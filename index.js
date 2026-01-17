const { Client, GatewayIntentBits, Collection, ActivityType, Partials, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, Permissions, PermissionFlagsBits, PermissionsBitField, AttachmentBuilder, StringSelectMenuBuilder, InteractionResponse } = require("discord.js");
const fs = require('node:fs');
const path = require('node:path');
const { Connectors } = require('shoukaku');
const { Kazagumo } = require('kazagumo');
const util = require("minecraft-server-util");
const mongoose = require('mongoose');
const msgModel = require('./db/db');
const sizeOf = require("image-size").default;
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
const color = "#FFFFFF";

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

kazagumo.on("playerStart", (player, track) => {
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
});

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

const lastCountTime = new Map();

mongoose
    .connect(uri, {
        useNewUrlParser: true, //任意
    })
    .then(() => {
        console.log('Connected DataBase!');
    })
    .catch((error) => {
        console.log(error);
    });

async function check() {
    const ip =
    {
        "je": "162.43.75.189",
        "jb": "162.43.75.189",
        "be": "162.43.75.189"
    };
    const port =
    {
        "je": 25565,
        "jb": 19132,
        "be": 19133
    };

    try {
        const result = await util.status(ip.je, port.je);
        const result_jb = await util.statusBedrock(ip.jb, port.jb);
        const result_be = await util.statusBedrock(ip.be, port.be);

        const embed = new EmbedBuilder()
            .addFields(
                { name: `**HUBサーバー (JE・BE対応)**`, value: " ", inline: false },
                { name: "サーバー状態", value: "🟢 オンライン", inline: true },
                { name: "参加人数", value: `${result.players.online}/${result.players.max}`, inline: true },
                { name: "バージョン", value: "JE: **" + result.version.name.replace("Velocity ", "") + "**\nBE: **" + result_jb.version.name + "**" || "undefined" },
                { name: `**BEサーバー**`, value: " ", inline: false },
                { name: "サーバー状態", value: "🟢 オンライン", inline: true },
                { name: "参加人数", value: `${result_be.players.online}/${result_be.players.max}`, inline: true },
                { name: "バージョン", value: "**\nBE: **" + result_be.version.name + "**" || "undefined" }
            )
            .setColor("Green")
            .setTimestamp();

        return embed;

    } catch (error) {
        try {
            const result = await util.status(ip.je, port.je);
            const result_jb = await util.statusBedrock(ip.jb, port.jb);

            const embed = new EmbedBuilder()
                .addFields(
                    { name: `**HUBサーバー (JE・BE対応)**`, value: " ", inline: false },
                    { name: "サーバー状態", value: "🟢 オンライン", inline: true },
                    { name: "参加人数", value: `${result.players.online}/${result.players.max}`, inline: true },
                    { name: "バージョン", value: "JE: **" + result.version.name.replace("Velocity ", "") + "**\nBE: **" + result_jb.version.name + "**" || "undefined" },
                    { name: `**BEサーバー**`, value: " ", inline: false },
                    { name: "サーバー状態", value: "🔴 オフライン", inline: true }
                )
                .setColor("Green")
                .setTimestamp();

            return embed;

        } catch (err) {
            try {
                const result_be = await util.statusBedrock(ip.be, port.be);

                const embed = new EmbedBuilder()
                    .addFields(
                        { name: `**HUBサーバー (JE・BE対応)**`, value: " ", inline: false },
                        { name: "サーバー状態", value: "🔴 オフライン", inline: true },
                        { name: `**BEサーバー**`, value: " ", inline: false },
                        { name: "サーバー状態", value: "🟢 オンライン", inline: true },
                        { name: "参加人数", value: `${result_be.players.online}/${result_be.players.max}`, inline: true },
                        { name: "バージョン", value: "**\nBE: **" + result_be.version.name + "**" || "undefined" }
                    )
                    .setColor("Green")
                    .setTimestamp();

                return embed;
            } catch (err) {
                const embed = new EmbedBuilder()
                    .addFields(
                        { name: `**HUBサーバー (JE・BE対応)**`, value: " ", inline: false },
                        { name: "サーバー状態", value: "🔴 オフライン", inline: true },
                        { name: `**BEサーバー**`, value: " ", inline: false },
                        { name: "サーバー状態", value: "🔴 オフライン", inline: true }
                    )
                    .setColor("Red")
                    .setTimestamp();

                return embed;
            }
        }
    }
}

