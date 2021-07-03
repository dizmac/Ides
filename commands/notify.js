const database = require('../utility/database');
const cache = require('../utility/cache');
const notifier = require('../utility/notifier');

module.exports = {
    name: 'notify',
    aliases: ['n', 'notification'],
    args: true,
    cooldown: 3600,
    async execute(message, args) {
        const array = []; array.push(cache.getCache('PBST')); array.push(cache.getCache('TMS')); array.push(cache.getCache('PET')); array.push(cache.getCache('PBM'));

        for (const eventParent of array) {
            for (const event of eventParent) {
                if (args[0] === event.TrainingID) {
                    const data = await database.getNotification(), offset = event.Time * 1000 - Date.now();
                    let exists = false;
                    data.forEach(x => {
                        if (message.author.id === x.user_id && event.TrainingID === x.trello_id)
                            return exists = true;
                    })

                    if (exists) return message.channel.send(`You already have a notification set up for the event \`${event.TrainingID}\``);
                    if (offset <= 0) return message.channel.send(`The start of event \`${event.TrainingID}\` has already passed!`)


                    database.addNotification(message.author.id, event.Time, event.TrainingID).then(() => {
                        notifier.newTimer(offset, event.TrainingID, message.author);
                        message.channel.send(`Notification set for event \`${event.TrainingID}\`! You will be notified when the event starts. (The event may or may not start early, refer to raid-alerts for the actual starting time!)`);
                    }).catch(() => message.channel.send('Something went wrong while adding your notification!'));
                }
            }
        }
    }
}
