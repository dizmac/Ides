const Cache = require('../../utility/cache');
const filter = require('../../utility/filter');
const utc = require('dayjs/plugin/utc');
const embedUtil = require('../../utility/embedUtil');
const { SlashCommandBuilder } = require("@discordjs/builders");
const dayjs = require('dayjs').extend(utc);


module.exports = {
    name: 'schedule',
    permissions: 'SEND_MESSAGES',
    data: new SlashCommandBuilder()
        .setName('schedule')
        .setDescription('Views a division\'s or the global schedule')
        .addStringOption(option => option.setName('division')
            .setDescription('The division\'s schedule to see')
            .setRequired(true)
            .addChoice('Security', 'PBST')
            .addChoice('Syndicate', 'TMS')
            .addChoice('Emergency', 'PET')
            .addChoice('Media', 'PBM')
            .addChoice('Global', 'Global'))
        .addIntegerOption(option => option.setName('limit')
            .setDescription('How many events are shown for this query (Max: 10; Use s!schedule to view more (infinite) events!)')
            .setRequired(true))
        .addStringOption(option => option.setName('host').setDescription('Host of the event')),
    async execute(interaction) {
        const { options } = interaction;

        const division = options.getString('division');
        let num = options.getInteger('limit'), host = options.getString('host'), counter = 0, data = Cache.getCache(division), eventCount = data.length, embeds = [];

        if (num <= 0 || num > 10) return interaction.reply({ content: '400 | Bad Request', ephemeral: true });

        if (host !== null) {
            data = filter.filterHost(data, host);
        }

        for (const d of data) {
            if (counter === num) break;
            counter++;
            const date = dayjs.unix(d.Time).utc(), name = d.Division === 'PBST' ? 'Security' : d.Division === 'TMS' ? 'Syndicate' : d.Division === 'PET' ? 'Emergency' : 'Media';

            embeds.push(embedUtil.create(d, d.Division, name, date, 'schedule'));
        }

        await interaction.editReply({ content: `There are ${eventCount} events scheduled for ${division === 'Global' ? 'the Global schedule' : division}!` +
                `${host ? `\nOnly showing **${host}**'s events! (Showing **${data.length}** event${data.length > 1 ? 's' : ''})` :
                    num && num !== data.length + 1 ? `\n**Only showing up to ${num} event${num > 1 ? 's' : ''}!**` : ''}`, embeds: embeds, ephemeral: true})
    }
}
