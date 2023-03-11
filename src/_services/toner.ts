import { Transport, Player, context, start, Loop, Emitter, Recorder } from 'tone'
import { SoundCfg, PlayRates } from './interfaces'

// RECORDER 

const recorder = new Recorder()

// STEPPER

let SequenceEmitter = new Emitter()
let stepper: Loop | null

// INSTRUMENTS

let instruments: Array<SoundCfg> = []
let ids = 0
const defaultPlayRates: PlayRates = {
  duration: 2,
  fadeOut: 0.2,
  offset: 0,
}

const instrumentsDefn: { [Key: string]: any } = {
  drum: {
    kick: [new Player('/sounds/kick70.mp3').toDestination(), { duration: 0.5 }],
    snare: [new Player('/sounds/snare.mp3').toDestination(), { duration: 2 }],
    hat: [new Player('/sounds/highhat.mp3').toDestination(), { duration: 2 }],
  },
  // bass: {
  //     'A2': [new Player('/sounds/bass.mp3').toDestination(), { duration: 0.5, fadeOut: 0.4 }],
  // },
  // chords: {
  //     'F#m': [new Player('/sounds/synthF.mp3').toDestination(), { duration: 0.5 }],
  // }
}
instrumentsDefn.drum.kick[0].connect(recorder);
instrumentsDefn.drum.snare[0].connect(recorder);
instrumentsDefn.drum.hat[0].connect(recorder);

function fillInstrumentsArray(): void {
  for (let group in instrumentsDefn) {
    for (let name in instrumentsDefn[group]) {
      instruments.push({
        id: ids++,
        group: group,
        name: name,
        source: instrumentsDefn[group][name],
      })
    }
  }
}

function getPlayInstrumentTrigger(id: number): (arg0: number) => void {
  const defn = instruments.filter((sound: SoundCfg) => sound.id === id)[0].source
  const rates = { ...defaultPlayRates, ...defn[1] }
  return (time) => defn[0].start(time, rates.offset, rates.duration)
}

function addSample(player: Player, rates: PlayRates) {
  instruments.push({
    id: ids++,
    group: 'samples',
    name: ids.toString(),
    source: [player, rates],
  })
}

// SCHEDULING

function scheduleEvent(
  triggerTime: string,
  triggerFunction: (arg0: number) => void
): number {
  return Transport.schedule((time) => {
    triggerFunction(time)
  }, triggerTime)
}

function scheduleI(triggerTime: string, instrumentId: number): number {
  return scheduleEvent(triggerTime, getPlayInstrumentTrigger(instrumentId))
}

function clearTransport() {
  Transport.cancel()
  SequenceEmitter.emit('cleared')
  stepper = null
  startStepper()
}

// START/STOP

function toggle(): void {
  Transport.state === 'stopped' ? startT() : stopT()
}

async function startT() {
  if (context.state !== 'running') {
    await start()
  }
  startStepper()
  Transport.start()
}

function stopT() {
  SequenceEmitter.emit('step', 'stop')
  Transport.stop()
}

function addKeyboardListener() {
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      toggle()
    }
  })
}

function startStepper() {
  stepper = stepper
    ? stepper
    : new Loop(
      (time) =>
        SequenceEmitter.emit('step', (Transport.position as string).split('.')[0]),
      '8n'
    )
  if (stepper.state === 'stopped') stepper.start(0)
}

// DEFAULT INIT

function runInit() {
  fillInstrumentsArray()
  addKeyboardListener()
  clearTransport()
}

runInit()

// EXPORTS

const TonerServiceIFace = {
  scheduleI,
  addSample,
  toggle,
  getInstruments: (): Array<SoundCfg> => instruments,
  clearAll: clearTransport,
  recorder,
  SequenceEmitter,
  defaultPlayRates
}

export default TonerServiceIFace
