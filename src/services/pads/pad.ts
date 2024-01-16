import { Player } from "tone";
import { Instrument, defaultPad, PadParams, EnvelopeParam } from "../interfaces";
import useToneStore from "../../store/store";
import NodesService from "../nodes";
import InstrumentsService from "../instruments";

async function reloadFromLocalStorage(instrument: Instrument) {
    const existingBlobStr = localStorage.getItem(`audioBlob_${instrument.id}`)
    if (existingBlobStr) {
        const res = await fetch(existingBlobStr);
        const blob = await res.blob();
        const audioURL = window.URL.createObjectURL(blob)
        addSample(audioURL, instrument.id)
    }
}

function addSample(audioURL: string, id: number) {
    const pad = InstrumentsService.instruments[id]
    if (pad && pad.pitchShift) {
        pad.audioURL = audioURL
        pad.player = new Player(audioURL);
        pad.player.chain(pad.pitchShift, pad.channelVolume)
        pad.channelVolume.fan(NodesService.controlRoomRecorder, NodesService.masterVolume)
        pad.player.buffer.onload = () => updateStoreActivePads(id, { audioUrl: audioURL })
    }
}

function syncPadParams(params: PadParams) {
    Object.entries(params).forEach(([key, envelope]) => {
        const id = parseInt(key)
        const i = InstrumentsService.instruments[id]
        if (i.player && envelope) {
            let unity = i.player.buffer.duration / 100
            i.offset = envelope[EnvelopeParam.offset] * unity
            i.duration = envelope[EnvelopeParam.duration] * unity
            i.player.fadeOut = envelope[EnvelopeParam.fadeOut] * unity
            i.player.fadeIn = envelope[EnvelopeParam.fadeIn] * unity
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
    inst.audioURL = undefined
    inst.player = undefined
    localStorage.removeItem(`audioBlob_${inst.id}`)
    updateStoreActivePads(inst.id, defaultPad)
}

useToneStore.subscribe((state) => state.padParams, syncPadParams)

const PadService = {
    reloadFromLocalStorage,
    addSample,
    resetPad,
    clearPads,
}

export default PadService