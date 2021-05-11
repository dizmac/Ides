const Cache = require('../cache');
const utc = require('dayjs/plugin/utc');
const embedUtil = require('../embedUtil');
const dayjs = require('dayjs').extend(utc);

module.exports = {
    name: 'nextEvent',
    aliases: ['ne'],
    args: true,
    execute(message, args) {
        const division = args[0].toUpperCase(),
            data = Cache.getCache(division),
            nextEvent = data[Object.keys(data)[0]],
            date = dayjs.unix(nextEvent.Time).utc(),
            name = division === 'PBST' ? 'Security' : division === 'TMS' ? 'Syndicate' : division === 'PET' ? 'Emergency' : 'Media';
        message.channel.send(embedUtil.create(nextEvent, division, name, date, 'nextEvent'));
        message.channel.send(embedUtil.create(nextEvent, division, name, date, 'schedule'));
    }
}