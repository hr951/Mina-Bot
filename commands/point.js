const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { model } = require('../db/db');
const { fields_embed } = require('../utils/embeds.js');
const { ms2time } = require("../utils/ms2time.js");

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

                const fields = [
                    { name: "MSGポイント", value: `${msgData.point}` },
                    { name: "MSG総ポイント", value: `${msgData.all_point}` },
                    { name: "総送信メッセージ数", value: `${msgData.msgcount}` },
                    { name: "VCポイント", value: `${msgData.vc_point}` },
                    { name: "VC総ポイント", value: `${msgData.vc_all_point}` },
                    { name: "VC総滞在時間", value: `${ms2time(msgData.vc_time)}` }
                ];

                await interaction.reply({
                    embeds: [fields_embed(interaction.member.displayName + "のポイント", null, fields)]
                });
            } catch (error) {
                interaction.reply({ content: "データベースにアクセスできませんでした", flags: [MessageFlags.Ephemeral] });
                custom.error(error);
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
                    custom.error(error);
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
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("1️⃣");

                const _2 = new ButtonBuilder()
                    .setCustomId(`role_1st_anni`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("2️⃣");

                const _3 = new ButtonBuilder()
                    .setCustomId(`role_2nd_anni`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("3️⃣");

                const fields = [
                    { name: "1️⃣ プロフィール背景アップグレード", value: `必要ポイント: **200**` },
                    { name: "2️⃣ Mina鯖1周年記念ロール", value: `必要ポイント: **0**` },
                    { name: "3️⃣ Mina鯖2周年記念ロール", value: `必要ポイント: **0**` },
                ];

                await interaction.user.send({
                    embeds: [fields_embed("ポイント使用フォーム", `ポイントを使用できるフォームです。\n基本的にMinachan鯖内でのみの特典です。\nあなたが所持しているポイント: **${points}**`, fields)],
                    components: [new ActionRowBuilder().addComponents(_1, _2, _3)]
                });
                interaction.reply({ content: "DMにフォームを送信しました。\nDMを確認して下さい。", flags: [MessageFlags.Ephemeral] });
            } catch (error) {
                custom.error(error);
                interaction.reply({ content: "DMを送信できませんでした。\nDMを開放しているか確認してください。", flags: [MessageFlags.Ephemeral] });
            }
        }
    }
}
