import { PitchShift, Player, Volume } from "tone"
import { Instrument } from "./interfaces"

// STOCKS

const drumDefaults = { duration: 2, fadeOut: 0.2, offset: 0 }

let stocks: Array<Instrument> = [
    { id: 0, name: 'kick', player: new Player('/sounds/kick70.mp3'), channelVolume: new Volume(0), ...drumDefaults, duration: 0.5 },
    { id: 1, name: 'snare', player: new Player('/sounds/snare.mp3'), channelVolume: new Volume(0), ...drumDefaults },
    { id: 2, name: 'hat', player: new Player('/sounds/highhat.mp3'), channelVolume: new Volume(0), ...drumDefaults },
]

let pads: Array<Instrument> = [
    { id: 3, name: '1', player: undefined, channelVolume: new Volume(0), pitchShift: new PitchShift() },
    { id: 4, name: '2', player: undefined, channelVolume: new Volume(0), pitchShift: new PitchShift() },
    { id: 5, name: '3', player: undefined, channelVolume: new Volume(0), pitchShift: new PitchShift() },
    { id: 6, name: '4', player: undefined, channelVolume: new Volume(0), pitchShift: new PitchShift() },
]

const instruments = stocks.concat(pads)

// TRIGGERS

function getPlayInstrumentTrigger(id: number): (arg0: number) => void {
    const instrument = instruments[id]
    if (instrument?.player && instrument?.fadeOut) { instrument.player.fadeOut = instrument.fadeOut }
    return (time) => instrument?.player?.start(time, instrument.offset, instrument.duration)
}

const InstrumentsService = {
    stocks,
    pads,
    instruments,
    getPlayInstrumentTrigger,
}

export default InstrumentsService