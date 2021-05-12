const Cache = require('../cache');
const utc = require('dayjs/plugin/utc');
const embedUtil = require('../embedUtil');
const dayjs = require('dayjs').extend(utc);


module.exports = {
    name: 'schedule',
    aliases: ['s'],
    args: true,
    execute(message, args) {
        const division = args[0].toUpperCase(), data = Cache.getCache(division);
        let num, counter = 0;

        if (args[1] === '0') {
            return message.channel.send('Such emptiness.');
        }


        num = args[1] && args[1].toLowerCase() !== 'all' ? parseInt(args[1]) : -1;

        message.channel.send(
            `There are ${data.length} events scheduled for ${division}!` +
            `${num !== -1 ? `\n**Only showing up to ${num} event` +
                `${num > 1 ? 's' : ''}!**` : ''}`
        );

        for (const d of data) {
            if (counter === num) return; counter++;
            const name = division === 'PBST' ? 'Security' : division === 'TMS' ? 'Syndicate' : division === 'PET' ? 'Emergency' : 'Media',
                date = dayjs.unix(d.Time).utc(),
                embed = embedUtil.create(d, division, name, date, 'schedule');
            message.channel.send(embed);
        }
    }
}
