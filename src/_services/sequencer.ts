import { Transport } from 'tone'
import TonerService from './toner'
import { Slot } from './interfaces'
import ToneStore from '../_store/store';
import useToneStore from '../_store/store';


const transportEvents: {[key: string]: number} = {} // key is eventId, prop is transportId
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

function syncScheduledEvents(scheduledEvents: Array<string>) {
  const transports = Object.keys(transportEvents);
  scheduledEvents.forEach(event => {
    if(transports.indexOf(event) === -1) { schedule(event) }
  })
  transports.forEach(event => {
    if(scheduledEvents.indexOf(event) === -1) { unschedule(event) }
  })
}

function setLoopEnd(bar: number): void {
  Transport.setLoopPoints('0:0:0', `${bar}:0:0`)
  Transport.cancel(`${bar}:0:0`)
}

function setBpm(val: number): void {
  Transport.bpm.value = val
}

function schedule(eventId: string) {
  const [timeId, instrumentId] = eventId.split('|')
  const triggerFunction = TonerService.getPlayInstrumentTrigger(parseInt(instrumentId))
  transportEvents[eventId] = Transport.schedule(time => triggerFunction(time), timeId)
}

function unschedule(eventId: string) {
  Transport.clear(transportEvents[eventId])
  delete transportEvents[eventId]
}

// INIT

let unSubs: Array<() => void>;

export function initSequencer() {

  unSubs = [
    ToneStore.subscribe((state) => state.activeTracks, syncActiveTracks),
    ToneStore.subscribe((state) => state.activeBars, syncActiveSlots),
    ToneStore.subscribe((state) => state.resolution, syncActiveSlots),
    ToneStore.subscribe((state) => state.bpm, setBpm),
    ToneStore.subscribe((state) => state.scheduledEvents, syncScheduledEvents),
  ];

  const storeState = useToneStore.getState()

  syncActiveSlots()
  syncActiveTracks()
  setBpm(storeState.bpm)
  syncScheduledEvents(storeState.scheduledEvents)

  Transport.loop = true
}

export function unsubSequencerSubscriptions() {
  unSubs.forEach(unsub => unsub())
}

