const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { model } = require('../db/db');
const { three_field_embed, five_field_embed } = require('../utils/embeds.js');

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
        const subcommand = interaction.options.getSubcommand();
        let user = interaction.user;

        if (subcommand === "view") {

            if (interaction.options.getUser('user')) {
                user = interaction.options.getUser('user');
            }
            try {
                const msgData = await model.findOne({ _id: user.id });

                await interaction.reply({
                    embeds: [three_field_embed(user.nickname || user.globalName + "のポイント", null, "所持ポイント", `${msgData.point}`, "総ポイント", `${msgData.all_point}`, "総送信メッセージ数", `${msgData.msgcount}`)]
                });
            } catch (error) {
                interaction.reply({ content: "Cannot access the DataBase", flags: [MessageFlags.Ephemeral] });
                console.error(error);
            }
        } else if (subcommand === "use") {
            try {

                let msgs = 0;
                let points = 0;
                let all_points = 0;
                let bg = false;
                try {
                    const msgPoint = await model.findOne({ _id: user.id });
                    msgs = msgPoint.msgcount;
                    points = msgPoint.point;
                    all_points = msgPoint.all_point;
                    bg = msgPoint.bg_upgrade;

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
                } catch (error) {
                    console.error(error);
                }

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
                    .setCustomId(`role_1st_anni`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("2️⃣");

                const _3 = new ButtonBuilder()
                    .setCustomId(`coming_soon`)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("3️⃣");

                const _4 = new ButtonBuilder()
                    .setCustomId(`role_osyaberi`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("4️⃣");

                const _5 = new ButtonBuilder()
                    .setCustomId(`role_densetu`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("5️⃣");

                await interaction.user.send({
                    embeds: [five_field_embed("ポイント使用フォーム", `ポイントを使用できるフォームです。\n基本的にMinachan鯖内でのみの特典です。\nあなたが所持しているポイント: **${points}**`, "1️⃣ プロフィール背景アップグレード", `必要ポイント: **200**`, "2️⃣ 運用1周年記念ロール", `必要ポイント: **1**`, "3️⃣ 進捗機能開放", `必要ポイント: **100**`, "4️⃣ Mina鯖のおしゃべりロール", `必要ポイント: **500**`, "5️⃣ Mina鯖の伝説話者ロール", `必要ポイント: **10000**`)],
                    components: [new ActionRowBuilder().addComponents(_1, _2, _3, _4, _5)]
                });
                interaction.reply({ content: "DMにフォームを送信しました。\nDMを確認して下さい。", flags: [MessageFlags.Ephemeral] });
            } catch (error) {
                console.error(error);
                interaction.reply({ content: "DMを送信できませんでした。\nDMを開放しているか確認してください。", flags: [MessageFlags.Ephemeral] });
            }
        }
    }
}
