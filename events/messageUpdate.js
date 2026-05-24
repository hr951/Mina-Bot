require("dotenv").config();
const { model, serverModel } = require('../db/db');
const { sendMessage } = require('../utils/sendMessages');

const clientId = "1307701661447360595";

module.exports = {
    name: 'messageUpdate',
    async execute(message, client) {

        const updateMessage = message.reactions.message;

        if (updateMessage.author.id === clientId || updateMessage.author.id === "1090176867052564480") return;

        if (updateMessage.guildId) {
            await sendMessage(updateMessage, "update");

            // ----- セキュリティ処理 -----
            let blackWordsConfig = {};
            try {
                const serverConfig = await serverModel.findOne({ _id: "1265637138247057428" });
                blackWordsConfig = JSON.parse(serverConfig.black_words);
                if (!blackWordsConfig) {
                    blackWordsConfig = null;
                }
            } catch (error) {
                custom.error(error);
            }

            const content = updateMessage.content.toLowerCase().normalize("NFKC");

            const compact = content.replace(/\s+/g, "");

            const exactMatch = blackWordsConfig.ExactMatch.some(w =>
                content === w
            );

            const partialMatch = blackWordsConfig.PartialMatch.some(w =>
                content.includes(w) || compact.includes(w.replace(/\s+/g, ""))
            );

            const idMatch = blackWordsConfig.Id.some(w =>
                updateMessage.author.id === w
            );

            if (exactMatch || partialMatch || idMatch) {
                try {
                    await updateMessage.delete();
                    await updateMessage.author.send({ content: `あなたの発言「${updateMessage.cleanContent}」からNGワードが検出されました。発言は削除され、WarningPointが加算されました。` });
                } catch (error) {
                    custom.error(error);
                }

                client.channels.cache.get("1380894393611059241").send({ content: `${updateMessage.member.displayName} の https://discord.com/channels/${updateMessage.guild.id}/${updateMessage.channel.id} での発言からNGワード (${updateMessage.cleanContent}) が検出されました。` });

                try {
                    let warnPoint = 0;
                    try {
                        const msgPoint = await model.findOne({ _id: updateMessage.author.id });
                        warnPoint = msgPoint.warn;
                        if (!warnPoint) {
                            warnPoint = 0;
                        }
                    } catch (error) {
                        custom.error(error);
                    }
                    await model.findOneAndUpdate(
                        { _id: updateMessage.author.id },
                        {
                            $set: {
                                warn: warnPoint + 1
                            },
                        },
                        { upsert: true, new: true }
                    );
                } catch (error) {
                    custom.error(error);
                }
            }

            // ----- セキュリティ処理 終了 -----
        }

    },
};