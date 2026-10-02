const { MessageFlags } = require("discord.js");
const { searchMinecraftPlayer } = require("../../utils/minecrafts/searchUser");

module.exports = {
    async execute(interaction) {
        const id = interaction.fields.getTextInputValue("mcid");
        const nickName = interaction.fields.getTextInputValue("nickName");

        const result = await searchMinecraftPlayer(id);

        setTimeout(async () => {
            await interaction.reply({
                content: "MinecraftのIDを照合中です。\nしばらくお待ちください。",
                flags: [MessageFlags.Ephemeral]
            });
        }, 1000);

        if (result.edition === "none") {
            await interaction.editReply({
                content: "MinecraftのIDが見つかりませんでした。\nもう一度確認して入力してください。",
                flags: [MessageFlags.Ephemeral]
            });
            return;
        }

        let setNick;
        let NickTemp = "";
        if (nickName) {
            NickTemp = ` / ${nickName}`;
        }

        if (result.edition === "both") {
            setNick = `${result.name[1]}${NickTemp}`;
        } else if (result.edition === "bedrock") {
            setNick = `${result.name[0]} (BE)${NickTemp}`;
        } else if (result.edition === "java") {
            setNick = `${result.name[0]}${NickTemp}`;
        }

        try {
            const role = await interaction.guild.roles.fetch("1356110722571964592");
            const role_2 = await interaction.guild.roles.fetch("1507341062925062164");
            const role_3 = await interaction.guild.roles.fetch("1507341579806048358");
            const member = await interaction.member.fetch();
            await member.roles.add(role);
            await member.roles.add(role_2);
            await member.roles.remove(role_3);

            await member.setNickname(setNick);

            await interaction.editReply({
                content: "認証されました。\nご協力ありがとうございます。",
                flags: [MessageFlags.Ephemeral]
            });
        } catch (error) {
            custom.error(error);
            await interaction.editReply({
                content: "ロールの付与に失敗しました。",
                flags: [MessageFlags.Ephemeral]
            });
        }
    }
};