require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const token  = process.env.TOKEN;
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));

const clientId = '841148794498580480';
const guildId = '841327655830814721';

for (const file of commandFiles) {
    const command = require(`../commands/slash/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);


module.exports = {
    run: async () => {
        try {
            console.log('Started refreshing application (/) commands.');


            /*
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );
            */

            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );

            console.log('Successfully reloaded application (/) commands.\n-----------');

        } catch (error) {
            console.error(error);
        }
    }
}
