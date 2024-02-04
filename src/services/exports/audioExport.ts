import { Transport, context, start } from 'tone'
import useToneStore from '../../store/store';
import InstrumentsService from '../core/instruments';

async function saveRecording() {
    // the recorded audio is returned as a blob
    const recording = await InstrumentsService.controlRoomRecorder.stop();
    InstrumentsService.masterVolume.mute = true;
    // download the recording by creating an anchor element and blob url
    const url = URL.createObjectURL(recording);
    const anchor = document.createElement("a");
    anchor.download = "recording.webm";
    anchor.href = url;
    anchor.click();
    Transport.off("stop", saveRecording);
}

export async function recordAudio() {
    InstrumentsService.masterVolume.mute = false;
    const bars = useToneStore.getState().activeBars
    if (InstrumentsService.controlRoomRecorder.state !== "started") { InstrumentsService.controlRoomRecorder.start(); }
    if (context.state !== 'running') { await start() }
    Transport.on("stop", saveRecording)
    Transport.start().stop(`+${bars}:0:0`)
}
