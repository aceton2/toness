import { Transport } from 'tone'
import TonerService from './toner'
import { Slot } from './interfaces'
import ToneStore from '../_store/store';
import useToneStore from '../_store/store';

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
  TonerService.getInstruments().forEach((inst, index) => 
    inst.player.mute = index >= tracks
  )
}

function syncScheduledEvents() {
  const scheduledEvents = ToneStore.getState().scheduledEvents
  const activeScheduledEvents = Object.keys(transportEventIds);
  const grid16 = ToneStore.getState().resolution === '16n'
  const desiredScheduledEvents = scheduledEvents.filter(ev => grid16 ? true : !is16th(ev))
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

// INIT

let unSubs: Array<() => void>;

export function initSequencer() {

  unSubs = [
    ToneStore.subscribe((state) => state.activeTracks, syncActiveTracks),
    ToneStore.subscribe((state) => state.activeBars, syncActiveSlots),
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

export function unsubSequencerSubscriptions() {
  unSubs.forEach(unsub => unsub())
}

