//注文処理
let currentTable = 1;
let allTablesData = JSON.parse(localStorage.getItem('gokiraku_tables_data')) || {};
let confirmCallback = null; // 確認画面用のコールバック保持

// マスターデータ（order-menu-data.js）からIDを元に日本語名を取得
function getItemName(id) {
    // menuDataが万が一読み込まれていなかった場合の安全ガード
    if (typeof menuData === 'undefined') {
        return "商品 " + id;
    }

    // 1. トッピング専用マスタから探す
    if (menuData.popupTopping) {
        const foundTopping = menuData.popupTopping.find(t => t.id === id);
        if (foundTopping) return foundTopping.name;
    }
    
    // 2. アルコール詳細(drinkDetails)のサブカテゴリをすべて探す
    if (menuData.drinkDetails) {
        for (const catKey in menuData.drinkDetails) {
            const foundDrink = menuData.drinkDetails[catKey].find(d => d.id === id);
            if (foundDrink) return foundDrink.name;
        }
    }

    // 3. その他、メインメニューカテゴリから探す
    for (const category in menuData) {
        if (Array.isArray(menuData[category])) {
            const found = menuData[category].find(item => item.id === id);
            if (found) return found.name;
        }
    }
    return "不明 (" + id + ")";
}

// 卓切り替えタブ（1〜11番卓）を生成
function initTabs() {
    const tabsContainer = document.getElementById('table-tabs');
    if (!tabsContainer) return;
    
    tabsContainer.innerHTML = '';
    for (let i = 1; i <= 11; i++) {
        const btn = document.createElement('button');
        btn.className = `table-btn ${i === currentTable ? 'active' : ''}`;
        btn.innerText = `${i}番卓`;
        btn.onclick = () => switchTable(i);
        tabsContainer.appendChild(btn);
    }
}

// タブ切り替え処理
function switchTable(tableNum) {
    currentTable = tableNum;
    document.querySelectorAll('.table-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', (idx + 1) === currentTable);
    });
    const titleEl = document.getElementById('current-table-title');
    if (titleEl) {
        titleEl.innerText = `${currentTable}番卓 の注文履歴`;
    }
    renderHistory();
}

// 注文履歴を表示する（トッピングは親メニューの真下に段落下げしてセット化）
function renderHistory() {
    const listContainer = document.getElementById('order-history-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    const history = allTablesData[currentTable] || [];
    
    if (history.length === 0) {
        listContainer.innerHTML = '<div class="empty-message">現在、この卓の注文履歴はありません。</div>';
        return;
    }

    // 厨房で見やすいよう、最新注文を一番上にする
    history.slice().reverse().forEach(item => {
        if (item.id.includes('_')) return; // トッピングレコードはメイン描画では飛ばす

        const row = document.createElement('div');
        row.className = 'order-row';

        // 親メニュー（もんじゃ、ビール等）の描画
        let innerHTML = `
            <div class="main-item-line">
                <div class="order-info">
                    <div>${item.name} × ${item.count}つ</div>
                    <div class="order-time">${item.time}</div>
                </div>
                <div class="status-actions">
                    <button class="status-btn ${item.paperDone ? 'done' : 'todo'}" onclick="toggleStatus('${item.uniqueId}', 'paper')">
                        ${item.paperDone ? '伝票 📝済' : '伝票 📝未'}
                    </button>
                    <button class="status-btn ${item.foodDone ? 'done' : 'todo'}" onclick="toggleStatus('${item.uniqueId}', 'food')">
                        ${item.foodDone ? '提供 🍳済' : '提供 🍳未'}
                    </button>
                </div>
            </div>
        `;

        // トッピングを段落下げで追加
        history.forEach(subItem => {
            if (subItem.id.startsWith(`${item.id}_`)) {
                innerHTML += `
                    <div class="topping-line">
                        ┗ ＋ ${subItem.name} × ${subItem.count}つ
                    </div>
                `;
            }
        });

        row.innerHTML = innerHTML;
        listContainer.appendChild(row);
    });
}

// ステータス切り替え
function toggleStatus(uniqueId, type) {
    const history = allTablesData[currentTable] || [];
    const item = history.find(i => i.uniqueId === uniqueId);
    if (item) {
        if (type === 'paper') item.paperDone = !item.paperDone;
        if (type === 'food') item.foodDone = !item.foodDone;
        saveData();
        renderHistory();
    }
}

// フリーズしないカスタム確認ダイアログ表示用関数
function showConfirm(title, msg, callback) {
    const overlay = document.getElementById("confirmOverlay");
    const titleEl = document.getElementById("confirmTitle");
    const msgEl = document.getElementById("confirmMsg");
    
    if (!overlay) return;
    
    titleEl.innerText = title;
    msgEl.innerText = msg;
    confirmCallback = callback;
    overlay.style.display = "flex";
}

// 確認ダイアログを閉じる処理
function closeConfirm(isYes) {
    const overlay = document.getElementById("confirmOverlay");
    if (overlay) {
        overlay.style.display = "none";
    }
    if (isYes && typeof confirmCallback === 'function') {
        confirmCallback();
    }
    confirmCallback = null;
}

// 清算ボタンが押された時の処理
function askClearCurrentTable() {
    // 標準の confirm() を使わず、オリジナルの自作モーダルで確認する
    showConfirm(
        "卓データの清算",
        `${currentTable}番卓のデータをすべて消去（お会計完了）しますか？`,
        function() {
            allTablesData[currentTable] = [];
            saveData();
            renderHistory();
            if (typeof showToast === 'function') {
                showToast(`${currentTable}番卓をリセットしました`);
            }
        }
    );
    
    // モーダルの確定ボタンにイベントをバインド
    const yesBtn = document.getElementById("confirmYesBtn");
    if (yesBtn) {
        yesBtn.onclick = function() {
            closeConfirm(true);
        };
    }
}

// ローカルストレージ保存
function saveData() {
    localStorage.setItem('gokiraku_tables_data', JSON.stringify(allTablesData));
}