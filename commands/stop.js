const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('音楽を停止し、ボイスチャンネルから切断します'),

    async execute(interaction) {
        const memberVoiceChannel = interaction.member.voice.channel;

        if (!memberVoiceChannel) {
            return interaction.reply({ content: '❌ ボイスチャンネルに参加してください。', ephemeral: true });
        }

        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: '⚠️ 再生中の音楽はありません。', ephemeral: true });
        }

        queue.delete(); // 停止して切断
        return interaction.reply('🛑 音楽を停止し、ボイスチャンネルから切断しました。');
    }
};
