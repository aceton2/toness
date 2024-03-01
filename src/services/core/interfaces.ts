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

export enum InstrumentType {
  stock, // always playable, source is never removed
  pad, // playable only when a source is added
  overdub, // plays over full loop. always triggered on 0:0:0 (plays only when source added)
}

export interface InstrumentDefn {
  name: string
  type: InstrumentType
  source?: string
  offset?: number
}

export interface Instrument extends TriggerEnvelop, InstrumentDefn {
  id: number
  channelVolume: Volume
  sampleVolume: Volume
  playHigh?: Player
  playLow?: Player
}

export interface TriggerEnvelop {
  pitchShift: PitchShift
  duration?: number
  fadeIn?: number
  fadeOut?: number
}

// PARAMS

export interface TrackParam {
  mute: boolean
  volume: number
  solo: boolean
}

export enum EnvelopeParam {
  duration,
  fadeOut,
  offset,
  fadeIn,
  pitchShift,
  amplitude
}

export interface InstrumentParam {
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

export interface InstrumentParams {
  [id: number]: InstrumentParam
};

export interface TrackParams {
  [id: number]: TrackParam
}
