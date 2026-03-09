const util = require("minecraft-server-util");
const { embed_check_ac, embed_check_hub_1, embed_check_hub_2, embed_check_offline } = require("./embeds.js");

async function check(ip, port) {

    try {
        const hub_1_je = await util.status(ip.hub_1_je, port.hub_1_je);
        const hub_1_be = await util.statusBedrock(ip.hub_1_be, port.hub_1_be);
        const hub_2_je = await util.status(ip.hub_2_je, port.hub_2_je);
        const hub_2_be = await util.statusBedrock(ip.hub_2_be, port.hub_2_be);

        return embed_check_ac(hub_1_je, hub_1_be, hub_2_je, hub_2_be);
    } catch {
        try {
            const hub_1_je = await util.status(ip.hub_1_je, port.hub_1_je);
            const hub_1_be = await util.statusBedrock(ip.hub_1_be, port.hub_1_be);

            return embed_check_hub_1(hub_1_je, hub_1_be);
        } catch {
            try {
                const hub_2_je = await util.status(ip.hub_2_je, port.hub_2_je);
                const hub_2_be = await util.statusBedrock(ip.hub_2_be, port.hub_2_be);

                return embed_check_hub_2(hub_2_je, hub_2_be);
            } catch {
                return embed_check_offline();
            }
        }
    }
}

module.exports = { check };