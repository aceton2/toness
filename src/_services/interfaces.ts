import { Player } from 'tone'

export interface Instrument {
    id: number
    name: string
    player?: Player
    duration?: number
    offset?: number
    fadeOut?: number
    padId?: number
  }

export interface Slot {
    bar: number
    timeId: string
}

export type PadName = 'red' | 'sol' | 'gelb' | 'rot'

  // timeId: string (bar:quarter:sixteenth)
  // scheduledEvent: string (timeId|instrumentId)
  // transportEventId: number
