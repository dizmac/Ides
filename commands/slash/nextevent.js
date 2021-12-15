const Cache = require('../../utility/cache');
const utc = require('dayjs/plugin/utc');
const embedUtil = require('../../utility/embedUtil');
const { SlashCommandBuilder } = require('@discordjs/builders');
const dayjs = require('dayjs').extend(utc);

module.exports = {
    name: 'nextevent',
    permissions: 'SEND_MESSAGES',
    data: new SlashCommandBuilder()
        .setName('nextevent')
        .setDescription('Views the next event')
        .addStringOption(option => option
            .setName('division')
            .setDescription('Division for the next event')
            .setRequired(true)
            .addChoice('Security', 'PBST')
            .addChoice('Syndicate', 'TMS')
            .addChoice('Emergency', 'PET')
            .addChoice('Media', 'PBM')
            .addChoice('Global', 'Global')),
    execute(interaction) {

        const { options } = interaction;

        const division = options.getString('division'),
            data = Cache.getCache(division),
            nextEvent = data[Object.keys(data)[0]];
        if (!nextEvent) return interaction.editReply({ embeds: [embedUtil.create('', division, '', '', 'noEvents')] });

        const date = dayjs.unix(nextEvent.Time).utc(),
            name = nextEvent.Division === 'PBST' ? 'Security' : nextEvent.Division === 'TMS' ? 'Syndicate' : nextEvent.Division === 'PET' ? 'Emergency' : 'Media';

        return interaction.editReply({ embeds: [embedUtil.create(nextEvent, nextEvent.Division, name, date, 'nextEvent'), embedUtil.create(nextEvent, nextEvent.Division, name, date, 'schedule')] });
    }
}
