const Discord = require('discord.js');
const fs = require('fs');
const Cache = require('./cache');
const { prefix } = require('./config.json');
const client = new Discord.Client();

require('dotenv').config(); Cache.init();


client.commands = new Discord.Collection();

client.once('ready', () => console.log("Ready!"));
client.login(process.env.TOKEN).then(() => console.log("Logged in!"));

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}


client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.args && !args.length) {
        return message.reply("You are missing the critical argument(s)!");
    }

    try {
        command.execute(message, args);
    } catch (error) {
        // return message.channel.send('Invalid Division!');
        console.log(error)
    }

})

