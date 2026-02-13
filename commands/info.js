const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Mina鯖 Botの情報を表示します"),

    async execute(interaction) {
        interaction.reply({ content: "開発中の機能です。", flags: [MessageFlags.Ephemeral] });
    },
};