const axios = require('axios');
require("dotenv").config();

// ⚠️ ここにGASのデプロイURLを貼り付けてください
const GAS_URL = process.env.GAS_URL;

/**
 * 1. 監視したいチャンネルIDをスプレッドシートに追加する
 * @param {string} channelId - YouTubeのチャンネルID (UC...)
 */
async function addChannel(channelId) {
    try {
        const response = await axios.post(GAS_URL, {
            action: 'addChannel',
            channelId: channelId
        });
        custom.log(`✅ 成功: ${JSON.stringify(response.data)}`);
    } catch (error) {
        custom.error(error);
    }
}


// 2. 記録されている動画のタイトルとIDの一覧を取得する
async function getVideoList() {
    const res = await axios.post(GAS_URL, { action: 'getVideoList' });
    //custom.log("📺 記録されている動画一覧:");
    //console.table(res.data);
    return res.data;
}


// 3. 特定の動画IDの推移（再生数の変化など）を取得する
async function getVideoHistory(videoId) {
    const res = await axios.post(GAS_URL, {
        action: 'getVideoHistory',
        videoId: videoId
    });

    /*custom.log(`📈 動画 [${videoId}] の推移データ:`);
    // 取得日時, 動画ID, タイトル, 再生数, 高評価数, 高評価率 の順で表示される
    res.data.forEach(row => {
        custom.log(`${new Date(row[0]).toLocaleString()} | 再生数: ${row[3]} | 高評価: ${row[4]}`);
    });*/
    return res.data;
}

// --- 実行例 ---
/*async function main() {
    // まず動画一覧を見て、気になる動画のIDを探す
    const list = await getVideoList();

    // 例: リストにある最初の動画IDで推移を表示してみる
    const firstVideoId = Object.keys(list)[1];
    if (firstVideoId) {
        await getVideoHistory(firstVideoId);
    }
}*/

module.exports = { addChannel, getVideoList, getVideoHistory };