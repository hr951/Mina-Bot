const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
    _id: { type: String }, // ユーザーID
    name: { type: String }, // ユーザーネーム
    display_name: { type: String }, // ディスプレイネーム
    content: { type: String }, // MSG内容
    msgcount: { type: Number }, // MSG総数
    point: { type: Number }, // MSGポイント
    all_point: { type: Number }, // MSG累計ポイント
    bg_upgrade: { type: Boolean }, // 背景変化
    bg_type: { type: Number }, // 0...デフォルト、1...既定アップグレード, 2...自由画像
    bg_url: { type: String }, // 自由画像URL
    anni_role: { type: Boolean },
    osyaberi_role: { type: Boolean },
    densetu_role: { type: Boolean },
    playlist: { type: String }, // ユーザープレイリスト
    warn: { type: Number }, // 警告数
    vc_point: { type: Number }, // VCポイント
    vc_all_point: { type: Number }, // VC累計ポイント
    vc_time: { type: Number } // UNIX
});

const serverSchema = new mongoose.Schema({
    _id: { type: String }, // サーバーID
    ip_hub_1_je: { type: String }, // サーバーIP (HUB1 JE)
    port_hub_1_je: { type: Number }, // サーバーポート (HUB1 JE)
    ip_hub_1_be: { type: String }, // サーバーIP (HUB1 BE)
    port_hub_1_be: { type: Number }, // サーバーポート (HUB1 BE)
    ip_hub_2_je: { type: String }, // サーバーIP (HUB2 JE)
    port_hub_2_je: { type: Number }, // サーバーポート (HUB2 JE)
    ip_hub_2_be: { type: String }, // サーバーIP (HUB2 BE)
    port_hub_2_be: { type: Number }, // サーバーポート (HUB2 BE)
    black_words: { type: String }, // ブラックワード
    commands_use: {
        total: { type: Number }, // 総使用数
        info: { type: Number },
        lb: { type: Number },
        loop: { type: Number },
        member: { type: Number },
        nowplaying: { type: Number },
        ping: { type: Number },
        play: { type: Number },
        playlist: { type: Number },
        point: { type: Number },
        profile: { type: Number },
        queue: { type: Number },
        search: { type: Number },
        skip: { type: Number },
        stop: { type: Number },
        top: { type: Number },
        update_server: { type: Number }
    } // コマンド使用率
});

const model = mongoose.model('Messages', msgSchema);
const serverModel = mongoose.model('Servers', serverSchema);

module.exports = { model, serverModel };