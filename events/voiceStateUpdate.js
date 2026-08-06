const { model } = require("../db/db");

const joinTimes = new Map();
const muteTimes = new Map();
const mutingTimes = new Map();

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        client.serverQueue = client.queues.get(oldState.guild.id);

        if (client.serverQueue) {

            // Botが接続しているボイスチャンネルを取得
            const botVoiceChannelId = client.serverQueue.connection.joinConfig.channelId;
            const voiceChannel = oldState.guild.channels.cache.get(botVoiceChannelId);

            // 1. ボイスチャンネル内にBot以外の人間が誰もいなくなった場合、自動退出
            if (voiceChannel && voiceChannel.members.filter(m => !m.user.bot).size === 0) {
                client.serverQueue.connection.destroy();
                client.queues.delete(oldState.guild.id);

                const textChannel = oldState.guild.channels.cache.get(client.serverQueue.textChannelId);
                if (textChannel) {
                    textChannel.send('ボイスチャンネルに誰もいなくなったため、自動切断しました。');
                }
                return;
            }

            // 2. Bot自身が切断された（キックや手動切断など）場合、キューと接続情報をクリア
            if (oldState.member.id === client.user.id && !newState.channelId) {
                try {
                    client.serverQueue.connection.destroy();
                } catch (error) {
                    custom.error(error);
                }
                client.queues.delete(oldState.guild.id);
                custom.log(`[VoiceState] Botが切断されたため、キューを強制クリアしました。`);
            }
        }

        const member = newState.member;
        if (member.user.bot) return;

        if (oldState.selfMute !== newState.selfMute) {
            const status = newState.selfMute ? "ミュート中" : "解除";
            custom.log(`${newState.member.displayName} がマイクを ${status} にしました`);
            if (!oldState.selfMute && newState.selfMute) {
                muteTimes.set(member.id, Date.now());
            }
            if (oldState.selfMute && !newState.selfMute) {
                const muteTime = muteTimes.get(member.id);
                if (muteTimes) {
                    mutingTimes.set(member.id, Date.now() - muteTime + (mutingTimes.get(member.id) || 0));
                    muteTimes.delete(member.id);
                }
            }
        }

        if (oldState.selfDeaf !== newState.selfDeaf) {
            const status = newState.selfDeaf ? "OFF" : "ON";
            custom.log(`${newState.member.displayName} がスピーカーを ${status} にしました`);
        }

        if (!oldState.channelId && newState.channelId) {
            joinTimes.set(member.id, Date.now());
            mutingTimes.set(member.id, 0);
        } else if (oldState.channelId && !newState.channelId) {
            const joinTime = joinTimes.get(member.id);
            if (joinTime) {
                const stayTime = Date.now() - joinTime;

                let mutingTime = mutingTimes.get(member.id) || 0;
                const muteTime = muteTimes.get(member.id);
                if (muteTime) {
                    mutingTime += (Date.now() - muteTime);
                }

                joinTimes.delete(member.id);
                muteTimes.delete(member.id);
                mutingTimes.delete(member.id);

                const tempTime = stayTime - mutingTime;
                const tempPoint = Math.floor((tempTime / 300_000) + (mutingTime / 900_000));

                try {
                    let vcTime = 0;
                    let vcPoint = 0;
                    let vcAllPoint = 0;
                    try {
                        const msgPoint = await model.findOne({ _id: member.id });
                        vcTime = msgPoint.vc_time;
                        vcPoint = msgPoint.vc_point;
                        vcAllPoint = msgPoint.vc_all_point;
                        if (!vcTime) {
                            vcTime = 0;
                        }
                        if (!vcPoint) {
                            vcPoint = 0;
                        }
                        if (!vcAllPoint) {
                            vcAllPoint = 0;
                        }
                    } catch (error) {
                        custom.error(error);
                    }
                    await model.findOneAndUpdate(
                        { _id: member.id },
                        {
                            $set: {
                                display_name: member.displayName,
                                vc_point: vcPoint + tempPoint,
                                vc_all_point: vcAllPoint + tempPoint,
                                vc_time: vcTime + stayTime
                            },
                        },
                        { upsert: true, new: true }
                    );
                } catch (error) {
                    custom.error(error);
                }
            }
        }
    },
};