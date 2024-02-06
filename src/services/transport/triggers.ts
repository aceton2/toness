import { Transport } from "tone";
import useToneStore from "../../store/store";
import InstrumentsService from "../core/instruments";
import GridService from "./grid";

const triggerEventIds: { [key: string]: number } = {} // the key is a scheduledEvent

function scheduleActiveTriggers() {
    // from the scheduled events set in the store we take the subset available
    // based on resolution and bars in grid and schedule/unschedule them to the Transport 
    const activeScheduledEvents = Object.keys(triggerEventIds);
    activeScheduledEvents.forEach(event => unschedule(event))
    getActiveEvents().forEach(event => schedule(event))
    Transport.setLoopPoints('0:0:0', `${useToneStore.getState().activeBars}:0:0`)
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

const TriggersService = {
    scheduleActiveTriggers,
    parseTrigger,
}

export default TriggersService
