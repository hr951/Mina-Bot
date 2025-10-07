const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const mongoose = require('mongoose');

const uri = process.env.DB;
const msgModel = require('../db/db');

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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('point')
        .setDescription('ポイント関連のコマンドです')
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('ユーザーのポイントを表示します')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('対象のユーザー')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('use')
                .setDescription('ポイントを利用します')
        ),

    async execute(interaction) {
        const color = "#ffffff";
        const subcommand = interaction.options.getSubcommand();
        let user = interaction.user;

        if (subcommand === "view") {

            if (interaction.options.getUser('user')) {
                user = interaction.options.getUser('user');
            }
            try {
                const msgData = await msgModel.findOne({ _id: user.id });

                const embed = await new EmbedBuilder()
                    .setTitle(user.nickname || user.globalName + "のポイント")
                    .addFields(
                        {
                            name: `所持ポイント`,
                            value: `${msgData.point}`,
                            inline: true
                        },
                        {
                            name: `総ポイント`,
                            value: `${msgData.all_point}`,
                            inline: true
                        },
                        {
                            name: `総送信メッセージ数`,
                            value: `${msgData.msgcount}`,
                            inline: true
                        },
                    )
                    .setColor(color)
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                interaction.reply({ content: "Cannot access the DataBase", ephemeral: true });
                console.error(error);
            }
        } else if (subcommand === "use") {
            try {

                let msgs = 0;
                let points = 0;
                let all_points = 0;
                let bg = false;
                try {
                    const msgPoint = await msgModel.findOne({ _id: user.id });
                    msgs = msgPoint.msgcount;
                    points = msgPoint.point;
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
                    if (isNaN(all_points)) {
                        all_points = 0;
                    }
                    if (!bg) {
                        bg = false;
                    }
                }

                const embed = new EmbedBuilder()
                    .setTitle("ポイント使用フォーム")
                    .setDescription(`ポイントを使用できるフォームです。\n基本的にMinachan鯖内でのみの特典です。\nあなたが所持しているポイント: **${points}**`)
                    .addFields(
                        {
                            name: `1️⃣ Profile Bot背景アップグレード`,
                            value: `必要ポイント: **50**`,
                            inline: true
                        },
                        {
                            name: `2️⃣ Nitro Classic 1ヵ月分`,
                            value: `必要ポイント: **1000**`,
                            inline: true
                        },
                        {
                            name: `3️⃣ Comming Soon!`,
                            value: `必要ポイント: **xxx**`,
                            inline: true
                        },
                    )
                    .setColor(color);

                    /*
                    Primary	青色
                    Secondary	灰色
                    Success	緑色
                    Danger	赤色
                    Link	外部リンク
                    */

                const _1 = new ButtonBuilder()
                    .setCustomId(`bg_upgrade`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("1️⃣");

                const _2 = new ButtonBuilder()
                    .setCustomId(`nitro`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("2️⃣");

                const _3 = new ButtonBuilder()
                    .setCustomId(`none`)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("3️⃣");

                await interaction.user.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(_1, _2, _3)] });
                interaction.reply({ content: "DMにフォームを送信しました。\nDMを確認して下さい。", ephemeral: true });
            } catch (error) {
                interaction.reply({ content: "DMを送信できませんでした。\nDMを開放しているか確認してください。", ephemeral: true });
            }
        }
    }
}
