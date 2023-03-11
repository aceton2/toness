import { Transport } from 'tone'
import TonerService from './toner'
import { Slot, ScheduledEvent } from './interfaces'

const scheduledEvents: Array<ScheduledEvent> = []

let sequencerSlots: Array<Slot>

let cfg = {
  maxBars: 4,
  minBars: 1,
  bpm: 120,
  bars: 2,
  resolution: '8n',
}

const sixteenths: { [key: string]: Array<string> } = {
  '8n': ['0', '2'],
  '16n': ['0', '1', '2', '3'],
}

function generateSlots(barNum: number): Array<Slot> {
  const slots: Array<Slot> = []
  ;['0', '1', '2', '3'].forEach((quarterNum) => {
    sixteenths[cfg.resolution].forEach((sixNum) =>
      slots.push({
        bar: barNum,
        id: `${barNum}:${quarterNum}:${sixNum}`,
      })
    )
  })
  return slots
}

function setSlots(bars: number) {
  let slots: Array<Slot> = []
  Array(bars)
    .fill(null)
    .forEach((e, index) => {
      slots = [...slots, ...generateSlots(index)]
    })
  sequencerSlots = slots
}

function getSlots(barNum = -1): Array<Slot> {
  return barNum === -1
    ? sequencerSlots
    : sequencerSlots.filter((slots) => slots.bar === barNum)
}

function getActiveBarCount(): number {
  return sequencerSlots.map((slots) => slots.bar).reduce((i, a) => (i > a ? i : a)) + 1
}

function addBar(): boolean {
  const newBars = getActiveBarCount() + 1
  if (newBars <= cfg.maxBars) {
    setSlots(newBars)
    setLoopEnd(newBars)
    return true
  } else return false
}

function removeBar(): boolean {
  const newBars = getActiveBarCount() - 1
  if (newBars >= cfg.minBars) {
    setSlots(newBars)
    setLoopEnd(newBars)
    return true
  } else return false
}

function setLoopEnd(bar: number): void {
  Transport.setLoopPoints('0:0:0', `${bar}:0:0`)
  Transport.cancel(`${bar}:0:0`)
}

function setBpm(val: number): void {
  Transport.bpm.value = val
}

// SCHEDULE

function schedule(timeId: string, instrumentId: number): number {
  let eventId = TonerService.scheduleI(timeId, instrumentId)
  scheduledEvents.push({
    timeId: timeId,
    instrumentId: instrumentId,
    eventId: eventId,
  })
  return eventId
}

function unschedule(eventId: number): void {
  const eventIndex = scheduledEvents.findIndex((rec) => rec.eventId !== eventId);
  scheduledEvents.splice(eventIndex, 1)
  Transport.clear(eventId)
}

// INIT

function init() {
  setSlots(cfg.bars)
  setLoopEnd(cfg.bars)
  setBpm(cfg.bpm)
  Transport.loop = true
}

init()

const seqFace = {
  getSlots,
  addBar,
  removeBar,
  setBpm,
  getBpm: (): number => Transport.bpm.value,
  schedule,
  unschedule,
  getActiveBarCount,
  scheduledEvents,
}

export default seqFace
