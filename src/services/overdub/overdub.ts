import { Transport, context, start } from 'tone'
import NodesService from '../nodes'
import useToneStore from '../../store/store';
import InstrumentsService from '../instruments';
import PadService from '../pads/pad';
import BlobService from '../pads/blobStore';

async function saveRecording() {
    Transport.off("stop", saveRecording);

    const blob = await NodesService.keyboardRecorder.stop();
    const url = BlobService.storeBlob(blob, InstrumentsService.overdub.id)
    PadService.addSample(url, InstrumentsService.overdub)
    useToneStore.getState().toggleScheduledEvent("0:0:0", InstrumentsService.overdub.id, true)
}

async function recordOverdub() {
    if (context.state !== 'running') { await start() }

    await NodesService.keyboardRecorder.start()
    Transport.on("stop", saveRecording)
    Transport.start().stop(`+${useToneStore.getState().activeBars}:0:0`)
}

function deleteOverdub() {
    BlobService.deleteBlob(InstrumentsService.overdub.id)
    PadService.resetPad(InstrumentsService.overdub.id) // TODO this should remove schedules?
    useToneStore.getState().toggleScheduledEvent("0:0:0", InstrumentsService.overdub.id, true)
}

const OverdubService = {
    recordOverdub,
    deleteOverdub
}

export default OverdubService