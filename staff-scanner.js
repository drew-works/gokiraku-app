// 📋 staff-scanner.js - カメラ起動・フリーズ完全防止・スマートフォンダイアログロック対策

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const statusMsg = document.getElementById("camera-status-msg");

let isScanning = false;
let streamRef = null;
let animationFrameId = null;

// カメラを安全に起動する関数
function openScanner() {
    document.getElementById('scanModal').style.display = 'flex';
    isScanning = true;
    updateStatus("カメラにアクセスしています...");

    // ①スマホ用の外カメラ優先の設定
    const constraints = {
        video: { facingMode: "environment" }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(startStream)
        .catch(err => {
            console.warn("外カメラの起動に失敗。フロントカメラでの再試行を行います:", err);
            // ②パソコンやインカメラのみの環境用
            return navigator.mediaDevices.getUserMedia({ video: true });
        })
        .then(startStream)
        .catch(err => {
            console.error("すべてのカメラ起動に失敗しました:", err);
            updateStatus("❌ カメラへのアクセスが許可されていないか、カメラが見つかりません。");
            showToast("カメラを起動できませんでした", true);
        });
}

function startStream(stream) {
    streamRef = stream;
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // iOS Safariでの全画面起動・フリーズを防止
    
    video.play()
        .then(() => {
            updateStatus("🟢 スキャン中... QRコードを枠内に写してください");
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(tick);
        })
        .catch(err => {
            console.error("ビデオ再生エラー:", err);
            updateStatus("❌ ビデオの再生に失敗しました。");
        });
}

// カメラを終了する関数
function closeScanner() {
    document.getElementById('scanModal').style.display = 'none';
    isScanning = false;
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    if (streamRef) {
        streamRef.getTracks().forEach(track => track.stop());
        streamRef = null;
    }
    
    if (video) {
        video.srcObject = null;
    }
}

// 毎フレームの描画＆QRコードスキャン処理
function tick() {
    if (!isScanning) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            animationFrameId = requestAnimationFrame(tick);
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // ビデオ映像をキャンバスに描画
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // スキャンレーザーアニメーションを描画
        drawScanningLine();

        try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            if (typeof jsQR === 'function') {
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert"
                });

                if (code && code.data) {
                    isScanning = false;
                    
                    // 解析・データ保存処理で万が一エラーが起きてもフリーズさせない
                    try {
                        processOrderQR(code.data);
                    } catch (err) {
                        console.error("QRデータ解析中にクラッシュ:", err);
                        showToast("QRコードのデータ構造が正しくありません", true);
                    }
                    
                    closeScanner(); // スキャンが成功したら必ずカメラスレッドを安全に止める
                    return;
                }
            } else {
                updateStatus("⚠️ jsQRライブラリが読み込まれていません。");
            }
        } catch (e) {
            console.error("QR解析中のエラー:", e);
        }
    }

    animationFrameId = requestAnimationFrame(tick);
}

// レーザーラインを描画
function drawScanningLine() {
    const time = Date.now() * 0.003;
    const y = (Math.sin(time) * 0.5 + 0.5) * canvas.height;
    
    ctx.strokeStyle = "#28a745";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#28a745";
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function updateStatus(text) {
    if (statusMsg) {
        statusMsg.innerText = text;
    }
}

// スキャン完了トースト表示関数 (ノンブロッキングでフリーズを完全回避)
function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = message;
    if (isError) {
        toast.classList.add("error-toast");
    } else {
        toast.classList.remove("error-toast");
    }

    toast.classList.add("show");

    // 2.5秒後に自動で隠す
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// スキャン成功時の注文分解処理
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

    if (!allTablesData[targetTable]) { 
        allTablesData[targetTable] = []; 
    }

    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const items = menuParts.split(",");
    items.forEach(itemStr => {
        const [id, count] = itemStr.split(":");
        if (id && count) {
            let itemName = "";
            if (id.includes('_')) {
                const toppingId = id.split('_')[1];
                itemName = getItemName(toppingId);
            } else {
                itemName = getItemName(id);
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
    switchTable(targetTable); // 自動的に、注文が入った卓にタブを切り替え
    
    // 標準alertは絶対に使わず、トースト通知で完了を知らせる
    showToast(`${targetTable}番卓に注文を追加しました！`);
}