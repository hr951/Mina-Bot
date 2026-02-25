const { EmbedBuilder } = require("discord.js");
const color = "#ffffff";

function embed_check_ac(result, result_jb, result_be) {

    const embed_check_ac = new EmbedBuilder()
        .addFields(
            { name: `**HUBサーバー (JE・BE対応)**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🟢 オンライン", inline: true },
            { name: "参加人数", value: `${result.players.online} / ${result.players.max}`, inline: true },
            { name: "バージョン", value: "JE: **" + result.version.name.replace("Velocity ", "") + "**\nBE: **" + result_jb.version.name + "**" || "undefined" },
            { name: `**BEサーバー**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🟢 オンライン", inline: true },
            { name: "参加人数", value: `${result_be.players.online} / ${result_be.players.max}`, inline: true },
            { name: "バージョン", value: "**\nBE: **" + result_be.version.name + "**" || "undefined" }
        )
        .setColor("Green")
        .setTimestamp();

    return embed_check_ac;
};

function embed_check_jb(result, result_jb) {

    const embed_check_jb = new EmbedBuilder()
        .addFields(
            { name: `**HUBサーバー (JE・BE対応)**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🟢 オンライン", inline: true },
            { name: "参加人数", value: `${result.players.online} / ${result.players.max}`, inline: true },
            { name: "バージョン", value: "JE: **" + result.version.name.replace("Velocity ", "") + "**\nBE: **" + result_jb.version.name + "**" || "undefined" },
            { name: `**BEサーバー**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🔴 オフライン", inline: true }
        )
        .setColor("Green")
        .setTimestamp();

    return embed_check_jb;
};

function embed_check_be(result_be) {

    const embed_check_be = new EmbedBuilder()
        .addFields(
            { name: `**HUBサーバー (JE・BE対応)**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🔴 オフライン", inline: true },
            { name: `**BEサーバー**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🟢 オンライン", inline: true },
            { name: "参加人数", value: `${result_be.players.online} / ${result_be.players.max}`, inline: true },
            { name: "バージョン", value: "**\nBE: **" + result_be.version.name + "**" || "undefined" }
        )
        .setColor("Green")
        .setTimestamp();

    return embed_check_be;
};

function embed_check_offline() {
    const embed_check_offline = new EmbedBuilder()
        .addFields(
            { name: `**HUBサーバー (JE・BE対応)**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🔴 オフライン", inline: true },
            { name: `**BEサーバー**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🔴 オフライン", inline: true }
        )
        .setColor("Red")
        .setTimestamp();

    return embed_check_offline;
};

function basic_embed(title, description) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();

    return embed;
};

function fields_embed(title, description, fields) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setTimestamp();

    if (description) {
        embed.setDescription(description);
    }

    if (Array.isArray(fields)) {
        const formattedFields = fields.map(f => ({
            name: f.name,
            value: f.value,
            inline: true
        }));
        embed.addFields(formattedFields);
    }

    return embed;
};

function np_embed(title, url, field1_name, field1_value, field2_name, field2_value, image, footer) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setURL(url)
        .addFields(
            { name: field1_name, value: field1_value, inline: true },
            { name: field2_name, value: field2_value, inline: true }
        )
        .setImage(image)
        .setFooter({ text: footer })
        .setColor(color);

    return embed;
};

function queue_embed(title, description, footer) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setFooter({ text: footer })
        .setColor(color);

    return embed;
};

function top_embed(title, url) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setURL(url)
        .setColor(color);

    return embed;
};

module.exports = {
    embed_check_ac,
    embed_check_jb,
    embed_check_be,
    embed_check_offline,
    basic_embed,
    fields_embed,
    np_embed,
    queue_embed,
    top_embed
};