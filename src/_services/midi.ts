import { Midi, Header } from '@tonejs/midi'
import useToneStore from '../_store/store';

let midiJson: any;
const ppq = 96;
const midiCodes: {[key: number]: number} = {
    0: 36, // kick
    1: 38, // snare
    2: 42 // hat
}

const headerJson = {
    name: 'toness',
    ppq: ppq,
    meta: [],
    tempos: [],
    timeSignatures: [],
    keySignatures: [],
}

export async function createMidiJson(file: File) {
    const fileUrl = await URL.createObjectURL(file)
    midiJson = await Midi.fromUrl(fileUrl)
    console.log(midiJson);
}

/**
 * This takes a schedule of events and downloads the corresponding midi file
 * @returns void
 */ 
function createMidi(): Midi {
    const midi = new Midi()
    const header = new Header()
    header.fromJSON(headerJson)
    midi.header = header

    const track = midi.addTrack();
    const grid = useToneStore.getState().resolution === '8n' ? 8 : 16;
    const ticksPerSlot = ppq / (grid / 4);

    [0, 1, 2].forEach(instrument => {
        useToneStore.getState().scheduledEvents
            .map(eventId => {
                const split = eventId.split('|')
                return {timeId: split[0], instrumentId: parseInt(split[1])}
            })
            .filter(event => (grid === 16 ? true : !is16th(event.timeId)))
            .filter(event => event.instrumentId === instrument)
            .map(notes => convertTimeIdToSlotNumber(notes.timeId, grid))
            .sort((a, b) => a - b)
            .forEach(slot => {
                track.addNote({
                    midi: midiCodes[instrument],
                    ticks: slot * ticksPerSlot,
                    durationTicks: 1 * ppq
                })
            })
    })

    return midi
}

function is16th(timeId: string) {
    return ['0', '2'].indexOf(timeId.split(':')[2]) === -1
}

function convertTimeIdToSlotNumber(timeId: string, grid: number): number {
    const timeArray = timeId.split(':').map(i => parseInt(i))
    const slot = (timeArray[0] * grid) + timeArray[1] * (grid / 4) + timeArray[2] * (grid / 16);
    return slot
}


export async function saveFile() {
    const a = document.createElement('a');
    a.download = 'toness_export.mid';
    const midiObj = createMidi()
    a.href = URL.createObjectURL(
        new Blob([midiObj.toArray()], { type: 'application/octet-stream' })
    );
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
};
