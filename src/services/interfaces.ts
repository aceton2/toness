import { PitchShift, Player, Volume } from 'tone'

export interface Instrument extends TriggerEnvelop {
  id: number
  name: string
  source?: string
  playHigh?: Player
  playLow?: Player
  channelVolume: Volume
}

interface TriggerEnvelop {
  duration?: number
  offset?: number
  fadeIn?: number
  fadeOut?: number
  pitchShift?: PitchShift
}

/** 
 * convention for slot events -
 * timeId: string (bar:quarter:sixteenth)
 * transportEventId: number
 * emphasis: boolean
 * scheduledEvent: string (timeId|instrumentId|emphasis)
 */

// TRACK PARAMS

interface TrackParam {
  mute: boolean
  volume: number
}

export interface TrackParams {
  [id: number]: TrackParam
}

export const defaultTrackParams = {
  0: { mute: false, volume: 100 },
  1: { mute: false, volume: 100 },
  2: { mute: false, volume: 100 },
  3: { mute: false, volume: 100 },
  4: { mute: false, volume: 100 },
  5: { mute: false, volume: 100 },
  6: { mute: false, volume: 100 },
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


