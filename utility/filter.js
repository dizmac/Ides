module.exports = {
    filterHost: (data, host) => {
        let rv = [];
        for (const event of data) {
            if (event.Trainer === host) rv.push(event);
        }
        return rv;
    }
}