import { Oscillator, Transport, Player } from 'tone';

// INSTRUMENTS

let instruments = {
    "drum": new Player('/sounds/drum.mp3').toDestination(),
    "snare": new Player('/sounds/snare.mp3').toDestination(),
    "hat": new Player('/sounds/highhat.mp3').toDestination()
}

function getPlayInstrumentTrigger(id) {
    const instrument = instruments[id];
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

function clearTransport() {
    Transport.cancel();
    Transport.emit('cleared');
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
    clearAll: clearTransport,
    getInstruments: getInstruments,
    getTransport: () => (Transport)
}


export default toneInterface;