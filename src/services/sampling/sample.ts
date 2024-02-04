import { Instrument } from "../core/interfaces";
import useToneStore from "../../store/store";
import InstrumentsService from "../core/instruments";
import BlobService from "./blobStore";

function loadSavedSamples() {
    InstrumentsService.instruments.forEach(async instrument => {
        const audioURL = await BlobService.loadBlob(instrument.id)
        if (audioURL) {
            addSample(audioURL, instrument)
        }
    })
}

function addSample(audioURL: string, instrument: Instrument) {
    instrument.source = audioURL
    instrument.playHigh?.load(instrument.source)
    instrument.playLow?.load(instrument.source)
    if (instrument.playHigh) {
        instrument.playHigh.buffer.onload = () =>
            useToneStore.getState().setInstrumentParams(instrument.id, { audioUrl: audioURL })
    }
}

function removeSample(id: number) {
    const inst = InstrumentsService.instruments[id]
    BlobService.deleteBlob(inst.id)
    inst.source = undefined // this should be handled by resest of instrument params
    useToneStore.getState().setInstrumentParams(inst.id)
}

const SampleService = {
    loadSavedSamples,
    addSample,
    removeSample,
}

export default SampleService