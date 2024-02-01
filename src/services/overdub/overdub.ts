import { Transport, context, start, Player } from 'tone'
import NodesService from '../nodes'
import useToneStore from '../../store/store';
import InstrumentsService from '../instruments';

async function saveRecording() {
    const recording = await NodesService.keyboardRecorder.stop();
    const overdub = InstrumentsService.overdub
    overdub.source = URL.createObjectURL(recording)
    overdub.playHigh?.load(overdub.source)
    useToneStore.getState().toggleScheduledEvent("0:0:0", overdub.id, true)
    Transport.off("stop", saveRecording);
}

async function recordOverdub() {
    if (context.state !== 'running') { await start() }

    const bars = useToneStore.getState().activeBars

    await NodesService.keyboardRecorder.start()
    Transport.on("stop", saveRecording)
    Transport.start().stop(`+${bars}:0:0`)
}

function deleteOverdub() {
    useToneStore.getState().toggleScheduledEvent("0:0:0", InstrumentsService.overdub.id, true)
}

const OverdubService = {
    recordOverdub,
    deleteOverdub
}

export default OverdubService