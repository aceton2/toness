import { Player, Recorder, Volume, PitchShift } from 'tone'
import { Instrument, PadName, ToneParams } from './interfaces'

// NODES

const controlRoomRecorder = new Recorder()
const masterVolume = new Volume(0).toDestination();

// INSTRUMENTS

const padDefault = {duration: 2, fadeOut: 0.2, offset: 0}

let instrumentsObj: {[key: string]: Instrument} = {
  kick: {id: 0, name: 'kick', player: new Player('/sounds/kick70.mp3'), ...padDefault, duration: 0.5, channelVolume: new Volume(0) },
  snare: {id: 1, name: 'snare', player: new Player('/sounds/snare.mp3'), ...padDefault, duration: 2, channelVolume: new Volume(0) },
  hat: {id: 2, name: 'hat', player: new Player('/sounds/highhat.mp3'), ...padDefault, duration: 2, channelVolume: new Volume(0) },
  red: {id: 3, name: 'red', player: undefined, ...padDefault, pitchShift: new PitchShift(), channelVolume: new Volume(0) },
  sol: {id: 4, name: 'sol', player: undefined, ...padDefault, pitchShift: new PitchShift(), channelVolume: new Volume(0) },
  gelb: {id: 5, name: 'gelb', player: undefined, ...padDefault, pitchShift: new PitchShift(), channelVolume: new Volume(0) },
  rot: {id: 6, name: 'rot', player: undefined, ...padDefault, pitchShift: new PitchShift(), channelVolume: new Volume(0) },
}
let instruments = Array.from(Object.values(instrumentsObj))

function addDrums() {
  [0, 1, 2].forEach(id => {
    const instrument = instruments.find(i => i.id === id)
    if(instrument?.player) {
      instrument.player.chain(instrument.channelVolume)
      instrument.channelVolume.fan(controlRoomRecorder, masterVolume)
    }
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
    pad.player.chain(pad.pitchShift, pad.channelVolume)
    pad.channelVolume.fan(controlRoomRecorder, masterVolume)    
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

function setVolume(name: string, val: number) {
  if(instrumentsObj[name]) {
    instrumentsObj[name].channelVolume.volume.value = val
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
  getInstrumentByName: (name: string) => instrumentsObj[name],
  getPadNames: () => instruments.filter(i => i.id > 2).map(i => i.name) as Array<PadName>,
  updateInstrumentParams,
  controlRoomRecorder,
  muteOutput,
  unmuteOutput,
  setVolume,
}

export default TonerServiceIFace
