import { Transport, context, start, Loop, Emitter } from 'tone'
import ToneStore from '../../store/store';
import InstrumentsService from '../core/instruments';
import TriggersService from './triggers';
import GridService from './grid';
import PadService from '../sampling/sample';
import useToneStore from '../../store/store';

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

function syncTrackSettings() {
  const trackSettings = ToneStore.getState().trackSettings
  InstrumentsService.instruments.forEach(i => {
    i.channelVolume.volume.value = -12 * (100 - trackSettings[i.id].volume) / 100
    i.channelVolume.mute = trackSettings[i.id].mute
  })
}

// START-STOP CONTROLS

function clearTransport() {
  Transport.cancel()
  syncSwing()
}

function syncSwing() {
  Transport.swing = useToneStore.getState().swing / 100
}

function syncSignature() {
  Transport.timeSignature = parseInt(useToneStore.getState().signature)
}

function syncPlaybackSample() {
  const playback = useToneStore.getState().playbackSample
  InstrumentsService.playbacks.forEach(pb => pb.player.stop())
  if (playback !== -1) {
    const i = InstrumentsService.playbacks[playback]
    Transport.scheduleOnce((time) => i.player.start(time), "0:0:0")
  }
}

function toggleTransport(): void {
  Transport.state === 'stopped' ? startTransport() : stopTransport()
}

function stopTransport() {
  InstrumentsService.playbacks.forEach(pb => pb.player.stop())
  Transport.stop()
}

async function startTransport() {
  if (context.state !== 'running') {
    await start()
  }
  syncPlaybackSample()
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
  syncTrackSettings()
  syncSignature()
  syncBpm(ToneStore.getState().bpm)

  unSubs = [
    ToneStore.subscribe((state) => state.activeTracks, syncActiveTracks),
    ToneStore.subscribe((state) => state.bpm, syncBpm),
    ToneStore.subscribe((state) => state.trackSettings, syncTrackSettings),
    ToneStore.subscribe((state) => state.resolution, syncStepEmitter),
    ToneStore.subscribe((state) => state.signature, syncSignature),
    ToneStore.subscribe((state) => state.swing, syncSwing),
    ToneStore.subscribe((state) => state.playbackSample, syncPlaybackSample),
    // visual grid
    ToneStore.subscribe((state) => state.activeBars, GridService.setGridTimeIds),
    ToneStore.subscribe((state) => state.resolution, GridService.setGridTimeIds),
    ToneStore.subscribe((state) => state.signature, GridService.setGridTimeIds),
    // scheduled triggers
    ToneStore.subscribe((state) => state.activeBars, TriggersService.scheduleActiveTriggers),
    ToneStore.subscribe((state) => state.resolution, TriggersService.scheduleActiveTriggers),
    ToneStore.subscribe((state) => state.signature, TriggersService.scheduleActiveTriggers),
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