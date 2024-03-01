import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { InstrumentParams, InstrumentParam, TrackParams, TrackParam, EnvelopeParam } from '../services/core/interfaces'
import InstrumentsService from '../services/core/instruments'
import TriggersService from '../services/transport/triggers'

export type GridResolutions = '16n' | '8n' | '8t'
export type GridSignature = '4' | '3'
export const STORE_VERSION = 1.8
const TRACKS_IDS = InstrumentsService.instruments.map(instrument => instrument.id)

interface TonesState {
  storeVersion: number,
  activeTimeIds: Array<string>,
  activeTracks: number,
  activeBars: number,
  signature: GridSignature,
  bpm: number,
  resolution: GridResolutions,
  instrumentParams: InstrumentParams,
  trackSettings: TrackParams,
  playbackSample: number,
  swing: number,
  setGridSignature: (sig: GridSignature) => void,
  setSwing: (swing: number) => void,
  setPlaybackSample: (s: number) => void,
  resetSequencer: () => void,
  changeBars: (bars: number) => void,
  changeTracks: (tracks: number) => void,
  scheduledEvents: Array<string>,
  addTriggerEvent: (timeId: string, instrumentId: number, emphasis: boolean) => void,
  removeTriggerEvent: (timeId: string, instrumentId: number) => void,
  removeTriggersForTrack: (instrumentId: number) => void,
  clearSchedule: () => void,
  setBpm: (bpm: string) => void,
  toggleResolution: (res: GridResolutions) => void,
  setActiveTimeIds: (slots: Array<string>) => void,
  setInstrumentParams: (id: number, params?: any) => void,
  setTrackVolume: (id: number, vol: number) => void,
  toggleTrackMute: (id: number) => void,
  toggleTrackSolo: (id: number) => void,
  resetTrackSetting: (id: number) => void,
  resetStore: () => void,
}

// INITIAL STATE

const defaultBPM = 124;

const defaultInstrument: InstrumentParam = {
  [EnvelopeParam.duration]: 99,
  [EnvelopeParam.fadeOut]: 20,
  [EnvelopeParam.offset]: 0,
  [EnvelopeParam.fadeIn]: 0,
  [EnvelopeParam.pitchShift]: 0,
  [EnvelopeParam.amplitude]: 0,
  custom: false,
  audioUrl: undefined // this means the audio is loaded into the player. change this to audio loaded
}

const defaultTrack: TrackParam = {
  mute: false,
  volume: 100,
  solo: false,
}

const defaultTrackParams = TRACKS_IDS.reduce<TrackParams>(
  (acc: TrackParams, curr) => (acc[curr] = { ...defaultTrack }, acc), {}
);
const defaultInstrumentParams = TRACKS_IDS.reduce<InstrumentParams>(
  (acc: InstrumentParams, curr) => (acc[curr] = { ...defaultInstrument }, acc as InstrumentParams), {}
);

const cleanSequencer = {
  activeTracks: 1, // SEQUENCER -> for setting mutes * WIDGET -> for setting track visibility
  activeBars: 1, // SEQUENCER -> for setting active slots
  signature: '4' as GridSignature,
  resolution: '8n' as GridResolutions,  // SEQUENCER -> for setting active slots * CONTROLS -> for button
  scheduledEvents: [], // SEQUENCER -> for transport sync * TOGGLE -> for step styling
  trackSettings: defaultTrackParams, // TONER -> for setting volume mutes * TRACK -> for showing state
}

const initialState = {
  storeVersion: STORE_VERSION,
  // listeners listed in comment
  activeTimeIds: [], // WIDGET -> for bar generation
  bpm: defaultBPM, // SEQUENCER -> for setting bpm * TEMPO -> for button
  swing: 0,
  instrumentParams: defaultInstrumentParams, // TONER -> for setting play params * PAD -> for setting controls
  playbackSample: -1, // which playback should play
  ...cleanSequencer
}


