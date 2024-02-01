import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { PadParams, defaultStoreParams, PadParam, TrackParams, defaultTrackParams } from '../services/interfaces'

export type GridResolutions = '16n' | '8n' | '8t'
export const STORE_VERSION = 1.1

interface TonesState {
  storeVersion: number,
  activeTimeIds: Array<string>,
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
  toggleScheduledEvent: (timeId: string, instrumentId: number, emphasis: boolean) => void,
  clearSchedule: () => void,
  setBpm: (bpm: string) => void,
  toggleResolution: (res: GridResolutions) => void,
  setActiveTimeIds: (slots: Array<string>) => void,
  setPadParams: (id: number, params: PadParam) => void,
  setTrackVolume: (id: number, vol: number) => void,
  toggleTrackMute: (id: number) => void,
  resetStore: () => void,
}

const initialState = {
  storeVersion: STORE_VERSION,
  // listeners listed in comment
  activeTimeIds: [], // WIDGET -> for bar generation
  activeTracks: 1, // SEQUENCER -> for setting mutes * WIDGET -> for setting track visibility
  activeBars: 2, // SEQUENCER -> for setting active slots
  bpm: 124, // SEQUENCER -> for setting bpm * TEMPO -> for button
  resolution: '8n' as GridResolutions,  // SEQUENCER -> for setting active slots * CONTROLS -> for button
  scheduledEvents: [], // SEQUENCER -> for transport sync * TOGGLE -> for step styling
  padParams: defaultStoreParams, // TONER -> for setting play params * PAD -> for setting controls
  trackSettings: defaultTrackParams, // TONER -> for setting volume mutes * TRACK -> for showing state
}


const useToneStore = create<TonesState>()(
  devtools(
    persist(
      subscribeWithSelector(
        (set) => ({
          ...initialState,
          resetStore: () => set(initialState),
          setPadParams: (padName, params) => set(state => ({ padParams: { ...state.padParams, [padName]: params } }), false, "setPadParams"),
          resetSequencer: () => set(state => ({ activeBars: 1, activeTracks: 1, scheduledEvents: [], bpm: 124, trackSettings: defaultTrackParams })),
          changeBars: (bars: number) => set(state => ({ activeBars: getNewBars(state.activeBars, bars) })),
          changeTracks: (tracks: number) => set(state => ({ activeTracks: getNewTracks(state.activeTracks, tracks) })),
          setBpm: (bpm: string) => set(state => ({ bpm: parseInt(bpm) })),
          setActiveTimeIds: (timeIds: Array<string>) => set(state => ({ activeTimeIds: timeIds })),
          toggleResolution: (res: GridResolutions) => set(state => ({ resolution: res })),
          clearSchedule: () => set(state => ({ scheduledEvents: [] })),
          toggleTrackMute: (id) => set(state => (
            { trackSettings: { ...state.trackSettings, [id]: { ...state.trackSettings[id], mute: !state.trackSettings[id].mute } } }
          )),
          setTrackVolume: (id: number, vol: number) => set(state => (
            { trackSettings: { ...state.trackSettings, [id]: { ...state.trackSettings[id], volume: vol } } }
          )),
          toggleScheduledEvent: (timeId: string, instrumentId: number, emphasis: boolean) => set(state => {
            const existingTrigger = state.scheduledEvents.find(e => e.slice(0, -2) === `${timeId}|${instrumentId}`)
            return {
              scheduledEvents:
                (existingTrigger)
                  ? state.scheduledEvents.filter(sEvent => sEvent !== existingTrigger)
                  : [...state.scheduledEvents, `${timeId}|${instrumentId}|${emphasis ? "1" : "0"}`]
            }
          }),
        })
      ),
      { name: 'toness' }
    ),
    { name: "toness" }
  )
)

function getNewBars(activeBars: number, change: number): number {
  const newBars = activeBars + change;
  return (newBars > 0 && newBars < 5) ? newBars : activeBars
}

function getNewTracks(activeTracks: number, change: number): number {
  const newTracks = activeTracks + change;
  return (newTracks > 0 && newTracks < 9) ? newTracks : activeTracks
}

export const selectPadAudioUrl = (state: TonesState, id: number) => {
  const param = state.padParams[id]
  return param?.audioUrl
}

export const selectTrackSetting = (state: TonesState, id: number) => {
  return state.trackSettings[id]
}

export default useToneStore

