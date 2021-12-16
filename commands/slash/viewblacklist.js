const Discord = require('discord.js');
const database = require('../../utility/database');
const member = require('../../utility/member');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
    name: 'viewblacklist',
    aliases: ['vb', 'vblacklist', 'bi', 'binfo', 'blacklistinfo'],
    args: false,
    permissions: 'MANAGE_MESSAGES',
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('viewblacklist')
        .setDescription('Views a user\'s or all blacklists of this guild')
        .addUserOption(option => option
            .setName('target')
            .setDescription('View the user\'s blacklist status')),
    async execute(interaction) {

        const { options, guild } = interaction;

        const target = options.getUser('target');
        const guild_id = guild.id;

        const embed = new Discord.MessageEmbed().setTitle('Blacklist').setColor('#FF0000').setAuthor('Ides', 'https://cdn.discordapp.com/avatars/841148794498580480/148535dbc855f1468b7dff5dc00f48dd.png?size=256');

        if (target == null) {
            embed.setDescription('Here is a list of blacklisted users for this guild!');
            database.getBlacklist(guild_id, 'user_id').then(async res => {
                for (let i = 0; i < res.length; i++) {
                    embed.addField(`User #${i + 1}`, `${await member.fetch(interaction, res[i].user_id)}`, false);
                }
            })
            await interaction.editReply({ embeds: [embed] });

        } else {
            database.getBlacklist(guild_id, target.id).then(async res => {
                const user = await member.fetch(interaction, target.id), exists = res.length !== 0;

                embed.setDescription(`Blacklist information for ${user}`);
                embed.addField('canBlacklist', user.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || developerIDs.includes(user.id) ? 'True' : 'False');
                embed.addField('isBlacklisted', exists ? 'True' : 'False');
                embed.addField('blacklistReason', exists ? res[0].blacklist_reason : 'None', false);
                await interaction.editReply({ embeds: [embed] });
            })
        }
    }
}
