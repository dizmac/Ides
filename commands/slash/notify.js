const database = require('../../utility/database');
const cache = require('../../utility/cache');
const notifier = require('../../utility/notifier');
const embedUtil = require('../../utility/embedUtil');
const status = require('../../utility/status');
const { SlashCommandBuilder } = require("@discordjs/builders");
const utc = require('dayjs/plugin/utc');
const dayjs = require('dayjs').extend(utc);

module.exports = {
    name: 'notify',
    permissions: 'SEND_MESSAGES',
    data: new SlashCommandBuilder()
        .setName('notify')
        .setDescription('Set up a notification for the event')
        .addStringOption(option => option
            .setName('event_id')
            .setDescription('The ID of the event to get notified about')
            .setRequired(true)),
    async execute(interaction) {
        const { options, user } = interaction, id = options.getString('event_id')

        const data = cache.getCache('Global');

        for (const event of data) {
            if (id === event.TrainingID) {
                const data = await database.getNotification(), offset = event.Time * 1000 - Date.now();

                let exists = false;

                data.forEach(x => {
                    if (user.id === x.user_id && event.TrainingID === x.trello_id)
                        return exists = true;
                })

                if (exists) return interaction.editReply({ embeds: [status.badRequest(`You already have a notification set up for the event \`${event.TrainingID}\``)], ephemeral: true });
                if (offset <= 0) return interaction.editReply({ embeds: [status.badRequest(`The start of event \`${event.TrainingID}\` has already passed!`)], ephemeral: true })


                database.addNotification(user.id, event.Time, event.TrainingID).then(() => {
                    notifier.newTimer(offset, event.TrainingID, user);
                    const date = dayjs.unix(event.Time).utc(), name = event.Division === 'PBST' ? 'Security' : event.Division === 'TMS' ? 'Syndicate' : event.Division === 'PET' ? 'Emergency' : 'Media';
                    return interaction.editReply({ content: `200 | Notification set for event \`${event.TrainingID}\`! You will be notified when the event starts. (The event may be expedited or delayed, refer to the host for the actual starting time!)`, ephemeral: true, embeds: [embedUtil.create(event, event.Division, name, date, 'schedule')] });
                }).catch((e) => console.log(e));
            }
        }
    }
}