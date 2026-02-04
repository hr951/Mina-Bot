require("dotenv").config();

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        const player = client.kazagumo.players.get(oldState.guild.id);
        if (!player) return;

        const voiceChannel = client.channels.cache.get(player.voiceId);
        if (voiceChannel && voiceChannel.members.filter(m => !m.user.bot).size === 0) {
            player.destroy();
        }
        
        if (oldState.member.id === client.user.id && !newState.channelId) {
            const guildId = oldState.guild.id;

            if (global.customQueue && global.customQueue.has(guildId)) {
                global.customQueue.delete(guildId);
                console.log(`[VoiceState] ボットが切断されたため、キューを強制クリアしました。`);
            }
        }
    },
};