const useToneStore = create<TonesState>()(
  devtools(
    persist(
      subscribeWithSelector(
        (set, get) => ({
          ...initialState,
          resetStore: () => set(state => initialState, true, "resetStore"),
          resetSequencer: () => set(state => ({ ...cleanSequencer }), false, "resetSequencer"),
          setInstrumentParams: (id, params) => {
            // when instrument params are reverted we reset scheduling and track params
            if (!params) {
              get().resetTrackSetting(id)
              get().removeTriggersForTrack(id)
            }
            set(state => (
              getNewParams(state.instrumentParams, id, params)
            ), false, "setInstrumentParams")
          },
          changeBars: (bars: number) => set(state => ({ activeBars: getNewBars(state.activeBars, bars) })),
          changeTracks: (tracks: number) => set(state => ({ activeTracks: getNewTracks(state.activeTracks, tracks) })),
          setBpm: (bpm: string) => set(state => ({ bpm: parseInt(bpm) })),
          setSwing: (swing: number) => set(state => ({ swing }), false, "setSwing"),
          setGridSignature: (signature: GridSignature) => set(state => ({ signature }), false, "setSignature"),
          toggleResolution: (res: GridResolutions) => set(state => ({ resolution: res }), false, "toggleResolution"),
          setActiveTimeIds: (timeIds: Array<string>) => set(state => (
            { activeTimeIds: timeIds }
          ), false, "setActiveTimeIds"),
          clearSchedule: () => set(state => ({ scheduledEvents: [] })),
          // TRACK SETTINGS
          toggleTrackMute: (id) => set(state => (
            { trackSettings: { ...state.trackSettings, [id]: { ...state.trackSettings[id], mute: !state.trackSettings[id].mute, solo: false } } }
          ), false, "toggleTrackMute"),
          toggleTrackSolo: (id) => set(state => {
            if (state.trackSettings[id].solo) {
              return {
                trackSettings:
                  { ...state.trackSettings, [id]: { ...state.trackSettings[id], solo: false } }
              }
            }
            // when turning on turn all other solos off
            const newSettings: TrackParams = {}
            Object.keys(state.trackSettings).forEach((keyS: string) => {
              const key = parseInt(keyS)
              newSettings[key] = { ...state.trackSettings[key], solo: id === key }
              if (key === id) {
                newSettings[key].mute = false
              }
            })
            return { trackSettings: newSettings }
          }, false, "toggleTrackSolo"),
          setTrackVolume: (id: number, vol: number) => set(state => (
            { trackSettings: { ...state.trackSettings, [id]: { ...state.trackSettings[id], volume: vol } } }
          ), false, "toggleTrackVolume"),
          resetTrackSetting: (id: number) => set(state => (
            { trackSettings: { ...state.trackSettings, [id]: defaultTrack } }
          ), false, "toggleTrackSetting"),
          // TRIGGER EVENTS
          addTriggerEvent: (timeId: string, instrumentId: number, emphasis: boolean) => {
            get().removeTriggerEvent(timeId, instrumentId)
            set(state => (
              { scheduledEvents: [...state.scheduledEvents, `${timeId}|${instrumentId}|${emphasis ? "1" : "0"}`] }
            ), false, "addTriggerEvent")
          },
          removeTriggerEvent: (timeId: string, instrumentId: number) => set(state => {
            const existingTrigger = state.scheduledEvents.find(e => e.slice(0, -2) === `${timeId}|${instrumentId}`)
            return {
              scheduledEvents: state.scheduledEvents.filter(trigger => trigger !== existingTrigger)
            }
          }),
          removeTriggersForTrack: (instrumentId: number) => set(state => {
            return {
              scheduledEvents: state.scheduledEvents.filter(trigger =>
                TriggersService.parseTrigger(trigger).instrumentId !== instrumentId.toString())
            }
          }),
          //   )
          // PLAYBACK
          setPlaybackSample: (s: number) => {
            if (s > -1) {
              get().setBpm(InstrumentsService.playbacks[s].bpm.toString())
              get().setGridSignature('4')
            }
            set(state => ({ playbackSample: s }), false, "setPlaybackSample");
          }
        })
      ),
      { name: 'toness' }
    ),
    { name: "toness" }
  )
)

function getNewParams(existingParams: InstrumentParams, id: number, params?: any) {
  const newParam = { [id]: { ...existingParams[id], ...(params || defaultInstrument) } }
  return { instrumentParams: { ...existingParams, ...newParam } }
}

function getNewBars(activeBars: number, change: number): number {
  const newBars = activeBars + change;
  return (newBars > 0 && newBars < 5) ? newBars : activeBars
}

function getNewTracks(activeTracks: number, change: number): number {
  const newTracks = activeTracks + change;
  return (newTracks > 0 && newTracks <= InstrumentsService.instruments.length) ? newTracks : activeTracks
}

export const selectPadAudioUrl = (state: TonesState, id: number) => {
  const param = state.instrumentParams[id]
  return param?.audioUrl
}

export default useToneStore