client.on('ready', () => {
    setInterval(() => {
        client.user.setPresence({
            activities: [
                {
                    name: `Minachanの広場`,
                    //name: "メンテナンス",
                    type: ActivityType.Competing
                }
            ],
            status: `online`//online : いつもの, dnd : 赤い奴, idle : 月のやつ, invisible : 表示なし
        });


    }, 1000);
    setInterval(async () => {
        const channel = await client.channels.cache.get('1410517358459486308');
        const msg = await channel.messages.fetch('1410517899122053281');
        msg.edit({ embeds: [await check()] });
    }, 60000);
})

//ここから

client.on('guildMemberAdd', async member => {
    if (member.guild.id === "1265637138247057428") {
        const welcome_embed = new EmbedBuilder()
            .setTitle(`Welcome to ${member.guild.name}`)
            .setDescription(`**${member.user.globalName}**さん、参加ありがとうございます。\nあなたは${member.guild.memberCount}人目のメンバーです！\n分からないことなどはお気軽にお尋ねください！`)
            .setColor(color)
            .setFooter({
                text: "Made by Mina鯖 Bot",
            })
            .setTimestamp();

        member.guild.channels.cache.get("1315627090233790495").send({ content: `<@${member.user.id}>`, embeds: [welcome_embed] });
    }
});

