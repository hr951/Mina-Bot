const { ActivityType, PresenceUpdateStatus } = require("discord.js");
require("dotenv").config();
const { check } = require("../utils/server-status");

const { serverModel } = require('../db/db');

let ip = {};
let port = {};
let ip_hub_1_je;
let ip_hub_1_be;
let ip_hub_2_je;
let ip_hub_2_be;
let port_hub_1_je;
let port_hub_1_be;
let port_hub_2_je;
let port_hub_2_be;

module.exports = {
    name: 'clientReady',
    async execute(client) {
        try {
            const server_config = await serverModel.findOne({ _id: "1265637138247057428" });
            ip_hub_1_je = server_config.ip_hub_1_je;
            port_hub_1_je = server_config.port_hub_1_je;
            ip_hub_1_be = server_config.ip_hub_1_be;
            port_hub_1_be = server_config.port_hub_1_be;
            ip_hub_2_je = server_config.ip_hub_2_je;
            port_hub_2_je = server_config.port_hub_2_je;
            ip_hub_2_be = server_config.ip_hub_2_be;
            port_hub_2_be = server_config.port_hub_2_be;

            ip =
            {
                "hub_1_je": ip_hub_1_je,
                "hub_1_be": ip_hub_1_be,
                "hub_2_je": ip_hub_2_je,
                "hub_2_be": ip_hub_2_be
            };
            port =
            {
                "hub_1_je": port_hub_1_je,
                "hub_1_be": port_hub_1_be,
                "hub_2_je": port_hub_2_je,
                "hub_2_be": port_hub_2_be
            };
        } catch (error) {
            console.error(error);
        }
        setInterval(() => {
            client.user.setPresence({
                activities: [
                    {
                        name: `Minachan鯖のBot`,
                        type: ActivityType.Playing
                    }
                ],
                status: PresenceUpdateStatus.Online // Online : いつもの, DoNotDisturb : 赤い奴, Idle : 月のやつ, Invisible : 表示なし
            });
        }, 5_000);

        console.log(`Logged in as ${client.user.tag}`);

        setInterval(async () => {
            const channel = await client.channels.cache.get('1410517358459486308');
            const msg = await channel.messages.fetch('1410517899122053281');
            msg.edit({ embeds: [await check(ip, port)] });
        }, 60_000);
    },
};