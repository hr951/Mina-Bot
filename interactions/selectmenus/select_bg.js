const { AttachmentBuilder } = require('discord.js');
const { model } = require('../../db/db');
const { google } = require('googleapis');
const axios = require('axios');

const CLIENT_ID = process.env.G_CLIENT_ID;
const CLIENT_SECRET = process.env.G_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.G_REFRESH_TOKEN;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_ID;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

module.exports = {
    async execute(interaction) {
        const value = interaction.values[0];
        const name = {
            0: "初期画像",
            1: "集合写真"
        };

        let image_url = "undefined";
        let fileId;

        if (value === "3") {
            await interaction.reply("60秒以内に画像を送信してください");

            const channel = interaction.channel;
            const userId = interaction.user.id;

            const filter = (msg) =>
                msg.author.id === userId && msg.attachments.size > 0;

            try {
                const collected = await channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 60_000, // 60秒待ち
                    errors: ["time"],
                });

                const msg = collected.first();
                const attachment = msg.attachments.first();

                const filename = attachment.name.toLowerCase();
                const type = attachment.contentType?.toLowerCase() || "";

                if (
                    !(
                        filename.endsWith(".png") ||
                        filename.endsWith(".jpg") ||
                        filename.endsWith(".jpeg") ||
                        type.includes("png") ||
                        type.includes("jpeg") ||
                        type.includes("jpg")
                    )
                ) {
                    await interaction.followUp("対応していないファイル形式です\n**__png/jpg/jpeg__**のファイル形式の画像を用意してください");
                    return;
                }

                const response = await axios({
                    method: 'get',
                    url: attachment.url,
                    responseType: 'stream',
                });

                // 2. Google Driveへ直接ストリームアップロード
                const fileMetadata = {
                    name: `${interaction.user.id}_${Date.now()}_${attachment.name}`,
                    parents: [GOOGLE_DRIVE_FOLDER_ID],
                };
                const media = {
                    mimeType: attachment.contentType,
                    body: response.data,
                };

                const driveFile = await drive.files.create({
                    requestBody: fileMetadata,
                    media: media,
                    fields: 'id',
                });

                const fileId = driveFile.data.id;

                // 3. 画像の閲覧権限を「リンクを知っている全員」に設定
                await drive.permissions.create({
                    fileId: fileId,
                    requestBody: { role: 'reader', type: 'anyone' },
                });

                // 4. 画像表示用直リンクの生成
                image_url = `https://lh3.googleusercontent.com/d/${fileId}`;

                // 5. 古い画像があればGoogle Driveから削除する処理（クリーンアップ）
                const currentUser = await model.findById(interaction.user.id);
                if (currentUser && currentUser.bg_drive_id) {
                    try {
                        await drive.files.delete({ fileId: currentUser.bg_drive_id });
                    } catch (delErr) {
                        custom.log('古いファイルの削除をスキップ (存在しない等の理由):', delErr.message);
                    }
                }

                const img = new AttachmentBuilder()
                    .setName(`${interaction.user.id}.png`)
                    .setFile(image_url);

                await interaction.followUp({
                    content: `以下の画像を登録しました！`,
                    files: [await img],
                });

            } catch (error) {
                custom.error(error);
                await interaction.followUp("60秒以内に画像が送信されませんでした");
            }
        } else {
            image_url = "undefined";
        }

        try {

            try {
                await model.findOne({ _id: interaction.user.id });
            } catch (error) {
                custom.error(error);
            }
            // 5. MongoDBのユーザーデータを更新
            await model.updateOne(
                { _id: interaction.user.id },
                {
                    $set: {
                        bg_type: 2,
                        bg_url: image_url,     // 表示用直リンク
                        bg_drive_id: fileId,        // 削除・管理用のGoogle Drive ID
                    },
                },
                { upsert: true }
            );
            if (value != 3) {
                await interaction.reply(`プロフィール背景を**${name[value - 1]}**に設定しました`);
            }
            //custom.log("Update the DataBase:", msgData);
        } catch (error) {
            custom.error("Update Error:", error);
        }

    }
};