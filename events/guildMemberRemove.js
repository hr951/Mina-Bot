require("dotenv").config();

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        if (member.guild.id === "1265637138247057428") {
            member.guild.channels.cache.get("1315627090233790495").send(`${member.user.globalName}さんが退出しました。`);
        }
    },
};