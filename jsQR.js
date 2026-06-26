<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ごきらく亭 - 店員用総合管理アプリ</title>
    <script src="jsQR.js"></script>
    <style>
        :root { --primary-color: #28a745; --dark-bg: #222; }
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f4f6f9; color: #333; margin: 0; padding-bottom: 60px; }
        .header { background: #343a40; color: white; padding: 15px; text-align: center; font-weight: bold; font-size: 20px; }
        
        /* 卓選択タブ */
        .table-selector { display: flex; overflow-x: auto; background: white; padding: 10px; gap: 8px; border-bottom: 1px solid #ddd; position: sticky; top: 0; z-index: 10; }
        .table-btn { flex: 0 0 auto; padding: 10px 16px; background: #e9ecef; border: 1px solid #ced4da; border-radius: 20px; font-weight: bold; cursor: pointer; font-size: 14px; }
        .table-btn.active { background: #007bff; color: white; border-color: #007bff; }
        
        .container { padding: 15px; max-width: 600px; margin: 0 auto; }
        .card { background: white; border-radius: 12px; padding: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 15px; }
        .card-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 8px; margin-bottom: 12px; font-weight: bold; font-size: 18px; }
        
        .order-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #edf2f7; }
        .order-row:last-child { border-bottom: none; }
        .order-info { flex: 1; font-weight: bold; font-size: 16px; }
        .order-time { font-size: 11px; color: #999; font-weight: normal; margin-top: 2px; }
        
        .status-actions { display: flex; gap: 6px; }
        .status-btn { border: none; padding: 8px 12px; font-size: 12px; font-weight: bold; border-radius: 6px; cursor: pointer; }
        .status-btn.todo { background: #fff5f5; color: #e53e3e; border: 1px solid #feb2b2; }
        .status-btn.done { background: #f0fff4; color: #38a169; border: 1px solid #9ae6b4; }
        
        .clear-btn { background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px; }
        .empty-message { text-align: center; color: #999; padding: 30px 0; font-weight: bold; }
        
        .scan-trigger-btn { position: fixed; bottom: 20px; right: 20px; background: #007bff; color: white; border: none; width: 64px; height: 64px; border-radius: 50%; font-size: 24px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,123,255,0.4); cursor: pointer; z-index: 100; display: flex; align-items: center; justify-content: center; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 1000; flex-direction: column; align-items: center; justify-content: center; padding: 20px; color: white; }
        #canvas { width: 100%; max-width: 320px; background: #000; border-radius: 12px; }
        .close-modal { background: #6c757d; color: white; border: none; padding: 12px; width: 100%; max-width: 320px; border-radius: 6px; font-weight: bold; margin-top: 15px; cursor: pointer; font-size: 16px; }
    </style>
</head>
<body>

    <div class="header">ごきらく亭 店員管理パネル</div>

    <div class="table-selector" id="table-tabs"></div>

    <div class="container">
        <div class="card">
            <div class="card-header">
                <span id="current-table-title">1番卓 の注文履歴</span>
                <button class="clear-btn" onclick="clearCurrentTable()">卓を清算(リセット)</button>
            </div>
            <div id="order-history-list"></div>
        </div>
    </div>

    <button class="scan-trigger-btn" onclick="openScanner()">📷</button>

    <div id="scanModal" class="modal">
        <h3 style="margin: 0 0 10px 0;">QRコードをスキャン</h3>
        <p style="font-size:13px; color:#ccc; margin: 0 0 15px 0;">スキャンすると自動で該当の卓に注文が入ります</p>
        <video id="video" style="display:none;"></video>
        <canvas id="canvas"></canvas>
        <button class="close-modal" onclick="closeScanner()">キャンセル</button>
    </div>

    <script>
        const menuData = {
            okonomi: [
                { id: 'o1', name: '紅しょうが天' }, { id: 'o2', name: '桜エビ天' }, { id: 'o3', name: '納豆天' }, { id: 'o4', name: 'ねぎ天' },
                { id: 'o5', name: '切イカ天' }, { id: 'o6', name: 'ツナ天' }, { id: 'o7', name: '豚天' }, { id: 'o8', name: 'ギョーザ天' },
                { id: 'o9', name: '牛天(和牛)' }, { id: 'o10', name: '三色天(桜エビ・切イカ・紅しょうが)' }, { id: 'o11', name: '長ネギ天(ちぢみ風)' },
                { id: 'o12', name: 'タコ天' }, { id: 'o13', name: '生イカ天' }, { id: 'o14', name: '生エビ天' }, { id: 'o15', name: '豚ネギ天' },
                { id: 'o16', name: 'ピザ天' }, { id: 'o17', name: 'カレー天' }, { id: 'o18', name: '明太子天' }, { id: 'o19', name: '豚キムチ天' },
                { id: 'o20', name: 'しらす梅天(しらす・梅・大葉・ネギ)' }, { id: 'o21', name: 'モチチーズねぎ天' }, { id: 'o22', name: 'カープ天(広島風)※キムチ又は切イカ' },
                { id: 'o23', name: 'カキ天(シーズン)' }, { id: 'o24', name: '豚チーズダブル天' }, { id: 'o25', name: '牛スジ天' }, { id: 'o26', name: 'MIX天(牛・豚・コーン)' },
                { id: 'o27', name: 'ごきらく天(タコ・イカ・あさり・エビ)' }, { id: 'o28', name: 'シーフードピザ天' }, { id: 'o29', name: 'スタミナ天(大盛)(ニンニク・ニラ・牛・豚・切イカ・紅しょうが)' }
            ],
            monja: [
                { id: 'm1', name: '納豆もんじゃ' }, { id: 'm2', name: '紅しょうがもんじゃ' }, { id: 'm3', name: 'コーンもんじゃ' }, { id: 'm4', name: 'そばもんじゃ' },
                { id: 'm5', name: '切イカもんじゃ' }, { id: 'm6', name: 'ベビースターもんじゃ' }, { id: 'm7', name: 'ツナもんじゃ' }, { id: 'm8', name: 'キムチもんじゃ' },
                { id: 'm9', name: 'チーズもんじゃ' }, { id: 'm10', name: '生イカもんじゃ' }, { id: 'm11', name: '生エビもんじゃ' }, { id: 'm12', name: 'タコもんじゃ' },
                { id: 'm13', name: '塩辛もんじゃ' }, { id: 'm14', name: 'もちチーズもんじゃ' }, { id: 'm15', name: 'カレーもんじゃ' }, { id: 'm16', name: 'ツナチーズもんじゃ' },
                { id: 'm17', name: '明太子もんじゃ' }, { id: 'm18', name: '激辛もんじゃ' }, { id: 'm19', name: 'カレーうどんもんじゃ' }, { id: 'm20', name: 'もちチーズせんべいもんじゃ' },
                { id: 'm21', name: 'もち明太子もんじゃ' }, { id: 'm22', name: 'イタリアンもんじゃ(トマト・バジル・チーズ・バター)' }, { id: 'm23', name: '明太チーズもんじゃ' }, { id: 'm24', name: 'MIXもんじゃ(豚・牛・コーン)' },
                { id: 'm25', name: 'ほうれん草もんじゃ(ベーコン・チーズ・バター)' }, { id: 'm26', name: 'もち明太子チーズもんじゃ' }, { id: 'm27', name: 'ごきらくもんじゃ(タコ・アサリ・切イカ・生イカ)' },
                { id: 'r1', name: '海鮮リゾットもんじゃ(エビ・イカ・タコ・チーズ・バター・ライス)' }, { id: 'r2', name: '地中海リゾットもんじゃ(トマト・ツナ・レモン・チーズ・バター・ライス)' },
                { id: 'r3', name: 'キノコとベーコンの白ワインリゾットもんじゃ' }, { id: 'r4', name: 'グリーンカレーリゾットもんじゃ' }, { id: 'r5', name: 'レッドカレーリゾットもんじゃ' }
            ],
            teppan: [
                { id: 't1', name: 'アスパラバター' }, { id: 't2', name: 'エリンギガーリック' }, { id: 't3', name: 'さつまいもバター' }, { id: 't4', name: '野菜盛' },
                { id: 't5', name: 'はんぺんバター' }, { id: 't6', name: 'イカゲソバター' }, { id: 't7', name: 'コーンじゃがバター' }, { id: 't8', name: 'きのこバター' },
                { id: 't9', name: 'ベーコンじゃがバター' }, { id: 't10', name: 'はんぺんチーズ' }, { id: 't11', name: '鶏ももバター' }, { id: 't12', name: '鶏ももバターガーリック' },
                { id: 't13', name: '豚キムチ' }, { id: 't14', name: '豚カルビ' }, { id: 't15', name: '豚ロースバター' }, { id: 't16', name: 'ごきらくウインナー' },
                { id: 't17', name: 'ごきらくチョリソー' }, { id: 't18', name: '生イカバター' }, { id: 't19', name: 'ホタテバター' }, { id: 't20', name: '生かきバター' },
                { id: 't21', name: '貝柱バター' }, { id: 't22', name: '特選和牛カルビ' }, { id: 't23', name: '黒毛和牛ヒレステーキ' }, { id: 't24', name: '黒毛和牛サーロインステーキ' },
                { id: 'y1', name: '焼きそば' }, { id: 'y2', name: '焼きうどん' }, { id: 'y3', name: 'カレー焼きそば' }, { id: 'y4', name: 'ピリモツ焼きそば' },
                { id: 'y5', name: '海鮮焼きそば(エビ・イカ・豚肉)' }, { id: 'y6', name: '海鮮塩焼きそば(塩だれ・エビ・イカ・タコ・豚肉・ネギ)' },
                { id: 'g1', name: 'ライス' }, { id: 'g2', name: 'キムチチャーハン' }, { id: 'g3', name: 'ガーリックチャーハン' }, { id: 'g4', name: 'エビチャーハン(玉子付き)' },
                { id: 'g5', name: 'そばチャーハン' }, { id: 'g6', name: '玉子' }, { id: 'g7', name: 'マヨネーズ' }
            ],
            otsumami: [
                { id: 's1', name: '冷奴' }, { id: 's2', name: 'お新香' }, { id: 's3', name: '板わさ' }, { id: 's4', name: 'もろきゅう' },
                { id: 's5', name: 'イカ塩辛' }, { id: 's6', name: '梅タタキ' }, { id: 's7', name: 'もずく酢' }, { id: 's8', name: 'しらすおろし' },
                { id: 's9', name: '冷トマト' }, { id: 's10', name: 'キムチ' }, { id: 's11', name: '枝豆' }, { id: 's12', name: 'ニンニクオイル' },
                { id: 's13', name: '牛すじ煮込' }, { id: 's14', name: 'ピリ辛もつ焼' }, { id: 's15', name: 'チャンジャ' }, { id: 's16', name: 'タコチャンジャ' },
                { id: 's17', name: 'エビマヨ' }, { id: 's18', name: 'エビのガーリック炒め' }, { id: 's19', name: 'ナスとピーマンの辛味噌炒め' }, { id: 's20', name: 'タコキムチ' },
                { id: 's21', name: '明太子' }, { id: 's22', name: '豆腐ツナ' }
            ],
            salad: [
                { id: 'sd1', name: '水菜とカリカリベーコンサラダ' }, { id: 'sd2', name: '大根サラダ' }, { id: 'sd3', name: 'ツナサラダ' }, { id: 'sd4', name: 'ほうれん草サラダ' },
                { id: 'sd5', name: 'じゃこサラダ' }, { id: 'sd6', name: '豆腐とワカメサラダ' }, { id: 'sd7', name: '豚しゃぶサラダ' }, { id: 'sd8', name: 'シーザーサラダ' },
                { id: 'sd9', name: 'ごきらくサラダ(炒めたナス・ししとう・大和芋)' }
            ],
            drink: [
                { id: 'd1', name: '生ビール(グラス)' }, { id: 'd2', name: '生ビール(中)' }, { id: 'd3', name: 'アサヒスーパードライ(瓶)' }, { id: 'd4', name: 'エビスビール(瓶)' },
                { id: 'd5', name: 'プレミアムモルツ(瓶)' }, { id: 'd6', name: 'サッポロ赤ラベル(瓶)' }, { id: 'd7', name: 'アサヒドライゼロ' }, { id: 'd8', name: 'チューハイ' },
                { id: 'd9', name: 'ウメサワー' }, { id: 'd10', name: 'レモンサワー' }, { id: 'd11', name: '青リンゴサワー' }, { id: 'd12', name: 'カルピスサワー' },
                { id: 'd13', name: 'ブルーサワー(カルピス+青リンゴ)' }, { id: 'd14', name: 'ライムサワー' }, { id: 'd15', name: 'シークァーサーサワー' }, { id: 'd16', name: '生レモンサワー' },
                { id: 'd17', name: '生オレンジサワー' }, { id: 'd18', name: '生グレープフルーツサワー' }, { id: 'd19', name: 'ラムネサワー' }, { id: 'd20', name: 'クリームソーダハイ' },
                { id: 'd21', name: 'ウーロンハイ(いいちこ)' }, { id: 'd22', name: '緑茶ハイ(いいちこ)' }, { id: 'd23', name: 'ジャスミンハイ(いいちこ)' }, { id: 'd24', name: '梅酒' },
                { id: 'd25', name: 'グラスワイン(赤・白)' }, { id: 'd26', name: 'チリ フランスワイン(赤・白)フルボトル' }, { id: 'd27', name: 'トリスハイボール' }, { id: 'd28', name: 'ブラックニッカ' },
                { id: 'd29', name: 'ジムビーム' }, { id: 'd30', name: '角ハイボール' }, { id: 'd31', name: 'ターキー8年(バーボン)' }, { id: 'd32', name: 'コークハイ' },
                { id: 'd33', name: 'ジンジャーハイ' }, { id: 'd34', name: 'サントリーリザーブ' }, { id: 'd35', name: '杏ソーダ割' }, { id: 'd36', name: '梅酒ソーダ割' },
                { id: 'd37', name: '桃ソーダ割' }, { id: 'd38', name: 'ライチソーダ割' }, { id: 'd39', name: 'ゆずレモンはちみつソーダ割' }, { id: 'd40', name: 'ジントニック' },
                { id: 'd41', name: 'カシスソーダ' }, { id: 'd42', name: 'カシスウーロン' }, { id: 'd43', name: 'カシスオレンジ' }, { id: 'd44', name: '松竹梅 一合' },
                { id: 'd45', name: '松竹梅 二合' }, { id: 'd46', name: '菊水辛口(冷酒)' }, { id: 'd47', name: '黒霧島(芋)' }, { id: 'd48', name: '白霧島(芋)' },
                { id: 'd49', name: '黒伊佐錦(芋)' }, { id: 'd50', name: 'いいちこ(麦)' }, { id: 'd51', name: '二階堂(麦)' }, { id: 'd52', name: '赤霧島(芋)' },
                { id: 'd53', name: '鍛高譚(しそ)' }, { id: 'd54', name: '琉球<泡盛新酒>' }, { id: 'd55', name: '残波<泡盛古酒>' }, { id: 'd56', name: '奄美の杜<黒糖>' },
                { id: 'd57', name: '吉四六(麦)' }, { id: 'd58', name: '大魔王(芋)' }, { id: 'd59', name: 'ジンロ(ボトル)' }, { id: 'd60', name: 'いいちこシルエット(ボトル)' },
                { id: 'd61', name: '黒霧島(ボトル)' }, { id: 'd62', name: '黒伊佐錦 900ml(ボトル)' }, { id: 'd63', name: '吉四六 瓶(ボトル)' }, { id: 'd64', name: '吉四六 陶器(ボトル)' },
                { id: 'd65', name: 'マッコリ グラス' }, { id: 'd66', name: 'マッコリ ボトル' }, { id: 'd67', name: 'ミネラルウォーター' }, { id: 'd68', name: 'コーヒー(アイス・ホット)' },
                { id: 'd69', name: 'ウーロン茶' }, { id: 'd70', name: '玉露茶' }, { id: 'd71', name: 'ジャスミン茶' }, { id: 'd72', name: 'カルピス' },
                { id: 'd73', name: 'ラムネ' }, { id: 'd74', name: '炭酸' }, { id: 'd75', name: 'コーラ(瓶)' }, { id: 'd76', name: 'バヤリースオレンジ(瓶)' },
                { id: 'd77', name: 'ジンジャーエール(瓶)' }, { id: 'd78', name: 'こどもビール(瓶)' }, { id: 'd79', name: 'クリームソーダ' }, { id: 'd80', name: 'ロックセット' },
                { id: 'd81', name: 'お湯割セット' }, { id: 'd82', name: 'ミネラルセット' }, { id: 'd83', name: '炭酸セット' }, { id: 'd84', name: 'ウーロンセット' },
                { id: 'd85', name: '緑茶セット' }, { id: 'd86', name: 'ジャスミン茶セット' }, { id: 'd87', name: '梅干し' }, { id: 'd88', name: '高級梅干し' }
            ],
            dessert: [
                { id: 'z1', name: 'バニラアイス' }, { id: 'z2', name: 'チョコかけアイス' }, { id: 'z3', name: '黒みつアイス' }, { id: 'z4', name: 'あんみつ' },
                { id: 'z5', name: 'クリームあんみつ' }, { id: 'z6', name: 'あんこ巻' }, { id: 'z7', name: '杏巻' }, { id: 'z8', name: 'チョコレート巻' }
            ]
        };

        function getItemName(id) {
            for (const category in menuData) {
                const found = menuData[category].find(item => item.id === id);
                if (found) return found.name;
            }
            return "不明 (" + id + ")";
        }

        let currentTable = 1;
        let allTablesData = JSON.parse(localStorage.getItem('gokiraku_tables_data')) || {};

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

        function renderHistory() {
            const listContainer = document.getElementById('order-history-list');
            listContainer.innerHTML = '';
            const history = allTablesData[currentTable] || [];
            
            if (history.length === 0) {
                listContainer.innerHTML = '<div class="empty-message">現在、この卓の注文履歴はありません。</div>';
                return;
            }

            history.slice().reverse().forEach(item => {
                const row = document.createElement('div');
                row.className = 'order-row';
                row.innerHTML = `
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
                `;
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

        // --- 📷 カメラロジック ---
        const video = document.getElementById("video");
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        let isScanning = false;
        let streamRef = null;

        function openScanner() {
            document.getElementById('scanModal').style.display = 'flex';
            isScanning = true;
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(stream => {
                streamRef = stream;
                video.srcObject = stream;
                video.setAttribute("playsinline", true);
                video.play();
                requestAnimationFrame(tick);
            }).catch(err => {
                alert("カメラの起動に失敗しました");
                closeScanner();
            });
        }

        function closeScanner() {
            document.getElementById('scanModal').style.display = 'none';
            isScanning = false;
            if (streamRef) { streamRef.getTracks().forEach(track => track.stop()); }
        }

        function tick() {
            if (!isScanning) return;
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
                
                if (code && code.data) {
                    isScanning = false;
                    processOrderQR(code.data);
                    closeScanner();
                }
            }
            requestAnimationFrame(tick);
        }

        // QRテキストを判別して卓に割り当てる
        function processOrderQR(qrText) {
            let targetTable = currentTable; // 切り替え忘れの時のバックアップ
            let menuParts = qrText;

            // QRコードの頭が「T3,」などの卓番号指定で始まっているか確認
            if (qrText.startsWith('T')) {
                const commaIndex = qrText.indexOf(',');
                if (commaIndex !== -1) {
                    const tableStr = qrText.substring(1, commaIndex); // "3" を抜く
                    targetTable = parseInt(tableStr) || currentTable;
                    menuParts = qrText.substring(commaIndex + 1); // 残りの注文データ
                }
            }

            if (!allTablesData[targetTable]) { allTablesData[targetTable] = []; }

            const now = new Date();
            const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

            const items = menuParts.split(",");
            items.forEach(itemStr => {
                const [id, count] = itemStr.split(":");
                if (id && count) {
                    const itemName = getItemName(id);
                    const orderItem = {
                        uniqueId: targetTable + "_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
                        id: id,
                        name: itemName,
                        count: parseInt(count),
                        time: timeStr,
                        paperDone: false,
                        foodDone: false
                    };
                    allTablesData[targetTable].push(orderItem);
                }
            });

            saveData();
            switchTable(targetTable); // 自動的に、注文が入った卓に画面を切り替えてあげる
            alert(`${targetTable}番卓に自動振り分けで注文を追加しました！`);
        }

        initTabs();
        renderHistory();
    </script>
</body>
</html>