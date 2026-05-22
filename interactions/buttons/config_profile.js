const { ModalBuilder, TextInputBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    async execute(interaction) {

        const modal = new ModalBuilder()
            .setTitle("プロフィール 生成")
            .setCustomId("profile_submit");
        const TextInput_1 = new TextInputBuilder()
            .setLabel("MCIDを入力してください")
            .setCustomId("mcid")
            .setStyle("Short")
            .setMaxLength(4000)
            .setRequired(true);
        const TextInput_2 = new TextInputBuilder()
            .setLabel("コメントを入力してください")
            .setCustomId("comment")
            .setStyle("Paragraph")
            .setMaxLength(4000)
            .setRequired(true);
        const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
        const ActionRow_2 = new ActionRowBuilder().setComponents(TextInput_2);
        modal.setComponents(ActionRow, ActionRow_2);
        return interaction.showModal(modal);

    }
};