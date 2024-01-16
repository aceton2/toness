import { Transport, context, start, Loop, Emitter } from 'tone'
import TonerService from './toner'
import { Slot } from './interfaces'
import ToneStore from '../_store/store';
import useToneStore from '../_store/store';
import { GridResolutions } from '../_store/store';

// STEPPER

let sequenceEmitter = new Emitter()
let stepper: Loop | null

// STORE LISTENERS

let unSubs: Array<() => void>;

// SLOTS 

const transportEventIds: {[key: string]: number} = {} // the key is a scheduledEvent

const eigthSubs = {
  '8n': ['0', '2'],
  '16n': ['0', '1', '2', '3'],
  '8t': ['0', '1.33', '2.66'],
}

function generateSlots(res: GridResolutions, bars: number): Array<Slot> {
  const slots: Array<Slot> = [];
  [0, 1, 2, 3].slice(0, bars).forEach(barNum => {
    ['0', '1', '2', '3'].forEach((quarterNum) => { 
      eigthSubs[res].forEach((sixNum) => 
        slots.push({
          bar: barNum,
          timeId: `${barNum}:${quarterNum}:${sixNum}`,
        })
      )
    })
  })
  return slots
}

function syncActiveSlots() {
  const bars = ToneStore.getState().activeBars
  const res = ToneStore.getState().resolution

  const activeSlots = generateSlots(res, bars)
  ToneStore.getState().setActiveSlots(activeSlots)

  setLoopEnd(bars)
}

function syncActiveTracks() {
  const tracks = ToneStore.getState().activeTracks
  TonerService.getInstruments().forEach((inst, index) => {
    if(inst.player) { inst.player.mute = index >= tracks }
  })
}

function syncScheduledEvents() {
  const activeScheduledEvents = Object.keys(transportEventIds);
  const desiredScheduledEvents = getActiveEvents()
  desiredScheduledEvents.forEach(scheduledEvent => {
    if(activeScheduledEvents.indexOf(scheduledEvent) === -1) { schedule(scheduledEvent) }
  })
  activeScheduledEvents.forEach(scheduledEvent => {
    if(desiredScheduledEvents.indexOf(scheduledEvent) === -1) { unschedule(scheduledEvent) }
  })
}

function getActiveEvents() {
  const resolution = ToneStore.getState().resolution
  const allEvents = ToneStore.getState().scheduledEvents 
  return allEvents.filter(event => {
    const part = event.split('|')[0].split(':')[2];
    switch(resolution) {
      case "8n": return ['0', '2'].indexOf(part) !== -1
      case "16n": return part.indexOf(".") === -1
      case "8t": return ['1', '2', '3'].indexOf(part) === -1
    }
  })
}

function setLoopEnd(bar: number): void {
  Transport.setLoopPoints('0:0:0', `${bar}:0:0`)
  Object.keys(transportEventIds).forEach(scheduledEvent => {
    const eventBar = scheduledEvent.split('|')[0].split(':')[0]
    if(parseInt(eventBar) >= bar) { delete transportEventIds[scheduledEvent] }
  })
  Transport.cancel(`${bar}:0:0`)
}

function setBpm(val: number): void {
  Transport.bpm.value = val
}

function schedule(scheduledEvent: string) {
  const [timeId, instrumentId] = scheduledEvent.split('|')
  const triggerFunction = TonerService.getPlayInstrumentTrigger(parseInt(instrumentId))
  transportEventIds[scheduledEvent] = Transport.schedule(time => triggerFunction(time), timeId)
}

function unschedule(scheduledEvent: string) {
  Transport.clear(transportEventIds[scheduledEvent])
  delete transportEventIds[scheduledEvent]
}

// CONTROLS

function clearTransport() {
  Transport.cancel()
}

function toggleTransport(): void {
  Transport.state === 'stopped' ? startTransport() : Transport.stop()
}

async function startTransport() {
  if (context.state !== 'running') {
    await start()
  }
  Transport.start()
}

function addKeyboardListener() {
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      toggleTransport()
    }
  })
}

function updateStepperRes() {
  if(stepper) {
    stepper.interval = ToneStore.getState().resolution
  }
}

function startStepper() {
  stepper = new Loop((time) => {
    sequenceEmitter.emit('step', (Transport.position as string).split('.')[0])
  }, ToneStore.getState().resolution)
  stepper.start(0)
}

// TODO: implement metronome like the stepper

// INIT

function initSequencer() {

  addKeyboardListener()
  clearTransport()
  TonerService.addExistingSounds()
  startStepper()

  unSubs = [
    // clean this up
    ToneStore.subscribe((state) => state.activeTracks, syncActiveTracks),
    ToneStore.subscribe((state) => state.activeBars, syncActiveSlots),
    ToneStore.subscribe((state) => state.activeBars, syncScheduledEvents),
    ToneStore.subscribe((state) => state.resolution, syncActiveSlots),
    ToneStore.subscribe((state) => state.resolution, syncScheduledEvents),
    ToneStore.subscribe((state) => state.resolution, updateStepperRes),
    ToneStore.subscribe((state) => state.bpm, setBpm),
    ToneStore.subscribe((state) => state.scheduledEvents, syncScheduledEvents),
  ];

  const storeState = useToneStore.getState()

  syncActiveSlots()
  syncActiveTracks()
  setBpm(storeState.bpm)
  syncScheduledEvents()

  Transport.loop = true
}

function unsubSequencerSubscriptions() {
  unSubs.forEach(unsub => unsub())
}


const SequencerService = {
  initSequencer,
  unsubSequencerSubscriptions,
  sequenceEmitter,
  clearTransport,
  toggleTransport,
}

export default SequencerService