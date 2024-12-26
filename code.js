const { Client, GatewayIntentBits, Collection, ActivityType, Partials, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, Permissions, PermissionFlagsBits, PermissionsBitField, AttachmentBuilder } = require("discord.js");
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
    Partials.User
  ]
  });
  
const token = process.env.DISCORD_BOT_TOKEN;
const color = "#FFFFFF";
//const player = new Player(client);

client.on('ready', () => {
  setInterval(() => {
    client.user.setPresence({
      activities: [
        {
          name: `Minachanの広場`,
          type: ActivityType.Competing
        }
      ],
      status: `online`//online : いつもの, dnd : 赤い奴, idle : 月のやつ, invisible : 表示なし
    });
    
    
  }, 1000)
})

//ここから

client.on('guildMemberAdd', async member => {
  if(member.guild.id === "1307224551410761778"){
   const guild = client.guilds.cache.get("1307683510311583805");
   try {
   const member_role = await guild.members.fetch(member.user);
   await member_role.roles.add("1307687730582523987");
   console.log("IN Minachanの広場\nMinaメンフォトナクラブ 参加あり"); 
  } catch(error) {
    console.log("IN Minachanの広場\nMinaメンフォトナクラブ 参加なし")
  }
    } else if(member.guild.id === "1307683510311583805"){
      const guild = client.guilds.cache.get("1307224551410761778");
      const role_guild = client.guilds.cache.get("1307683510311583805");
      try {
      const check = await guild.members.fetch(member.user);
      const member_role = await role_guild.members.fetch(member.user);
      await member_role.roles.add("1307687730582523987");
      console.log("IN Minaメンフォトナクラブ\nMinachanの広場 参加あり"); 
     } catch(error) {
       console.log("IN Minaメンフォトナクラブ\nMinachanの広場 参加なし")
     }
       }
  });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`${filePath} に必要な "data" か "execute" がありません。`);
  }
}

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()){

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`${interaction.commandName} が見つかりません。`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'error', ephemeral: true });
  }};
  
  const thumbnail = interaction.client.user.displayAvatarURL();
  if (interaction.isButton()){
    if(interaction.customId === "report"){
    const modal = new ModalBuilder()
 				.setTitle("チケット")
 				.setCustomId("report_submit");
 			const TextInput_1 = new TextInputBuilder()
 				.setLabel("題名を入力してください。")
 				.setCustomId("title")
 				.setStyle("Short")
        .setPlaceholder(" ")
 				.setMaxLength(100)
 				.setMinLength(2)
 				.setRequired(true);
    const TextInput_2 = new TextInputBuilder()
 				.setLabel("内容を入力してください。")
 				.setCustomId("content")
 				.setStyle("Paragraph")
        .setPlaceholder(" ")
 				.setMaxLength(1000)
 				.setMinLength(2)
 				.setRequired(true);
 			const ActionRow = new ActionRowBuilder().setComponents(TextInput_1);
      const ActionRow_2 = new ActionRowBuilder().setComponents(TextInput_2);
 			modal.setComponents(ActionRow, ActionRow_2);
 			return interaction.showModal(modal);
    } else if (interaction.customId === "del"){
      if (!interaction.member.roles.cache.has('1307226905862340608')) {
      await interaction.reply({content: "チャンネルを削除する権限がありません。", ephemeral: true })
      return;
    }else{
      const delmsg = new EmbedBuilder()
      .addFields({
        name: " ",
        value: `<@${interaction.user.id}>がチケット「**${interaction.channel.name}**」を削除しました。`,
        inline : true
      })
      .setColor(color);
      client.channels.cache.get("1307705261544308807").send({ embeds:[delmsg]})
      interaction.channel.delete();
    }
    } else if (interaction.customId === "stop"){
      /*try {
        global.connection.destroy();
        interaction.reply({content:"再生を停止しました。", ephemeral: false})
        } catch (error) {
            interaction.reply({content:"VCに接続していません。", ephemeral: true})
        }*/
    }
  } else if (interaction.isModalSubmit()){
 		if (interaction.customId == "report_submit"){
 			const content = interaction.fields.getTextInputValue("content");
      const title = interaction.fields.getTextInputValue("title");
      const id = interaction.user.id;
      try{
      const channel = await interaction.guild.channels.create({
 	name: `${title}`,
 	parent: "1307701371587399730",
  permissionOverwrites: [
                 {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel],
                 },
                {
                    id: interaction.guild.members.cache.get(id),
                    allow: [PermissionFlagsBits.ViewChannel],
                },
                {
                  id: interaction.guild.roles.cache.get("1307225736905621534"),
                  allow: [PermissionFlagsBits.ViewChannel],
                }]
 })
    const embed_content = new EmbedBuilder()
            .setTitle(title)
            .setDescription(content)
            .setColor(color)
         .setFooter({
        text: "Made by Mina鯖 Bot",
        iconURL:thumbnail,
      })
      .setTimestamp()
    const Del_Button = new ButtonBuilder()
		.setCustomId(`del`)
		.setStyle(ButtonStyle.Danger)
		.setLabel("チャンネルの削除")
		.setEmoji("🗑️");
  await channel.send({ content : `<@${id}>`, embeds:[embed_content], components: [new ActionRowBuilder().setComponents(Del_Button)]})
  await interaction.reply({ content: `https://discord.com/channels/${channel.guildId}/${channel.id} を作成しました。`, ephemeral: true })
      } catch (error) {
        await interaction.reply({ content: `キャッシュされていないユーザーの可能性があります。\n人力でチャンネルを作成してください。`, ephemeral: true })
      }
    }
}
});

