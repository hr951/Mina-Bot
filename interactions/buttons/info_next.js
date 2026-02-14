const { page1, page2, page3 } = require('../../utils/pages.js');

module.exports = {
    async execute(interaction) {
        await interaction.deferUpdate();
        const page = interaction.message.embeds[0].description.includes("ドキュメント") ? 1 : 2;
        let newPage;
        switch (page) {
            case 1:
                newPage = await page2(interaction);
                break;
            case 2:
                newPage = await page3(interaction);
                break;
            default:
                newPage = await page1(interaction);
        }
        await interaction.editReply({ embeds: [newPage] });
    }
};