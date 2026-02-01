const util = require("minecraft-server-util");
const { embed_check_ac, embed_check_jb, embed_check_be, embed_check_offline } = require("./embeds.js");

async function check(ip, port) {

    try {
        const result = await util.status(ip.je, port.je);
        const result_jb = await util.statusBedrock(ip.jb, port.jb);
        const result_be = await util.statusBedrock(ip.be, port.be);

        return embed_check_ac(result, result_jb, result_be);
    } catch {
        try {
            const result = await util.status(ip.je, port.je);
            const result_jb = await util.statusBedrock(ip.jb, port.jb);

            return embed_check_jb(result, result_jb);
        } catch {
            try {
                const result_be = await util.statusBedrock(ip.be, port.be);

                return embed_check_be(result_be);
            } catch {
                return embed_check_offline();
            }
        }
    }
}

module.exports = { check };