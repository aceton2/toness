import { PitchShift, Player, Volume } from 'tone'

export interface Instrument {
    id: number
    name: string
    player?: Player
    duration: number
    offset: number
    fadeOut: number
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



// PAD PARAMS

export enum EnvelopeParam {
  duration,
  fadeOut, 
  offset, 
  fadeIn, 
  pitchShift
}

export interface PadParam {
  [EnvelopeParam.duration]: number,
  [EnvelopeParam.fadeOut]: number,
  [EnvelopeParam.offset]: number,
  [EnvelopeParam.fadeIn]: number,
  [EnvelopeParam.pitchShift]: number,
  custom: boolean,
  audioUrl?: string
}

export type PadParams = {
  red: PadParam,
  sol: PadParam,
  gelb: PadParam,
  rot: PadParam,
};

// DEFAULTS 

export const defaultPad: PadParam = { 
  [EnvelopeParam.duration]: 99, 
  [EnvelopeParam.fadeOut]: 20, 
  [EnvelopeParam.offset]: 0, 
  [EnvelopeParam.fadeIn]: 20, 
  [EnvelopeParam.pitchShift]: 0,
  custom: false,
  audioUrl: undefined
}

export const defaultStoreParams: PadParams = {
  red: {...defaultPad},
  sol: {...defaultPad},
  gelb: {...defaultPad},
  rot: {...defaultPad}
}

export type PadName = keyof typeof defaultStoreParams

