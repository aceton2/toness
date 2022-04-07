import { Transport, Player, context, start } from 'tone';

// INSTRUMENTS

let instrumentsDefn = {
    drum: {
        kick: [new Player('/sounds/kick70.mp3').toDestination(), 2],
        snare: [new Player('/sounds/snare.mp3').toDestination(), 2],
        hat: [new Player('/sounds/highhat.mp3').toDestination(), 2],
    },
    bass: {
        'A2': [new Player('/sounds/bass.mp3').toDestination(), 2],
    },
    chords: {
        'F#m': [new Player('/sounds/synthF.mp3').toDestination(), 0.5],
    }
}

function getPlayInstrumentTrigger(id) {
    const defn = instruments.find(record => record.id === id).source;
    return (time) => defn[0].start(time).stop(time + defn[1]);
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

async function startT() {
    if (context.state !== 'running') {
        await start();
    }
    Transport.start();
}

// UTILITY

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

function addKeyboardListener() {
    document.addEventListener('keydown', e => {
        if (e.key === " ") { Transport.toggle(); }
    });
}


// DEFAULT INIT

let instruments = createInstrumentsArray();
Transport.loop = true;
addKeyboardListener();


// EXPORTS

const toneInterface = {
    setBpm: val => Transport.bpm.value = val,
    start: () => startT(),
    stop: () => Transport.stop(),
    scheduleI: scheduleI,
    unschedule: id => Transport.clear(id),
    setLoopEnd: setLoopEnd,
    clearAll: clearTransport,
    getTransport: () => (Transport),
    getInstruments: () => (instruments),
}


export default toneInterface;