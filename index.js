const Discord = require('discord.js');
const fs = require('fs');

const Cache = require('./utility/cache');
const database = require('./utility/database');
const builder = require('./utility/builder');
const { Intents } = require('discord.js');
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

require('dotenv').config(); globalThis.developerIDs = ['336079549613867008'];

(async () => {
    await builder.run(); await database.connect(); Cache.init(); client.login(process.env.TOKEN).then(() => console.log("[DISCORD.JS] Logged in!"));
})();

client.messageCommands = new Discord.Collection(); client.slashCommands = new Discord.Collection(); client.cooldowns = new Discord.Collection();

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const messageCommandFiles = fs.readdirSync('./commands/message').filter(file => file.endsWith('.js'));
const slashCommandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

for (const file of messageCommandFiles) {
    const command = require(`./commands/message/${file}`);

    client.messageCommands.set(command.name, command);
}
for (const file of slashCommandFiles) {
    const command = require(`./commands/slash/${file}`);

    client.slashCommands.set(command.name, command);
}
