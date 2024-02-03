import { Transport, context, start, Loop, Emitter } from 'tone'
import PadService from '../sampling/pad';
import { TrackParams } from '../interfaces'
import ToneStore from '../../store/store';
import InstrumentsService from '../instruments';
import TriggersService from './triggers';
import GridService from './grid';

// SETTING SYNCS

function syncActiveTracks() {
  const tracks = ToneStore.getState().activeTracks
  InstrumentsService.instruments.forEach((inst, index) => {
    inst.channelVolume.mute = index >= tracks
  })
}

function syncBpm(val: number): void {
  Transport.bpm.value = val
}

function syncTrackSettings(trackSettings: TrackParams) {
  InstrumentsService.instruments.forEach(i => {
    i.channelVolume.volume.value = -12 * (100 - trackSettings[i.id].volume) / 100
    i.channelVolume.mute = trackSettings[i.id].mute
  })
}

// START-STOP CONTROLS

function clearTransport() {
  Transport.cancel()
}

function toggleTransport(): void {
  Transport.state === 'stopped' ? startTransport() : Transport.stop()
}

async function startTransport() {
  if (context.state !== 'running') {
    await start()
  }
  Transport.loop = true
  Transport.start()
}

function addKeyboardListener() {
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      toggleTransport()
    }
  })
}

// EMITTERS

let stepEmitter = new Emitter()
let stepper: Loop | null

function syncStepEmitter() {
  if (stepper) {
    stepper.interval = ToneStore.getState().resolution
  }
}

function linkStepEmitter() {
  stepper = new Loop((time) => {
    stepEmitter.emit('step', (Transport.position as string).split('.')[0])
  }, ToneStore.getState().resolution)
  stepper.start(0)

  Transport.on('stop', () => stepEmitter.emit('step', 'stop'))
}

// INIT

let unSubs: Array<() => void>;

function initSequencer() {

  clearTransport()
  linkStepEmitter()
  addKeyboardListener()
  InstrumentsService.connectInstruments()
  PadService.loadSavedSamples()
  GridService.setGridTimeIds()
  TriggersService.scheduleActiveTriggers()

  syncActiveTracks()
  syncBpm(ToneStore.getState().bpm)

  unSubs = [
    ToneStore.subscribe((state) => state.activeTracks, syncActiveTracks),
    ToneStore.subscribe((state) => state.bpm, syncBpm),
    ToneStore.subscribe((state) => state.trackSettings, syncTrackSettings),
    ToneStore.subscribe((state) => state.resolution, syncStepEmitter),
    // visual grid
    ToneStore.subscribe((state) => state.activeBars, GridService.setGridTimeIds),
    ToneStore.subscribe((state) => state.resolution, GridService.setGridTimeIds),
    // scheduled triggers
    ToneStore.subscribe((state) => state.activeBars, TriggersService.scheduleActiveTriggers),
    ToneStore.subscribe((state) => state.resolution, TriggersService.scheduleActiveTriggers),
    ToneStore.subscribe((state) => state.scheduledEvents, TriggersService.scheduleActiveTriggers),
  ];
}

function unsubSequencerSubscriptions() {
  unSubs.forEach(unsub => unsub())
}

const SequencerService = {
  initSequencer,
  unsubSequencerSubscriptions,
  stepEmitter,
  clearTransport,
  toggleTransport,
}

export default SequencerService