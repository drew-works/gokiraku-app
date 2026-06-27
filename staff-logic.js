// 全卓の注文データ、表示の切り替え、ボタン処理
// 状態変数とデータの読み込み
let currentTable = 'all'; 
let allTablesData = JSON.parse(localStorage.getItem('gokiraku_tables_data')) || {};

// IDから「名前」と「価格」のマスタデータをリアルタイムに取得
function getItemInfo(id) {
    const defaultInfo = { name: "商品 " + id, price: 0 };
    if (typeof menuData === 'undefined') return defaultInfo;

    let targetId = id;
    if (id.includes('_')) {
        targetId = id.split('_')[1];
    }

    if (menuData.popupTopping) {
        const found = menuData.popupTopping.find(t => t.id === targetId || t.id === id);
        if (found) return { name: found.name, price: found.price || 0 };
    }
    
    if (menuData.drinkDetails) {
        for (const catKey in menuData.drinkDetails) {
            const found = menuData.drinkDetails[catKey].find(d => d.id === targetId || d.id === id);
            if (found) return { name: found.name, price: found.price || 0 };
        }
    }

    for (const category in menuData) {
        if (Array.isArray(menuData[category])) {
            const found = menuData[category].find(item => item.id === targetId || item.id === id);
            if (found) return { name: found.name, price: found.price || 0 };
        }
    }
    return defaultInfo;
}

// 卓タブの描画
function initTabs() {
    const tabsContainer = document.getElementById('table-tabs');
    if (!tabsContainer) return;
    tabsContainer.innerHTML = '';

    // 1. 全卓共通ボタン
    const globalBtn = document.createElement('button');
    globalBtn.className = `table-btn global-btn ${currentTable === 'all' ? 'active' : ''}`;
    globalBtn.innerText = '📋 全卓共通';
    globalBtn.onclick = () => switchTable('all');
    tabsContainer.appendChild(globalBtn);

    // 2. 1〜11番卓ボタン
    for (let i = 1; i <= 11; i++) {
        const btn = document.createElement('button');
        btn.className = `table-btn ${i === currentTable ? 'active' : ''}`;
        
        const tableOrders = allTablesData[i] || [];
        const hasTodo = tableOrders.some(item => !item.id.includes('_') && item.foodDone === false);
        if (hasTodo) {
            btn.classList.add('has-todo');
        }

        btn.innerText = `${i}番卓`;
        btn.onclick = () => switchTable(i);
        tabsContainer.appendChild(btn);
    }
}

function switchTable(tableId) {
    currentTable = tableId;
    initTabs();
    renderMainContent();
}

