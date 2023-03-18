import { Transport, Player, context, start, Loop, Emitter, Recorder } from 'tone'
import { Instrument } from './interfaces'

// RECORDER 

const recorder = new Recorder()

// STEPPER

let SequenceEmitter = new Emitter()
let stepper: Loop | null

// INSTRUMENTS
let instruments: Array<Instrument> = [
  {id: 0, name: 'kick', player: new Player('/sounds/kick70.mp3').toDestination(), duration: 0.5 },
  {id: 1, name: 'snare', player: new Player('/sounds/snare.mp3').toDestination(), duration: 2 },
  {id: 2, name: 'hat', player: new Player('/sounds/highhat.mp3').toDestination(), duration: 2 },
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
  addKeyboardListener()
  clearTransport()
  instruments.forEach(i => i.player.connect(recorder))
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
}

export default TonerServiceIFace
