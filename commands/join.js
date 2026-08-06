const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const { processQueue } = require('../ttsManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("VCに参加します"),

    async execute(interaction, client) {
        const voiceChannel = interaction.member?.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: '先にボイスチャンネルに入ってください。', flags: [MessageFlags.Ephemeral] });
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        connection.subscribe(player);

        const newQueue = {
            connection,
            player,
            queue: [],
            isPlaying: false,
            textChannelId: interaction.channel.id
        };

        player.on(AudioPlayerStatus.Idle, () => {
            newQueue.isPlaying = false;
            processQueue(newQueue);
        });

        player.on('error', (err) => {
            console.error('[PLAYER ERROR]', err);
            newQueue.isPlaying = false;
            processQueue(newQueue);
        });

        client.queues.set(interaction.guild.id, newQueue);
        return interaction.reply({ content: '接続しました。読み上げを開始します。', flags: [MessageFlags.Ephemeral] });
    }
};