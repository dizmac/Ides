module.exports = {
    name: 'ping',
    args: false,
    execute(message, args, client) {
        message.channel.send(`Response Latency: ${Date.now() - message.createdTimestamp}ms.\nWebsocket Latency: ${client.ws.ping}ms`);
    }
};
