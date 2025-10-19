global.ReadableStream = require('stream/web').ReadableStream;
global.crypto = require('crypto');

require("./server.js");

const { Client, GatewayIntentBits, Collection, ActivityType, Partials, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, Permissions, PermissionFlagsBits, PermissionsBitField, AttachmentBuilder } = require("discord.js");
const fs = require('node:fs');
const path = require('node:path');
const util = require("minecraft-server-util");
const mongoose = require('mongoose');
const msgModel = require('./db/db');

const uri = process.env.DB;

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
const color = "#FFFFFF";

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
    const ip = "147.185.221.30";
    const port = 34283;
    const ip_be = "162.43.85.205";
    const port_be = 19132;
    try {
        const result = await util.status(ip, port);
        const result_be = await util.statusBedrock(ip_be, port_be);

        const embed = new EmbedBuilder()
            .addFields(
                { name: `**HUBサーバー (JE・BE対応)**`, value: " ", inline: false },
                { name: "サーバー状態", value: "🟢 オンライン", inline: true },
                { name: "参加人数", value: `${result.players.online}/${result.players.max}`, inline: true },
                { name: "バージョン", value: result.version.name || "undefined" },
                { name: "\n \n", value: "\n \n" },
                { name: `**Xserver (BE限定)**`, value: " ", inline: false },
                { name: "サーバー状態", value: "🟢 オンライン", inline: true },
                { name: "参加人数", value: `${result_be.players.online}/${result_be.players.max}`, inline: true },
                { name: "バージョン", value: result_be.version.name || "undefined" }
            )
            .setColor("Green")
            .setTimestamp();

        return embed;

    } catch (error) {
        try {
            const result = await util.status(ip, port);

            const embed = new EmbedBuilder()
                .addFields(
                    { name: `**HUBサーバー (JE・BE対応)**`, value: " ", inline: false },
                    { name: "サーバー状態", value: "🟢 オンライン", inline: true },
                    { name: "参加人数", value: `${result.players.online}/${result.players.max}`, inline: true },
                    { name: "バージョン", value: result.version.name || "undefined" },
                    { name: " ", value: " " },
                    { name: `**Xserver (BE限定)**`, value: " ", inline: false },
                    { name: "サーバー状態", value: "🔴 オフライン", inline: true }
                )
                .setColor("Orange")
                .setTimestamp();

            return embed;

        } catch (error) {
            try {
                const result_be = await util.statusBedrock(ip_be, port_be);

                const embed = new EmbedBuilder()
                    .addFields(
                        { name: `**HUBサーバー (JE・BE対応)**`, value: " ", inline: false },
                        { name: "サーバー状態", value: "🔴 オフライン", inline: true },
                        { name: "\n \n", value: "\n \n" },
                        { name: `**Xserver (BE限定)**`, value: " ", inline: false },
                        { name: "サーバー状態", value: "🟢 オンライン", inline: true },
                        { name: "参加人数", value: `${result_be.players.online}/${result_be.players.max}`, inline: true },
                        { name: "バージョン", value: result_be.version.name || "undefined" },
                    )
                    .setColor("Orange")
                    .setTimestamp();

                return embed;

            } catch (error) {
                const embed = new EmbedBuilder()
                    .addFields(
                        { name: `**HUBサーバー (JE・BE対応)**`, value: " ", inline: false },
                        { name: "サーバー状態", value: "🔴 オフライン", inline: true },
                        { name: " ", value: " " },
                        { name: `**Xserver (BE限定)**`, value: " ", inline: false },
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
        //const guild = await client.guilds.cache.get("1040937611390353408");
        const channel = await client.channels.cache.get('1410517358459486308');
        const msg = await channel.messages.fetch('1410517899122053281');
        msg.edit({ embeds: [await check()] });
    }, 60000);
})

//ここから

