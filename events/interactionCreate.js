const { MessageFlags } = require("discord.js");
const { serverModel } = require("../db/db");
require("dotenv").config();

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                custom.error(`${interaction.commandName} が見つかりません。`);
                return;
            }
            try {
                let useCmd = 0;
                let useTotalCmd = 0;
                try {
                    const msgPoint = await serverModel.findOne({ _id: "1265637138247057428" });
                    useCmd = msgPoint.commands_use[command.data.name];
                    useTotalCmd = msgPoint.commands_use.total;
                    if (!useCmd) {
                        useCmd = 0;
                    }
                    if (!useTotalCmd) {
                        useTotalCmd = 0;
                    }
                } catch (error) {
                    custom.error(error);
                }
                await serverModel.findOneAndUpdate(
                    { _id: "1265637138247057428" },
                    {
                        $set: {
                            [`commands_use.total`]: useTotalCmd + 1,
                            [`commands_use.${command.data.name}`]: useCmd + 1
                        },
                    },
                    { upsert: true, new: true }
                );
            } catch (error) {
                custom.error(error);
            }
            try {
                await command.execute(interaction, client);
            } catch (error) {
                try {
                    await interaction.reply({ content: 'Error', flags: [MessageFlags.Ephemeral] });
                    custom.error(error);
                } catch (error) {
                    try {
                        await interaction.editReply({ content: 'Error', flags: [MessageFlags.Ephemeral] });
                        custom.error(error);
                    } catch (error) {
                        custom.error(error);
                    }
                }
            }
        };

        if (interaction.isButton()) {
            if (interaction.user.id === interaction.customId) { // ユーザーIDを使うため特例
                return await interaction.message.delete();
            }

            try {
                const parts = interaction.customId.split('__');
                const fileName = parts[0];
                const button = require(`../interactions/buttons/${fileName}.js`);
                await button.execute(interaction, client);
            } catch (error) {
                custom.error(error);
                interaction.reply({ content: "Error", flags: [MessageFlags.Ephemeral] });
                return;
            }
        }

        if (interaction.isModalSubmit()) {
            try {
                const modal = require(`../interactions/modals/${interaction.customId}.js`);
                await modal.execute(interaction, client);
            } catch (error) {
                custom.error(error);
                interaction.reply({ content: "Error", flags: [MessageFlags.Ephemeral] });
                return;
            }
        }

        if (interaction.isStringSelectMenu()) {
            try {
                const selectmenu = require(`../interactions/selectmenus/${interaction.customId}.js`);
                await selectmenu.execute(interaction, client);
            } catch (error) {
                custom.error(error);
                interaction.reply({ content: "Error", flags: [MessageFlags.Ephemeral] });
                return;
            }
        }
    },
};