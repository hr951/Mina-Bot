const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
    _id: { type: String }, //ユーザーID
    name: { type: String }, //ユーザーネーム
    content: { type: String }, //メッセ
    msgcount: { type: Number }, //メッセ数
    point: { type: Number }, //所持ポイント
    all_point: { type: Number }, //累計ポイント
    bg_upgrade: { type: Boolean }, //背景変化
    bg_type: { type: Number }, //0...デフォルト、1...既定アップグレード, 2...自由画像
    bg_url: { type: String },
    anni_role: { type: Boolean },
    osyaberi_role: { type: Boolean },
    densetu_role: { type: Boolean },
    playlist: { type: String }
});

const serverSchema = new mongoose.Schema({
    _id: { type: String }, //サーバーID
    ip_je: { type: String }, //サーバーIP (JE)
    port_je: { type: Number }, //サーバーポート (JE)
    ip_jb: { type: String }, //サーバーIP (JB)
    port_jb: { type: Number }, //サーバーポート (JB)
    ip_be: { type: String }, //サーバーIP (BE)
    port_be: { type: Number } //サーバーポート (BE)
});

const model = mongoose.model('Messages', msgSchema);
const serverModel = mongoose.model('Servers', serverSchema);

module.exports = { model, serverModel };