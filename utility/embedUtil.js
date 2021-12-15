require('dotenv').config();
const Discord = require('discord.js');
const utc = require('dayjs/plugin/utc');
const RelativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs').extend(utc).extend(RelativeTime);

module.exports = {
    create: (data, division, name, date, type) => {
        if (type === 'noEvents') {
            return new Discord.MessageEmbed()
                .setAuthor('Ides', 'https://cdn.discordapp.com/avatars/841148794498580480/148535dbc855f1468b7dff5dc00f48dd.png?size=256')
                .setTitle(`No events available for ${division}!`)
                .setTimestamp();
        }
        if (type === 'schedule') {
            return new Discord.MessageEmbed()
                .setAuthor(name, process.env[`${division}_ICON`])
                .setColor(data.EventColor)
                .addField('Time', `**UTC Time**: ${date.format('ddd, MMMM D')} at ${date.format('h:mm A')}\n**Local Time**: <t:${data.Time}:F>`, false)
                .addField('Host', data.Trainer, false)
                .addField('Duration', `${data.Duration} Minutes`, false)
                .addField('Notes', data.Notes, false)
                .addField('Event Type', data.EventType, false)
                .setFooter(data.TrainingID)
                .setTimestamp();
        } else {
            const cDate = dayjs().utc();
            return new Discord.MessageEmbed()
                .setAuthor(name, process.env[`${division}_ICON`])
                .setColor(data.EventColor)
                .setDescription(`The next event is a ${data.EventType} in ${date.diff(cDate, 'd')%31}d ${Math.abs(cDate.diff(date, 'h'))%24}h ${date.diff(cDate, 'm')%60}m ${date.diff(cDate, 's')%60}s`).setTimestamp();
        }

    }
}