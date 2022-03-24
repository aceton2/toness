import { Oscillator, Transport } from 'tone';

// CUSTOM TRIGGERS

function logSteps(time) {
    const pos = Transport.position.split('.');
    console.log(pos[0])
}

// INSTRUMENTS

let activeInstrument1 = new Oscillator(330).toDestination();
let activeInstrument2 = new Oscillator(220).toDestination();

function playActiveInstrument1(time) {
    return activeInstrument1.start(time).stop(time + 0.1);
}

function playActiveInstrument2(time) {
    return activeInstrument2.start(time).stop(time + 0.1);
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
    if (instrumentId === "1") {
        return scheduleEvent(triggerTime, playActiveInstrument1);
    } else if (instrumentId === "2") {
        return scheduleEvent(triggerTime, playActiveInstrument2);
    }
}

// DEFAULTS

Transport.loop = true

// EXPORTS

const toneInterface = {
    setBpm: val => Transport.bpm.value = val,
    start: () => Transport.start(),
    stop: () => Transport.stop(),
    scheduleI: scheduleI,
    unschedule: id => Transport.clear(id),
    setLoopEnd: setLoopEnd,
    clearAll: () => Transport.cancel()
}

export default toneInterface;