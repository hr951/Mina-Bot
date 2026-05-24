const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");
const fs = require('node:fs');
const path = require('node:path');
const { Connectors } = require('shoukaku');
const { Kazagumo } = require('kazagumo');
const mongoose = require('mongoose');
require("dotenv").config();
require('./utils/createLogs.js');

require("./server.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
        Partials.User
    ]
});

const token = process.env.DISCORD_BOT_TOKEN;
const uri = process.env.DB;

if (!global.loopSettings) global.loopSettings = new Map();
if (!global.customQueue) global.customQueue = new Map();

const Nodes = [
    {
        name: 'Render-Node',
        url: process.env.LAVA_LINK_URL, // URL (PORT -> 443)
        auth: process.env.LAVA_LINK_AUTH, // パスワード
        secure: true // HTTPS(443) -> true
    }
];

// ----- Kazagumo初期化 -----
const kazagumo = new Kazagumo({
    defaultSearchEngine: "soundcloud",
    send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
    }
}, new Connectors.DiscordJS(client), Nodes);

kazagumo.on("playerEnd", async (player) => {
    const guildId = player.guildId;
    const queue = global.customQueue.get(guildId);
    const loopMode = global.loopSettings.get(guildId) || "none";

    if (!queue || queue.length === 0) return;

    // --- ループモードによる配列操作 ---
    if (loopMode === "track") {
        custom.log(`[Loop] 1曲リピート中: ${queue[0].query}`);
    }
    else if (loopMode === "queue") {
        const finishedItem = queue.shift();
        queue.push(finishedItem);
        custom.log(`[Loop] 全曲ループ: ${finishedItem.query} を最後尾に移動`);
    }
    else {
        queue.shift();
    }

    if (queue.length > 0) {
        const { playNext } = require('./commands/search.js');
        await playNext(player, kazagumo);
    }
});

kazagumo.on("playerException", async (player) => {
    const { playNext } = require('./commands/search.js');
    const queue = global.customQueue.get(player.guildId);
    if (queue) {
        queue.shift(); // 失敗した曲を飛ばす
        await playNext(player, kazagumo);
    }
});

kazagumo.on("playerDestroy", (player) => {
    const guildId = player.guildId;

    if (global.customQueue && global.customQueue.has(guildId)) {
        global.customQueue.delete(guildId);
        custom.log(`[Cleanup] Guild: ${guildId} - ボットが退出したためキューを削除しました。`);
    }

    if (global.loopSettings && global.loopSettings.has(guildId)) {
        global.loopSettings.delete(guildId);
    }
});

client.kazagumo = kazagumo;
client.kazagumo.shoukaku.on('ready', (name) => custom.log(`Connected Lavalink - ${name}`));
// ----- Kazagumo初期化終了 -----

// ----- エラーハンドリング -----
// Shoukaku (接続層) のエラーをキャッチ
kazagumo.shoukaku.on('error', (name, error) => {
    custom.error(`Lavalink [${name}] でエラーが発生しました: ${error.message}`);
});

// Kazagumo (プレイヤー層) のエラーをキャッチ
kazagumo.on('error', (name, error) => {
    custom.error(`Kazagumo [${name}] でエラーが発生しました: ${error.message}`);
});

// 予期せぬエラーでプロセスを落とさないための保険
process.on('unhandledRejection', (reason, promise) => {
    custom.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on('uncaughtException', (error) => {
    custom.error(`Uncaught Exception: ${error.message}`);
});
// ----- エラーハンドリング終了 -----

mongoose
    .connect(uri)
    .then(() => {
        custom.log('Connected DataBase - index.js');
    })
    .catch((error) => {
        custom.error(error);
    });

// ---- ここまでBot設定 ----

// ---- コマンド&イベント読み込み処理 ----
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        custom.error(`${filePath} に必要な "data" か "execute" がありません。`);
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// ---- コマンド&イベント読み込み処理終了 ----

client.login(token);
