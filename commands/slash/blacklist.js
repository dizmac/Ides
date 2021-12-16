const database = require('../../utility/database');
const status = require('../../utility/status');
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    name: 'blacklist',
    permissions: 'MANAGE_MESSAGES',
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Blacklists users')
        .addUserOption(option => option
            .setName('target')
            .setDescription('Target user to blacklist')
            .setRequired(true))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason of the blacklist')
            .setRequired(true)),

    async execute(interaction, client, isRoot) {
        const { options, guild, author } = interaction;

        const target = options.getUser('target');
        const guild_id = guild.id;
        let reason = options.getString('reason');

        if (!isRoot) {
            if (target.id === author.id) return interaction.editReply({ embeds: [status.badRequest('You can\'t blacklist yourself!')], ephemeral: true });
            if (developerIDs.includes(target.id)) return interaction.editReply({ embeds: [status.forbidden('Forbidden')], ephemeral: true });
        }

        await interaction.editReply({ content: `Adding the user to the blacklist for this guild (**${guild_id}**)!`, ephemeral: true });

        database.addBlacklist(guild_id, target.id, reason).then((r) => {
            if (r) interaction.editReply({ embeds: [status.success(`Successfully added ${target.username} to the command blacklist!`)], ephemeral: true });
            else interaction.editReply({ embeds: [status.serverError('Something went wrong while adding the user to the command blacklist.')], ephemeral: true });
        });
    }
}
