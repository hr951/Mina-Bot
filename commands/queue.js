const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const color = "#ffffff";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("再生キューを表示します"),

    async execute(interaction) {
        const queue = global.customQueue.get(interaction.guild.id);
        const loopMode = global.loopSettings.get(interaction.guild.id) || "none";

        const ja = {
            none: "オフ",
            track: "1曲リピート",
            queue: "全曲ループ"
        };

        if (!queue || queue.length === 0) return interaction.reply({ content: "キューは空です", ephemeral: true });

        const list = queue.map((item, index) => `${index + 1}. **${item.query}**`).join("\n");

        const embed = new EmbedBuilder()
            .setTitle("再生キュー (1. は再生中)")
            .setDescription(list)
            .setFooter({ text: `ループモード: ${ja[loopMode]}` })
            .setColor(color);

        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
};