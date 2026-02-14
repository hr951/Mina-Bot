const { ActivityType, PresenceUpdateStatus } = require("discord.js");
require("dotenv").config();
const { check } = require("../utils/server-status");

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
    name: 'clientReady',
    async execute(client) {
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

        client.user.setPresence({
            activities: [
                {
                    name: `Minachanの広場`,
                    //name: "エラー処理中……",
                    type: ActivityType.Competing
                }
            ],
            status: PresenceUpdateStatus.Online // Online : いつもの, DoNotDisturb : 赤い奴, Idle : 月のやつ, Invisible : 表示なし
        });

        console.log(`Logged in as ${client.user.tag}`);

        setInterval(async () => {
            const channel = await client.channels.cache.get('1410517358459486308');
            const msg = await channel.messages.fetch('1410517899122053281');
            msg.edit({ embeds: [await check(ip, port)] });
        }, 60_000);
    },
};