// カメラ起動、QRコードの読み取り
// カメラ・QRスキャン関連の変数
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const statusMsg = document.getElementById("camera-status-msg");

let isScanning = false;
let streamRef = null;
let animationFrameId = null;

// スキャナーを開く
function openScanner() {
    document.getElementById('scanModal').style.display = 'flex';
    isScanning = true;
    statusMsg.innerText = "カメラにアクセスしています...";

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function(stream) {
            streamRef = stream;
            video.srcObject = stream;
            video.setAttribute("playsinline", true);
            video.play();
            statusMsg.innerText = "スキャン中...";
            animationFrameId = requestAnimationFrame(tick);
        })
        .catch(function(err) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(stream) {
                    streamRef = stream;
                    video.srcObject = stream;
                    video.setAttribute("playsinline", true);
                    video.play();
                    statusMsg.innerText = "スキャン中(インカメラ)...";
                    animationFrameId = requestAnimationFrame(tick);
                })
                .catch(function(e) {
                    statusMsg.innerText = "カメラを起動できませんでした。";
                });
        });
}

// スキャナーを閉じる
function closeScanner() {
    document.getElementById('scanModal').style.display = 'none';
    isScanning = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (streamRef) {
        streamRef.getTracks().forEach(track => track.stop());
        streamRef = null;
    }
    video.srcObject = null;
}

// 毎フレームの描画解析ループ
function tick() {
    if (!isScanning) return;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (typeof jsQR === 'function') {
            var code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                isScanning = false;
                processOrderQR(code.data);
                closeScanner();
                return;
            }
        }
    }
    animationFrameId = requestAnimationFrame(tick);
}

// 読み取ったQRテキストを解析して注文をデータに追加
function processOrderQR(qrText) {
    let targetTable = currentTable === 'all' ? 1 : currentTable;
    let menuParts = qrText;

    if (qrText.startsWith('T')) {
        const commaIndex = qrText.indexOf(',');
        if (commaIndex !== -1) {
            const tableStr = qrText.substring(1, commaIndex);
            targetTable = parseInt(tableStr) || targetTable;
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
            const itemInfo = getItemInfo(id); // staff-logic.jsの関数を使用
            const orderItem = {
                uniqueId: targetTable + "_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
                id: id,
                name: itemInfo.name,
                price: itemInfo.price,
                count: parseInt(count),
                time: timeStr,
                paperDone: false,
                foodDone: false
            };
            allTablesData[targetTable].push(orderItem);
        }
    });

    saveData(); // staff-logic.jsの関数を使用
    
    // 今開いている画面のままリストを再描画
    switchTable(currentTable); 
    alert(`注文を自動振り分けで追加しました！`);
}