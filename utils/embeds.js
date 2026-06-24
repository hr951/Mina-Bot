const { EmbedBuilder } = require("discord.js");
const color = "#ffffff";

function embed_check_ac(hub_1_je, hub_1_be, hub_2_je, hub_2_be) {

    const embed_check_ac = new EmbedBuilder()
        .addFields(
            { name: `**サーバー 1**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🟢 オンライン", inline: true },
            { name: "参加人数", value: `${hub_1_je.players.online} / ${hub_1_je.players.max}`, inline: true },
            { name: "バージョン", value: "JE: **" + hub_1_je.version.name.replace("Velocity ", "") + "**\nBE: **" + hub_1_be.version.name + "**" || "undefined" },
            { name: `**サーバー 2**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🟢 オンライン", inline: true },
            { name: "参加人数", value: `${hub_2_je.players.online} / ${hub_2_je.players.max}`, inline: true },
            { name: "バージョン", value: "JE: **" + hub_2_je.version.name.replace("Velocity ", "") + "**\nBE: **" + hub_2_be.version.name + "**" || "undefined" }
        )
        .setColor("Green")
        .setTimestamp();

    return embed_check_ac;
};

function embed_check_hub_1(hub_1_je, hub_1_be) {

    const embed_check_hub_1 = new EmbedBuilder()
        .addFields(
            { name: `**サーバー 1**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🟢 オンライン", inline: true },
            { name: "参加人数", value: `${hub_1_je.players.online} / ${hub_1_je.players.max}`, inline: true },
            { name: "バージョン", value: "JE: **" + hub_1_je.version.name.replace("Velocity ", "") + "**\nBE: **" + hub_1_be.version.name + "**" || "undefined" },
            { name: `**サーバー 2**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🔴 オフライン", inline: true }
        )
        .setColor("Green")
        .setTimestamp();

    return embed_check_hub_1;
};

function embed_check_hub_2(hub_2_je, hub_2_be) {

    const embed_check_hub_2 = new EmbedBuilder()
        .addFields(
            { name: `**サーバー 1**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🔴 オフライン", inline: true },
            { name: `**サーバー 2**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🟢 オンライン", inline: true },
            { name: "参加人数", value: `${hub_2_je.players.online} / ${hub_2_je.players.max}`, inline: true },
            { name: "バージョン", value: "JE: **" + hub_2_je.version.name.replace("Velocity ", "") + "**\nBE: **" + hub_2_be.version.name + "**" || "undefined" }
        )
        .setColor("Green")
        .setTimestamp();

    return embed_check_hub_2;
};

function embed_check_offline() {
    const embed_check_offline = new EmbedBuilder()
        .addFields(
            { name: `**サーバー 1**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🔴 オフライン", inline: true },
            { name: `**サーバー 2**`, value: " ", inline: false },
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

/*
const fields = [
    { name: "Name", value: "Value" },
    { name: "Name", value: "Value" },
    { name: "Name", value: "Value" }
];
*/
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

function image_url_embed(title, url, image) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setURL(url)
        .setColor(color)
        .setImage(image)
        .setTimestamp();

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
    embed_check_hub_1,
    embed_check_hub_2,
    embed_check_offline,
    basic_embed,
    fields_embed,
    image_url_embed,
    np_embed,
    queue_embed,
    top_embed
};