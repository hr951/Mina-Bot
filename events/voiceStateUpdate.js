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
    },
};