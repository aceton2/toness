import { Player, Recorder, Volume, PitchShift } from 'tone'
import { Instrument, PadName, PadParams, EnvelopeParam, defaultPad } from './interfaces'
import useToneStore from '../_store/store';

// NODES

const controlRoomRecorder = new Recorder()
const masterVolume = new Volume(0).toDestination();

// INSTRUMENTS

function getDefaultSetup() {
  return {duration: 2, fadeOut: 0.2, offset: 0, channelVolume: new Volume(0)}
}

let instrumentsObj: {[key: string]: Instrument} = {
  kick: {id: 0, name: 'kick', player: new Player('/sounds/kick70.mp3'), ...getDefaultSetup(), duration: 0.5 },
  snare: {id: 1, name: 'snare', player: new Player('/sounds/snare.mp3'), ...getDefaultSetup(), duration: 2 },
  hat: {id: 2, name: 'hat', player: new Player('/sounds/highhat.mp3'), ...getDefaultSetup(), duration: 2 },
  red: {id: 3, name: 'red', player: undefined, ...getDefaultSetup(), pitchShift: new PitchShift() },
  sol: {id: 4, name: 'sol', player: undefined, ...getDefaultSetup(), pitchShift: new PitchShift() },
  gelb: {id: 5, name: 'gelb', player: undefined, ...getDefaultSetup(), pitchShift: new PitchShift() },
  rot: {id: 6, name: 'rot', player: undefined, ...getDefaultSetup(), pitchShift: new PitchShift() },
}
let instruments = Array.from(Object.values(instrumentsObj))

function addExistingSounds() {
  instruments.forEach(instrument => {
    if(instrument.player) {
      instrument.player.chain(instrument.channelVolume)
      instrument.channelVolume.fan(controlRoomRecorder, masterVolume)
    } else {
      reloadFromLS(instrument)
    }
  })
}

async function reloadFromLS(instrument: Instrument) {
  const existingBlobStr = localStorage.getItem(`audioBlob_${instrument.name}`)
  if(existingBlobStr) {
    const res = await fetch(existingBlobStr);
    const blob = await res.blob();
    const audioURL = window.URL.createObjectURL(blob)
    addSample(audioURL, instrument.name as PadName)
  }
}

function getPlayInstrumentTrigger(id: number): (arg0: number) => void {
  const instrument = instruments.find(i => i.id === id)
  if(instrument?.player && instrument?.fadeOut) { instrument.player.fadeOut = instrument.fadeOut }
  return (time) => instrument?.player?.start(time, instrument.offset, instrument.duration)
}

function addSample(audioURL: string, padName: PadName) {
  const pad = instruments.find(i => i.name === padName)
  if(pad && pad?.pitchShift) {
    pad.audioURL = audioURL
    pad.player = new Player(audioURL);
    pad.player.chain(pad.pitchShift, pad.channelVolume)
    pad.channelVolume.fan(controlRoomRecorder, masterVolume)    
  }
  updateStoreActivePads(padName, audioURL)
}

function syncPadParams(params: PadParams) {  
  Object.keys(params).forEach(padName => {
    const envelope = params[padName as PadName] 
    const i = instrumentsObj[padName]
    if(i.player && i.pitchShift && envelope) { // pads identified because they have pitch shift
      const unity = i.player.buffer.duration / 100
      i.offset = envelope[EnvelopeParam.offset] * unity
      i.duration = envelope[EnvelopeParam.duration]* unity
      i.player.fadeOut = envelope[EnvelopeParam.fadeOut] * unity
      i.player.fadeIn = envelope[EnvelopeParam.fadeIn] * unity
      if(i.pitchShift) {
        i.pitchShift.pitch = envelope[EnvelopeParam.pitchShift] / 2
      }
    }
  })
}

function clearPads() {
  instruments.forEach(i => {
    if(i.pitchShift) { // pads identified because they have pitch shift
      i.audioURL = undefined
      i.player = undefined
      localStorage.removeItem(`audioBlob_${i.name}`)
      updateStoreActivePads(i.name as PadName)
    }
  })
}

function getPadNames() {
  return instruments.filter(i => i.id > 2).map(i => i.name) as Array<PadName>
}

function updateStoreActivePads(padName: PadName, audioUrl?: string) {
  const padParams = useToneStore.getState().padParams
  useToneStore.getState().setPadParams(padName, {
    ...padParams[padName],  
    ...(audioUrl ? {audioUrl} : defaultPad) // if no audioUrl revert everything to default
  })
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

useToneStore.subscribe((state) => state.padParams, syncPadParams)

// EXPORTS

const TonerServiceIFace = {
  getPlayInstrumentTrigger,
  addSample,
  addExistingSounds,
  getInstruments: (): Array<Instrument> => instruments,
  getInstrumentByName: (name: string) => instrumentsObj[name],
  getPadNames,
  controlRoomRecorder,
  muteOutput,
  unmuteOutput,
  setVolume,
  clearPads,
}

export default TonerServiceIFace
