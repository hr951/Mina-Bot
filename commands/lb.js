const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { model } = require('../db/db');

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
        ),

    async execute(interaction) {
        const color = "#ffffff";
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

            const embed = new EmbedBuilder()
                .setTitle('各部門TOP')
                .setColor(color)
                .setDescription(
                    `**AllPoint TOP:** ${result.top_allpoint[0]?.name || 'なし'}: **${result.top_allpoint[0]?.all_point || 0}**\n` +
                    `**Point TOP:** ${result.top_point[0]?.name || 'なし'}: **${result.top_point[0]?.point || 0}**\n` +
                    `**MSG数 TOP:** ${result.top_msgcount[0]?.name || 'なし'}: **${result.top_msgcount[0]?.msgcount || 0}**\n` +
                    `**MSG平均長さ TOP:** ${result.top_avg[0]?.name || 'なし'}: **${result.top_avg[0]?.avgLength?.toFixed(2) || 0}**`
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

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

            let desc = '';
            topUsers.forEach((user, i) => {
                const value =
                    sort === 'averagemsg'
                        ? user.avgLength.toFixed(2)
                        : user[sort]?.toLocaleString?.() ?? 0;
                desc += `**${i + 1}.** ${user.name}: **${value}**\n`;
            });

            const embed = new EmbedBuilder()
                .setTitle(`${sort === 'point' ? 'Point' : sort === 'all_point' ? 'AllPoint' : sort === 'msgcount' ? 'MSG数' : sort === 'averagemsg' ? 'MSG平均長さ' : "Undefined"}ランキング`)
                .setColor(color)
                .setDescription(desc)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        }
    }
}
