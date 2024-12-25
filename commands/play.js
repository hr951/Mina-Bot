const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { entersState, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel,  StreamType } = require('@discordjs/voice');
const ytdl = require("@distube/ytdl-core");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("音楽を再生します")
    .addStringOption((option) =>
      option.setName("url")
            .setDescription("YouTube URL")
            .setRequired(true)
    ),

  async execute(interaction) {

    const url = interaction.options.getString('url');
    const thumbnail = interaction.client.user.displayAvatarURL();
    const color = "#ffffff";
    const request_user = interaction.user.id;

    if (!interaction.guild) {
        return;
      }
      // メッセージから動画URLだけを取り出す
      if (!ytdl.validateURL(url)) return interaction.reply({content:`${url}は処理できません。`, ephemeral: true});

      // コマンドを実行したメンバーがいるボイスチャンネルを取得
      const channel = interaction.member.voice.channel;
      // コマンドを実行したメンバーがボイスチャンネルに入ってなければ処理を止める
      if (!channel) return interaction.reply({content:'先にVCに参加してください。', ephemeral: true});
      // チャンネルに参加
      global.connection = joinVoiceChannel({
       adapterCreator: channel.guild.voiceAdapterCreator,
       channelId: channel.id,
       guildId: channel.guild.id,
       selfDeaf: true,
       selfMute: false,
      });
      const player = createAudioPlayer();
      global.connection.subscribe(player);
      // 動画の音源を取得
      const stream = ytdl(ytdl.getURLVideoID(url), {
        filter: format => format.audioCodec === 'opus' && format.container === 'webm', //webm opus
        quality: 'highest',
        highWaterMark: 32 * 1024 * 1024, // https://github.com/fent/node-ytdl-core/issues/902
      });
      //再生リソースを作成
      const resource = createAudioResource(stream, {
        inputType: StreamType.WebmOpus
      });
      // 再生
      player.play(resource);
      //動画の情報を取得
      ytdl.getBasicInfo(url).then(info => {
        var title = info.videoDetails.title;
        var time = info.videoDetails.lengthSeconds;
        var video_url = info.videoDetails.video_url;
        var thumbnail_url = info.videoDetails.thumbnails[3].url;

      let hour = Math.floor(time / 3600);
      let min = Math.floor(time % 3600 / 60);
      let rem = time % 60;

      console.log(`${interaction.user.username} が ${title} をリクエストしました。`)

      const embed_play = new EmbedBuilder()
          .setTitle(title)
          .setURL(video_url)
          .setDescription(`長さ：**${hour}時間${min}分${rem}秒**`)
          .addFields(
            {
              name: "リクエストしたユーザー",
              value: `<@${request_user}>`,
              inline: false
            },
          )
          .setImage(thumbnail_url)
          .setColor(color)
          .setFooter({
            text: "Made by Mina鯖 Bot",
            iconURL: thumbnail,
          })
          .setTimestamp();
      
      const Button = new ButtonBuilder()
		      .setCustomId(`stop`)
		      .setStyle(ButtonStyle.Danger)
		      .setLabel("停止する")
		      .setEmoji("🛑");

      interaction.channel.send({ embeds: [embed_play], components: [new ActionRowBuilder() .setComponents(Button)]});
        });
      interaction.reply({content:"音楽を再生します。", ephemeral:true});

      await entersState(player,AudioPlayerStatus.Playing, 10 * 1000);
      await entersState(player,AudioPlayerStatus.Idle, 24 * 60 * 60 * 1000);
      // 再生が終了したら抜ける
      global.connection.destroy();
      interaction.editReply({content:"音楽の再生を終了しました。"})
    },
  };
