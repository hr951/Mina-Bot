const { MessageFlags } = require("discord.js");
const { serverModel } = require('../../db/db');

module.exports = {
    async execute(interaction) {
        const ip_je = interaction.fields.getTextInputValue("ip_je");
        const ip_jb = interaction.fields.getTextInputValue("ip_jb");
        const port_jb = interaction.fields.getTextInputValue("port_jb");
        const ip_be = interaction.fields.getTextInputValue("ip_be");
        const port_be = interaction.fields.getTextInputValue("port_be");

        try {
            await serverModel.findOneAndUpdate(
                { _id: "1265637138247057428" }, // 条件
                {
                    $set: {
                        ip_je: ip_je,
                        ip_jb: ip_jb,
                        port_jb: parseInt(port_jb),
                        ip_be: ip_be,
                        port_be: parseInt(port_be)
                    },
                },
                { upsert: true, new: true } // 無ければ作成、更新後のデータを返す
            );
            interaction.reply({ content: `サーバー情報を更新しました\nBotを再起動します...`, flags: [MessageFlags.Ephemeral] });
            setTimeout(() => {
                process.exit(0);
            }, 1000);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: `サーバー情報の更新に失敗しました`, flags: [MessageFlags.Ephemeral] });
        }
    }
};