const Discord = require("discord.js")
const { PermissionFlagsBits, ChannelType } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require("./config.json")

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds
  ]
});

module.exports = client

client.on('interactionCreate', (interaction) => {

  if (interaction.type === Discord.InteractionType.ApplicationCommand) {

    const cmd = client.slashCommands.get(interaction.commandName);

    if (!cmd) return interaction.reply(`Error`);

    interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

    cmd.run(client, interaction)

  }
})

client.on('ready', () => {
  console.log(`✅ Olá Rangel, Estou online em ${client.user.username}!`)
})


client.slashCommands = new Discord.Collection()

require('./handler')(client)

client.login(config.token)

//...........................................-> TICKET <-...........................................//

client.on("interactionCreate", (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "ticket") {
      if (interaction.guild.channels.cache.find(ca => ca.name === `${interaction.user.id}`)) {
        let canal = interaction.guild.channels.cache.find(ca => ca.name === `${interaction.user.id}`);

        let jaTem = new Discord.EmbedBuilder()
          .setDescription(`❌ **Calma! Você já tem um ticket criado em: ${canal}.**`)
          .setColor('#ff0000')

        interaction.reply({ embeds: [jaTem], ephemeral: true })
      } else {
        let cargostaff = '1009937698175340605'; //Id do cargo de staff.
        interaction.guild.channels.create({
          name: `${interaction.user.username}-🎟`,
          type: 0, //Canal de texto
          parent: '1010255361363685457', //Id da categoria
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: ["ViewChannel"]
            },
            {
              id: interaction.user.id,
              allow: ["ViewChannel", "SendMessages", "AddReactions", "AttachFiles"]
            },
            {
              id: cargostaff,
              allow: ["ViewChannel", "SendMessages", "AddReactions", "AttachFiles", "ManageMessages"]
            }
          ]
        }).then(ca => {

          let direciandoaocanal = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
              .setLabel(`Ticket`)
              .setEmoji(`🎫`)
              .setStyle(5)
              .setURL(`https://discord.com/channels/${interaction.guild.id}/${ca.id}`)
          )
          let newTicket = new Discord.EmbedBuilder()
            .setDescription(`${interaction.user} **Um novo ticket foi aberto: ${ca}!**`)
            .setColor('Random')

          interaction.reply({ embeds: [newTicket], components: [direciandoaocanal], ephemeral: true })


          let embed = new Discord.EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setDescription(`${interaction.user} *Seja bem vindo(a) ao meu sistema de ticket, aguarde os staffs entrarem em contato contigo, após a conduta fechar o ticket com: \`🗑\`*`);

          const b1 = new Discord.ButtonBuilder()
            .setCustomId("closet")
            .setEmoji("🗑")
            .setStyle(4)
          let botao = new Discord.ActionRowBuilder().addComponents(b1);

          ca.send({ content: `**🔔 - <@&${cargostaff}>**`, embeds: [embed], components: [botao] }).then(msg => msg.pin())
          ca.send(`${interaction.user}`).then(msg => setTimeout(msg.delete.bind(msg), 5000))
        })
      }

    } else if (interaction.customId === "closet") {
      let bye = new Discord.EmbedBuilder()
        .setDescription(`📤 **Plin plin, estarei fechando este ticket em: \`5 segundos\` .**`)
        .setColor('Random')
        
      interaction.reply({ embeds: [bye] }).then(() => {
        setTimeout(() => {
          interaction.channel.delete();
        }, 5000)
      })
    }
  }
});


//...........................................-> DropdownRoles <-...........................................//

