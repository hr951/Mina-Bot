const { EmbedBuilder } = require("discord.js");

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
}

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
}

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
}

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
}

module.exports = { embed_check_ac, embed_check_jb, embed_check_be, embed_check_offline };