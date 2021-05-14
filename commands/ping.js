const discord = require('discord.js');
const client = new discord.Client();

module.exports = {
    name: 'ping',
    args: false,
    execute(message) {
		message.channel.send('Loading data').then (async (msg) =>{
			msg.delete()
			message.channel.send(`Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
        })
    }
});
