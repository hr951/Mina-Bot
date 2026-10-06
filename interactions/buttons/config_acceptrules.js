const { MessageFlags, ModalBuilder, TextInputBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    async execute(interaction) {
        const id = interaction.customId.replace('config_acceptrules__', '');
        if (id === "yes") {
            const modal = new ModalBuilder()
                .setTitle("ニックネーム入力 フォーム")
                .setCustomId("acceptrules_submit");
            /* const TextInput_1 = new TextInputBuilder()
                .setLabel("Minecraft IDを入力してください。")
                .setCustomId("mcid")
                .setStyle("Short")
                .setMaxLength(100)
                .setRequired(true);*/
            const TextInput_2 = new TextInputBuilder()
                .setLabel("ニックネームを入力してください。")
                .setCustomId("nickName")
                .setStyle("Short")
                .setMaxLength(100)
                .setRequired(true);
            // const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
            const ActionRow_2 = new ActionRowBuilder().setComponents(TextInput_2);
            modal.setComponents(/*ActionRow,*/ ActionRow_2);
            return interaction.showModal(modal);

        } else if (id === "no") {
            await interaction.reply({
                content: "そうか、そうか、つまりきみはそんなやつなんだな。",
                flags: [MessageFlags.Ephemeral]
            });
        }

    }
};