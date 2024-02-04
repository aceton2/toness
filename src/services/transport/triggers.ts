import { Transport } from "tone";
import useToneStore from "../../store/store";
import InstrumentsService from "../core/instruments";

const triggerEventIds: { [key: string]: number } = {} // the key is a scheduledEvent

function scheduleActiveTriggers() {
    // from the scheduled events set in the store we take the subset available
    // based on resolution and bars in grid and schedule/unschedule them to the Transport 
    const activeScheduledEvents = Object.keys(triggerEventIds);
    const desiredScheduledEvents = getActiveEvents()
    desiredScheduledEvents.forEach(scheduledEvent => {
        if (activeScheduledEvents.indexOf(scheduledEvent) === -1) { schedule(scheduledEvent) }
    })
    activeScheduledEvents.forEach(scheduledEvent => {
        if (desiredScheduledEvents.indexOf(scheduledEvent) === -1) { unschedule(scheduledEvent) }
    })
    Transport.setLoopPoints('0:0:0', `${useToneStore.getState().activeBars}:0:0`)
}

function getActiveEvents() {
    const resolution = useToneStore.getState().resolution
    const bar = useToneStore.getState().activeBars
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
        const eventBar = event.split('|')[0].split(':')[0]
        return parseInt(eventBar) < bar // only keep active bars
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
