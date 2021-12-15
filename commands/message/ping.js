module.exports = {
    name: 'ping',
    permissions: 'SEND_MESSAGES',
    args: false,
    execute(message, args, client) {
        message.reply({ content: `Response Latency: ${Date.now() - message.createdTimestamp}ms\nWebsocket Latency: ${client.ws.ping}ms` });
    }
};
