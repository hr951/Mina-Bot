const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");
const fs = require('node:fs');
const path = require('node:path');
const { Connectors } = require('shoukaku');
const { Kazagumo } = require('kazagumo');
const mongoose = require('mongoose');
require("dotenv").config();

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

const Nodes = [{
    name: 'Render-Node',
    url: process.env.LAVA_LINK_URL, // URL (PORT -> 443)
    auth: process.env.LAVA_LINK_AUTH, // パスワード
    secure: true // HTTPS(443) -> true
}];

// ----- Kazagumo初期化 -----
const kazagumo = new Kazagumo({
    defaultSearchEngine: "soundcloud",
    send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
    }
}, new Connectors.DiscordJS(client), Nodes);

/*kazagumo.on("playerStart", (player, track) => {
    const embed = new EmbedBuilder()
        .setTitle(player.queue.current.title)
        .setURL(player.queue.current.uri)
        .addFields(
            { name: "アーティスト: ", value: player.queue.current.author, inline: true },
            { name: "長さ: ", value: `${Math.floor(player.queue.current.length / 60000)}:${Math.floor((player.queue.current.length % 60000) / 1000).toString().padStart(2, '0')}`, inline: true }
        )
        .setImage(player.queue.current.thumbnail)
        .setColor(color);

    player.data.get("textChannel").send({ content: "再生中", embeds: [embed] });
});*/

client.kazagumo = kazagumo;
client.kazagumo.shoukaku.on('ready', (name) => console.log(`Lavalink Node: ${name} が接続されました！`));
// ----- Kazagumo初期化終了 -----

// ----- エラーハンドリング -----
// Shoukaku (接続層) のエラーをキャッチ
kazagumo.shoukaku.on('error', (name, error) => {
    console.error(`Lavalink Node[${name}] でエラーが発生しました:`, error);
});

// Kazagumo (プレイヤー層) のエラーをキャッチ
kazagumo.on('error', (name, error) => {
    console.error(`Kazagumo[${name}] でエラーが発生しました:`, error);
});

// 予期せぬエラーでプロセスを落とさないための保険
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
// ----- エラーハンドリング終了 -----

mongoose
    .connect(uri, {
        useNewUrlParser: true, //任意
    })
    .then(() => {
        console.log('Connected DataBase! - index.js');
    })
    .catch((error) => {
        console.log(error);
    });

// ---- ここまでBot設定 ----

// ---- コマンド読み込み処理 ----
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`${filePath} に必要な "data" か "execute" がありません。`);
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

// ---- コマンド読み込み処理終了 ----

client.login(token);