client.on('guildMemberRemove', async member => {
    if (member.guild.id === "1265637138247057428") {
        member.guild.channels.cache.get("1315627090233790495").send(`${member.user.globalName}さんが退出しました。`);
    }
});

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

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`${interaction.commandName} が見つかりません。`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            try {
                await interaction.reply({ content: 'error', ephemeral: true });
                console.error(error);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const thumbnail = interaction.client.user.displayAvatarURL();
    if (interaction.isButton()) {
        if (interaction.customId === "report") {
            const modal = new ModalBuilder()
                .setTitle("チケット")
                .setCustomId("report_submit");
            const TextInput_1 = new TextInputBuilder()
                .setLabel("題名を入力してください。")
                .setCustomId("title")
                .setStyle("Short")
                .setPlaceholder(" ")
                .setMaxLength(100)
                .setMinLength(2)
                .setRequired(true);
            const TextInput_2 = new TextInputBuilder()
                .setLabel("内容を入力してください。")
                .setCustomId("content")
                .setStyle("Paragraph")
                .setPlaceholder(" ")
                .setMaxLength(1000)
                .setMinLength(2)
                .setRequired(true);
            const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
            const ActionRow_2 = new ActionRowBuilder().setComponents(TextInput_2);
            modal.setComponents(ActionRow, ActionRow_2);
            return interaction.showModal(modal);
        } else if (interaction.customId === "del") {
            if (!interaction.member.roles.cache.has('1307226905862340608')) {
                await interaction.reply({ content: "チャンネルを削除する権限がありません。", ephemeral: true })
                return;
            } else {
                const delmsg = new EmbedBuilder()
                    .addFields({
                        name: " ",
                        value: `<@${interaction.user.id}>がチケット「**${interaction.channel.name}**」を削除しました。`,
                        inline: true
                    })
                    .setColor(color);
                client.channels.cache.get("1307705261544308807").send({ embeds: [delmsg] })
                interaction.channel.delete();
            }

            //point use
            //bg
        } else if (interaction.customId === "bg_upgrade") {
            let points = 0;
            let bg = false;
            try {
                const msgPoint = await msgModel.findOne({ _id: interaction.user.id });
                points = msgPoint.point;
                bg = msgPoint.bg_upgrade;
                if (isNaN(points)) {
                    points = 0;
                }
                if (!bg) {
                    bg = false;
                }
            } catch (error) {
                console.error(error);
            }
            if (bg) {
                const menu = new StringSelectMenuBuilder()
                    .setCustomId("select_bg")
                    .setPlaceholder("画像を選択してください")
                    .addOptions(
                        {
                            label: "初期画像",
                            value: "1",
                        },
                        {
                            label: "集合写真",
                            value: "2",
                        },
                        {
                            label: "画像を登録する",
                            value: "3",
                        }
                    );

                const row = new ActionRowBuilder().addComponents(menu);

                await interaction.reply({
                    components: [row],
                    ephemeral: true
                });

                return;
            } else if (points < 200) {
                await interaction.reply({ content: `**${200 - points}**ポイント分不足しています。`, ephemeral: true });
                return;
            }
            try {
                const msgData = await msgModel.findOneAndUpdate(
                    { _id: interaction.user.id }, // 条件
                    {
                        $set: {
                            name: interaction.user.username,
                            point: points - 200,
                            bg_upgrade: true,
                        },
                    },
                    { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
                );

                const menu = new StringSelectMenuBuilder()
                    .setCustomId("select_bg")
                    .setPlaceholder("画像を選択してください")
                    .addOptions(
                        {
                            label: "初期画像",
                            value: "1",
                        },
                        {
                            label: "集合写真",
                            value: "2",
                        },
                        {
                            label: "画像を登録する",
                            value: "3",
                        }
                    );

                const row = new ActionRowBuilder().addComponents(menu);

                await interaction.reply({
                    components: [row],
                    ephemeral: true
                });

            } catch (err) {
                console.error("Update Error:", err);
            }

            //1st_anni
        } else if (interaction.customId === "1st_anni") {
            let points = 0;
            let anni_role = false;
            try {
                const msgPoint = await msgModel.findOne({ _id: interaction.user.id });
                points = msgPoint.point;
                anni_role = msgPoint.anni_role;

                if (isNaN(points)) {
                    points = 0;
                }
                if (!anni_role) {
                    anni_role = false;
                }
            } catch (error) {
                console.error(error);
            }
            if (anni_role) {
                await interaction.reply({ content: `すでに有効化されています。`, ephemeral: true });
                return;
            } else if (points < 1) {
                await interaction.reply({ content: `**${1 - points}**ポイント分不足しています。`, ephemeral: true });
                return;
            }
            try {
                const msgData = await msgModel.findOneAndUpdate(
                    { _id: interaction.user.id }, // 条件
                    {
                        $set: {
                            name: interaction.user.username,
                            point: points - 1,
                            anni_role: true
                        },
                    },
                    { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
                );

                const guild = await client.guilds.fetch("1265637138247057428");
                const role = await guild.roles.fetch("1446401161161605170");
                const member = await guild.members.fetch(interaction.user.id);
                await member.roles.add(role);

                interaction.reply({ content: `運用1周年記念ロールを付与しました。`, ephemeral: true });
            } catch (err) {
                console.error("Update Error:", err);
                const msgData = await msgModel.findOneAndUpdate(
                    { _id: interaction.user.id }, // 条件
                    {
                        $set: {
                            name: interaction.user.username,
                            point: points + 1,
                            anni_role: false
                        },
                    },
                    { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
                );
            }

            //osyaberi
        } else if (interaction.customId === "osyaberi") {
            let points = 0;
            let osyaberi_role = false;
            try {
                const msgPoint = await msgModel.findOne({ _id: interaction.user.id });
                points = msgPoint.point;
                osyaberi_role = msgPoint.osyaberi_role;

                if (isNaN(points)) {
                    points = 0;
                }
                if (!osyaberi_role) {
                    osyaberi_role = false;
                }
            } catch (error) {
                console.error(error);
            }
            if (osyaberi_role) {
                await interaction.reply({ content: `すでに有効化されています。`, ephemeral: true });
                return;
            } else if (points < 500) {
                await interaction.reply({ content: `**${500 - points}**ポイント分不足しています。`, ephemeral: true });
                return;
            }
            try {
                const msgData = await msgModel.findOneAndUpdate(
                    { _id: interaction.user.id }, // 条件
                    {
                        $set: {
                            name: interaction.user.username,
                            point: points - 500,
                            osyaberi_role: true
                        },
                    },
                    { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
                );

                const guild = await client.guilds.fetch("1265637138247057428");
                const role = await guild.roles.fetch("1408359240229453894");
                const member = await guild.members.fetch(interaction.user.id);
                await member.roles.add(role);

                await interaction.reply({ content: `Mina鯖のおしゃべりロールを付与しました。`, ephemeral: true });
            } catch (err) {
                console.error("Update Error:", err);
            }

            //densetu
        } else if (interaction.customId === "densetu") {
            let points = 0;
            let densetu_role = false;
            try {
                const msgPoint = await msgModel.findOne({ _id: interaction.user.id });
                points = msgPoint.point;
                densetu_role = msgPoint.densetu_role;

                if (isNaN(points)) {
                    points = 0;
                }
                if (!densetu_role) {
                    densetu_role = false;
                }
            } catch (error) {
                console.error(error);
            }
            if (densetu_role) {
                await interaction.reply({ content: `すでに有効化されています。`, ephemeral: true });
                return;
            } else if (points < 10000) {
                await interaction.reply({ content: `**${10000 - points}**ポイント分不足しています。`, ephemeral: true });
                return;
            }
            try {
                const msgData = await msgModel.findOneAndUpdate(
                    { _id: interaction.user.id }, // 条件
                    {
                        $set: {
                            name: interaction.user.username,
                            point: points - 10000,
                            densetu_role: true
                        },
                    },
                    { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
                );

                const guild = await client.guilds.fetch("1265637138247057428");
                const role = await guild.roles.fetch("1408359506634866748");
                const member = await guild.members.fetch(interaction.user.id);
                await member.roles.add(role);

                interaction.reply({ content: `Mina鯖の伝説話者ロールを付与しました。`, ephemeral: true });
            } catch (err) {
                console.error("Update Error:", err);
            }

            //none
        } else if (interaction.customId === "none") {
            let points = 0;
            try {
                const msgPoint = await msgModel.findOne({ _id: interaction.user.id });
                points = msgPoint.point;
            } catch (error) {
                console.error(error);
                if (isNaN(points)) {
                    points = 0;
                }
            }
            if (points < 0) {
                await interaction.reply({ content: `**${0 - points}**ポイント分不足しています。`, ephemeral: true });
                return;
            }
            try {
                const msgData = await msgModel.findOneAndUpdate(
                    { _id: interaction.user.id }, // 条件
                    {
                        $set: {
                            name: interaction.user.username,
                            point: points - 0,
                        },
                    },
                    { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
                );
                interaction.reply({ content: `Comming Soon!\n更新をお待ちください!`, ephemeral: true });
            } catch (err) {
                console.error("Update Error:", err);
            }

            //delete profile
        } else if (interaction.user.id === interaction.customId) {
            await interaction.message.delete();
        } else {
            await interaction.reply({ content: "このプロフィールの作者ではありません。", ephemeral: true })
        }

        //modal
    } else if (interaction.isModalSubmit()) {

        //report
        if (interaction.customId == "report_submit") {
            const content = interaction.fields.getTextInputValue("content");
            const title = interaction.fields.getTextInputValue("title");
            const id = interaction.user.id;
            try {
                const channel = await interaction.guild.channels.create({
                    name: `${title}`,
                    parent: "1307701371587399730",
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.guild.members.cache.get(id),
                            allow: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.guild.roles.cache.get("1307225736905621534"),
                            allow: [PermissionFlagsBits.ViewChannel],
                        }]
                })
                const embed_content = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(content)
                    .setColor(color)
                    .setFooter({
                        text: "Made by Mina鯖 Bot",
                        iconURL: thumbnail,
                    })
                    .setTimestamp()
                const Del_Button = new ButtonBuilder()
                    .setCustomId(`del`)
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("チャンネルの削除")
                    .setEmoji("🗑️");
                await channel.send({ content: `<@${id}>`, embeds: [embed_content], components: [new ActionRowBuilder().setComponents(Del_Button)] });
                await interaction.reply({ content: `https://discord.com/channels/${channel.guildId}/${channel.id} を作成しました。`, ephemeral: true });
            } catch (error) {
                await interaction.reply({ content: `キャッシュされていないユーザーの可能性があります。\n人力でチャンネルを作成してください。`, ephemeral: true });
            }
        }
    } else if (interaction.isStringSelectMenu()) {

        if (interaction.customId === "select_bg") {
            const value = interaction.values[0];
            const name = {
                0: "初期画像",
                1: "集合写真"
            };

            let image_url = "undefined";

            if (value === "3") {
                await interaction.reply("60秒以内に画像を送信してください");

                const channel = interaction.channel;
                const userId = interaction.user.id;

                const filter = (msg) =>
                    msg.author.id === userId && msg.attachments.size > 0;

                try {
                    const collected = await channel.awaitMessages({
                        filter,
                        max: 1,
                        time: 60_000, // 60秒待ち
                        errors: ["time"],
                    });

                    const msg = collected.first();
                    const attachment = msg.attachments.first();

                    const filename = attachment.name.toLowerCase();
                    const type = attachment.contentType?.toLowerCase() || "";

                    if (
                        !(
                            filename.endsWith(".png") ||
                            filename.endsWith(".jpg") ||
                            filename.endsWith(".jpeg") ||
                            type.includes("png") ||
                            type.includes("jpeg") ||
                            type.includes("jpg")
                        )
                    ) {
                        await interaction.followUp("対応していないファイル形式です\n**__png/jpg/jpeg__**のファイル形式の画像を用意してください");
                        return;
                    }

                    const imgBuffer = await fetch(attachment.url).then((r) => r.arrayBuffer());
                    const dimensions = sizeOf(Buffer.from(imgBuffer));

                    const { width, height } = dimensions;

                    if (width > 1920 || height > 1080) {
                        await interaction.followUp(`サイズが大きすぎます (${width}x${height})\n**__1920×1080__**以下にして送信してください`);
                        return;
                    }

                    const image = await interaction.followUp({
                        content: `以下の画像を登録しました！(${width}x${height})`,
                        files: [attachment.url],
                    });

                    image_url = image.attachments.first().attachment;

                    console.log(image_url)

                } catch (error) {
                    console.log(error);
                    await interaction.followUp("60秒以内に画像が送信されませんでした");
                }
            } else {
                image_url = "undefined";
            }

            try {

                try {
                    const msgPoint = await msgModel.findOne({ _id: interaction.user.id });
                } catch (error) {
                    console.error(error);
                }
                const msgData = await msgModel.findOneAndUpdate(
                    { _id: interaction.user.id }, // 条件
                    {
                        $set: {
                            name: interaction.user.username,
                            bg_type: value - 1,
                            bg_url: image_url
                        },
                    },
                    { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
                );
                if (value != 3) {
                    await interaction.reply(`プロフィール背景を**${name[value - 1]}**に設定しました`);
                }
                //console.log("Update the DataBase:", msgData);
            } catch (err) {
                console.error("Update Error:", err);
            }

        }
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const userId = message.author.id;

    if (message.guildId) {
        const now = Date.now();

        if (userId === "962670040795201557" && message.content === "!debug") {
            try {
                const msgData = await msgModel.findOneAndUpdate(
                    { _id: message.author.id }, // 条件
                    {
                        $set: {
                            name: message.author.username,
                            point: 999999,
                        },
                    },
                    { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
                );
                message.reply("Success")
            } catch (error) {
                message.reply("Failed")
                console.error(error);
            }
        } else if (userId === "962670040795201557" && message.content === "!reset") {
            try {
                await msgModel.deleteMany({});
                message.reply("Success");
            } catch (error) {
                console.error(error);
                message.reply("Failed");
            }
        } else if (userId === "962670040795201557" && message.content === "!point_reset") {
            let all_points = 0;
            try {
                const msgPoint = await msgModel.findOne({ _id: message.author.id });
                all_points = msgPoint.all_point;
            } catch (error) {
                if (isNaN(all_points)) {
                    all_points = 0;
                }
            }
            try {
                const msgData = await msgModel.findOneAndUpdate(
                    { _id: message.author.id }, // 条件
                    {
                        $set: {
                            name: message.author.username,
                            point: all_points,
                        },
                    },
                    { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
                );
                message.reply("Success");
            } catch (error) {
                console.error(error);
                message.reply("Failed");
            }
        } else if (userId === "962670040795201557" && message.content === "!update_status") {
            const channel = await client.channels.cache.get('1410517358459486308');
            const msg = await channel.messages.fetch('1410517899122053281');
            msg.edit({ embeds: [await check()] });
        }

        const lastTime = lastCountTime.get(userId) || 0;

        const length = message.content.length;
        var fixed = Math.floor(length / 40);
        const chance = length / 40 - fixed;
        var addpoint = Math.random() < chance ? 1 : 0;

        console.log(fixed + addpoint)

        if (now - lastTime < 2000) {
            addpoint = 0;
            fixed = 0;
        } else {
            lastCountTime.set(userId, now);
        }

        try {
            let msgs = 0;
            let points = 0;
            let all_points = 0;
            let msg_length = 0;
            let bg = false;
            let anni_role = false;
            let osyaberi_role = false;
            let densetu_role = false;

            try {
                const msgPoint = await msgModel.findOne({ _id: message.author.id });
                msgs = msgPoint.msgcount;
                points = msgPoint.point;
                all_points = msgPoint.all_point;
                msg_length = msgPoint.msglength;
                bg = msgPoint.bg_upgrade;
                anni_role = msgPoint.anni_role;
                osyaberi_role = msgPoint.osyaberi_role;
                densetu_role = msgPoint.densetu_role;

                if (isNaN(msgs)) {
                    msgs = 0;
                }
                if (isNaN(points)) {
                    points = 0;
                }
                if (isNaN(msg_length)) {
                    msg_length = msgs * 5;
                }
                if (isNaN(all_points)) {
                    all_points = 0;
                }
                if (!bg) {
                    bg = false;
                }
                if (!anni_role) {
                    anni_role = false;
                }
                if (!osyaberi_role) {
                    osyaberi_role = false;
                }
                if (!densetu_role) {
                    densetu_role = false;
                }
            } catch (error) {
                console.error(error);
            }
            const msgData = await msgModel.findOneAndUpdate(
                { _id: message.author.id }, // 条件
                {
                    $set: {
                        name: message.author.username,
                        content: message.cleanContent,
                        msgcount: msgs + 1,
                        msglength: msg_length + message.content.length,
                        point: points + fixed + addpoint,
                        all_point: all_points + fixed + addpoint,
                        bg_upgrade: bg,
                        anni_role: anni_role,
                        osyaberi_role: osyaberi_role,
                        densetu_role: densetu_role
                    },
                },
                { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
            );

            //console.log("Update the DataBase:", msgData);
        } catch (err) {
            console.error("Update Error:", err);
        }
    }

    if (message.content.match(/🖕/)) {
        if (message.author.id === "962670040795201557" || message.author.id === "1225452488237514763") return;
        message.delete();
        client.channels.cache.get("1380894393611059241").send(`${message.author.tag} が ${message.channel} で 「**${message.cleanContent}**」 と発言しました。`);
    }
    const MESSAGE_URL_REGEX = /https?:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/g;
    const matches = MESSAGE_URL_REGEX.exec(message.content);
    if (matches) {
        const [_, guildId, channelId, messageId] = matches;
        try {
            var guild = await client.guilds.fetch(guildId);
            var channel = await client.channels.fetch(channelId);
            var fetchedMessage = await channel.messages.fetch(messageId);
        } catch (error) {
            const reply = await message.reply({ content: "Botがサーバーに加入していない可能性があります。", allowedMentions: { repliedUser: false } });
            setTimeout(() => {
                reply.delete();
            }, 2000);
            return;
        }

        if (fetchedMessage.poll) return;

        if (!fetchedMessage.embeds[0] && fetchedMessage.attachments.size === 0) {

            const Embed = new EmbedBuilder()
                .setColor('#ffffff')
                .setAuthor({ name: fetchedMessage.author.username, iconURL: fetchedMessage.author.displayAvatarURL() })
                .setDescription(fetchedMessage.content)
                .setTimestamp(fetchedMessage.createdTimestamp);

            message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });
        } else if (fetchedMessage.attachments.size === 0 && fetchedMessage.embeds[0]) {
            message.reply({ embeds: [fetchedMessage.embeds[0]], allowedMentions: { repliedUser: false } });
        } else if (!fetchedMessage.content) {
            const files = await fetchedMessage.attachments.map(a => a.attachment);
            message.reply({ files: files, allowedMentions: { repliedUser: false } });
        } else {
            const files = await fetchedMessage.attachments.map(a => a.attachment);
            const texts = await fetchedMessage.content;
            message.reply({ content: texts, files: files, allowedMentions: { repliedUser: false } });
        }
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    const react_message = reaction.message;
    const react_member = react_message.guild.members.resolve(user);
    console.log(`${reaction.message.guild} で ${user.tag} が ${reaction.emoji.name} をリアクションしました`);
    if (user.id === "1225452488237514763" || user.id === "962670040795201557") return;
    if (reaction.emoji.name === '🖕') {
        react_message.reactions.cache.get('🖕').remove();
        client.channels.cache.get("1380894393611059241").send(`${user.tag} が https://discord.com/channels/${reaction.message.guild.id}/${react_message.channel.id}/${react_message.id} に ${reaction.emoji.name} を リアクションしました。`);
    }
});

// 誰かがボイスチャンネルからいなくなった時の処理
client.on("voiceStateUpdate", (oldState, newState) => {
    const player = kazagumo.players.get(oldState.guild.id);
    if (!player) return;

    const voiceChannel = client.channels.cache.get(player.voiceId);
    if (voiceChannel && voiceChannel.members.filter(m => !m.user.bot).size === 0) {
        player.destroy();
        const textChannel = client.channels.cache.get(player.textId);
        if (textChannel) textChannel.send("誰もいなくなったので退出しました");
    }
});

/*client.on('messageCreate', async message => {
  const thumbnail = message.client.user.displayAvatarURL();
  if(message.content === "report"){
    const Button = new ButtonBuilder()
        .setCustomId(`report`)
        .setStyle(ButtonStyle.Primary)
        .setLabel("チケット作成")
        .setEmoji("📩");
    
    const report_emb = new EmbedBuilder()
  .addFields(
    {
      name: "チケット作成",
      value: `意見や違反者の報告などに使用してください。\nどんな些細なことでも構いません。`,
      inline: true
    },
    )
  .setColor(color);
  message.channel.send({ embeds: [report_emb], components: [new ActionRowBuilder().setComponents(Button)]});
    } else if (message.content === "games"){
      const games_emb = new EmbedBuilder()
      .setTitle("ゲーム総合フォーラムについて")
  .setDescription("Minecraft以外のゲームについてそれぞれフォーラムを作成して会話する場所です。")
  .addFields(
    {
      name: "注意",
      value: "フォーラムを作成する前に重複しているフォーラムがないか確認してください。\n重複が確認された場合、消去する可能性があります。",
      inline: true
    },
  )
  .setColor("#ffffff")
  .setFooter({
    text: "Made by Mina鯖 Bot",
    iconURL: thumbnail,
  })
  .setTimestamp();
 
      message.channel.send({ embeds: [games_emb]});
    } else if (message.content === "logs"){
      const logs_emb = new EmbedBuilder()
      .setTitle("意見ボックスについて")
  .setDescription("基本的にサーバーの意見等を受け付けます。")
  .addFields(
    {
      name: "注意",
      value: "意見や違反に対応する際は誤りがないように回答をお願いします。\nまた、チャンネルの削除は主のみ可能です。",
      inline: true
    },
  )
  .setColor("#ffffff")
  .setFooter({
    text: "Made by Mina鯖 Bot",
    iconURL: thumbnail,
  })
  .setTimestamp();
 
      message.channel.send({ embeds: [logs_emb]});
    } else if (message.content === "invite"){
      const server_name = "Minachanの広場";
      const server_link = "https://discord.gg/Qbh53XcMY8"
      const invite_emb = new EmbedBuilder()
      .setTitle(server_name+" 招待URL")
      .setDescription("Minachanの広場に参加すると発言できるようになります。")
  .setColor("#ffffff")
  .setFooter({
    text: "Made by Mina鯖 Bot",
    iconURL: thumbnail,
  })
  .setTimestamp();
 
  const invite_url = new ButtonBuilder()
    .setLabel(server_name+"に参加する")
    .setURL(server_link)
    .setStyle(ButtonStyle.Link);
 
      message.channel.send({ embeds: [invite_emb],components: [new ActionRowBuilder().addComponents(invite_url)]});
    }
});*/

client.login(token);
