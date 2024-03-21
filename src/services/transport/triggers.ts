import { Transport } from "tone";
import useToneStore from "../../store/store";
import InstrumentsService from "../core/instruments";
import GridService from "./grid";
import { Voicing, VoicingDictionary, VoiceLeading } from "tonal";

const triggerEventIds: { [key: string]: number } = {} // the key is a scheduledEvent
const prevChords: Array<number> = []

function scheduleActiveTriggers() {
    // from the scheduled events set in the store we take the subset available
    // based on resolution and bars in grid and schedule/unschedule them to the Transport 

    const arrangement = useToneStore.getState().songArrangement;
    const cycles = arrangement.length || 1;
    const barsPercussion = useToneStore.getState().activeBars;
    Transport.setLoopPoints(0, `${barsPercussion * cycles}m`)

    setArrangement()

    const activeScheduledEvents = Object.keys(triggerEventIds);
    activeScheduledEvents.forEach(event => unschedule(event))

    for (let i = 0; i < cycles; i++) {
        getActiveEvents().map(event => {
            const cycleBar = parseInt(event[0]) + (i * barsPercussion)
            schedule(`${cycleBar}${event.substring(1)}`)
        })
    }
}

function getActiveEvents() {
    const resolution = useToneStore.getState().resolution
    const activeBars = useToneStore.getState().activeBars
    const signature = useToneStore.getState().signature
    const allEvents = useToneStore.getState().scheduledEvents
    return allEvents.filter(event => {
        const sixteenth = parseTrigger(event).timeId.split(':')[2];
        switch (resolution) {
            case "8n": return ['0', '2'].indexOf(sixteenth) !== -1 // only keep eigths
            case "16n": return sixteenth.indexOf(".") === -1 // remove triplets
            case "8t": return ['1', '2', '3'].indexOf(sixteenth) === -1 // remove straight 16 and 8
            default: return true
        }
    }).filter(event => {
        const timeId = parseTrigger(event).timeId
        const { bar, quarter, sixteenth } = GridService.parseTimeId(timeId)
        return bar < activeBars && quarter < parseInt(signature)
    })
}

function schedule(scheduledEvent: string) {
    const [timeId, instrumentId, emphasis] = scheduledEvent.split('|')
    const triggerFunction = InstrumentsService.getPlayInstrumentTrigger(parseInt(instrumentId), emphasis === "1")
    triggerEventIds[scheduledEvent] = Transport.schedule(time => triggerFunction(time), timeId)
}

function unschedule(scheduledEvent: string) {
    Transport.clear(triggerEventIds[scheduledEvent])
    delete triggerEventIds[scheduledEvent]
}

function parseTrigger(scheduledEvent: string) {
    const [timeId, instrumentId, emphasis] = scheduledEvent.split('|')
    return {
        timeId,
        instrumentId,
        emphasized: emphasis === "1",
    }
}

function setArrangement() {
    const barsPercussion = useToneStore.getState().activeBars;
    prevChords.forEach(id => Transport.clear(id))
    useToneStore.getState().songArrangement.forEach((cycle, cycleIndex) => {
        cycle.forEach((bar, barIndex) => {
            (bar || []).forEach((chord, chordIndex) => {
                const toPlay = Voicing.search(chord, ["B3", "D5"], VoicingDictionary.defaultDictionary)
                const triggerBar = barIndex + (cycleIndex * barsPercussion)
                const triggerEights = chordIndex === 1 ? 2 : 0;
                const scheduled = Transport.schedule((time) => {
                    InstrumentsService.chords.playSampler?.triggerAttackRelease(toPlay[0], 0.60);
                }, `${triggerBar}:${triggerEights}:0`);
                prevChords.push(scheduled)
            })
        })
    })
}

const TriggersService = {
    scheduleActiveTriggers,
    parseTrigger,
}

export default TriggersService
