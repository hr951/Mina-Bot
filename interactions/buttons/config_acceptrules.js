const { MessageFlags } = require("discord.js");

module.exports = {
    async execute(interaction) {
        const id = interaction.customId.replace('config_acceptrules__', '');
        if (id === "yes") {
            try {
                const role = await interaction.guild.roles.fetch("1356110722571964592");
                const role_2 = await interaction.guild.roles.fetch("1507341062925062164");
                const role_3 = await interaction.guild.roles.fetch("1507341579806048358");
                const member = await interaction.member.fetch();
                await member.roles.add(role);
                await member.roles.add(role_2);
                await member.roles.remove(role_3);
                await interaction.reply({
                    content: "認証されました。\nご協力ありがとうございます。",
                    flags: [MessageFlags.Ephemeral]
                });
            } catch (error) {
                custom.error(error);
                await interaction.reply({
                    content: "ロールの付与に失敗しました。",
                    flags: [MessageFlags.Ephemeral]
                });
            }
        } else if (id === "no") {
            await interaction.reply({
                content: "そうか、そうか、つまりきみはそんなやつなんだな。",
                flags: [MessageFlags.Ephemeral]
            });
        }

    }
};