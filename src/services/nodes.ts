import { Recorder, Volume } from 'tone'

const controlRoomRecorder = new Recorder()
const masterVolume = new Volume(0).toDestination();

function muteOutput() {
  masterVolume.mute = true;
}

function unmuteOutput() {
  masterVolume.mute = false;
}

// EXPORTS

const NodesService = {
  controlRoomRecorder,
  muteOutput,
  unmuteOutput,
  masterVolume,
}

export default NodesService
