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

function two_field_embed(title, description, field1_name, field1_value, field2_name, field2_value) {
    if (!description) {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .addFields(
                { name: field1_name, value: field1_value, inline: true },
                { name: field2_name, value: field2_value, inline: true }
            )
            .setColor(color)
            .setTimestamp();

        return embed;
    } else {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .addFields(
                { name: field1_name, value: field1_value, inline: true },
                { name: field2_name, value: field2_value, inline: true }
            )
            .setColor(color)
            .setTimestamp();

        return embed;
    }
};

function three_field_embed(title, description, field1_name, field1_value, field2_name, field2_value, field3_name, field3_value) {
    if (!description) {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .addFields(
                { name: field1_name, value: field1_value, inline: true },
                { name: field2_name, value: field2_value, inline: true },
                { name: field3_name, value: field3_value, inline: true }
            )
            .setColor(color)
            .setTimestamp();

        return embed;
    } else {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .addFields(
                { name: field1_name, value: field1_value, inline: true },
                { name: field2_name, value: field2_value, inline: true },
                { name: field3_name, value: field3_value, inline: true }
            )
            .setColor(color)
            .setTimestamp();

        return embed;
    }
};

function four_field_embed(title, description, field1_name, field1_value, field2_name, field2_value, field3_name, field3_value, field4_name, field4_value) {
    if (!description) {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .addFields(
                { name: field1_name, value: field1_value, inline: true },
                { name: field2_name, value: field2_value, inline: true },
                { name: field3_name, value: field3_value, inline: true },
                { name: field4_name, value: field4_value, inline: true }
            )
            .setColor(color)
            .setTimestamp();

        return embed;
    } else {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .addFields(
                { name: field1_name, value: field1_value, inline: true },
                { name: field2_name, value: field2_value, inline: true },
                { name: field3_name, value: field3_value, inline: true },
                { name: field4_name, value: field4_value, inline: true }
            )
            .setColor(color)
            .setTimestamp();

        return embed;
    }
};

function five_field_embed(title, description, field1_name, field1_value, field2_name, field2_value, field3_name, field3_value, field4_name, field4_value, field5_name, field5_value) {
    if (!description) {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .addFields(
                { name: field1_name, value: field1_value, inline: true },
                { name: field2_name, value: field2_value, inline: true },
                { name: field3_name, value: field3_value, inline: true },
                { name: field4_name, value: field4_value, inline: true },
                { name: field5_name, value: field5_value, inline: true }
            )
            .setColor(color)
            .setTimestamp();

        return embed;
    } else {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .addFields(
                { name: field1_name, value: field1_value, inline: true },
                { name: field2_name, value: field2_value, inline: true },
                { name: field3_name, value: field3_value, inline: true },
                { name: field4_name, value: field4_value, inline: true },
                { name: field5_name, value: field5_value, inline: true }
            )
            .setColor(color)
            .setTimestamp();

        return embed;
    }
};

function nine_field_embed(title, description, field1_name, field1_value, field2_name, field2_value, field3_name, field3_value, field4_name, field4_value, field5_name, field5_value, field6_name, field6_value, field7_name, field7_value, field8_name, field8_value, field9_name, field9_value) {
    if (!description) {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .addFields(
                { name: field1_name, value: field1_value, inline: true },
                { name: field2_name, value: field2_value, inline: true },
                { name: field3_name, value: field3_value, inline: true },
                { name: field4_name, value: field4_value, inline: true },
                { name: field5_name, value: field5_value, inline: true },
                { name: field6_name, value: field6_value, inline: true },
                { name: field7_name, value: field7_value, inline: true },
                { name: field8_name, value: field8_value, inline: true },
                { name: field9_name, value: field9_value, inline: true }
            )
            .setColor(color)
            .setTimestamp();

        return embed;
    } else {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .addFields(
                { name: field1_name, value: field1_value, inline: true },
                { name: field2_name, value: field2_value, inline: true },
                { name: field3_name, value: field3_value, inline: true },
                { name: field4_name, value: field4_value, inline: true },
                { name: field5_name, value: field5_value, inline: true },
                { name: field6_name, value: field6_value, inline: true },
                { name: field7_name, value: field7_value, inline: true },
                { name: field8_name, value: field8_value, inline: true },
                { name: field9_name, value: field9_value, inline: true }
            )
            .setColor(color)
            .setTimestamp();

        return embed;
    }
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
    two_field_embed,
    three_field_embed,
    four_field_embed,
    five_field_embed,
    nine_field_embed,
    np_embed,
    queue_embed,
    top_embed
};