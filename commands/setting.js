const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { model } = require('../db/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setting")
        .setDescription("各種設定です")
        .addSubcommand(subcommand =>
            subcommand
                .setName('voice')
                .setDescription('読み上げ音声の設定をします')
                .addStringOption((option) =>
                    option
                        .setName("speed")
                        .setDescription("読み上げの速度を変更できます")
                        .setRequired(true) //trueで必須、falseで任意
                        .addChoices(
                            { name: "ふつう", value: "normal" },
                            { name: "ゆっくり", value: "slow" }
                        )
                )
                .addStringOption((option) =>
                    option
                        .setName("lang")
                        .setDescription("読み上げの言語を変更できます")
                        .setRequired(true) //trueで必須、falseで任意
                        .addChoices(
                            { name: "日本語", value: "ja" },
                            { name: "英語", value: "en" }
                        )
                )
        ),

    async execute(interaction, client) {
        const speedMode = interaction.options.getString('speed') || 'normal';
        const lang = interaction.options.getString('lang') || 'ja';

        const isSlow = speedMode === 'slow';
        const newSetting = {
            lang: lang,
            slow: isSlow,
            speedScale: isSlow ? 0.5 : 1.0
        };

        try {
            await model.findOneAndUpdate(
                { _id: interaction.user.id },
                {
                    $set: {
                        [`vc_voice_setting.lang`]: newSetting.lang,
                        [`vc_voice_setting.slow`]: newSetting.slow,
                        [`vc_voice_setting.speedScale`]: newSetting.speedScale
                    },
                },
                { upsert: true, new: true }
            );
        } catch (error) {
            custom.error(error);
        }

        return interaction.reply({ content: `設定を保存しました！\n(速度: ${speedMode}, 言語: ${lang})`, flags: MessageFlags.Ephemeral });
    }
};