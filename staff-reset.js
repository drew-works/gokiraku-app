//店員用リセット機能専用ファイル
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tableNumber = urlParams.get('table') || '1'; 
    const isStaff = urlParams.get('staff') === '1'; // URLに &staff=1 があるかチェック

    // 店員用URLの場合だけ、画面最上部に真っ赤なリセットバーを強制合流させる
    if (isStaff) {
        window.addEventListener('DOMContentLoaded', () => {
            const staffBar = document.createElement('div');
            staffBar.style.cssText = "background: #dc3545; color: white; text-align: center; padding: 12px; font-weight: bold; position: sticky; top: 0; z-index: 10000; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); cursor: pointer;";
            staffBar.innerText = `🚨【店員用】${tableNumber}番卓の履歴を完全に消去する`;
            
            staffBar.onclick = function() {
                if (confirm(`【確認】${tableNumber}番卓のこれまでの注文履歴を完全に削除して、新しいお客様用にリセットしますか？`)) {
                    // ローカルストレージの履歴を削除
                    localStorage.removeItem(`order_history_t${tableNumber}`);
                    alert(`${tableNumber}番卓の履歴をリセットしました。この画面を閉じて大丈夫です。`);
                    window.location.reload(); // 画面をリフレッシュして初期状態に
                }
            };
            
            // 画面の最初に差し込む
            document.body.insertBefore(staffBar, document.body.firstChild);
        });
    }
})();