// メイン表示の切り替え
function renderMainContent() {
    const headerArea = document.getElementById('card-header-area');
    const listContainer = document.getElementById('main-display-list');
    if (!headerArea || !listContainer) return;

    listContainer.innerHTML = '';

    if (currentTable === 'all') {
        // 【全卓共通リスト】
        headerArea.className = "card-header all-tables";
        headerArea.innerHTML = `<span>🔥 全卓共通 キッチン未提供リスト</span>`;

        let allTodos = [];
        for (let t = 1; t <= 11; t++) {
            const history = allTablesData[t] || [];
            history.forEach(item => {
                if (!item.id.includes('_') && item.foodDone === false) {
                    allTodos.push({ tableNum: t, orderItem: item, allHistory: history });
                }
            });
        }

        if (allTodos.length === 0) {
            listContainer.innerHTML = '<div class="empty-message">🎉 現在、全卓すべての料理が提供済みです！</div>';
            return;
        }

        allTodos.sort((a, b) => a.orderItem.uniqueId.localeCompare(b.orderItem.uniqueId));

        allTodos.forEach(todo => {
            const item = todo.orderItem;
            const row = document.createElement('div');
            row.className = 'order-row';

            const currentInfo = getItemInfo(item.id);
            const singlePrice = currentInfo.price || 0;
            const priceText = singlePrice > 0 ? `<span class="item-price-tag">(¥${singlePrice.toLocaleString()} × ${item.count})</span>` : '';

            let innerHTML = `
                <div class="main-item-line">
                    <div class="order-info">
                        <div><span class="table-badge">${todo.tableNum}番卓</span>${currentInfo.name} × ${item.count} ${priceText}</div>
                        <div class="order-time">${item.time}</div>
                    </div>
                    <div class="status-actions">
                        <button class="status-btn todo" onclick="setFoodDoneGlobal(${todo.tableNum}, '${item.uniqueId}')">
                            提供 🍳未
                        </button>
                    </div>
                </div>
            `;

            todo.allHistory.forEach(subItem => {
                if (subItem.id.startsWith(`${item.id}_`)) {
                    const subInfo = getItemInfo(subItem.id);
                    const subSinglePrice = subInfo.price || 0;
                    const subPriceText = subSinglePrice > 0 ? `<span class="item-price-tag">(¥${subSinglePrice.toLocaleString()} × ${subItem.count})</span>` : '';
                    
                    innerHTML += `
                        <div class="topping-line">
                            ┗ ${subInfo.name} × ${subItem.count} ${subPriceText}
                        </div>
                    `;
                }
            });

            row.innerHTML = innerHTML;
            listContainer.appendChild(row);
        });

    } else {
        // 【個別卓履歴】
        headerArea.className = "card-header";
        headerArea.innerHTML = `
            <span>${currentTable}番卓 の注文履歴</span>
            <button class="clear-btn" onclick="askClearCurrentTable()">卓を清算(リセット)</button>
        `;

        const history = allTablesData[currentTable] || [];
        if (history.length === 0) {
            listContainer.innerHTML = '<div class="empty-message">現在、この卓の注文履歴はありません。</div>';
            return;
        }

        history.slice().reverse().forEach(item => {
            if (item.id.includes('_')) return;

            const row = document.createElement('div');
            row.className = 'order-row';

            const currentInfo = getItemInfo(item.id);
            const singlePrice = currentInfo.price || 0;
            const priceText = singlePrice > 0 ? `<span class="item-price-tag">(¥${singlePrice.toLocaleString()} × ${item.count})</span>` : '';

            let innerHTML = `
                <div class="main-item-line">
                    <div class="order-info">
                        <div>${currentInfo.name} × ${item.count} ${priceText}</div>
                        <div class="order-time">${item.time}</div>
                    </div>
                    <div class="status-actions">
                        <button class="status-btn ${item.paperDone ? 'done' : 'todo'}" onclick="toggleStatusLocal('${item.uniqueId}', 'paper')">
                            ${item.paperDone ? '伝票 📝済' : '伝票 📝未'}
                        </button>
                        <button class="status-btn ${item.foodDone ? 'done' : 'todo'}" onclick="toggleStatusLocal('${item.uniqueId}', 'food')">
                            ${item.foodDone ? '提供 🍳済' : '提供 🍳未'}
                        </button>
                    </div>
                </div>
            `;

            history.forEach(subItem => {
                if (subItem.id.startsWith(`${item.id}_`)) {
                    const subInfo = getItemInfo(subItem.id);
                    const subSinglePrice = subInfo.price || 0;
                    const subPriceText = subSinglePrice > 0 ? `<span class="item-price-tag">(¥${subSinglePrice.toLocaleString()} × ${subItem.count})</span>` : '';
                    
                    innerHTML += `
                        <div class="topping-line">
                            ┗ ${subInfo.name} × ${subItem.count} ${subPriceText}
                        </div>
                    `;
                }
            });

            row.innerHTML = innerHTML;
            listContainer.appendChild(row);
        });
    }
}

// 個別卓画面からのボタン処理
function toggleStatusLocal(uniqueId, type) {
    const history = allTablesData[currentTable] || [];
    const item = history.find(i => i.uniqueId === uniqueId);
    if (item) {
        if (type === 'paper') item.paperDone = !item.paperDone;
        if (type === 'food') item.foodDone = !item.foodDone;
        saveData();
        initTabs();
        renderMainContent();
    }
}

// 共通画面からの提供完了処理
function setFoodDoneGlobal(tableNum, uniqueId) {
    const history = allTablesData[tableNum] || [];
    const item = history.find(i => i.uniqueId === uniqueId);
    if (item) {
        item.foodDone = true;
        saveData();
        initTabs();
        renderMainContent();
    }
}

// データリセット
function askClearCurrentTable() {
    if (confirm(`${currentTable}番卓のデータをすべて消去しますか？`)) {
        allTablesData[currentTable] = [];
        saveData();
        initTabs();
        renderMainContent();
    }
}

function saveData() {
    localStorage.setItem('gokiraku_tables_data', JSON.stringify(allTablesData));
}

// アプリの初期起動
initTabs();
renderMainContent();