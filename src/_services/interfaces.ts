import { Player } from 'tone'

export interface Instrument {
    id: number
    name: string
    player: Player
    duration?: number
    offset?: number
    fadeOut?: number
  }

export interface Slot {
    bar: number
    timeId: string
  }

// timeId|instrumentId
