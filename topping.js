// 📋 topping.js (トッピング機能専用ファイル)

let currentParentItemId = null; // 今トッピングを選んでいる親メニュー（もんじゃ等）のID

// 1. お好み・もんじゃ用トッピングポップアップを開く
function openToppingModal(baseItemId, baseItemName, price) {
    currentParentItemId = baseItemId; // どのメニューに対してのトッピングかを記憶
    updateCount(baseItemId, 1, price); // 親メニューの数を1増やす
    
    document.getElementById('topping-modal-title').innerText = `「${baseItemName}」のトッピング`;
    
    const container = document.getElementById('topping-list-container');
    if (menuData.popupTopping && container) {
        let html = `
            <button class="order-btn" style="background:#6c757d; width:100%; margin: 5px 0 15px 0; padding:10px; font-size:15px;" onclick="closeToppingModal()">
                トッピングなしで確定
            </button>
            <div style="border-top:2px dashed #ccc; margin-bottom:10px;"></div>
        `;

        menuData.popupTopping.forEach(tp => {
            const taxInPrice = Math.round(tp.price * 1.1);
            // 「親ID_トッピングID」という合体キーで現在の個数を取得
            const comboId = `${currentParentItemId}_${tp.id}`;
            const currentCount = selections[comboId] || 0;
            
            html += `
                <div class="menu-item" style="border-bottom: 1px solid #eee; padding: 10px 0;">
                    <div class="item-info">
                        <div class="item-name" style="font-size:14px; font-weight:bold;">${tp.name}</div>
                        <div class="item-price" style="font-size:13px; color:#666;">¥${tp.price.toLocaleString()}<span style="color:#999; font-size:11px; margin-left:3px;">(税込¥${taxInPrice.toLocaleString()})</span></div>
                    </div>
                    <div class="counter">
                        <button class="btn btn-minus" onclick="updateToppingCount('${tp.id}', -1, ${tp.price})">-</button>
                        <span class="count" id="count-${tp.id}">${currentCount}</span>
                        <button class="btn btn-plus" onclick="updateToppingCount('${tp.id}', 1, ${tp.price})">+</button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }
    document.getElementById('toppingModal').style.display = 'flex';
}

// 2. トッピング専用の個数カウント処理
function updateToppingCount(toppingId, change, price) {
    if (!currentParentItemId) return;
    
    // カート内（selections）には「親ID_トッピングID」の形で保存する
    const comboKey = `${currentParentItemId}_${toppingId}`;
    const current = selections[comboKey] || 0;
    const next = Math.max(0, current + change);
    
    if (next === 0) { 
        delete selections[comboKey]; 
    } else { 
        selections[comboKey] = next; 
    }
    
    // ポップアップ画面内の数字の表示をリアルタイム更新
    document.querySelectorAll(`#count-${toppingId}`).forEach(el => {
        el.innerText = next;
    });
    
    // メイン側にあるフッターや注文確認ボタンの表示を更新する関数を呼び出す
    if (typeof refreshFooter === 'function') {
        refreshFooter();
    }
}

// 3. ポップアップを閉じる
function closeToppingModal() {
    document.getElementById('toppingModal').style.display = 'none';
    currentParentItemId = null; // 閉じたら親IDを忘れる
}