import { PitchShift, Player, Volume } from 'tone'

export interface Instrument {
  id: number
  name: string
  player?: Player
  duration?: number
  offset?: number
  fadeOut?: number
  padId?: number,
  pitchShift?: PitchShift
  channelVolume: Volume
  audioURL?: string
}

/** 
 * convention for slot events -
 * timeId: string (bar:quarter:sixteenth)
 * scheduledEvent: string (timeId|instrumentId)
 * transportEventId: number
 */
export interface Slot {
  bar: number
  timeId: string
}

// TRACK PARAMS

interface TrackParam {
  mute: boolean
}

export interface TrackParams {
  [id: number]: TrackParam
}

export const defaultTrackParams = {
  0: { mute: false },
  1: { mute: false },
  2: { mute: false },
  3: { mute: false },
  4: { mute: false },
  5: { mute: false },
  6: { mute: false },
}

// PAD PARAMS

export enum EnvelopeParam {
  duration,
  fadeOut,
  offset,
  fadeIn,
  pitchShift,
  amplitude
}

export interface PadParam {
  [EnvelopeParam.duration]: number,
  [EnvelopeParam.fadeOut]: number,
  [EnvelopeParam.offset]: number,
  [EnvelopeParam.fadeIn]: number,
  [EnvelopeParam.pitchShift]: number,
  [EnvelopeParam.amplitude]: number,
  custom: boolean,
  audioUrl?: string
}

export type PadParams = {
  [key: number]: PadParam
};

// DEFAULTS 

export const defaultPad: PadParam = {
  [EnvelopeParam.duration]: 99,
  [EnvelopeParam.fadeOut]: 20,
  [EnvelopeParam.offset]: 0,
  [EnvelopeParam.fadeIn]: 0,
  [EnvelopeParam.pitchShift]: 0,
  [EnvelopeParam.amplitude]: 0,
  custom: false,
  audioUrl: undefined
}

export const defaultStoreParams: PadParams = {
  3: { ...defaultPad },
  4: { ...defaultPad },
  5: { ...defaultPad },
  6: { ...defaultPad }
}


