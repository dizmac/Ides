const { Permissions } = require('discord.js');
const database = require('../utility/database');
const status = require('../utility/status');


module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        const { client, guild, user, member } = interaction;

        let blacklisted;

        await interaction.deferReply({ ephemeral: true });

        if (interaction.isCommand()) {
            const command = client.slashCommands.get(interaction.commandName), root = user.id === '336079549613867008';

            if (!member.permissions.has(Permissions.FLAGS[command.permission])) return await interaction.editReply({ embeds: [status.unauthorized(`You lack the required permissions to run this command! (\`${command.permissions}\`)`)], ephemeral: true })

            await database.getBlacklist(guild.id, user.id).then(res => {
                if (res.length > 0) blacklisted = true;
            })

            if (blacklisted && !root) return interaction.editReply({ embeds: [status.forbidden('You are blacklisted from the bot in this guild! You can not run commands here!')], ephemeral: true })

            try {
                await command.execute(interaction, client, root)
            } catch {
                return interaction.editReply({ embeds: [status.serverError('Something went wrong while processing your request!')] })
            }
        }
    }
}