client.on("interactionCreate", interaction => {
  if (interaction.isSelectMenu()) {
    let choice = interaction.values[0]
    let javascript = interaction.guild.roles.cache.get("1009937775631536139");
    let python = interaction.guild.roles.cache.get("1009937698175340605");
    let dbd = interaction.guild.roles.cache.get("1009937494420238396");
    let html = interaction.guild.roles.cache.get("1009937549025886328");
    let channel = client.channels.cache.get("1009938290159386744");
    const member = interaction.member

    //javascript
    if (choice == 'java_script') {
      if (member.roles.cache.some(role => role.id == javascript)) {
        channel.send({
          embeds: [
            new Discord.EmbedBuilder()
              .setDescription(`❌ *| ${interaction.user} removeu seu cargo ${javascript}*`)
              .setColor('Red')
              .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dinamyc: true }) })
          ],
        })
        interaction.reply({ content: `❌ | *${interaction.user}, Removi o cargo ${javascript} de você com sucesso!*`, ephemeral: true })
        member.roles.remove(javascript)
      }
      else {
        channel.send({
          embeds: [
            new Discord.EmbedBuilder()
              .setDescription(`✅ | ${interaction.member} **Resgatou o cargo** ${javascript}`)
              .setTimestamp()
              .setColor('Green')
              .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
          ]
        })
        member.roles.add(javascript)
        interaction.reply({ content: `✅ | *${interaction.user}, Adicionei o cargo ${javascript} em você com sucesso!*`, ephemeral: true })
      }
    }

    //html
    if (choice == 'web') {
      if (member.roles.cache.some(role => role.id == html)) {
        channel.send({
          embeds: [
            new Discord.EmbedBuilder()
              .setDescription(`❌ *| ${interaction.user} removeu seu cargo ${html}*`)
              .setColor('Red')
              .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dinamyc: true }) })
          ],
        })
        interaction.reply({ content: `❌  | *${interaction.user}, Removi o cargo ${html} de você com sucesso!*`, ephemeral: true })
        member.roles.remove(html)
      }
      else {
        channel.send({
          embeds: [
            new Discord.EmbedBuilder()
              .setDescription(`✅ | ${interaction.member} **Resgatou o cargo** ${html}`)
              .setTimestamp()
              .setColor('Green')
              .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
          ]
        })
        member.roles.add(html)
        interaction.reply({ content: `✅ | *${interaction.user}, Adicionei o cargo ${html} em você com sucesso!*`, ephemeral: true })
      }
    }

    //dbd
    if (choice == 'dbd') {
      if (member.roles.cache.some(role => role.id == dbd)) {
        channel.send({
          embeds: [
            new Discord.EmbedBuilder()
              .setDescription(`❌ *| ${interaction.user} removeu seu cargo ${dbd}*`)
              .setColor('Red')
              .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dinamyc: true }) })
          ],
        })
        interaction.reply({ content: `❌  | *${interaction.user}, Removi o cargo ${dbd} de você com sucesso!*`, ephemeral: true })
        member.roles.remove(dbd)
      }
      else {
        channel.send({
          embeds: [
            new Discord.EmbedBuilder()
              .setDescription(`✅ | ${interaction.member} **Resgatou o cargo** ${dbd}`)
              .setTimestamp()
              .setColor('Green')
              .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
          ]
        })
        member.roles.add(dbd)
        interaction.reply({ content: `✅ | *${interaction.user}, Adicionei o cargo ${dbd} em você com sucesso!*`, ephemeral: true })
      }
    }

    //python
    if (choice == 'python') {
      if (member.roles.cache.some(role => role.id == python)) {
        channel.send({
          embeds: [
            new Discord.EmbedBuilder()
              .setDescription(`❌ *| ${interaction.user} removeu seu cargo ${python}*`)
              .setColor('Red')
              .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dinamyc: true }) })
          ],
        })
        interaction.reply({ content: `❌  | *${interaction.user}, Removi o cargo ${python} de você com sucesso!*`, ephemeral: true })
        member.roles.remove(python)
      }
      else {
        channel.send({
          embeds: [
            new Discord.EmbedBuilder()
              .setDescription(`✅ | ${interaction.member} **Resgatou o cargo** ${python}`)
              .setTimestamp()
              .setColor('Green')
              .setFooter({ text: `${interaction.member.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
          ]
        })
        member.roles.add(python)
        interaction.reply({ content: `✅ | *${interaction.user}, Adicionei o cargo ${python} em você com sucesso!*`, ephemeral: true })
      }
    }
  }
})