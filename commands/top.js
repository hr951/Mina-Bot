const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('チャンネルの一番上のメッセージのリンクを送信します'),
  async execute(interaction) {
    const channel = interaction.channel;
    const messages = await channel.messages.fetch({ after: '0', limit: 1 });
    const message = messages.first();
    const link = message.url;

    // リンクを返信する    

    const embed = new EmbedBuilder()
      .setTitle("チャンネル最上部へ")
      .setURL(link)
      .setColor("#FFFFFF")
    await interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
};
