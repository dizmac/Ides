const Cache = require('../../utility/cache');
const utc = require('dayjs/plugin/utc');
const embedUtil = require('../../utility/embedUtil');
const math = require('mathjs');
const dayjs = require('dayjs').extend(utc);


module.exports = {
    name: 'schedule',
    aliases: ['s'],
    cooldown: 60,
    permissions: 'SEND_MESSAGES',
    args: true,
    execute(message, args) {
        const division = args[0].toUpperCase();
        let num, host, counter = 0, data = Cache.getCache(division), eventCount = data.length, embeds = [];


        num = args[1] && args[1].toLowerCase() !== 'all' ? Math.floor(math.evaluate(args[1])) : data.length + 1;

        if (args[1] !== 'all' && num <= 0 || num > 10) return message.reply({ content: '400 | Bad Request'});



        message.channel.send({
                content: `There are ${eventCount} events scheduled for ${division}!` +
                    `${num && num !== data.length + 1 ? `\n**Only showing up to ${num} event` + `${num > 1 ? 's' : ''}!**` :
                        host ? `\nOnly showing **${host}**'s events! (Showing **${data.length}** event${data.length > 1 ? 's' : ''}!)` : ''}`
            }
        );

        for (const d of data) {

            if (counter === num) return message.channel.send({ embeds: embeds });

            if (counter >= 10 && counter % 10 === 0) {
                message.channel.send({ embeds: embeds });
                embeds = [];
            }

            const name = d.Division === 'PBST' ? 'Security' : d.Division === 'TMS' ? 'Syndicate' : d.Division === 'PET' ? 'Emergency' : 'Media';


            embeds.push(embedUtil.create(d, division, name, dayjs.unix(d.Time).utc(), 'schedule'));
            counter++;
        }
    }
}
