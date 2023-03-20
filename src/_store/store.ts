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
  setBpm: (bpm: number) => void,
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
        changeBars: (bars: number) => set(state => ({activeBars: state.activeBars + bars})), // min-max 1-4
        changeTracks: (tracks: number) => set(state => ({activeTracks: state.activeTracks + tracks})), // min-max 1-4
        setBpm: (bpm: number) => set(state => ({ bpm })),
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

export const selectIsFullGrid = (state: TonesState) => state.resolution === '16n'

export default useToneStore