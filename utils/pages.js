const { version } = require('discord.js');
const os = require('os');
const { getCPUUsage, getRAMUsage, getDBUsage } = require('./getUsage.js');
const { ms2time } = require('./ms2time.js');
const { basic_embed, fields_embed } = require('./embeds.js');
require("dotenv").config();


function page1(interaction) {
    return basic_embed(`${interaction.client.user.username}の情報 (1/4)`,
        "### 各種ドキュメントリンク\n**利用規約:**\n__[🌐外部リンク](https://hr951.github.io/minachan/terms)__\n\n**プライバシーポリシー:**\n__[🌐外部リンク](https://hr951.github.io/minachan/privacypolicy)__");
};

function page2(interaction) {
    const commands = interaction.client.commands.map(cmd => ` - **/${cmd.data.name}**: ${cmd.data.description}`).join("\n");
    return basic_embed(`${interaction.client.user.username}の情報 (2/4)`, "### コマンドリスト\n" + commands);
};

async function page3(interaction) {
    const uptime = await ms2time(interaction.client.uptime);
    const nodeVer = process.version;
    const djsVer = version;
    const osVer = os.type();
    const ping = await interaction.client.ws.ping;
    const cpuUsage = await getCPUUsage();
    const ramUsage = await getRAMUsage();
    const dbUsage = await getDBUsage();

    const fields = [
        { name: "稼働時間", value: uptime },
        { name: "Ping", value: `${ping}ms` },
        { name: "OS", value: osVer },
        { name: "CPU使用率", value: `${cpuUsage}%` },
        { name: "RAM使用率", value: `${ramUsage.percentage}%` },
        { name: "DB使用量", value: `${dbUsage.used}MB` },
        { name: "discord.js", value: `v${djsVer}` },
        { name: "Node.js", value: nodeVer }
    ];

    return fields_embed(
        `${interaction.client.user.username}の情報 (3/4)`,
        "### ステータス",
        fields
    );
};

async function page4(interaction) {
    const guild_name = await interaction.client.guilds.cache.get("1265637138247057428").name;
    const fields = [
        { name: "Developer", value: "えいちあーる" },
        { name: "Libraries", value: "Node.js\ndiscord.js\nCanvas" },
        { name: "Assets", value: "Icons: Flaticon\nFont: Nosutaru-dot\nImages: Minecraft" },
        { name: "Special Thanks", value: `${guild_name}\nDebuggers` },
        { name: "References", value: "Some GitHub Projects\nDiscord API Docs" }
    ];

    return fields_embed(
        `${interaction.client.user.username}の情報 (4/4)`,
        "### クレジット",
        fields
    );
};

module.exports = { page1, page2, page3, page4 };