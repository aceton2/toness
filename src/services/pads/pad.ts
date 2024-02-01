import { Instrument, PadParams, EnvelopeParam } from "../interfaces";
import useToneStore from "../../store/store";
import InstrumentsService from "../instruments";
import BlobService from "./blobStore";

function loadSavedSamples() {
    InstrumentsService.instruments.forEach(async instrument => {
        const audioURL = await BlobService.loadBlob(instrument.id)
        if (audioURL) {
            addSample(audioURL, instrument)
        }
    })
}

function addSample(audioURL: string, pad: Instrument) {
    pad.source = audioURL
    pad.playHigh?.load(pad.source)
    pad.playLow?.load(pad.source)
    if (pad.playHigh) {
        pad.playHigh.buffer.onload = () =>
            useToneStore.getState().setPadParams(pad.id, { audioUrl: audioURL })
    }
}

function syncPadParams(params: PadParams) {
    Object.entries(params).forEach(([key, envelope]) => {
        const id = parseInt(key)
        const i = InstrumentsService.instruments[id]
        if (i.playHigh && envelope) {
            let unity = i.playHigh.buffer.duration / 100
            i.offset = envelope[EnvelopeParam.offset] * unity
            i.duration = envelope[EnvelopeParam.duration] * unity
            i.fadeOut = envelope[EnvelopeParam.fadeOut] * unity
            i.fadeIn = envelope[EnvelopeParam.fadeIn] * unity
            setVolume(id, envelope[EnvelopeParam.amplitude])
            if (i.pitchShift) {
                i.pitchShift.pitch = envelope[EnvelopeParam.pitchShift] / 2
            }
        }
    })
}

function setVolume(id: number, val: number) {
    if (InstrumentsService.instruments[id]) {
        InstrumentsService.instruments[id].channelVolume.volume.value = val
    }
}


function clearPads() {
    InstrumentsService.pads.forEach(i => {
        resetPad(i.id)
    })
}

function resetPad(id: number) {
    const inst = InstrumentsService.instruments[id]
    BlobService.deleteBlob(inst.id)
    inst.source = undefined // this should be handled by resest of pad params
    useToneStore.getState().setPadParams(inst.id)
}

useToneStore.subscribe((state) => state.padParams, syncPadParams)

const PadService = {
    loadSavedSamples,
    addSample,
    resetPad,
    clearPads,
}

export default PadService