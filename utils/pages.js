const { version } = require('discord.js');
const os = require('os');
const { getCPUUsage, getRAMUsage } = require('./getUsage.js');
const { ms2time } = require('./ms2time.js');
const { portChecker } = require('./port_checker.js');
const { basic_embed, eight_field_embed } = require('./embeds.js');
require("dotenv").config();


function page1(interaction) {
    return basic_embed(`${interaction.client.user.username}の情報`,
        "### 各種ドキュメントリンク\n**利用規約:**\n__[🌐外部リンク](https://hr951.github.io/minachan/terms)__\n\n**プライバシーポリシー:**\n__[🌐外部リンク](https://hr951.github.io/minachan/privacypolicy)__");
};

function page2(interaction) {
    const commands = interaction.client.commands.map(cmd => ` - **/${cmd.data.name}**: ${cmd.data.description}`).join("\n");
    return basic_embed(`${interaction.client.user.username}の情報`, "### コマンドリスト\n" + commands);
};

async function page3(interaction) {
    const kazagumo = interaction.client.kazagumo;
    const YT_API_URL = process.env.HOME_API_URL;

    const host = YT_API_URL.substring(0, YT_API_URL.lastIndexOf(':'));
    const port = Number(YT_API_URL.substring(YT_API_URL.lastIndexOf(':') + 1));

    let playSource;
    if (await portChecker(host, port)) {
        playSource = "YouTube";
    } else if (kazagumo.shoukaku.nodes.size) {
        playSource = "SoundCloud";
    } else {
        playSource = "再生サーバー未接続";
    }

    const uptime = await ms2time(interaction.client.uptime);
    const nodeVer = process.version;
    const djsVer = version;
    const osVer = os.type();
    const ping = await interaction.client.ws.ping;
    const cpuUsage = await getCPUUsage();
    const ramUsage = await getRAMUsage();

    return eight_field_embed(
        `${interaction.client.user.username}の情報`,
        "### ステータス",
        "稼働時間", uptime,
        "Ping", `${ping}ms`,
        "OS", osVer,
        "CPU使用率", `${cpuUsage}%`,
        "RAM使用率", `${ramUsage.percentage}%`,
        "再生ソース", playSource,
        "Discord.js", "v" + djsVer,
        "Node.js", nodeVer
    );
};

module.exports = { page1, page2, page3 };