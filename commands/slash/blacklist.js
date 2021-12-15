const database = require('../../utility/database');
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
        console.log(target)
        const guild_id = guild.id;
        let reason = options.getString('reason');

        if (!isRoot) {
            if (target.id === author.id) return interaction.editReply({ content: '400 | Bad Request', ephemeral: true })
            if (developerIDs.includes(target.id)) return interaction.editReply({ content: '403 | Forbidden', ephemeral: true })
        }

        await interaction.editReply({ content: `Adding the user to the blacklist for this guild (**${guild_id}**)!`, ephemeral: true });

        database.addBlacklist(guild_id, target.id, reason).then((r) => {
            if (r) interaction.editReply({ content: `200 | Successfully added ${target.username} to the command blacklist!`, ephemeral: true });
            else interaction.editReply({ content: '500 | Something went wrong while adding the user to the command blacklist.', ephemeral: true });
        });
    }
}
