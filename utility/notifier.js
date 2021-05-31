const database = require('./database');

const Timer = (timestamp, tid, user) => setTimeout(() => database.removeNotification(user.id, tid).then(() => user.send(`The event the ID ${tid} has begun!`)), timestamp);

module.exports = {
    init: async (client) => {
        const data = await database.getNotification();
        for (const notification of data) {
            const user = await client.users.fetch(notification.user_id), trello_id = notification.trello_id;
            console.log(user);
            const timestamp = parseInt(notification.time_stamp);

            if (timestamp - Date.now()/1000 < 0) return database.removeNotification(user.id, trello_id);
            Timer(timestamp, trello_id, user);
        }
    },
    newTimer: (timestamp, tid, user) => Timer(timestamp, tid, user)

}

