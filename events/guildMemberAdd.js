const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
const color = "#FFFFFF";

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        if (member.guild.id === "1265637138247057428") {
            const welcome_embed = new EmbedBuilder()
                .setTitle(`Welcome to ${member.guild.name}`)
                .setDescription(`**${member.user.globalName}**さん、参加ありがとうございます。\nあなたは${member.guild.memberCount}人目のメンバーです！\n分からないことなどはお気軽にお尋ねください！`)
                .setColor(color)
                .setFooter({
                    text: "Made by Mina鯖 Bot",
                })
                .setTimestamp();

            member.guild.channels.cache.get("1315627090233790495").send({ content: `<@${member.user.id}>`, embeds: [welcome_embed] });
        }
    },
};