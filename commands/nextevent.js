const Cache = require('../utility/cache');
const utc = require('dayjs/plugin/utc');
const embedUtil = require('../utility/embedUtil');
const dayjs = require('dayjs').extend(utc);

module.exports = {
    name: 'nextEvent',
    aliases: ['ne'],
    cooldown: 5,
    args: true,
    execute(message, args) {
        const division = args[0].toUpperCase(),
            data = Cache.getCache(division),
            nextEvent = data[Object.keys(data)[0]];
        if (!nextEvent) return message.channel.send(embedUtil.create('', division, '', '', 'noEvents'));

        const date = dayjs.unix(nextEvent.Time).utc(),
            name = division === 'PBST' ? 'Security' : division === 'TMS' ? 'Syndicate' : division === 'PET' ? 'Emergency' : 'Media';

        message.channel.send(embedUtil.create(nextEvent, division, name, date, 'nextEvent'));
        message.channel.send(embedUtil.create(nextEvent, division, name, date, 'schedule'));
    }
}
