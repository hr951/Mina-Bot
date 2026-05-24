const { getDate } = require("./getDate");

async function sendMessage(message, type) {
    if (!message.content && (!message.embeds || message.embeds.length === 0) && (!message.attachments || message.attachments.size === 0)) {
        return;
    }

    try {
        const targetChannel = message.client.channels.cache.get("1504907076059795517");

        if (!targetChannel) return;

        const guildName = message.client.guilds.cache.get(message.guildId)?.name || "Unknown Guild";
        const channelName = message.channel.name;
        const header = type === "update" ? `[${getDate()}] ${channelName}(${guildName}) ${message.author.tag}\n**Edited from ID: ${message.id}**` : `[${getDate()}] ${channelName}(${guildName}) ${message.author.tag}\n**Sent ID: ${message.id}**`;
        const contentText = message.content ? `${header}\n${message.content}` : header;

        const sendOptions = {
            content: contentText,
            embeds: message.embeds
        };

        if (message.attachments && message.attachments.size > 0) {
            sendOptions.files = message.attachments.map(a => a.url);
        }

        await targetChannel.send(sendOptions);

    } catch (error) {
        custom.error(error);
    }
};

module.exports = {
    sendMessage
};