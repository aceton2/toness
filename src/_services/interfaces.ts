import { Player } from 'tone'

export interface SoundCfg {
    id: number
    group: string
    name: string
    source: [Player, PlayRates]
  }
  
export interface PlayRates {
    duration?: number
    offset?: number
    fadeOut?: number
}

export interface Slot {
    bar: number
    id: string
  }
  
export interface ScheduledEvent {
    timeId: string
    instrumentId: number
    eventId?: number
}
