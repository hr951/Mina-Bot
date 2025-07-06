const { createReadStream } = require('node:fs');
const { request } = require('node:http'); // or `https` if using https URL
const { Readable } = require('node:stream');

const { useMainPlayer, QueueRepeatMode } = require('discord-player');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { stream } = require('play-dl'); // ※代替も可能

const musicList = require('../musics.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('指定されたMP3 URLを再生します')
    .addStringOption(option =>
      option
        .setName('record')
        .setDescription('レコード名を選択してください')
        .setRequired(true)
        .addChoices(
          { name: '13', value: '1' },
          { name: 'cat', value: '2' },
          { name: 'blocks', value: '3' },
          { name: 'chirp', value: '4' },
          { name: 'far', value: '5' },
          { name: 'mall', value: '6' },
          { name: 'mellohi', value: '7' },
          { name: 'stal', value: '8' },
          { name: 'strad', value: '9' },
          { name: 'ward', value: '10' },
          { name: '11', value: '11' },
          { name: 'wait', value: '12' },
          { name: 'otherside', value: '13' },
          { name: 'Pigstep', value: '14' },
          { name: 'Creator', value: '15' },
          { name: 'Creator (オルゴール)', value: '16' },
          { name: 'Relic', value: '17' },
          { name: 'Precipice', value: '18' },
          { name: '5', value: '19' },
          { name: 'Tears', value: '20' },
          { name: 'Lava Chicken', value: '21' }
        )
    ),

  async execute(interaction) {
    const thumbnail = interaction.client.user.displayAvatarURL();
    const color = '#ffffff';

    // まず deferReply して3秒以内の初回応答を確保
    await interaction.deferReply();

    const number = interaction.options.getString('record');
    // 今はURL固定だけど将来的にmusicListから取得可能
    const url =
      'https://vercel-52db8uq86-hr951s-projects.vercel.app/lavachicken.mp3';

    const memberVoiceChannel = interaction.member.voice.channel;
    if (!memberVoiceChannel) {
      // defer済みだからeditReply使う
      return interaction.editReply({
        content: '❌ ボイスチャンネルに参加してください。',
        ephemeral: true
      });
    }

    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guildId);

    try {
      // もし再生中があれば止める
      queue?.delete();
    } catch (error) {
      console.log(error);
    }

    try {
      // player.play にURL文字列ではなく曲情報オブジェクトを渡すのがコツ
      const { track, queue: currentQueue } = await player.play(
        memberVoiceChannel,
        {
          title: musicList[number - 1].name,
          url: url
        },
        {
          nodeOptions: {
            metadata: interaction,
            bufferingTimeout: 30_000,
            onBeforeCreateStream: async (track, source, _queue) => {
              return await fetchMp3Stream(track.url);
            }
          }
        }
      );

      currentQueue.setRepeatMode(QueueRepeatMode.TRACK);

      const embed = new EmbedBuilder()
        .setTitle(musicList[number - 1].name)
        .addFields(
          {
            name: `作曲者`,
            value: musicList[number - 1].author,
            inline: true
          },
          {
            name: `再生時間`,
            value:
              Math.floor(musicList[number - 1].second / 60) +
              '分' +
              (musicList[number - 1].second % 60) +
              '秒',
            inline: true
          }
        )
        .setColor(color)
        .setFooter({
          text: 'Made by Mina鯖 Bot',
          iconURL: thumbnail
        })
        .setTimestamp();

      // deferReply済みなのでeditReplyで返す
      return interaction.editReply({ content: '✅ 再生開始', embeds: [embed] });
    } catch (error) {
      console.error('再生エラー:', error);
      // ここもdefer済みなのでeditReply使う
      return interaction.editReply(
        '❌ 再生に失敗しました。URLがMP3でないか、読み込みに失敗しました。'
      );
    }
  }
};

// MP3ストリームを取得する関数
async function fetchMp3Stream(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? require('https') : require('http');
    protocol
      .get(url, res => {
        if (res.statusCode !== 200) {
          reject(new Error(`Stream status: ${res.statusCode}`));
        } else {
          resolve(res);
        }
      })
      .on('error', reject);
  });
}
