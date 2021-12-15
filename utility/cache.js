require('dotenv').config();

const Uranus = require('uranus.js');
const Kronos = new Uranus(process.env.API_KEY);

let cache = {
    Global: [],
    PBST: [],
    TMS: [],
    PET: [],
    PBM: []
};

async function sGet() {
    console.log("[CACHE] Sending requests to Kronos API!");
    await Kronos.get.schedule('', true).then(r => {
        let data = JSON.parse(r);
        get(data.pbst, 'PBST');
        get(data.tms, 'TMS');
        get(data.pet, 'PET');
        get(data.pbm, 'PBM');
        get(cache.Global, 'Global');
    })
}

function get(r, Division) {
    let data = [];
    for (const event in r) {
        const currentEvent = r[event];
        if (currentEvent.Time > Date.now() / 1000) {
            currentEvent.Division = Division !== 'Global' ? Division : currentEvent.Division;
            data.push(currentEvent);
        }
    }
    data.sort(compare);
    cache[Division] = data;
    cache.Global = Division !== 'Global' ? cache.Global.concat(data) : cache.Global;
}


module.exports = {
    getCache: (Division) => {
        return cache[Division];
    },
    init: () => {
        sGet(); setInterval(() => sGet(), 300000);
    }
}

function compare(a, b) {
    if (a.Time > b.Time) {
        return 1;
    } else if (a.Time < b.Time) {
        return -1;
    }
    return 0;
}