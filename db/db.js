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
    ip_hub_1_je: { type: String }, //サーバーIP (HUB1 JE)
    port_hub_1_je: { type: Number }, //サーバーポート (HUB1 JE)
    ip_hub_1_be: { type: String }, //サーバーIP (HUB1 BE)
    port_hub_1_be: { type: Number }, //サーバーポート (HUB1 BE)
    ip_hub_2_je: { type: String }, //サーバーIP (HUB2 JE)
    port_hub_2_je: { type: Number }, //サーバーポート (HUB2 JE)
    ip_hub_2_be: { type: String }, //サーバーIP (HUB2 BE)
    port_hub_2_be: { type: Number } //サーバーポート (HUB2 BE)
});

const model = mongoose.model('Messages', msgSchema);
const serverModel = mongoose.model('Servers', serverSchema);

module.exports = { model, serverModel };