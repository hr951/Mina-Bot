const util = require("minecraft-server-util");
const { EmbedBuilder } = require("discord.js");

async function check(ip, port) {

    let hub_1_je;
    let hub_1_be;
    let hub_2_je;
    let hub_2_be;

    try {
        hub_1_je = await util.status(ip.hub_1_je, port.hub_1_je);
    } catch (error) { }
    try {
        hub_1_be = await util.statusBedrock(ip.hub_1_be, port.hub_1_be);
    } catch (error) { }
    try {
        hub_2_je = await util.status(ip.hub_2_je, port.hub_2_je);
    } catch (error) { }
    try {
        hub_2_be = await util.statusBedrock(ip.hub_2_be, port.hub_2_be);
    } catch (error) { }

    let color = "Green";

    const embed = new EmbedBuilder()
        .setTimestamp();

    if (hub_1_je && hub_1_be) {
        embed.addFields(
            { name: `**サーバー 1**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🟢 オンライン", inline: true },
            { name: "参加人数", value: `${hub_1_je.players.online} / ${hub_1_je.players.max}`, inline: true },
            { name: "バージョン", value: "JE: **" + hub_1_je.version.name.replace("Velocity ", "") + "**\nBE: **" + hub_1_be.version.name + "**" || "undefined" }
        );
    } else if (hub_1_je && !hub_1_be) {
        embed.addFields(
            { name: `**サーバー 1**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🟢 オンライン", inline: true },
            { name: "参加人数", value: `${hub_1_je.players.online} / ${hub_1_je.players.max}`, inline: true },
            { name: "バージョン", value: "JE: **" + hub_1_je.version.name.replace("Velocity ", "") + "**" || "undefined" }
        );
    } else if (!hub_1_je && hub_1_be) {
        embed.addFields(
            { name: `**サーバー 1**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🟢 オンライン", inline: true },
            { name: "参加人数", value: `${hub_1_be.players.online} / ${hub_1_be.players.max}`, inline: true },
            { name: "バージョン", value: "BE: **" + hub_1_be.version.name + "**" || "undefined" }
        );
    } else if (!hub_1_je && !hub_1_be) {
        embed.addFields(
            { name: `**サーバー 1**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🔴 オフライン", inline: true }
        );
    }

    if (hub_2_je && hub_2_be) {
        embed.addFields(
            { name: `**サーバー 2**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🟢 オンライン", inline: true },
            { name: "参加人数", value: `${hub_2_je.players.online} / ${hub_2_je.players.max}`, inline: true },
            { name: "バージョン", value: "JE: **" + hub_2_je.version.name.replace("Velocity ", "") + "**\nBE: **" + hub_2_be.version.name + "**" || "undefined" }
        );
    } else if (hub_2_je && !hub_2_be) {
        embed.addFields(
            { name: `**サーバー 2**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🟢 オンライン", inline: true },
            { name: "参加人数", value: `${hub_2_je.players.online} / ${hub_2_je.players.max}`, inline: true },
            { name: "バージョン", value: "JE: **" + hub_2_je.version.name.replace("Velocity ", "") + "**" || "undefined" }
        );
    } else if (!hub_2_je && hub_2_be) {
        embed.addFields(
            { name: `**サーバー 2**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🟢 オンライン", inline: true },
            { name: "参加人数", value: `${hub_2_be.players.online} / ${hub_2_be.players.max}`, inline: true },
            { name: "バージョン", value: "BE: **" + hub_2_be.version.name + "**" || "undefined" }
        );
    } else if (!hub_2_je && !hub_2_be) {
        embed.addFields(
            { name: `**サーバー 2**`, value: " ", inline: false },
            { name: "サーバー状態", value: "🔴 オフライン", inline: true }
        );
    }

    if (!hub_1_je && !hub_1_be && !hub_2_je && !hub_2_be) {
        color = "Red";
    }

    embed.setColor(color);

    return embed;
}

module.exports = { check };