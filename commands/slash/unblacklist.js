const database = require('../../utility/database');
const status = require('../../utility/status');
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    name: 'unblacklist',
    permissions: 'MANAGE_MESSAGES',
    data: new SlashCommandBuilder()
        .setName('unblacklist')
        .setDescription('Removes a user from the guild blacklist')
        .addUserOption(option => option
            .setName('target')
            .setDescription('Target user to remove from the blacklist')
            .setRequired(true)),
    async execute(interaction) {

        const { options, guild } = interaction;

        const target = options.getUser('target');
        const guild_id = guild.id;

        await interaction.editReply({ content: `Removing the user from the blacklist for this guild (**${guild_id}**)!`, ephemeral: true });

        database.removeBlacklist(guild_id, target.id).then((r) => {
            if (r) interaction.editReply({ embeds: [status.success(`Successfully removed ${target.username} from the command blacklist!`)], ephemeral: true });
            else interaction.editReply({ embeds: [status.badRequest('Something went wrong while removing the user from the command blacklist.')], ephemeral: true });
        });
    }
}
