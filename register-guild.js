// コマンド設定部分
const { SlashCommandBuilder } = require("discord.js");
const fs = require('node:fs');

const token = "token";
const clientId = "clientId";
const guildId = "guildId";

const ping = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Pingを取得します');

const top = new SlashCommandBuilder()
	.setName('top')
	.setDescription('チャンネルの最初のメッセージを取得します');

const point = new SlashCommandBuilder()
	.setName('point')
	.setDescription('ポイント関連のコマンドです')
	.addSubcommand(subcommand =>
		subcommand
			.setName('view')
			.setDescription('ユーザーのポイントを表示します')
			.addUserOption(option =>
				option
					.setName('user')
					.setDescription('対象のユーザー')
					.setRequired(false)
			)
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('use')
			.setDescription('ポイントを利用します')
	);

const play = new SlashCommandBuilder()
	.setName("play")
	.setDescription("音楽を再生します")
	.addStringOption(option => option
		.setName("record")
		.setDescription("レコード名を選択してください")
		.setRequired(true)
		.addChoices(
			{ name: "13", value: "1" },
			{ name: "cat", value: "2" },
			{ name: "blocks", value: "3" },
			{ name: "chirp", value: "4" },
			{ name: "far", value: "5" },
			{ name: "mall", value: "6" },
			{ name: "mellohi", value: "7" },
			{ name: "stal", value: "8" },
			{ name: "strad", value: "9" },
			{ name: "ward", value: "10" },
			{ name: "11", value: "11" },
			{ name: "wait", value: "12" },
			{ name: "otherside", value: "13" },
			{ name: "Pigstep", value: "14" },
			{ name: "Creator", value: "15" },
			{ name: "Creator (オルゴール)", value: "16" },
			{ name: "Relic", value: "17" },
			{ name: "Precipice", value: "18" },
			{ name: "5", value: "19" },
			{ name: "Tears", value: "20" },
			{ name: "Lava Chicken", value: "21" }
		)
	);

const stop = new SlashCommandBuilder()
	.setName('stop')
	.setDescription('音楽を停止します');

const lb = new SlashCommandBuilder()
	.setName('lb')
	.setDescription('ポイント関連のコマンドです')
	.addSubcommand(subcommand =>
		subcommand
			.setName('all')
			.setDescription('各部門首位を表示します')
	)
	.addSubcommand(subcommand =>
		subcommand
			.setName('category')
			.setDescription('それぞれの部門のランキングです')
			.addStringOption(option => option
				.setName("sort")
				.setDescription("ソートする内容を選択してください")
				.setRequired(true)
				.addChoices(
					{ name: "Point", value: "point" },
					{ name: "MSGcount", value: "msgcount" },
					{ name: "AllPoint", value: "all_point" },
					{ name: "AvgMSGlength", value: "averagemsg" }
				)
			)
			.addStringOption(option => option
				.setName("number")
				.setDescription("ソートする数量を選択してください")
				.setRequired(true)
				.addChoices(
					{ name: "TOP20", value: "20" },
					{ name: "TOP10", value: "10" },
					{ name: "TOP5", value: "5" }
				)
			)
	);

const profile = new SlashCommandBuilder()
	.setName('profile')
	.setDescription('create your profile')
	.addStringOption(option =>
		option.setName('minecraft-id')
			.setDescription('マイクラのIDを書いてください')
			.setRequired(true)
	)
	.addStringOption(option =>
		option.setName('comment')
			.setDescription('ひとことを書いてください')
			.setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("sns1")
			.setDescription("使用しているSNSを選択してください")
			.setRequired(false) //trueで必須、falseで任意
			.addChoices(
				{ name: "Twitter", value: "x" },
				{ name: "Youtube", value: "yt" },
				{ name: "Discord", value: "discord" },
				{ name: "Scratch", value: "sc" },
				{ name: "Instagram", value: "ig" },
				{ name: "TikTok", value: "tt" }
			)
	)
	.addStringOption((option) =>
		option
			.setName("sns2")
			.setDescription("使用しているSNSを選択してください")
			.setRequired(false) //trueで必須、falseで任意
			.addChoices(
				{ name: "Twitter", value: "x" },
				{ name: "Youtube", value: "yt" },
				{ name: "Discord", value: "discord" },
				{ name: "Scratch", value: "sc" },
				{ name: "Instagram", value: "ig" },
				{ name: "TikTok", value: "tt" }
			)
	)
	.addStringOption((option) =>
		option
			.setName("sns3")
			.setDescription("使用しているSNSを選択してください")
			.setRequired(false) //trueで必須、falseで任意
			.addChoices(
				{ name: "Twitter", value: "x" },
				{ name: "Youtube", value: "yt" },
				{ name: "Discord", value: "discord" },
				{ name: "Scratch", value: "sc" },
				{ name: "Instagram", value: "ig" },
				{ name: "TikTok", value: "tt" }
			)
	);

const commands = [ping, top, point, lb, profile]

const member = new SlashCommandBuilder()
	.setName('member')
	.setDescription('勢力ごとのメンバーを表示します');

const commands_guild = [member]

//登録用関数
const { REST, Routes } = require("discord.js")
const rest = new REST({ version: '10' }).setToken(token)
async function main() {
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
