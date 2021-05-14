const database = require('../utility/database');
const authorized = ['336079549613867008', '700771513774768189'];

module.exports = {
    name: 'blacklist',
    aliases: ['b'],
    args: false,
    execute(message) {
        if (!message.member.hasPermission("MANAGE_MESSAGES") && !authorized.includes(message.author.id))
            return message.channel.send('**Insufficient Permission!**\nYou must be a bot administrator or have "MANAGE_MESSAGES" permission!');

        const target = message.mentions.members.first();
        const guild_id = message.guild.id;

        if (!target) return message.channel.send('Please mention a user that you want to blacklist!');
        if (target.id === message.author.id) return message.channel.send('You can not blacklist yourself...:pensive:')
        if (authorized.includes(target.id)) return message.channel.send('You can not blacklist the bot developers!')

        message.channel.send(`Adding the user to the blacklist for this guild (**${guild_id}**)!`);

        database.add(guild_id, target.id).then((r) => {
            if (r) message.channel.send(`Successfully added ${target.displayName} to the command blacklist!`);
            else message.channel.send('Something went wrong while adding the user to the command blacklist.');
        });
    }
}