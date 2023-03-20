import { Transport, Player, context, start, Loop, Emitter, Recorder, Volume } from 'tone'
import useToneStore from '../_store/store'
import { Instrument } from './interfaces'

// NODES

const recorder = new Recorder()
const vol = new Volume(0).toDestination();

// STEPPER

let SequenceEmitter = new Emitter()
let stepper: Loop | null

// INSTRUMENTS
let instruments: Array<Instrument> = [
  {id: 0, name: 'kick', player: new Player('/sounds/kick70.mp3'), duration: 0.5 },
  {id: 1, name: 'snare', player: new Player('/sounds/snare.mp3'), duration: 2 },
  {id: 2, name: 'hat', player: new Player('/sounds/highhat.mp3'), duration: 2 },
]

function getPlayInstrumentTrigger(id: number): (arg0: number) => void {
  const instrument = instruments.find((sound: Instrument) => sound.id === id)
  const rates = { fadeOut: 0.2, offset: 0, duration: instrument?.duration }
  return (time) => instrument?.player.start(time, rates.offset, rates.duration)
}

let ids = 100;
function addSample(player: Player) {
  instruments.push({
    id: ids++,
    name: ids.toString(),
    player: player,
    fadeOut: 0.2, 
    offset: 0, 
    duration: 2
  })
  player.connect(recorder)
}

// SCHEDULING

function clearTransport() {
  Transport.cancel()
  stepper = null
  startStepper()
}

// START/STOP

function toggle(): void {
  Transport.state === 'stopped' ? startT() : Transport.stop()
}

async function startT() {
  if (context.state !== 'running') {
    await start()
  }
  startStepper()
  Transport.start()
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
    : new Loop((time) => emitStep(), '16n')
  if (stepper.state === 'stopped') stepper.start(0)
}

function emitStep() {
  const emit16ths = useToneStore.getState().resolution === '16n'
  const step = (Transport.position as string).split('.')[0]
  const eigths = ['0', '2'].indexOf(step.split(':')[2]) != -1
  if(emit16ths || eigths) {
    SequenceEmitter.emit('step', step)
  }
}

function muteOutput() {
  vol.mute = true;
}

function unmuteOutput() {
  vol.mute = false;
}

// DEFAULT INIT

function runInit() {
  addKeyboardListener()
  clearTransport()
  instruments.forEach(i => {
    i.player.connect(recorder).connect(vol)
  })
}

runInit()

// EXPORTS

const TonerServiceIFace = {
  getPlayInstrumentTrigger,
  addSample,
  toggle,
  getInstruments: (): Array<Instrument> => instruments,
  clearAll: clearTransport,
  recorder,
  SequenceEmitter,
  muteOutput,
  unmuteOutput
}

export default TonerServiceIFace
