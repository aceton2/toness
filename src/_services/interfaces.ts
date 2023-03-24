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
}

export interface ToneParams {
  offset: number, // 0-99
  duration: number, // 0-99
  fadeOut: number, // 0-99
  fadeIn: number // 0-99
  pitchShift: number, // -48-48
}

export interface Slot {
    bar: number
    timeId: string
}

export type PadName = 'red' | 'sol' | 'gelb' | 'rot'

  // timeId: string (bar:quarter:sixteenth)
  // scheduledEvent: string (timeId|instrumentId)
  // transportEventId: number
