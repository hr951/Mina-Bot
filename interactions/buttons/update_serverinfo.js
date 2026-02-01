const { ModalBuilder, TextInputBuilder, ActionRowBuilder } = require("discord.js");
const { serverModel } = require('../../db/db');

module.exports = {
    async execute(interaction) {
        let ip_je;
        let ip_jb;
        let port_jb;
        let ip_be;
        let port_be;
        try {
            const server_config = await serverModel.findOne({ _id: "1265637138247057428" });
            ip_je = server_config.ip_je;
            ip_jb = server_config.ip_jb;
            port_jb = server_config.port_jb;
            ip_be = server_config.ip_be;
            port_be = server_config.port_be;
        } catch (error) {
            console.log(error);
        }

        const modal = new ModalBuilder()
            .setTitle("サーバー情報更新")
            .setCustomId("serverinfo_submit");
        const TextInput_1 = new TextInputBuilder()
            .setLabel("HUBサーバー(JE)のIPアドレスを入力してください")
            .setCustomId("ip_je")
            .setStyle("Short")
            .setValue(ip_je)
            .setMaxLength(100)
            .setMinLength(2)
            .setRequired(true);
        const TextInput_2 = new TextInputBuilder()
            .setLabel("HUBサーバー(BE)のIPアドレスを入力してください")
            .setCustomId("ip_jb")
            .setStyle("Short")
            .setValue(ip_jb)
            .setMaxLength(1000)
            .setMinLength(2)
            .setRequired(true);
        const TextInput_3 = new TextInputBuilder()
            .setLabel("HUBサーバー(BE)のポート番号を入力してください")
            .setCustomId("port_jb")
            .setStyle("Short")
            .setValue(`${port_jb}`)
            .setMaxLength(100)
            .setMinLength(2)
            .setRequired(true);
        const TextInput_4 = new TextInputBuilder()
            .setLabel("BEサーバーのIPアドレスを入力してください")
            .setCustomId("ip_be")
            .setStyle("Short")
            .setValue(ip_be)
            .setMaxLength(1000)
            .setMinLength(2)
            .setRequired(true);
        const TextInput_5 = new TextInputBuilder()
            .setLabel("BEサーバーのポート番号を入力してください")
            .setCustomId("port_be")
            .setStyle("Short")
            .setValue(`${port_be}`)
            .setMaxLength(100)
            .setMinLength(2)
            .setRequired(true);
        const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
        const ActionRow_2 = new ActionRowBuilder().setComponents(TextInput_2);
        const ActionRow_3 = new ActionRowBuilder().setComponents(TextInput_3);
        const ActionRow_4 = new ActionRowBuilder().setComponents(TextInput_4);
        const ActionRow_5 = new ActionRowBuilder().setComponents(TextInput_5);
        modal.setComponents(ActionRow, ActionRow_2, ActionRow_3, ActionRow_4, ActionRow_5);
        return interaction.showModal(modal);

    }
};