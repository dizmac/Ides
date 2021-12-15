const Discord = require('discord.js');

module.exports = {
    success: (feedback) => {
        return new Discord.MessageEmbed()
            .setTitle('`200` | Success')
            .setDescription(feedback)
            .setColor('#00FF00')
            .setTimestamp()
    },
    badRequest: (feedback) => {
        return new Discord.MessageEmbed()
            .setTitle('`400` | Bad Request')
            .setDescription(feedback)
            .setColor('#FF0000')
            .setTimestamp()
    },
    unauthorized: (feedback) => {
        return new Discord.MessageEmbed()
            .setTitle('`401` | Bad Request')
            .setDescription(feedback)
            .setColor('#FF0000')
            .setTimestamp()
    },
    forbidden: (feedback) => {
        return new Discord.MessageEmbed()
            .setTitle('`403` | Forbidden')
            .setDescription(feedback)
            .setColor('#FF0000')
            .setTimestamp()
    },
    serverError: (feedback) => {
        return new Discord.MessageEmbed()
            .setTitle('`500` | Bad Request')
            .setDescription(feedback)
            .setColor('#FF0000')
            .setTimestamp()
    }
}