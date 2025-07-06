const { useMainPlayer, QueueRepeatMode } = require('discord-player');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { stream } = require('play-dl');

const musicList = require('../musics.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('指定されたMP3 URLを再生します')
        .addStringOption(option =>
            option
                .setName("record")
                .setDescription("レコード名を選択してください")
                .setRequired(true)
                .addChoices(
                    { name: "13", value: "1" },
                    { name: "cat", value: "2" },
                    { name: "blocks", value: "3" },
                    { name: "chirp", value: "4" },
                    { name: "far", value: "5" },
                    { name: "mall", value: "6" },
                    { name: "mellohi", value: "7" },
                    { name: "stal", value: "8" },
                    { name: "strad", value: "9" },
                    { name: "ward", value: "10" },
                    { name: "11", value: "11" },
                    { name: "wait", value: "12" },
                    { name: "otherside", value: "13" },
                    { name: "Pigstep", value: "14" },
                    { name: "Creator", value: "15" },
                    { name: "Creator (オルゴール)", value: "16" },
                    { name: "Relic", value: "17" },
                    { name: "Precipice", value: "18" },
                    { name: "5", value: "19" },
                    { name: "Tears", value: "20" },
                    { name: "Lava Chicken", value: "21" }
                )
        ),

    async execute(interaction) {
        const thumbnail = interaction.client.user.displayAvatarURL();
        const color = "#ffffff";

        const number = interaction.options.getString('record');
        const index = Number(number) - 1;
        const music = musicList[index];

        if (!music) {
            return interaction.reply({
                content: "❌ 無効なレコード番号が指定されました。",
                ephemeral: true
            });
        }

        const url = `https://cdn.glitch.global/7ca78b4a-80bf-4fc9-90bf-9493ef66ec25/${music.id}.mp3`;
        const memberVoiceChannel = interaction.member.voice.channel;

        if (!memberVoiceChannel) {
            return interaction.reply({
                content: '❌ ボイスチャンネルに参加してください。',
                ephemeral: true
            });
        }

        await interaction.deferReply();

        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);

        try {
            queue?.delete();
        } catch (err) {
            console.log("❗ queue delete error:", err);
        }

        try {
            const { queue: currentQueue } = await player.play(memberVoiceChannel, url, {
                nodeOptions: {
                    metadata: interaction,
                    bufferingTimeout: 30_000,
                    onBeforeCreateStream: async (track) => {
                        console.log("🎵 play-dl streaming start:", track.url);
                        const playdlStream = await stream(track.url);
                        return playdlStream.stream;
                    }
                }
            });

            currentQueue.setRepeatMode(QueueRepeatMode.TRACK);

            const minutes = Math.floor(music.second / 60);
            const remainSeconds = music.second % 60;

            const embed = new EmbedBuilder()
                .setTitle(music.name)
                .addFields(
                    { name: '作曲者', value: music.author, inline: true },
                    { name: '再生時間', value: `${minutes}分${remainSeconds}秒`, inline: true }
                )
                .setColor(color)
                .setFooter({
                    text: "Made by Mina鯖 Bot",
                    iconURL: thumbnail,
                })
                .setTimestamp();

            console.log("✅ 再生成功・embed送信");
            await interaction.editReply({ content: "✅ 再生開始", embeds: [embed] });
        } catch (err) {
            console.error("🔥 再生エラー:", err);
            await interaction.editReply("❌ 再生に失敗しました。URLが無効か、ストリームの取得に失敗しました。");
        }
    }
};
