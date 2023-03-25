import { Transport, context, start, Loop, Emitter } from 'tone'
import TonerService from './toner'
import { Slot } from './interfaces'
import ToneStore from '../_store/store';
import useToneStore from '../_store/store';

// STEPPER

let sequenceEmitter = new Emitter()
let stepper: Loop | null

// STORE LISTENERS

let unSubs: Array<() => void>;

// SLOTS 

const transportEventIds: {[key: string]: number} = {} // the key is a scheduledEvent
const sequencerSlots: Array<Slot> = generateSlots()

function generateSlots(): Array<Slot> {
  const slots: Array<Slot> = [];
  [0, 1, 2, 3].forEach(barNum => {
    ['0', '1', '2', '3'].forEach((quarterNum) => {
      ['0', '1', '2', '3'].forEach((sixNum) => 
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

  const activeSlots = sequencerSlots.filter(slot => {
      if(res === '8n' && ['1', '3'].indexOf(slot.timeId.slice(-1)) !== -1) {
        return false
      }
      return slot.bar <= bars - 1
  });
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
  const grid16 = ToneStore.getState().resolution === '16n'
  const desiredScheduledEvents = ToneStore.getState().scheduledEvents.filter(ev => grid16 ? true : !is16th(ev))
  desiredScheduledEvents.forEach(scheduledEvent => {
    if(activeScheduledEvents.indexOf(scheduledEvent) === -1) { schedule(scheduledEvent) }
  })
  activeScheduledEvents.forEach(scheduledEvent => {
    if(desiredScheduledEvents.indexOf(scheduledEvent) === -1) { unschedule(scheduledEvent) }
  })
}

function is16th(event: string) {
  const part = event.split('|')[0].split(':')[2];
  return ['0', '2'].indexOf(part) === -1
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
  stepper = null
  startStepper()
}

function toggleTransport(): void {
  Transport.state === 'stopped' ? startTransport() : Transport.stop()
}

async function startTransport() {
  if (context.state !== 'running') {
    await start()
  }
  startStepper()
  Transport.start()
}

function addKeyboardListener() {
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      toggleTransport()
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
  const eigths = ['0', '2'].indexOf(step.split(':')[2]) !== -1
  if(emit16ths || eigths) {
    sequenceEmitter.emit('step', step)
  }
}

// INIT

function initSequencer() {

  addKeyboardListener()
  clearTransport()
  TonerService.addExistingSounds()

  unSubs = [
    // clean this up
    ToneStore.subscribe((state) => state.activeTracks, syncActiveTracks),
    ToneStore.subscribe((state) => state.activeBars, syncActiveSlots),
    ToneStore.subscribe((state) => state.activeBars, syncScheduledEvents),
    ToneStore.subscribe((state) => state.resolution, syncActiveSlots),
    ToneStore.subscribe((state) => state.resolution, syncScheduledEvents),
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