// QRカメラ制御
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

// スキャンしたQRテキストを解析して注文を各卓に突っ込む
function processOrderQR(qrText) {
    let targetTable = currentTable;
    let menuParts = qrText;

    if (qrText.startsWith('T')) {
        const commaIndex = qrText.indexOf(',');
        if (commaIndex !== -1) {
            const tableStr = qrText.substring(1, commaIndex);
            targetTable = parseInt(tableStr) || currentTable;
            menuParts = qrText.substring(commaIndex + 1);
        }
    }

    if (!allTablesData[targetTable]) { allTablesData[targetTable] = []; }

    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const items = menuParts.split(",");
    items.forEach(itemStr => {
        const [id, count] = itemStr.split(":");
        if (id && count) {
            // ⭐トッピング（例：m26_tp19）の場合の名前取得処理
            let itemName = "";
            if (id.includes('_')) {
                const toppingId = id.split('_')[1];
                itemName = getItemName(toppingId); // トッピングのマスターから純粋な名前（ベビースター等）を抜く
            } else {
                itemName = getItemName(id); // 通常メニューの名前をマスターから取得
            }

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
    switchTable(targetTable);
    alert(`${targetTable}番卓に自動振り分けで注文を追加しました！`);
}