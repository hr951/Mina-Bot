const googleTTS = require('google-tts-api');
const { createAudioResource, StreamType } = require('@discordjs/voice');
const { model } = require('./db/db');

// デフォルト設定
// Google TTS では lang (言語) や slow (低速フラグ) が利用可能
const DEFAULT_SETTING = {
    lang: 'ja',
    slow: false,
    speedScale: 1.0 // 識別用（通常: 1.0, 低速: 0.5）
};

/**
 * ユーザー個別のJSON設定ファイルを読み込む
 */
async function loadUserSetting(userId) {
    let vcVoiceSetting;

    try {
        const msgPoint = await model.findOne({ _id: userId });
        if (!vcVoiceSetting) {
            vcVoiceSetting = null;
        }
        return msgPoint.vc_voice_setting || { ...DEFAULT_SETTING };
    } catch (error) {
        custom.error(error);
    }
    return { ...DEFAULT_SETTING };
}

/**
 * 再生キューの処理
 */
async function processQueue(serverQueue) {
    if (serverQueue.isPlaying || serverQueue.queue.length === 0) return;

    serverQueue.isPlaying = true;
    const { text, userId } = serverQueue.queue.shift();

    // 発言者の個別設定ファイルをロード
    const setting = await loadUserSetting(userId);

    try {
        // Google TTS から音声URLを取得
        const url = googleTTS.getAudioUrl(text, {
            lang: setting.lang || 'ja',
            slow: setting.slow || false,
            host: 'https://translate.google.com',
            timeout: 10000,
        });

        const resource = createAudioResource(url, {
            inputType: StreamType.Arbitrary
        });

        serverQueue.player.play(resource);
    } catch (err) {
        console.error('[Google TTS Error]', err);
        serverQueue.isPlaying = false;
        processQueue(serverQueue);
    }
}

module.exports = {
    loadUserSetting,
    processQueue
};