client.on('guildMemberAdd', async member => {
    if (member.guild.id === "1307224551410761778") {
        const guild = client.guilds.cache.get("1307683510311583805");
        try {
            const member_role = await guild.members.fetch(member.user);
            await member_role.roles.add("1307687730582523987");
            console.log("IN Minachanの広場\nMinaメンフォトナクラブ 参加あり");
        } catch (error) {
            console.log("IN Minachanの広場\nMinaメンフォトナクラブ 参加なし")
        }
    } else if (member.guild.id === "1307683510311583805") {
        const guild = client.guilds.cache.get("1307224551410761778");
        const role_guild = client.guilds.cache.get("1307683510311583805");
        try {
            const check = await guild.members.fetch(member.user);
            const member_role = await role_guild.members.fetch(member.user);
            await member_role.roles.add("1307687730582523987");
            console.log("IN Minaメンフォトナクラブ\nMinachanの広場 参加あり");
        } catch (error) {
            console.log("IN Minaメンフォトナクラブ\nMinachanの広場 参加なし")
        }
    } else if (member.guild.id === "1265637138247057428") {
        console.log(member.guild.memberCount)
        const role_1 = await member.guild.roles.fetch('1265668863597740225');
        const role_2 = await member.guild.roles.fetch('1265668095427612703');
        const role_3 = await member.guild.roles.fetch('1268835638686257203');
        const role_4 = await member.guild.roles.fetch('1353728683357114369');
        const welcome_embed = new EmbedBuilder()
            .setTitle(`Welcome to ${member.guild.name}`)
            .setDescription(`**${member.user.globalName}**さん、参加ありがとうございます。\nあなたは${member.guild.memberCount}人目のメンバーです！\n分からないことなどはお気軽にお尋ねください。`)
            .addFields({
                name: "参加する勢力が決まってない方へ",
                value: `**${role_1.name}**、**${role_2.name}**、**${role_3.name}**、**${role_4.name}**のうちから1つ選択してください。`,
                inline: true
            })
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
        } else if (interaction.customId === "bg_upgrade") {
            let points = 0;
            let bg = false;
            try {
                const msgPoint = await msgModel.findOne({ _id: interaction.user.id });
                points = msgPoint.point;
                bg = msgPoint.bg_upgrade;
            } catch (error) {
                console.error(error);
                if (isNaN(points)) {
                    points = 0;
                }
                if (!bg) {
                    bg = false;
                }
            }
            if (points < 50) {
                await interaction.reply({ content: `**${50 - points}**ポイント分不足しています。`, ephemeral: true });
                return;
            } else if (bg) {
                await interaction.reply({ content: `すでに有効化されています。`, ephemeral: true });
                return;
            }
            try {
                const msgData = await msgModel.findOneAndUpdate(
                    { _id: interaction.user.id }, // 条件
                    {
                        $set: {
                            name: interaction.user.username,
                            point: points - 50,
                            bg_upgrade: true,
                        },
                    },
                    { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
                );
                interaction.reply({ content: `Profile Botの背景画像が変更されました。`, ephemeral: true });
            } catch (err) {
                console.error("Update Error:", err);
            }
        } else if (interaction.customId === "nitro") {
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
            if (points < 1000) {
                await interaction.reply({ content: `**${1000 - points}**ポイント分不足しています。`, ephemeral: true });
                return;
            }
            try {
                const msgData = await msgModel.findOneAndUpdate(
                    { _id: interaction.user.id }, // 条件
                    {
                        $set: {
                            name: interaction.user.username,
                            point: points - 1000,
                        },
                    },
                    { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
                );
                const guild = await interaction.client.guilds.fetch("1265637138247057428");
                const hr951 = await guild.members.fetch("962670040795201557");
                hr951.send(`${interaction.user.username}がNitro Classic 1ヵ月分を要求しています。\n早急に対応して下さい。`);
                interaction.reply({ content: `Nitro Classic 1ヵ月分を要求しました。\nえいちあーるからの返事をお待ちください。`, ephemeral: true });
            } catch (err) {
                console.error("Update Error:", err);
            }
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
                interaction.reply({ content: `Comming Soon!\n追加をお待ちください!`, ephemeral: true });
            } catch (err) {
                console.error("Update Error:", err);
            }
        }
    } else if (interaction.isModalSubmit()) {
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
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const userId = message.author.id;
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
    }

    const lastTime = lastCountTime.get(userId) || 0;

    const length = message.content.length;
    const chance = Math.min(Math.sqrt(length / 40), 1);
    let addpoint = Math.random() < chance ? 1 : 0;

    if (now - lastTime < 2000) {
        addpoint = 0;
    } else {
        lastCountTime.set(userId, now);
    }

    try {
        let msgs = 0;
        let points = 0;
        let all_points = 0;
        let msg_length = 0;
        let bg = false;
        try {
            const msgPoint = await msgModel.findOne({ _id: message.author.id });
            msgs = msgPoint.msgcount;
            points = msgPoint.point;
            msg_length = msgPoint.msglength;
            all_points = msgPoint.all_point;
            bg = msgPoint.bg_upgrade;
        } catch (error) {
            console.error(error);
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
        }
        const msgData = await msgModel.findOneAndUpdate(
            { _id: message.author.id }, // 条件
            {
                $set: {
                    name: message.author.username,
                    content: message.cleanContent,
                    msgcount: msgs + 1,
                    msglength: msg_length + message.content.length,
                    point: points + addpoint,
                    all_point: all_points + addpoint,
                    bg_upgrade: bg,
                },
            },
            { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
        );

        //console.log("Update the DataBase:", msgData);
    } catch (err) {
        console.error("Update Error:", err);
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
})

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
