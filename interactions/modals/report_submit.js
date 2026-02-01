const { ActionRowBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const color = "#FFFFFF";

module.exports = {
    async execute(interaction) {
        const thumbnail = interaction.client.user.displayAvatarURL();
        const content = interaction.fields.getTextInputValue("content");
        const title = interaction.fields.getTextInputValue("title");
        const id = interaction.user.id;
        try {
            const channel = await interaction.guild.channels.create({
                name: `${title}`,
                parent: "1307701371587399730",
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.guild.members.cache.get(id),
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.guild.roles.cache.get("1307225736905621534"),
                        allow: [PermissionFlagsBits.ViewChannel],
                    }]
            })
            const embed_content = new EmbedBuilder()
                .setTitle(title)
                .setDescription(content)
                .setColor(color)
                .setFooter({
                    text: "Made by Mina鯖 Bot",
                    iconURL: thumbnail,
                })
                .setTimestamp()
            const Del_Button = new ButtonBuilder()
                .setCustomId(`channel_delete`)
                .setStyle(ButtonStyle.Danger)
                .setLabel("チャンネルの削除")
                .setEmoji("🗑️");
            await channel.send({ content: `<@${id}>`, embeds: [embed_content], components: [new ActionRowBuilder().setComponents(Del_Button)] });
            await interaction.reply({ content: `https://discord.com/channels/${channel.guildId}/${channel.id} を作成しました。`, ephemeral: true });
        } catch {
            await interaction.reply({ content: `キャッシュされていないユーザーの可能性があります。\n人力でチャンネルを作成してください。`, ephemeral: true });
        }
    }
};