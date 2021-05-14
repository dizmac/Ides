const Discord = require('discord.js');
const fs = require('fs');

const Cache = require('./utility/cache');
const database = require('./utility/database');
const { prefix } = require('./config.json');
const client = new Discord.Client();

require('dotenv').config(); database.connect(); Cache.init();

client.commands = new Discord.Collection();

client.once('ready', () => console.log("[DISCORD.JS] Ready!"));
client.login(process.env.TOKEN).then(() => console.log("[DISCORD.JS] Logged in!"));

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}


client.on('message', async message => {
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();


    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    let blacklisted = false;

    await database.get(message.guild.id, message.author.id).then(res => {
        if (res.length > 0) blacklisted = true;
    })

    if (blacklisted) return message.channel.send('You are blacklisted from the bot in this guild! You can not run commands here!');

    if (command.args && !args.length) {
        return message.reply("You must include a division!");
    }

    try {
        command.execute(message, args);
    } catch (error) {
        return message.channel.send('Invalid Argument(s)!');
    }

})

