const { SlashCommandBuilder } = require("discord.js");
const yts = require('yt-search');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("曲を再生します")
    .addStringOption(option =>
      option
        .setName("query")
        .setDescription("URL または 検索ワード / 曲名の後ろに作者を入れると精度が上がります")
        .setRequired(true)
    ),

  async execute(interaction) {

    const kazagumo = interaction.client.kazagumo;
    const guildId = interaction.guild.id;
    const query = interaction.options.getString('query');

    await interaction.deferReply({ ephemeral: true });

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.editReply({ content: "先にボイスチャンネルに入ってください", ephemeral: true });
    }

    if (!global.customQueue.has(guildId)) global.customQueue.set(guildId, []);
    const queue = global.customQueue.get(guildId);

    queue.push({
      query: query,
      requester: interaction.user.tag
    });

    const player = await kazagumo.createPlayer({
      guildId: guildId,
      textId: interaction.channel.id,
      voiceId: interaction.member.voice.channel.id,
      deaf: true
    });

    if (!player.playing && !player.paused && queue.length === 1) {
      await playNext(player, kazagumo);
      return interaction.editReply({ content: `**${query}** を追加しました\n※サーバーの稼働状況によって取得先が変わります`, ephemeral: true });
    }

    return interaction.editReply({ content: `**${query}** を追加しました\n※サーバーの稼働状況によって取得先が変わります`, ephemeral: true });
  },
};

async function playNext(player, kazagumo) {

  const queue = global.customQueue.get(player.guildId);
  if (!queue || queue.length === 0) return;

  const nextItem = queue[0]; // 先頭を取得
  const query = nextItem.query;
  const homeIp = process.env.HOME_API_URL;
  const proxyUrl = `http://${homeIp}/stream?query=${encodeURIComponent(query)}`;

  let track = null;

  try {
    const result = await kazagumo.search(proxyUrl, { engine: "http" });
    if (result && result.tracks.length > 0) {
      track = result.tracks[0];
      const yt = await yts(query).catch(() => null);
      if (yt && yt.videos[0]) {
        track.title = yt.videos[0].title;
        track.thumbnail = yt.videos[0].thumbnail;
        track.author = yt.videos[0].author.name;
        track.uri = yt.videos[0].url;
        track.source = true;
      }
    }
  } catch {
    console.log(`[Home Server] 接続失敗、SoundCloudへ切り替えます: ${query}`);
  }

  if (!track) {
    // --- Render Lava ---
    // YouTubeから情報を取得
    const ytResult = await yts(query).catch(() => null);

    if (!ytResult || !ytResult.videos.length) {
      console.log("YouTube情報なし");
      queue.shift();
      playNext(player, kazagumo);
    }

    const video = ytResult.videos[0];
    const ytDurationMs = video.duration.seconds * 1000;

    // SoundCloudで検索
    const searchTitle = `${video.title}`;
    const res = await kazagumo.search(searchTitle, { engine: "soundcloud" });

    if (!res.tracks.length) {
      console.log("SoundCloud情報なし");
      queue.shift();
      playNext(player, kazagumo);
      return;
    }

    // カバー回避用フィルタ（秒数誤差15秒以内）
    track = res.tracks.find(t => Math.abs(t.length - ytDurationMs) < 15000) || res.tracks[0];
  }

  if (track) {
    player.play(track);
  } else {
    queue.shift();
    playNext(player, kazagumo);
  }
}

module.exports.playNext = playNext;