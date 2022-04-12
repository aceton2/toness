import { Transport, Player, context, start, Loop } from 'tone';

export interface SoundCfg {
    id: number,
    group: string,
    name: string,
    source: [any, number]
}

// STEPPER

let stepper: Loop | null;

// INSTRUMENTS

let instruments: Array<SoundCfg> = [];

const instrumentsDefn: { [Key: string]: any } = {
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

function fillInstrumentsArray(): void {
    let id = 0;
    for (let group in instrumentsDefn) {
        for (let name in instrumentsDefn[group]) {
            instruments.push({
                id: id++,
                group: group,
                name: name,
                source: instrumentsDefn[group][name]
            })
        }
    }
}


function getPlayInstrumentTrigger(id: number): (arg0: number) => void {
    const defn = instruments.filter((sound: SoundCfg) => sound.id === id)[0].source;
    return time => defn[0].start(time).stop(time + defn[1]);
}

// SCHEDULING 

function scheduleEvent(triggerTime: string, triggerFunction: (arg0: number) => void): number {
    return Transport.schedule((time) => {
        triggerFunction(time);
    }, triggerTime);
}

function scheduleI(triggerTime: string, instrumentId: number): number {
    return scheduleEvent(triggerTime, getPlayInstrumentTrigger(instrumentId));
}

function clearTransport() {
    Transport.cancel();
    Transport.emit('cleared');
    stepper = null;
    startStepper();
}

// START/STOP

function toggle(): void {
    (Transport.state === "stopped") ? startT() : stopT();
}

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

function addKeyboardListener() {
    document.addEventListener('keydown', e => {
        if (e.key === " ") {
            toggle();
        }
    });
}

function startStepper() {
    stepper = stepper ? stepper : new Loop(time =>
        // @ts-ignore
        Transport.emit('step', Transport.position.split('.')[0])
        , "8n");
    if (stepper.state === 'stopped') stepper.start(0);
}


// DEFAULT INIT

function runInit() {
    fillInstrumentsArray();
    addKeyboardListener();
    clearTransport();
}

runInit();

// EXPORTS

const tonerIFace = {
    scheduleI: scheduleI,
    getInstruments: (): Array<SoundCfg> => (instruments),
    toggle: toggle,
    clearAll: clearTransport
};

export default tonerIFace;