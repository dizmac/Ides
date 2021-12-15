const Discord = require('discord.js');

const { prefix } = require('../config.json');
const database = require('../utility/database');
const status = require('../utility/status');
const { Permissions } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        const { client, content, member, author } = message;

        const { cooldowns } = client;

        if (!content.toLowerCase().startsWith(prefix) || author.bot) return;

        const args = content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.messageCommands.get(commandName) || client.messageCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        const root = author.id === '336079549613867008';

        if (!command) return;

        let blacklisted = false;

        await database.getBlacklist(message.guild.id, author.id).then(res => {
            if (res.length > 0) blacklisted = true;
        })
        if (content.includes("@")) return message.reply({ embeds: [status.badRequest('You can not include a mention in your command!')] })
        if (!root && blacklisted) return message.reply({ embeds: [status.forbidden('You are blacklisted from the bot in this guild! You can not run commands here!')] });
        if (!member.permissions.has(Permissions.FLAGS[command.permissions]) && !root) return message.reply({ embeds: [status.unauthorized(`You lack the required permissions to run this command! (\`${command.permissions}\`)`)] });
        if (command.args && !args.length) return message.reply({ embeds: [status.badRequest('You must include the necessary arguments!')] });
        if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());

        const now = Date.now(), timestamps = cooldowns.get(command.name), cooldownAmount = (command.cooldown || 2) * 1000;

        if (!root && timestamps.has(author.id)) {
            const expirationTime = timestamps.get(author.id) + cooldownAmount;
            if (now < expirationTime) return message.reply({ embeds: [status.badRequest(`Please wait ${((expirationTime - now) / 1000).toFixed()} more second(s) before reusing the \'${command.name}\' command.`)] });
        }

        timestamps.set(author.id, now);
        setTimeout(() => timestamps.delete(author.id), cooldownAmount);


        try {
            command.execute(message, args, client, root);
        } catch (error) {
            console.log(error)
            return message.reply({ embeds: [status.serverError('Something went wrong while processing your request')] });
        }
    }
}