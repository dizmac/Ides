const database = require('../utility/database');

module.exports = {
    name: 'blacklist',
    aliases: ['b'],
    args: false,
    cooldown: 10,
    execute(message, args, client, isRoot) {
        if (!message.member.hasPermission("MANAGE_MESSAGES") && !developerIDs.includes(message.author.id))
            return message.channel.send('**Insufficient Permission!**\nYou must be a bot administrator or have "MANAGE_MESSAGES" permission!');

        const target = message.mentions.members.first();
        const guild_id = message.guild.id;
        const reason = args[1];
        console.log(reason)

        if (!target || !reason) return message.channel.send('Please supply the required arguments!');
        if (!isRoot) {
            if (target.id === message.author.id) return message.channel.send('You can not blacklist yourself...:pensive:')
            if (developerIDs.includes(target.id)) return message.channel.send('You can not blacklist the bot developers!')
        }
        message.channel.send(`Adding the user to the blacklist for this guild (**${guild_id}**)!`);

        database.addBlacklist(guild_id, target.id, reason).then((r) => {
            if (r) message.channel.send(`Successfully added ${target.displayName} to the command blacklist!`);
            else message.channel.send('Something went wrong while adding the user to the command blacklist.');
        });
    }
}
