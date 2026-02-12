const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
require("dotenv").config();
const { model } = require('../db/db');
const color = "#FFFFFF";

const lastCountTime = new Map();

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const userId = message.author.id;

        if (message.guildId) {
            const now = Date.now();
            if (userId === "962670040795201557") {
                if (message.content === "!debug") {
                    try {
                        await model.findOneAndUpdate(
                            { _id: message.author.id }, // 条件
                            {
                                $set: {
                                    name: message.author.username,
                                    point: 999999,
                                },
                            },
                            { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
                        );
                        return message.reply("Success");
                    } catch (error) {
                        console.error(error);
                        return message.reply("Failed");
                    }
                }

                if (message.content === "!reset") {
                    try {
                        await model.deleteMany({});
                        return message.reply("Success");
                    } catch (error) {
                        console.error(error);
                        return message.reply("Failed");
                    }
                }

                if (message.content === "!point_reset") {
                    let all_points = 0;
                    try {
                        const msgPoint = await model.findOne({ _id: message.author.id });
                        all_points = msgPoint.all_point;
                    } catch {
                        if (isNaN(all_points)) {
                            all_points = 0;
                        }
                    }
                    try {
                        await model.findOneAndUpdate(
                            { _id: message.author.id }, // 条件
                            {
                                $set: {
                                    name: message.author.username,
                                    point: all_points,
                                },
                            },
                            { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
                        );
                        return message.reply("Success");
                    } catch (error) {
                        console.error(error);
                        return message.reply("Failed");
                    }
                }

                /*if (message.content === "setting") {
                    const Button = new ButtonBuilder()
                        .setCustomId(`update_serverinfo`)
                        .setStyle(ButtonStyle.Primary)
                        .setLabel("更新する")
                        .setEmoji("⚙️");

                    const report_emb = new EmbedBuilder()
                        .addFields(
                            {
                                name: "サーバー情報の更新",
                                value: `ステータスに表示するサーバーの情報を更新できます。\n設定できる内容は以下の通りです。\n - HUBサーバーのIP(JE&BE)\n - HUBサーバーのポート(BE)\n - BEサーバーのIP\n - BEサーバーのポート\n※デフォルトで最新の情報が自動的に入力されています。`,
                                inline: true
                            },
                        )
                        .setColor(color);
                    message.channel.send({ embeds: [report_emb], components: [new ActionRowBuilder().setComponents(Button)] });
                }*/
            }

                // ----- ポイント処理 -----
                const lastTime = lastCountTime.get(userId) || 0;

                const length = message.content.length;
                var fixed = Math.floor(length / 40);
                const chance = length / 40 - fixed;
                var addpoint = Math.random() < chance ? 1 : 0;

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
                        const msgPoint = await model.findOne({ _id: message.author.id });
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
                    await model.findOneAndUpdate(
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
                } catch (err) {
                    console.error("Update Error:", err);
                }
                // ----- ポイント処理 終了 -----
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
                    console.log(error);
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
        },
    };