const Discord = require('discord.js');
const fs = require('fs');

const Cache = require('./utility/cache');
const database = require('./utility/database');
const notifier = require('./utility/notifier');
const { prefix } = require('./config.json');
const client = new Discord.Client();

require('dotenv').config(); database.connect(); Cache.init(); globalThis.developerIDs = ['336079549613867008', '700771513774768189'];


client.commands = new Discord.Collection(); client.cooldowns = new Discord.Collection();

const { cooldowns } = client;

client.once('ready', () => {console.log("[DISCORD.JS] Ready!"); notifier.init(client)});
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
    const root = message.author.id === '336079549613867008';

    if (!command) return;

    let blacklisted = false;

    await database.getBlacklist(message.guild.id, message.author.id).then(res => {
        if (res.length > 0) blacklisted = true;
    })
    if (message.content.includes("@")) return message.channel.send("Try to run the command again, but with less trolling!");
    if (!root && blacklisted) return message.channel.send('You are blacklisted from the bot in this guild! You can not run commands here!');

    if (command.args && !args.length) return message.reply("You must include a division!");

    if (!client.cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());

    const now = Date.now(), timestamps = cooldowns.get(command.name), cooldownAmount = (command.cooldown || 2) * 1000;

    if (!developerIDs.includes(message.author.id) && timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) return message.reply(`Please wait ${((expirationTime - now) / 1000).toFixed()} more second(s) before reusing the \'${command.name}\' command.`);
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


    try {
        command.execute(message, args, client, root);
    } catch (error) {
        return message.channel.send('Invalid Argument(s)!');
    }
})

