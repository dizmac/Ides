module.exports = {
    fetch: async (context, id) => {
        let promise = new Promise((resolve) => {
            context.guild.members.fetch(id).then(user => {
                resolve(user);
            })
        })
        return await promise
    }
}