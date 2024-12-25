const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('音楽を停止します'),
    async execute(interaction) {
        try{
            global.connection.destroy();
            await interaction.reply({content:"音楽の再生を終了しました。"})
    }catch (error) {
        console.log(error)
    }
    }
}
