import { PitchShift, Player, Volume, PolySynth } from "tone"
import { Instrument } from "./interfaces"
import NodesService from "./nodes"

// STOCKS

const drumDefaults = { duration: 2, fadeOut: 0.2, offset: 0 }

// NOTE: ID must correspond to place in array. CHANGE THIS
let stocks: Array<Instrument> = [
    { id: 0, name: 'kick', source: '/sounds/kick70.mp3', channelVolume: new Volume(0), ...drumDefaults, duration: 0.5 },
    { id: 1, name: 'snare', source: '/sounds/snare.mp3', channelVolume: new Volume(0), ...drumDefaults },
    { id: 2, name: 'hat', source: '/sounds/highhat.mp3', channelVolume: new Volume(0), ...drumDefaults },
]

let pads: Array<Instrument> = [
    { id: 3, name: '1', channelVolume: new Volume(0), pitchShift: new PitchShift() },
    { id: 4, name: '2', channelVolume: new Volume(0), pitchShift: new PitchShift() },
    { id: 5, name: '3', channelVolume: new Volume(0), pitchShift: new PitchShift() },
    { id: 6, name: '4', channelVolume: new Volume(0), pitchShift: new PitchShift() },
]

let overdub: Array<Instrument> = [
    { id: 7, name: 'overdub', channelVolume: new Volume(0) },
]

const instruments = stocks.concat(pads).concat(overdub)

// KEYS

const casio = new PolySynth().fan(NodesService.controlRoomRecorder, NodesService.keyboardRecorder, NodesService.masterVolume)

// TRIGGER

function getPlayInstrumentTrigger(id: number, emphasis: boolean): (arg0: number) => void {
    return (time) => {
        const instrument = instruments[id];
        const player = emphasis ? instrument.playHigh : instrument.playLow;
        // note: when we clear a pad we only need to remove the source
        if (!instrument.source || !player) { return }
        if (instrument.fadeOut) { player.fadeOut = instrument.fadeOut }
        player.start(time, instrument.offset, instrument.duration)
    }
}

// SIGNAL CHAIN

function wireSignalChain(instrument: Instrument) {
    instrument.channelVolume.fan(NodesService.controlRoomRecorder, NodesService.masterVolume)

    const fxAndVol = instrument.pitchShift
        ? instrument.pitchShift.chain(instrument.channelVolume)
        : instrument.channelVolume

    instrument.playHigh = new Player(instrument.source).chain(new Volume(0), fxAndVol)
    instrument.playLow = new Player(instrument.source).chain(new Volume(-8), fxAndVol)
}

function connectInstruments() {
    instruments.forEach(instrument => wireSignalChain(instrument))
}

const InstrumentsService = {
    stocks,
    pads,
    overdub: overdub[0],
    instruments,
    casio,
    connectInstruments,
    getPlayInstrumentTrigger,
}

export default InstrumentsService