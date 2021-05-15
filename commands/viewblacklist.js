const Discord = require('discord.js');
const database = require('../utility/database');
const member = require('../utility/member');
const authorized = ['336079549613867008', '700771513774768189'];

module.exports = {
    name: 'viewblacklist',
    aliases: ['vb', 'vblacklist', 'bi', 'binfo', 'blacklistinfo'],
    args: false,
    execute(message, args) {
        if (!message.member.hasPermission("MANAGE_MESSAGES") && !authorized.includes(message.author.id))
            return message.channel.send('**Insufficient Permission!**\nYou must be a bot administrator or have "MANAGE_MESSAGES" permission!');

        const embed = new Discord.MessageEmbed().setTitle('Blacklist').setColor('#FF0000').setAuthor('Ides', 'https://cdn.discordapp.com/avatars/841148794498580480/148535dbc855f1468b7dff5dc00f48dd.png?size=256');

        if (args.length === 0) {
            embed.setDescription('Here is a list of blacklisted users for this guild!');
            database.get(message.guild.id, 'user_id').then(async res => {
                for (let i = 0; i < res.length; i++) {
                    embed.addField(`User #${i + 1}`, `${await member.fetch(message, res[i].user_id)}`, false);
                }
                await message.channel.send(embed);
            })
        } else {
            if (isNaN(parseInt(args[0]))) return message.channel.send('Invalid User ID!');

            database.get(message.guild.id, args[0]).then(async res => {
                const target = await member.fetch(message, args[0]);
                embed.setDescription(`Blacklist information for ${target}`);
                embed.addField('canBlacklist', target.hasPermission('MANAGE_MESSAGES') || authorized.includes(target.id) ? 'True' : 'False');
                embed.addField('isBlacklisted', res.length !== 0 ? 'True' : 'False');
                await message.channel.send(embed);
            })
        }
    }
}