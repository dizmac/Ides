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

        
        num = args[1] && division !== 'all' ? parseInt(args[1]) : -1;


        for (const d of data) {
            if (counter === num) return; counter++;
            const name = division === 'PBST' ? 'Security' : division === 'TMS' ? 'Syndicate' : division === 'PET' ? 'Emergency' : 'Media',
                date = dayjs.unix(d.Time).utc(),
                embed = embedUtil.create(d, division, name, date, 'schedule');
            message.channel.send(embed);
        }
    }
}