const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("VCから退出します"),

    async execute(interaction, client) {
        client.serverQueue = client.queues.get(interaction.guild.id);
        if (client.serverQueue) {
            client.serverQueue.connection.destroy();
            client.queues.delete(interaction.guild.id);
            return interaction.reply({ content: '切断しました。', flags: [MessageFlags.Ephemeral] });
        }
        return interaction.reply({ content: 'Botは接続していません。', flags: [MessageFlags.Ephemeral] });
    }
};