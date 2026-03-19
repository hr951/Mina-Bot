const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { model, serverModel } = require('../db/db');
const { basic_embed } = require("../utils/embeds.js");

module.exports = {
    data: new SlashCommandBuilder()
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
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('commands')
                .setDescription('コマンドの使用率を表示します')
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "all") {

            const [result] = await model.aggregate([
                {
                    $addFields: {
                        avgLength: {
                            $cond: {
                                if: { $eq: ["$msgcount", 0] },
                                then: 0,
                                else: { $divide: ["$msglength", "$msgcount"] }
                            }
                        }
                    }
                },
                {
                    $facet: {
                        top_avg: [
                            { $sort: { avgLength: -1 } },
                            { $limit: 1 },
                            { $project: { name: 1, avgLength: 1, _id: 0 } }
                        ],
                        top_msgcount: [
                            { $sort: { msgcount: -1 } },
                            { $limit: 1 },
                            { $project: { name: 1, msgcount: 1, _id: 0 } }
                        ],
                        top_allpoint: [
                            { $sort: { all_point: -1 } },
                            { $limit: 1 },
                            { $project: { name: 1, all_point: 1, _id: 0 } }
                        ],
                        top_point: [
                            { $sort: { point: -1 } },
                            { $limit: 1 },
                            { $project: { name: 1, point: 1, _id: 0 } }
                        ]
                    }
                }
            ]);

            if (!result) {
                return interaction.reply({ content: 'データがありません。', flags: [MessageFlags.Ephemeral] });
            }

            const description = `**AllPoint TOP:** ${result.top_allpoint[0]?.name || 'なし'}: **${result.top_allpoint[0]?.all_point || 0}**\n` +
                `**Point TOP:** ${result.top_point[0]?.name || 'なし'}: **${result.top_point[0]?.point || 0}**\n` +
                `**MSG数 TOP:** ${result.top_msgcount[0]?.name || 'なし'}: **${result.top_msgcount[0]?.msgcount || 0}**\n` +
                `**MSG平均長さ TOP:** ${result.top_avg[0]?.name || 'なし'}: **${result.top_avg[0]?.avgLength?.toFixed(2) || 0}**`;

            await interaction.reply({ embeds: [basic_embed("各部門TOP", description)] });

        } else if (subcommand === "category") {
            const sort = interaction.options.getString('sort');
            const number = interaction.options.getString('number');
            let topUsers;

            if (sort === 'averagemsg') {
                topUsers = await model.aggregate([
                    {
                        $addFields: {
                            avgLength: {
                                $cond: {
                                    if: { $eq: ["$msgcount", 0] },
                                    then: 0,
                                    else: { $divide: ["$msglength", "$msgcount"] }
                                }
                            }
                        }
                    },
                    { $sort: { avgLength: -1 } },
                    { $limit: Number(number) },
                    { $project: { name: 1, avgLength: 1 } }
                ]);
            } else {
                topUsers = await model.find({}, { name: 1, [sort]: 1 })
                    .sort({ [sort]: -1 })
                    .limit(number);
            }

            if (!topUsers.length) {
                return interaction.reply({ content: 'ランキングデータがまだありません。', flags: [MessageFlags.Ephemeral] });
            }

            let description = '';
            topUsers.forEach((user, i) => {
                const value =
                    sort === 'averagemsg'
                        ? user.avgLength.toFixed(2)
                        : user[sort]?.toLocaleString?.() ?? 0;
                description += `**${i + 1}.** ${user.name}: **${value}**\n`;
            });

            const title = `${sort === 'point' ? 'Point' : sort === 'all_point' ? 'AllPoint' : sort === 'msgcount' ? 'MSG数' : sort === 'averagemsg' ? 'MSG平均長さ' : "Undefined"}ランキング`;

            await interaction.reply({ embeds: [basic_embed(title, description)] });

        } else if (subcommand === "commands") {
            let useCmd = {};
            const serverConfig = await serverModel.findOne({ _id: "1265637138247057428" });
            useCmd = serverConfig.commands_use;
            const total = useCmd.total;

            const rankCmd = Object.entries(useCmd).filter(([name]) => name !== "total").sort((a, b) => b[1] - a[1]);
            const description = `**Total**: ${total}回\n` + rankCmd.map(([name, count], index) => `${index + 1}. **${name}**: ${count || 0}回 (${((count || 0) / total * 100).toFixed(1)}%)`).join('\n');

            const title = `コマンド使用率ランキング`;

            await interaction.reply({ embeds: [basic_embed(title, description)] });
        }
    }
}
