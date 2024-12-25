// コマンド設定部分
const { SlashCommandBuilder } = require("discord.js");
const fs = require('node:fs');

const token = "token";
const clientId = "id";
const guildId = "id";

const ping = new SlashCommandBuilder()
.setName('ping')
	.setDescription('Pingを取得します');

const top = new SlashCommandBuilder()
      .setName('top')
            .setDescription('チャンネルの最初のメッセージを取得します');

const play = new SlashCommandBuilder()
.setName("play")
    .setDescription("音楽を再生します")
    .addStringOption(option => option
        .setName("url")
        .setDescription("urlを入力してください")
        .setRequired(true));

const stop = new SlashCommandBuilder()
		.setName('stop')
		.setDescription('音楽を停止します');

const commands = [ ping, top, play, stop ]

const member = new SlashCommandBuilder()
.setName('member')
	.setDescription('勢力ごとのメンバーを表示します');

const commands_guild = [ member ]

//登録用関数
const { REST, Routes } = require("discord.js")
const rest = new REST({ version: '10' }).setToken(token)
async function main(){
	await rest.put(
		Routes.applicationCommands(clientId),
		{ body: commands },
	);
	await rest.put(
		Routes.applicationGuildCommands(clientId, guildId),
		{ body: commands_guild },
	);
}

main().catch(err => console.log(err))
