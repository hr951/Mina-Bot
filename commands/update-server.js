const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { check } = require("../utils/server-status.js");
const { serverModel } = require('../db/db');

let ip = {};
let port = {};
let ip_je;
let port_je;
let ip_jb;
let port_jb;
let ip_be;
let port_be;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update-server')
        .setDescription('サーバーステータスを最新の状態にします'),
    async execute(interaction) {
        interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        try {
            const server_config = await serverModel.findOne({ _id: "1265637138247057428" });
            ip_je = server_config.ip_je;
            port_je = server_config.port_je;
            ip_jb = server_config.ip_jb;
            port_jb = server_config.port_jb;
            ip_be = server_config.ip_be;
            port_be = server_config.port_be;

            ip =
            {
                "je": ip_je,
                "jb": ip_jb,
                "be": ip_be
            };
            port =
            {
                "je": port_je,
                "jb": port_jb,
                "be": port_be
            };
        } catch (error) {
            console.error(error);
        }

        const channel = await interaction.client.channels.cache.get('1410517358459486308');
        const msg = await channel.messages.fetch('1410517899122053281');
        await msg.edit({ embeds: [await check(ip, port)] });

        await interaction.editReply({ content: "ステータスを更新しました", flags: [MessageFlags.Ephemeral] });
    },
};
