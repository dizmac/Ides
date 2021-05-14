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
    get: async (gid, uid) => {
        let promise = new Promise((resolve, reject) => {
            const request = new sql.Request();
            request.query(`SELECT * FROM blacklist WHERE guild_id=${gid} AND user_id=${uid}`, function(err, recordset) {
                if (err) reject(err);
                resolve(recordset.recordset);
            })
        })
        return await promise;
    },
    add: async (gid, uid) => {
        let promise = new Promise((resolve, reject) => {
            const request = new sql.Request();
            request.query(`INSERT INTO blacklist(guild_id, user_id) VALUES (${gid}, ${uid})`, function(err) {
                if (err) reject(err);
                resolve(true);
            })
        })
        return await promise;
    },
    remove: async (gid, uid) => {
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

