import { Instrument, defaultPad, PadParams, EnvelopeParam } from "../interfaces";
import useToneStore from "../../store/store";
import InstrumentsService from "../instruments";

function loadSavedSamples() {
    InstrumentsService.pads.forEach(instrument => reloadFromLocalStorage(instrument))
}

async function reloadFromLocalStorage(instrument: Instrument) {
    const existingBlobStr = localStorage.getItem(`audioBlob_${instrument.id}`)
    if (existingBlobStr) {
        const res = await fetch(existingBlobStr);
        const blob = await res.blob();
        const audioURL = window.URL.createObjectURL(blob)
        addSample(audioURL, instrument)
    }
}

function addSample(audioURL: string, pad: Instrument) {
    pad.source = audioURL
    pad.playHigh?.load(pad.source)
    pad.playLow?.load(pad.source)
    if (pad.playHigh) {
        pad.playHigh.buffer.onload = () =>
            updateStoreActivePads(pad.id, { audioUrl: audioURL })
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

function updateStoreActivePads(id: number, newValues: any) {
    const padParams = useToneStore.getState().padParams
    useToneStore.getState().setPadParams(id, {
        ...padParams[id],
        ...newValues,
    })
}

function resetPad(id: number) {
    const inst = InstrumentsService.instruments[id]
    localStorage.removeItem(`audioBlob_${inst.id}`)
    inst.source = undefined
    updateStoreActivePads(inst.id, defaultPad)
}

useToneStore.subscribe((state) => state.padParams, syncPadParams)

const PadService = {
    loadSavedSamples,
    addSample,
    resetPad,
    clearPads,
}

export default PadService