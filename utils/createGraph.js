const { createCanvas, registerFont } = require('canvas');
registerFont('./font/NotoSansJP-VariableFont_wght.ttf', { family: 'NotoSans' });

/**
 * 動画の推移データを2軸グラフ化してPNG保存する
 * @param {Array} historyData - GASから取得した推移データの配列
 * @param {string} videoTitle - 動画タイトル（ファイル名用）
 */
function createGraph(historyData, videoTitle) {
    if (!historyData || historyData.length < 2) {
        custom.log("❌ データが足りないためグラフを描画できません。");
        return;
    }

    // --- 1. データの整理 ---
    const labels = []; // 日時
    const views = [];  // 再生数
    const likes = [];  // 高評価数

    historyData.forEach(row => {
        // row: [日時, ID, タイトル, 再生数, 高評価数, 高評価率]
        labels.push(new Date(row[0]));
        views.push(parseInt(row[3]) || 0);
        likes.push(parseInt(row[4]) || 0);
    });

    // --- 2. グラフのサイズと設定 ---
    const width = 1000;
    const height = 600;
    const padding = { top: 60, right: 80, bottom: 80, left: 80 }; // 左右に軸スペース確保
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 背景色
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // --- 3. 軸の範囲（Min/Max）計算 ---
    const maxViews = Math.max(...views) * 1.1; // 少し余裕を持たせる
    const minViews = Math.min(...views) * 0.9;
    const maxLikes = Math.max(...likes) * 1.1;
    const minLikes = Math.min(...likes) * 0.9;

    // X軸（時間）の範囲
    const minTime = labels[0].getTime();
    const maxTime = labels[labels.length - 1].getTime();
    const timeRange = maxTime - minTime;

    // --- 4. 座標変換関数 ---
    const getX = (date) => padding.left + ((date.getTime() - minTime) / timeRange) * graphWidth;
    const getYLeft = (value) => padding.top + graphHeight - ((value - minViews) / (maxViews - minViews)) * graphHeight;
    const getYRight = (value) => padding.top + graphHeight - ((value - minLikes) / (maxLikes - minLikes)) * graphHeight;

    // --- 5. 軸とグリッドの描画 ---
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // 横グリッド（再生数基準で5本）
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + (graphHeight / 5) * i;
        const valView = Math.round(maxViews - ((maxViews - minViews) / 5) * i);
        const valLike = Math.round(maxLikes - ((maxLikes - minLikes) / 5) * i);

        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(valView.toLocaleString(), padding.left - 10, y + 5); // 左軸（再生数）

        ctx.textAlign = 'left';
        ctx.fillText(valLike.toLocaleString(), width - padding.right + 10, y + 5); // 右軸（高評価）
    }

    // X軸のラベル（最初、中間、最後）
    ctx.textAlign = 'center';
    [0, 0.5, 1].forEach(p => {
        const time = minTime + timeRange * p;
        const date = new Date(time);
        const label = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
        ctx.fillText(label, getX(date), height - padding.bottom + 25);
    });

    // --- 6. データのプロット（折れ線） ---

    // 再生数（青色、左軸）
    ctx.strokeStyle = '#1a73e8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    labels.forEach((date, i) => {
        const x = getX(date);
        const y = getYLeft(views[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 高評価数（赤色、右軸）
    ctx.strokeStyle = '#d93025';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]); // 点線にする
    ctx.beginPath();
    labels.forEach((date, i) => {
        const x = getX(date);
        const y = getYRight(likes[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]); // 実線に戻す

    // --- 7. タイトルと凡例 ---
    ctx.fillStyle = '#000';
    ctx.font = 'bold 20px "NotoSans"';
    ctx.textAlign = 'center';
    ctx.fillText(videoTitle, width / 2, padding.top - 20);

    // 凡例
    ctx.font = '16px "NotoSans"';
    ctx.textAlign = 'left';

    ctx.fillStyle = '#1a73e8';
    ctx.fillRect(width - 250, 15, 20, 10);
    ctx.fillText('再生数 (左軸)', width - 220, 25);

    ctx.fillStyle = '#d93025';
    ctx.fillRect(width - 250, 35, 20, 10);
    ctx.fillText('高評価数 (右軸、点線)', width - 220, 45);

    // --- 8. ファイル保存 ---
    return canvas;
}

module.exports = { createGraph };