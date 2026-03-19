const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
require("dotenv").config();
const color = "#FFFFFF";

const options = ["configServer", "configBlackWords"];

function createConfigBoard(option) {
    if (option === options[0]) {
        const Button1 = new ButtonBuilder()
            .setCustomId("update_serverinfo_1")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("更新する")
            .setEmoji("⚙️");

        const Button2 = new ButtonBuilder()
            .setCustomId("update_serverinfo_2")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("更新する")
            .setEmoji("⚙️");

        const embed = new EmbedBuilder()
            .addFields(
                {
                    name: "サーバー情報の更新",
                    value: `ステータスに表示するサーバーの情報を更新できます。\n設定できる内容は以下の通りです。\n - HUBサーバー ➀のIP(JE&BE)\n - HUBサーバー ➀のポート(JE&BE)\n - HUBサーバー ➁のIP(JE&BE)\n - HUBサーバー ➁のポート(JE&BE)\n※デフォルトで最新の情報が自動的に入力されています。`,
                    inline: true
                },
            )
            .setColor(color);

        return { embeds: [embed], components: [new ActionRowBuilder().setComponents(Button1, Button2)] };
    } else if (option === options[1]) {
        const Button = new ButtonBuilder()
            .setCustomId("config_blackwords")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("更新する")
            .setEmoji("⚙️");

        const embed = new EmbedBuilder()
            .addFields(
                {
                    name: "NGワードの更新",
                    value: `サーバー内で禁止するワードを更新できます。\n設定できる内容は以下の通りです。\n - 完全一致で禁止...その単語(文字列)がそのまま送信された場合に通知します。\n - 部分一致で禁止...その単語(文字列)が送信されたメッセージに含まれている場合に通知します。\n※デフォルトで最新の情報が自動的に入力されています。`,
                    inline: true
                },
            )
            .setColor(color);

        return { embeds: [embed], components: [new ActionRowBuilder().setComponents(Button)] };
    } else {
        return { content: '不明なオプションです。\n以下のリスト内から選択してください。\n```\n' + options.join("\n") + '```' };
    }

}

module.exports = { createConfigBoard };