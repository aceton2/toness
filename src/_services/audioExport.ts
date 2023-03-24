import { Transport, context, start } from 'tone'
import TonerService from './toner'
import useToneStore from '../_store/store';

async function saveRecording() {
    // the recorded audio is returned as a blob
    const recording = await TonerService.controlRoomRecorder.stop();
    TonerService.unmuteOutput();
    // download the recording by creating an anchor element and blob url
    const url = URL.createObjectURL(recording);
    const anchor = document.createElement("a");
    anchor.download = "recording.webm";
    anchor.href = url;
    anchor.click();
    Transport.off("stop", saveRecording);
}

export async function recordAudio() {
    TonerService.muteOutput()
    const bars = useToneStore.getState().activeBars
    if(TonerService.controlRoomRecorder.state !== "started") { TonerService.controlRoomRecorder.start(); }
    if (context.state !== 'running') { await start() }
    Transport.on("stop", saveRecording)
    Transport.start().stop(`+${bars}:0:0`)
}
