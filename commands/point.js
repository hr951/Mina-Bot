const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
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
        .setDescription('空欄であなたのポイントを取得します')
        .addUserOption(option => option
            .setName("user")
            .setDescription("ユーザーを選択してください")
            .setRequired(false)
        ),

    async execute(interaction) {
        const thumbnail = interaction.client.user.displayAvatarURL();
        const color = "#ffffff";
        let user = interaction.user;
        if (interaction.options.getUser('user')) {
            user = interaction.options.getUser('user');
        }
        try {
            const msgData = await msgModel.findOne({ _id: user.id });

            const embed = await new EmbedBuilder()
                .setTitle(user.nickname || user.user.globalName + "のポイント")
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
                .setFooter({
                    text: "Made by Mina鯖 Bot",
                    iconURL: thumbnail,
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            interaction.reply({ content: "Cannot access the DataBase", ephemeral: true });
            console.error(error);
        }
    }
}
