import { Transport } from 'tone';
import Toner from './toner';

let sequencerSlots;
let scheduledEvents = [];

let cfg = {
    maxBars: 4,
    minBars: 1,
    bpm: 120,
    bars: 2,
    resolution: "8n"
};

const sixteenths = {
    "8n": ["0", "2"],
    "16n": ["0", "1", "2", "3"]
}

function generateSlots(barNum) {
    const slots = [];
    ["0", "1", "2", "3"].forEach(quarterNum => {
        sixteenths[cfg.resolution].forEach(sixNum =>
            slots.push({
                bar: barNum,
                id: `${barNum}:${quarterNum}:${sixNum}`
            })
        )
    })
    return slots
}

function setSlots(bars) {
    let slots = []
    Array(bars).fill(null).forEach((e, index) => {
        slots = [...slots, ...generateSlots(index)]
    });
    sequencerSlots = slots;
}

function getSlots(barNum = -1) {
    return barNum === -1 ? sequencerSlots : sequencerSlots.filter(slots => slots.bar === barNum);
}

function getActiveBarCount() {
    return sequencerSlots.map(slots => slots.bar).reduce((i, a) => (i > a) ? i : a) + 1;
}

function addBar() {
    const newBars = getActiveBarCount() + 1;
    if (newBars <= cfg.maxBars) {
        setSlots(newBars);
        setLoopEnd(newBars);
        return true;
    } else return false;
}

function removeBar() {
    const newBars = getActiveBarCount() - 1;
    if (newBars >= cfg.minBars) {
        setSlots(newBars);
        setLoopEnd(newBars);
        return true;
    } else return false;
}

function setLoopEnd(bar) {
    Transport.setLoopPoints("0:0:0", `${bar}:0:0`);
    Transport.cancel(`${bar}:0:0`);
}


function setBpm(val) {
    Transport.bpm.value = val;
}

function init() {
    setSlots(cfg.bars);
    setLoopEnd(cfg.bars);
    setBpm(cfg.bpm);
    Transport.loop = true;
}

function schedule(timeId, instrumentId) {
    let eventId = Toner.scheduleI(timeId, instrumentId);
    scheduledEvents.push({
        timeId: timeId,
        instrumentId: instrumentId,
        eventId: eventId
    });
    return eventId;
}

function unschedule(eventId) {
    scheduledEvents = scheduledEvents.filter(rec => rec.eventId !== eventId);
    Transport.clear(eventId);
}

init();

const seqFace = {
    getSlots: getSlots,
    addBar: addBar,
    removeBar: removeBar,
    setBpm: setBpm,
    getBpm: () => Transport.bpm.value,
    transport: () => (Transport),
    schedule: schedule,
    unschedule: unschedule
}

export default seqFace;
