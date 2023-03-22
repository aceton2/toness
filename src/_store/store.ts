import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { Slot } from '../_services/interfaces'

interface TonesState {
  activeSlots: Array<Slot>,
  activeTracks: number,
  activeBars: number,
  bpm: number,
  resolution: '16n' | '8n',
  changeBars: (bars: number) => void,
  changeTracks: (tracks: number) => void,
  scheduledEvents: Array<string>,
  toggleScheduledEvent: (event: string) => void,
  clearSchedule: () => void,
  setBpm: (bpm: string) => void,
  toggleResolution: () => void,
  setActiveSlots: (slots: Array<Slot>) => void,
}


const useToneStore = create<TonesState>()(
  devtools(
    persist(
      subscribeWithSelector(
      (set) => ({
        activeSlots: [],
        activeTracks: 1,
        activeBars: 2,
        bpm: 120,
        resolution: '8n',
        scheduledEvents: [],
        changeBars: (bars: number) => set(state => ({activeBars: getNewBars(state.activeBars, bars)})),
        changeTracks: (tracks: number) => set(state => ({activeTracks: getNewTracks(state.activeTracks, tracks)})),
        setBpm: (bpm: string) => set(state => ({ bpm: parseInt(bpm) })),
        setActiveSlots: (slots: Array<Slot>) => set(state => ({activeSlots: slots})),
        toggleResolution: () => set(state => ({resolution: state.resolution === '8n' ? '16n' : '8n'})),
        clearSchedule: () => set(state => ({scheduledEvents: []})),
        toggleScheduledEvent: (scheduledEvent: string) => set(state => {
          return {scheduledEvents: 
            (state.scheduledEvents.indexOf(scheduledEvent) != -1)
            ? state.scheduledEvents.filter(sEvent => sEvent !== scheduledEvent)
            : [...state.scheduledEvents, scheduledEvent]
          }
        }),
      })
      ),
      {name: 'toness'}
    ),
    {name: "toness"}
  )
)

function getNewBars(activeBars: number, change: number): number {
  const newBars = activeBars + change;
  return (newBars > 0 && newBars < 5) ? newBars : activeBars
}

function getNewTracks(activeTracks: number, change: number): number {
  const newTracks = activeTracks + change;
  return (newTracks > 0 && newTracks < 8) ? newTracks : activeTracks
}

export const selectIsFullGrid = (state: TonesState) => state.resolution === '16n'

export default useToneStore