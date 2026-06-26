// 注文処理・トッピング連動表示
let currentTable = 1;
let allTablesData = JSON.parse(localStorage.getItem('gokiraku_tables_data')) || {};

// マスターデータ（order-menu-data.js）からIDをもとに名前を引き出す共通関数
function getItemName(id) {
    // 1. トッピング専用マスター（popupTopping）から探す
    if (menuData.popupTopping) {
        const foundTopping = menuData.popupTopping.find(t => t.id === id);
        if (foundTopping) return foundTopping.name;
    }
    
    // 2. お酒詳細（drinkDetails）内のサブカテゴリーをすべて探す
    if (menuData.drinkDetails) {
        for (const subCat in menuData.drinkDetails) {
            const foundDrink = menuData.drinkDetails[subCat].find(d => d.id === id);
            if (foundDrink) return foundDrink.name;
        }
    }

    // 3. その他、通常のメインカテゴリー（okonomi, monja, teppan 等）から探す
    for (const category in menuData) {
        if (Array.isArray(menuData[category])) {
            const found = menuData[category].find(item => item.id === id);
            if (found) return found.name;
        }
    }
    return "不明 (" + id + ")";
}

// 卓切り替えタブの生成（1〜11番卓）
function initTabs() {
    const tabsContainer = document.getElementById('table-tabs');
    tabsContainer.innerHTML = '';
    for (let i = 1; i <= 11; i++) {
        const btn = document.createElement('button');
        btn.className = `table-btn ${i === currentTable ? 'active' : ''}`;
        btn.innerText = `${i}番卓`;
        btn.onclick = () => switchTable(i);
        tabsContainer.appendChild(btn);
    }
}

function switchTable(tableNum) {
    currentTable = tableNum;
    document.querySelectorAll('.table-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', (idx + 1) === currentTable);
    });
    document.getElementById('current-table-title').innerText = `${currentTable}番卓 の注文履歴`;
    renderHistory();
}

// ⭐大改修：店員画面の注文履歴表示（トッピングを親メニューの下にぶら下げる）
function renderHistory() {
    const listContainer = document.getElementById('order-history-list');
    listContainer.innerHTML = '';
    const history = allTablesData[currentTable] || [];
    
    if (history.length === 0) {
        listContainer.innerHTML = '<div class="empty-message">現在、この卓の注文履歴はありません。</div>';
        return;
    }

    // 厨房が見やすいように最新の注文を一番上（逆順）にする
    history.slice().reverse().forEach(item => {
        // IDにアンダーバー「_」が含まれるトッピングデータは、大元のループでは一旦描画を飛ばす
        if (item.id.includes('_')) return;

        const row = document.createElement('div');
        row.className = 'order-row';

        // ①親メニュー（もんじゃや焼きそば等）の表示ライン
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

        // ⭐②この親メニューに紐づくトッピングが、同じ履歴データ内にあるか探して真下に段落下げ追加
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

function clearCurrentTable() {
    if (confirm(`${currentTable}番卓のデータをすべて消去（お会計完了）しますか？`)) {
        allTablesData[currentTable] = [];
        saveData();
        renderHistory();
    }
}

function saveData() {
    localStorage.setItem('gokiraku_tables_data', JSON.stringify(allTablesData));
}