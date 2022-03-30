import { Oscillator, Transport } from 'tone';
import * as Tone from 'tone';

// console.log(Tone);

// INSTRUMENTS

let instruments = {
    "220": new Oscillator(220).toDestination(),
    "330": new Oscillator(330).toDestination(),
    "440": new Oscillator(440).toDestination()
}

function getPlayInstrumentTrigger(id) {
    const instrument = instruments[id];
    const note = id
    return (time) => instrument.start(time).stop(time + 0.1);
}

// INTERFACE FUNCTIONS

function setLoopEnd(bar) {
    Transport.setLoopPoints("0:0:0", `${bar}:0:0`);
    Transport.cancel(`${bar}:0:0`);
}

function scheduleEvent(triggerTime, triggerFunction) {
    return Transport.schedule((time) => {
        triggerFunction(time);
    }, triggerTime);
}


function scheduleI(triggerTime, instrumentId) {
    return scheduleEvent(triggerTime, getPlayInstrumentTrigger(instrumentId));
}

function getInstruments() {
    let keys = []
    for (let key in instruments) {
        keys.push(key);
    }
    return keys;
}

// DEFAULTS

Transport.loop = true;

// EXPORTS

const toneInterface = {
    setBpm: val => Transport.bpm.value = val,
    start: () => Transport.start(),
    stop: () => Transport.stop(),
    scheduleI: scheduleI,
    unschedule: id => Transport.clear(id),
    setLoopEnd: setLoopEnd,
    clearAll: () => Transport.cancel(),
    getInstruments: getInstruments
}


export default toneInterface;