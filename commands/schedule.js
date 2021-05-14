const Cache = require('../utility/cache');
const filter = require('../utility/filter');
const utc = require('dayjs/plugin/utc');
const embedUtil = require('../embedUtil');
const math = require('mathjs');
const dayjs = require('dayjs').extend(utc);


module.exports = {
    name: 'schedule',
    aliases: ['s'],
    args: true,
    execute(message, args) {
        const division = args[0].toUpperCase(),
            name = division === 'PBST' ? 'Security' : division === 'TMS' ? 'Syndicate' : division === 'PET' ? 'Emergency' : 'Media';
        let num, host, counter = 0, data = Cache.getCache(division), eventCount = data.length;

        if (args[1] && args[1].startsWith('host=')) {
            host = args[1].split('=')[1];
            data = filter.filterHost(data, host);
        } else {
            num = args[1] && args[1].toLowerCase() !== 'all' ? Math.floor(math.evaluate(args[1])) : data.length + 1;
            if (args[1] === 9+10) num = 21
            if (num === 0 || args[1] === 'null') return message.channel.send('Such emptiness.');
            if (num < 0) return message.channel.send('**Negative events!** :zany_face:')
        }


        message.channel.send(
            `There are ${eventCount} events scheduled for ${division}!` +
            `${num && num !== data.length + 1 ? `\n**Only showing up to ${num} event` + `${num > 1 ? 's' : ''}!**` : 
                host ? `\nOnly showing **${host}**'s events! (Showing **${data.length}** event${data.length > 1 ? 's' : ''}!)` : ''}`
        );

        for (const d of data) {
            if (counter === num) return;
            counter++;
            const date = dayjs.unix(d.Time).utc();
            message.channel.send(embedUtil.create(d, division, name, date, 'schedule'));
        }
    }
}
