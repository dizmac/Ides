const Discord = require('discord.js');
const utc = require('dayjs/plugin/utc');
const RelativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs').extend(utc).extend(RelativeTime);

module.exports = {
    create(data, division, name, date, type) {
        if (type === 'schedule') {
            return new Discord.MessageEmbed()
                .setAuthor(name, process.env[`${division}_ICON`])
                .setColor(data.EventColor)
                .addField('Time', `${date.format('ddd, MMMM D')} at ${date.format('h:mm A')} UTC`, false)
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