const database = require('../utility/database');

module.exports = {
    name: 'unblacklist',
    aliases: ['ub', 'ublacklist'],
    args: false,
    cooldown: 10,
    execute(message) {
        if (!message.member.hasPermission("MANAGE_MESSAGES") && !globalThis.authorized.includes(message.author.id))
            return message.channel.send('**Insufficient Permission!**\nYou must be a **bot administrator** or have the **"MANAGE_MESSAGES"** permission!');

        const target = message.mentions.members.first();
        const guild_id = message.guild.id;

        if (!target) return message.channel.send('Please mention a user that you want to remove from the blacklist!');

        message.channel.send(`Removing the user from the blacklist for this guild (**${guild_id}**)!`);

        database.remove(guild_id, target.id).then((r) => {
            if (r) message.channel.send(`Successfully removed ${target.displayName} from the command blacklist!`);
            else message.channel.send('Something went wrong while removing the user from the command blacklist.');
        });
    }
}
