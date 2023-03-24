import { Player, Recorder, Volume, PitchShift } from 'tone'
import { Instrument, PadName, ToneParams } from './interfaces'

// NODES

const controlRoomRecorder = new Recorder()
const masterVolume = new Volume(0).toDestination();

// INSTRUMENTS

const padDefault = {duration: 2, fadeOut: 0.2, offset: 0}

let instruments: Array<Instrument> = [
  {id: 0, name: 'kick', player: new Player('/sounds/kick70.mp3'), ...padDefault, duration: 0.5 },
  {id: 1, name: 'snare', player: new Player('/sounds/snare.mp3'), ...padDefault, duration: 2 },
  {id: 2, name: 'hat', player: new Player('/sounds/highhat.mp3'), ...padDefault, duration: 2 },
  // pads
  {id: 3, name: 'red', player: undefined, ...padDefault, pitchShift: new PitchShift() },
  {id: 4, name: 'sol', player: undefined, ...padDefault, pitchShift: new PitchShift() },
  {id: 5, name: 'gelb', player: undefined, ...padDefault, pitchShift: new PitchShift() },
  {id: 6, name: 'rot', player: undefined, ...padDefault, pitchShift: new PitchShift() },
]

function addDrums() {
  [0, 1, 2].forEach(id => {
    const instrument = instruments.find(i => i.id === id)
    instrument?.player?.fan(controlRoomRecorder, masterVolume)
  })
}

function getPlayInstrumentTrigger(id: number): (arg0: number) => void {
  const instrument = instruments.find(i => i.id === id)
  if(instrument?.player && instrument?.fadeOut) { instrument.player.fadeOut = instrument.fadeOut }
  return (time) => instrument?.player?.start(time, instrument.offset, instrument.duration)
}

function addSample(audioURL: string, padName: PadName) {
  const pad = instruments.find(i => i.name === padName)
  if(pad && pad?.pitchShift) {
    pad.player = new Player(audioURL);
    pad.pitchShift.fan(controlRoomRecorder, masterVolume)
    pad.player.connect(pad.pitchShift)
  }
}

function updateInstrumentParams(instrument: Instrument, params: ToneParams) {  
  if(instrument.player) {
    instrument.offset = (params.offset / 100) * instrument.player.buffer.duration
    instrument.duration = (params.duration / 100) * instrument.player.buffer.duration 
    instrument.player.fadeOut = (params.fadeOut / 100) * instrument.player.buffer.duration
    instrument.player.fadeIn = (params.fadeIn / 100) * instrument.player.buffer.duration
    if(instrument.pitchShift) {
      instrument.pitchShift.pitch = params.pitchShift / 2
    }
  }
}

function muteOutput() {
  masterVolume.mute = true;
}

function unmuteOutput() {
  masterVolume.mute = false;
}

// DEFAULT INIT

function runInit() {
  addDrums()
}

runInit()

// EXPORTS

const TonerServiceIFace = {
  getPlayInstrumentTrigger,
  addSample,
  getInstruments: (): Array<Instrument> => instruments,
  getPadNames: () => instruments.filter(i => i.id > 2).map(i => i.name) as Array<PadName>,
  getPadByName: (name: string) => instruments.find(i => i.name === name),
  updateInstrumentParams,
  controlRoomRecorder,
  muteOutput,
  unmuteOutput,
}

export default TonerServiceIFace