client.on('messageCreate', async message => {
  if (message.author.id === client.user.id) return;
  if (message.author.bot) return;
  const MESSAGE_URL_REGEX = /https?:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/g;
  const matches = MESSAGE_URL_REGEX.exec(message.content);
  if (matches) {
    const [_, guildId, channelId, messageId] = matches;
    const guild = await client.guilds.fetch(guildId);
    const channel = await client.channels.fetch(channelId);
    const fetchedMessage = await channel.messages.fetch(messageId);

    if (!fetchedMessage.embeds[0] && fetchedMessage.attachments.size === 0){

    const Embed = new EmbedBuilder()
      .setColor('#ffffff')
      .setAuthor({ name: fetchedMessage.author.username, iconURL: fetchedMessage.author.displayAvatarURL() })
      .setDescription(fetchedMessage.content)
      .setTimestamp(fetchedMessage.createdTimestamp);

    message.channel.reply({ embeds: [Embed] ,allowedMentions: { repliedUser: false }});
  } else if (fetchedMessage.attachments.size === 0 && fetchedMessage.embeds[0]){
    message.channel.reply({ embeds: [fetchedMessage.embeds[0]] ,allowedMentions: { repliedUser: false }});
  } else if (!fetchedMessage.content){
    const files = await fetchedMessage.attachments.map(a=>a.attachment);
    message.channel.reply({ files: files ,allowedMentions: { repliedUser: false }});
  } else {
    const files = await fetchedMessage.attachments.map(a=>a.attachment);
    const texts = await fetchedMessage.content;
    message.channel.reply({ content: texts,files: files ,allowedMentions: { repliedUser: false }});
  }
  }
});

/*client.on('messageCreate', async message => {
  const thumbnail = message.client.user.displayAvatarURL();
  if(message.content === "report"){
    const Button = new ButtonBuilder()
		.setCustomId(`report`)
		.setStyle(ButtonStyle.Primary)
		.setLabel("チケット作成")
		.setEmoji("📩");
    
    const report_emb = new EmbedBuilder()
  .addFields(
    {
      name: "チケット作成",
      value: `意見や違反者の報告などに使用してください。\nどんな些細なことでも構いません。`,
      inline: true
    },
    )
  .setColor(color);
  message.channel.send({ embeds: [report_emb], components: [new ActionRowBuilder().setComponents(Button)]});
    } else if (message.content === "games"){
      const games_emb = new EmbedBuilder()
      .setTitle("ゲーム総合フォーラムについて")
  .setDescription("Minecraft以外のゲームについてそれぞれフォーラムを作成して会話する場所です。")
  .addFields(
    {
      name: "注意",
      value: "フォーラムを作成する前に重複しているフォーラムがないか確認してください。\n重複が確認された場合、消去する可能性があります。",
      inline: true
    },
  )
  .setColor("#ffffff")
  .setFooter({
    text: "Made by Mina鯖 Bot",
    iconURL: thumbnail,
  })
  .setTimestamp();

      message.channel.send({ embeds: [games_emb]});
    } else if (message.content === "logs"){
      const logs_emb = new EmbedBuilder()
      .setTitle("意見ボックスについて")
  .setDescription("基本的にサーバーの意見等を受け付けます。")
  .addFields(
    {
      name: "注意",
      value: "意見や違反に対応する際は誤りがないように回答をお願いします。\nまた、チャンネルの削除は主のみ可能です。",
      inline: true
    },
  )
  .setColor("#ffffff")
  .setFooter({
    text: "Made by Mina鯖 Bot",
    iconURL: thumbnail,
  })
  .setTimestamp();

      message.channel.send({ embeds: [logs_emb]});
    } else if (message.content === "invite"){
      const server_name = "Minachanの広場";
      const server_link = "https://discord.gg/Qbh53XcMY8"
      const invite_emb = new EmbedBuilder()
      .setTitle(server_name+" 招待URL")
      .setDescription("Minachanの広場に参加すると発言できるようになります。")
  .setColor("#ffffff")
  .setFooter({
    text: "Made by Mina鯖 Bot",
    iconURL: thumbnail,
  })
  .setTimestamp();

  const invite_url = new ButtonBuilder()
	.setLabel(server_name+"に参加する")
	.setURL(server_link)
	.setStyle(ButtonStyle.Link);

      message.channel.send({ embeds: [invite_emb],components: [new ActionRowBuilder().addComponents(invite_url)]});
    }
});*/

client.login(token);
