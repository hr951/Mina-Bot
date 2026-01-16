const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const color = "#ffffff";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("曲をスキップします"),

    async execute(interaction) {

        const kazagumo = interaction.client.kazagumo;
        const player = kazagumo.players.get(interaction.guild.id);

        if (!interaction.guild) return;

        if (!kazagumo.shoukaku.nodes.size) {
            return interaction.reply({ content: "再生サーバーに接続できていません。\n少し待ってからやり直してください。", ephemeral: true });
        }

        if (!player) return interaction.reply({ content: "再生中の曲がありません", ephemeral: true });
        player.skip();

        const embed = new EmbedBuilder()
            .setTitle("曲をスキップしました")
            .setColor(color);

        return interaction.reply({ embeds: [embed] });
    },
};