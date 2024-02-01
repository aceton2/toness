import { PitchShift, Player, Volume } from 'tone'

// TRIGGERS

/** 
 * convention for slot events -
 * timeId: string (bar:quarter:sixteenth)
 * transportEventId: number
 * emphasis: boolean
 * scheduledEvent: string (timeId|instrumentId|emphasis)
 */

// INSTRUMENTS
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

// PARAMS

export interface TrackParam {
  mute: boolean
  volume: number
}

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

// STORE INTERFACES

export interface PadParams {
  [id: number]: PadParam
};

export interface TrackParams {
  [id: number]: TrackParam
}
