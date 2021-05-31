const sql = require('mssql');
const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE
};

module.exports = {
    connect: () => {
        sql.connect(config).then(() => console.log('[DATABASE] Connected!'));
    },
    getNotification: async () => {
        let promise = new Promise((resolve, reject) => {
            const request = new sql.Request();
            request.query(`SELECT * FROM notifications`, function(err, recordset) {
                if (err) reject(err);
                resolve(recordset.recordset);
            })
        })
        return await promise;
    },
    addNotification: async (uid, timestamp, tid) => {
        console.log(uid);
        console.log(timestamp);
        console.log(tid);

        let promise = new Promise((resolve, reject) => {
            const request = new sql.Request();
            request.query(`INSERT INTO notifications(user_id, time_stamp, trello_id) VALUES (${uid}, ${timestamp}, '${tid}')`, function(err) {
                if (err) reject(err);
                resolve(true);
            })
        })
        return await promise;
    },
    removeNotification: async (uid, tid) => {
        let promise = new Promise((resolve, reject) => {
            const request = new sql.Request();
            request.query(`DELETE FROM notifications WHERE user_id=${uid} AND trello_id='${tid}'`, function(err) {
                if (err) reject(err);
                resolve(true);
            })
        })
        return await promise;
    },
    getBlacklist: async (gid, uid) => {
        let promise = new Promise((resolve, reject) => {
            const request = new sql.Request();
            request.query(`SELECT * FROM blacklist WHERE guild_id=${gid} AND user_id=${uid}`, function(err, recordset) {
                if (err) reject(err);
                resolve(recordset.recordset);
            })
        })
        return await promise;
    },
    addBlacklist: async (gid, uid, bReason) => {
        let promise = new Promise((resolve, reject) => {
            const request = new sql.Request();
            request.query(`INSERT INTO blacklist(guild_id, user_id, blacklist_reason) VALUES (${gid}, ${uid}, '${bReason}')`, function(err) {
                if (err) reject(err);
                resolve(true);
            })
        })
        return await promise;
    },
    removeBlacklist: async (gid, uid) => {
        let promise = new Promise((resolve, reject) => {
            const request = new sql.Request();
            request.query(`DELETE FROM blacklist WHERE guild_id=${gid} AND user_id=${uid}`, function(err) {
                if (err) reject(err);
                resolve(true);
            })
        })
        return await promise;
    }
}

