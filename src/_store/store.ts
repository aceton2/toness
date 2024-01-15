import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { Slot, PadParams, PadName, defaultStoreParams, PadParam, TrackParams, defaultTrackParams } from '../_services/interfaces'

export type GridResolutions =  '16n' | '8n' | '8t'

interface TonesState {
  activeSlots: Array<Slot>,
  activeTracks: number,
  activeBars: number,
  bpm: number,
  resolution: GridResolutions,
  padParams: PadParams,
  trackSettings: TrackParams,
  resetSequencer: () => void,
  changeBars: (bars: number) => void,
  changeTracks: (tracks: number) => void,
  scheduledEvents: Array<string>,
  toggleScheduledEvent: (event: string) => void,
  clearSchedule: () => void,
  setBpm: (bpm: string) => void,
  toggleResolution: (res: GridResolutions) => void,
  setActiveSlots: (slots: Array<Slot>) => void,
  setPadParams: (pad: PadName, params: PadParam) => void
  toggleTrackMute: (id: number) => void
}


const useToneStore = create<TonesState>()(
  devtools(
    persist(
      subscribeWithSelector(
      (set) => ({
        // listeners listed in comment
        activeSlots: [], // WIDGET -> for bar generation
        activeTracks: 1, // SEQUENCER -> for setting mutes * WIDGET -> for setting track visibility
        activeBars: 2, // SEQUENCER -> for setting active slots
        bpm: 124, // SEQUENCER -> for setting bpm * TEMPO -> for button
        resolution: '8n',  // SEQUENCER -> for setting active slots * CONTROLS -> for button
        scheduledEvents: [], // SEQUENCER -> for transport sync * TOGGLE -> for step styling
        padParams: defaultStoreParams, // TONER -> for setting play params * PAD -> for setting controls
        trackSettings: defaultTrackParams, // TONER -> for setting volume mutes * TRACK -> for showing state
        setPadParams: (padName, params) => set(state => ({padParams: {...state.padParams, [padName]: params}})),
        resetSequencer: () => set(state => ({activeBars: 1, activeTracks: 1, scheduledEvents: [], bpm: 124})),
        changeBars: (bars: number) => set(state => ({activeBars: getNewBars(state.activeBars, bars)})),
        changeTracks: (tracks: number) => set(state => ({activeTracks: getNewTracks(state.activeTracks, tracks)})),
        setBpm: (bpm: string) => set(state => ({ bpm: parseInt(bpm) })),
        setActiveSlots: (slots: Array<Slot>) => set(state => ({activeSlots: slots})),
        toggleResolution: (res: GridResolutions) => set(state => ({resolution: res})),
        clearSchedule: () => set(state => ({scheduledEvents: []})),
        toggleTrackMute: (id) => set(state => (
          {trackSettings: {...state.trackSettings, [id]: {mute: !state.trackSettings[id].mute} }}
        )),
        toggleScheduledEvent: (scheduledEvent: string) => set(state => {
          return {scheduledEvents: 
            (state.scheduledEvents.indexOf(scheduledEvent) !== -1)
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

export const selectPadAudioUrl = (state: TonesState, name: string) => {
  const param = state.padParams[name as PadName]
  return param?.audioUrl
}

export const selectTrackSetting = (state: TonesState, id: number) => {
  return state.trackSettings[id]
}

export default useToneStore

