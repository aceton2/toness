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

export let blobType = {type: "audio/ogg; codecs=opus"}

  // timeId: string (bar:quarter:sixteenth)
  // scheduledEvent: string (timeId|instrumentId)
  // transportEventId: number
