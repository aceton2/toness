import { Transport, Player } from 'tone';

// INSTRUMENTS

let instrumentsDefn = {
    drum: {
        kick: new Player('/sounds/kick70.mp3').toDestination(),
        snare: new Player('/sounds/snare.mp3').toDestination(),
        hat: new Player('/sounds/highhat.mp3').toDestination()
    },
    bass: {
        'A2': new Player('/sounds/bass.mp3').toDestination(),
    },
    chords: {
        'F#m': new Player('/sounds/synthF.mp3').toDestination(),
    }
}

function createInstrumentsArray() {
    let iArr = [];
    let id = 0;
    for (let group in instrumentsDefn) {
        for (let name in instrumentsDefn[group]) {
            iArr.push({
                id: id++,
                group: group,
                name: name,
                source: instrumentsDefn[group][name]
            })
        }
    }
    return iArr;
}

let instruments = createInstrumentsArray();

function getPlayInstrumentTrigger(id) {
    const instrument = instruments.find(record => record.id === id).source;
    return (time) => instrument.start(time).stop(time + 0.6);
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
    getTransport: () => (Transport),
    getInstruments: () => (instruments),
}


export default toneInterface;