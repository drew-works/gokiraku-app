// --- 卓番号の自動取得 ---
//  『?table=卓番号』をURLの最後に書き込む
const urlParams = new URLSearchParams(window.location.search);
const tableNumber = urlParams.get('table') || '1'; 

document.getElementById('table-display-bar').innerText = `お席: ${tableNumber}番卓`;
document.getElementById('modal-table-title').innerText = `【${tableNumber}番卓 注文用】`;

const selections = {};     // 今回選んでいるメニュー（現在のカート）
const orderHistory = {};   // これまでに確定させたメニュー（注文履歴）
let qrcode = null;

// ブラウザに保存されている履歴を復元
const savedHistory = localStorage.getItem(`order_history_t${tableNumber}`);
if (savedHistory) {
    Object.assign(orderHistory, JSON.parse(savedHistory));
}

const categoryNames = {
    okonomi: 'お好み焼き',
    monja: 'もんじゃ焼き',
    risottoMonja: 'リゾットもんじゃ',
    teppan: '鉄板焼き',
    takoyaki: 'タコ焼き',
    yakisoba: '焼きそば',
    gohan: 'ごはん',
    otsumami: 'おつまみ',
    salad: 'サラダ',
    dessert: 'デザート',
    alcohol: 'お飲みもの(アルコール)',
    softDrink: 'ソフトドリンク',
    topping: 'トッピング'
};

// メニュー・詳細トッピング・詳細ドリンクすべてから特定のIDの商品を探すヘルパー
function findItemById(id) {
    // 1. メインのmenuDataから探す
    for (const category in menuData) {
        if (category === 'drinkDetails') continue;
        const item = menuData[category].find(i => i.id === id);
        if (item) return item;
    }
    // 2. アルコールの詳細リスト内から探す
    if (menuData.drinkDetails) {
        for (const catId in menuData.drinkDetails) {
            const item = menuData.drinkDetails[catId].find(i => i.id === id);
            if (item) return item;
        }
    }
    return null;
}

