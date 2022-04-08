import { Transport, Player, context, start, Loop } from 'tone';

let instruments; // available instruments will be filled here.

// CONFIG

const defaults = {
    bpm: 120,
    bars: 2
};

const instrumentsDefn = {
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

// PLAY FUNCTIONS

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

function toggle() {
    (Transport.state === "stopped") ? startT() : stopT();
}

function setBpm(val) {
    Transport.bpm.value = val;
}

// UTILITY

async function startT() {
    if (context.state !== 'running') {
        await start();
    }
    startStepper();
    Transport.start();
}

function stopT() {
    Transport.emit('step', 'stop');
    Transport.stop();
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

function addKeyboardListener() {
    document.addEventListener('keydown', e => {
        if (e.key === " ") {
            toggle();
        }
    });
}

let stepper;
function startStepper() {
    stepper = stepper ? stepper : new Loop(time =>
        Transport.emit('step', Transport.position.split('.')[0])
        , "8n");
    if (stepper.state === 'stopped') stepper.start(0);
}

// DEFAULT INIT

function runInit() {
    instruments = createInstrumentsArray();
    Transport.loop = true;
    addKeyboardListener();
    setBpm(defaults.bpm)
    setLoopEnd(defaults.bars);
    clearTransport();
}

runInit();

// EXPORTS

const tonerIFace = {
    setBpm: val => setBpm(val),
    toggle: () => toggle(),
    scheduleI: scheduleI,
    unschedule: id => Transport.clear(id),
    setLoopEnd: setLoopEnd,
    clearAll: clearTransport,
    getTransport: () => (Transport),
    getInstruments: () => (instruments),
    getDefaults: () => (defaults)
};

export default tonerIFace;