module.exports = {
    fetch: async (message, id) => {
        let promise = new Promise((resolve) => {
            message.guild.members.fetch(id).then(user => {
                resolve(user);
            })
        })
        return await promise
    }
}