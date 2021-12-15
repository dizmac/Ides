const notifier = require('../utility/notifier');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('[DISCORD.JS] Ready!');
        await notifier.init(client);
        console.log('-----------')
    }
}