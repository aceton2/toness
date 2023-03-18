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
  addScheduledEvent: (event: string) => void,
  removeScheduledEvent: (event: string) => void,
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
        addScheduledEvent: (event: string) => set(state => ({scheduledEvents: [...state.scheduledEvents, event]})),
        removeScheduledEvent: (event: string) => set(state => ({
          scheduledEvents: state.scheduledEvents.filter(sEvent => sEvent !== event)
        })),
      })
      ),
      {name: 'toness'}
    ),
    {name: "toness"}
  )
)

export default useToneStore