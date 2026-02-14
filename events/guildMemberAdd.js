const { basic_embed } = require('../utils/embeds.js');
require("dotenv").config();

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        if (member.guild.id === "1265637138247057428") {
            member.guild.channels.cache.get("1315627090233790495").send({
                content: `<@${member.user.id}>`,
                embeds: [basic_embed(`Welcome to ${member.guild.name}`, `**${member.user.globalName}**さん、参加ありがとうございます。\nあなたは${member.guild.memberCount}人目のメンバーです！\n分からないことなどはお気軽にお尋ねください！`)]
            });
        }
    },
};