function initMenu() {
    const tabsContainer = document.getElementById('tabs-container');
    const sectionsContainer = document.getElementById('menu-sections-container');
    let isFirst = true; 

    for (const category in menuData) {
        // ポップアップ専用のデータはメインタブに出さない
        if (category === 'popupTopping' || category === 'drinkDetails') continue;

        const tabBtn = document.createElement('button');
        tabBtn.className = `tab-btn ${isFirst ? 'active' : ''}`;
        tabBtn.innerText = categoryNames[category] || category;
        tabBtn.onclick = function(e) { switchTab(category, e.currentTarget); };
        tabsContainer.appendChild(tabBtn);

        const container = document.createElement('div');
        container.id = category;
        container.className = `menu-container ${isFirst ? 'active' : ''}`;

        let html = '';
        menuData[category].forEach(item => {
            const isCustom = item.isCustomPrice || typeof item.price !== 'number';
            
            let priceText = '';
            let numericPrice = 0;

            if (isCustom) {
                priceText = item.priceStr;
                numericPrice = 0;
            } else {
                const taxInPrice = Math.round(item.price * 1.1);
                // 大カテゴリーのダミーボタン（金額が0円のもの）は「選ぶ」ボタンにするため金額表記を隠す
                if (category === 'alcohol') {
                    priceText = `<span style="color:#28a745; font-size:0.9em; font-weight:bold;">タップして種類を選ぶ</span>`;
                } else {
                    priceText = `¥${item.price.toLocaleString()}<span style="color: #888; font-size: 0.85em; margin-left: 5px;">(税込¥${taxInPrice.toLocaleString()})</span>`;
                }
                numericPrice = item.price;
            }

            // 条件分岐：プラスボタンを押した時の動きを分ける
            let plusClickAction = `updateCount('${item.id}', 1, ${numericPrice})`;
            let minusButtonHtml = `<button class="btn btn-minus" onclick="updateCount('${item.id}', -1, ${numericPrice})">-</button>`;
            let countHtml = `<span class="count" id="count-${item.id}">0</span>`;

            if (category === 'okonomi' || category === 'monja') {
                // お好み・もんじゃはトッピング付きポップアップへ
                plusClickAction = `openToppingModal('${item.id}', '${item.name}', ${numericPrice})`;
            } else if (category === 'alcohol') {
                // ★アルコールの大カテゴリーは詳細ポップアップへ（ここではマイナスや数字は出さない）
                plusClickAction = `openDrinkModal('${item.id}', '${item.name}')`;
                minusButtonHtml = '';
                countHtml = '';
            }

            html += `
                <div class="menu-item">
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">${priceText}</div>
                    </div>
                    <div class="counter">
                        ${minusButtonHtml}
                        ${countHtml}
                        <button class="btn btn-plus" onclick="${plusClickAction}">+</button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
        sectionsContainer.appendChild(container);

        isFirst = false; 
    }
    refreshFooter();
}

// ★新しく追加：お酒の大カテゴリーを押した時の詳細ポップアップ
function openDrinkModal(categoryId, categoryName) {
    document.getElementById('drink-modal-title').innerText = `「${categoryName}」の選択`;
    const container = document.getElementById('drink-list-container');
    
    if (menuData.drinkDetails && menuData.drinkDetails[categoryId] && container) {
        let html = '';
        menuData.drinkDetails[categoryId].forEach(drink => {
            const taxInPrice = Math.round(drink.price * 1.1);
            const currentCount = selections[drink.id] || 0;
            html += `
                <div class="menu-item" style="border-bottom: 1px solid #eee; padding: 10px 0;">
                    <div class="item-info">
                        <div class="item-name" style="font-size:14px; font-weight:bold;">${drink.name}</div>
                        <div class="item-price" style="font-size:13px; color:#666;">¥${drink.price.toLocaleString()}<span style="color:#999; font-size:11px; margin-left:3px;">(税込¥${taxInPrice.toLocaleString()})</span></div>
                    </div>
                    <div class="counter">
                        <button class="btn btn-minus" onclick="updateCount('${drink.id}', -1, ${drink.price})">-</button>
                        <span class="count" id="count-${drink.id}">${currentCount}</span>
                        <button class="btn btn-plus" onclick="updateCount('${drink.id}', 1, ${drink.price})">+</button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }
    document.getElementById('drinkModal').style.display = 'flex';
}
function closeDrinkModal() { document.getElementById('drinkModal').style.display = 'none'; }


function handleMainAction() {
    const currentSelectedCount = Object.values(selections).reduce((a, b) => a + b, 0);
    if (currentSelectedCount > 0) {
        showConfirmation();
    } else if (Object.keys(orderHistory).length > 0) {
        openHistoryModal();
    }
}

function refreshFooter() {
    const totalItems = Object.values(selections).reduce((a, b) => a + b, 0);
    const hasHistory = Object.keys(orderHistory).length > 0;
    
    document.getElementById('items-count-display').innerText = totalItems;
    const mainBtn = document.getElementById('main-action-btn');
    
    if (totalItems > 0) {
        mainBtn.innerText = "注文内容を確認";
        mainBtn.style.background = "#28a745"; 
        mainBtn.disabled = false;
    } else if (hasHistory) {
        mainBtn.innerText = "これまでの注文履歴";
        mainBtn.style.background = "#17a2b8"; 
        mainBtn.disabled = false;
    } else {
        mainBtn.innerText = "メニューを選んでください";
        mainBtn.style.background = "#6c757d"; 
        mainBtn.disabled = true;
    }
}

function showConfirmation() {
    const keys = Object.keys(selections);
    const container = document.getElementById('confirm-list-container');
    let html = '';
    let total = 0;

    // まず、通常のメインメニュー（お好み焼きやドリンクなど）を先に処理する
    keys.forEach(key => {
        if (key.includes('_')) return; // トッピングはここでは飛ばす

        const item = findItemById(key);
        if (!item) return;
        const count = selections[key];
        
        const subTotal = item.price * count;
        const subTaxIn = Math.round(subTotal * 1.1);
        total += subTotal;

        // ①親メニュー（もんじゃ等）の表示
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin:12px 0 4px 0; font-size:15px; font-weight:bold;">
                <div>${item.name} × ${count}</div>
                <div>¥${subTotal.toLocaleString()} <span style="color:#888; font-size:12px;">(税込¥${subTaxIn.toLocaleString()})</span></div>
            </div>
        `;

        // ⭐【追加】この親メニューに紐づくトッピングがカートにあるか探して下に並べる
        keys.forEach(subKey => {
            if (subKey.startsWith(`${key}_`)) { // この商品のトッピングだったら
                const toppingId = subKey.split('_')[1];
                const toppingItem = menuData.popupTopping.find(t => t.id === toppingId);
                if (!toppingItem) return;

                const topCount = selections[subKey];
                const topTotal = toppingItem.price * topCount;
                const topTaxIn = Math.round(topTotal * 1.1);
                total += topTotal;

                // ②段落を下げてトッピングを表示
                html += `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin:4px 0 4px 20px; font-size:14px; color:#555;">
                        <div style="color: #888;"> Topping ${toppingItem.name} × ${topCount}</div>
                        <div>¥${topTotal.toLocaleString()} <span style="color:#999; font-size:11px;">(税込¥${topTaxIn.toLocaleString()})</span></div>
                    </div>
                `;
            }
        });
    });

    container.innerHTML = html;
    document.getElementById('confirm-total-display').innerText = total.toLocaleString();
    document.getElementById('confirmModal').style.display = 'flex';
}

function closeConfirmation() { document.getElementById('confirmModal').style.display = 'none'; }

function generateOrderQR() {
    const keys = Object.keys(selections);
    const qrText = `T${tableNumber},` + keys.map(id => `${id}:${selections[id]}`).join(',');

    document.getElementById('qrModal').style.display = 'flex';
    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = ""; 
    qrcode = new QRCode(qrContainer, {
        text: qrText,
        width: 200,
        height: 200,
        correctLevel: QRCode.CorrectLevel.M
    });

    keys.forEach(id => {
        orderHistory[id] = (orderHistory[id] || 0) + selections[id];
    });

    localStorage.setItem(`order_history_t${tableNumber}`, JSON.stringify(orderHistory));
    closeConfirmation();
}

function closeQRAndReset() {
    document.getElementById('qrModal').style.display = 'none';
    for (const id in selections) {
        delete selections[id];
    }
    document.querySelectorAll('.count').forEach(el => {
        el.innerText = '0';
    });
    refreshFooter();
    alert('注文用QRを表示しました！追加注文される場合は、そのまま次のメニューの「＋」を押してください。');
}

// 注文履歴の表示
function openHistoryModal() {
    const container = document.getElementById('history-list-container');
    let html = '';
    const historyKeys = Object.keys(orderHistory);

    // まず、通常のメインメニュー（もんじゃやドリンクなど単体のID）を先に処理する
    historyKeys.forEach(key => {
        if (key.includes('_')) return; // トッピングここでは飛ばす

        const item = findItemById(key);
        if (!item) return;
        const count = orderHistory[key];

        // ①親メニュー（もんじゃ等）を履歴に表示
        html += `
            <div style="margin:12px 0 4px 0; font-size:15px; color:#333; font-weight:bold;">
                ・ <strong>${item.name}</strong> × ${count}品
            </div>
        `;

        // ⭐この親メニューに紐づくトッピングが履歴データにあるか探して下に並べる
        historyKeys.forEach(subKey => {
            if (subKey.startsWith(`${key}_`)) { // この商品のトッピングだったら
                const toppingId = subKey.split('_')[1];
                
                // トッピングのマスターデータ（popupTopping）から名前を探す
                const toppingItem = menuData.popupTopping.find(t => t.id === toppingId);
                if (!toppingItem) return;

                const topCount = orderHistory[subKey];

                // ②段落を下げてトッピングの履歴を表示
                html += `
                    <div style="margin:4px 0 4px 25px; font-size:14px; color:#666;">
                        Topping ${toppingItem.name} × ${topCount}つ
                    </div>
                `;
            }
        });
    });

    container.innerHTML = html;
    document.getElementById('historyModal').style.display = 'flex';
}

function closeHistoryModal() { document.getElementById('historyModal').style.display = 'none'; }

function switchTab(categoryId, clickedBtn) {
    document.querySelectorAll('.menu-container').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    const targetContainer = document.getElementById(categoryId);
    if (targetContainer) targetContainer.classList.add('active');
    clickedBtn.classList.add('active');
}

function updateCount(id, change, price) {
    const current = selections[id] || 0;
    const next = Math.max(0, current + change);
    if (next === 0) { delete selections[id]; } else { selections[id] = next; }
    
    // 通常メニューとポップアップ内の同一商品を同時に書き換え
    document.querySelectorAll(`#count-${id}`).forEach(el => {
        el.innerText = next;
    });
    refreshFooter();
}

function closeQR() { document.getElementById('qrModal').style.display = 'none'; }

initMenu();