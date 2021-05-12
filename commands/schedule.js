const Cache = require('../cache');
const utc = require('dayjs/plugin/utc');
const embedUtil = require('../embedUtil');
const math = require('mathjs')
const dayjs = require('dayjs').extend(utc);


module.exports = {
    name: 'schedule',
    aliases: ['s'],
    args: true,
    execute(message, args) {
        const division = args[0].toUpperCase(), data = Cache.getCache(division), name = division === 'PBST' ? 'Security' : division === 'TMS' ? 'Syndicate' : division === 'PET' ? 'Emergency' : 'Media';
        let num, counter = 0;

        if (args[1] === '0') return message.channel.send('Such emptiness.');

        num = args[1] && args[1].toLowerCase() !== 'all' ? Math.floor(math.evaluate(args[1])) : data.length + 1;

        if (num < 0) return message.channel.send('**Negative events!** :zany_face:')


        message.channel.send(
            `There are ${data.length} events scheduled for ${division}!` +
            `${num !== data.length+1 ? `\n**Only showing up to ${num} event` +
                `${num > 1 ? 's' : ''}!**` : ''}`
        );

        for (const d of data) {
            if (counter === num) return; counter++;
            const date = dayjs.unix(d.Time).utc();
            message.channel.send(embedUtil.create(d, division, name, date, 'schedule'));
        }
    }
}
