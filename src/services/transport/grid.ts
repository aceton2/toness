import useToneStore, { GridResolutions } from "../../store/store";

// TimeIds set the ActiveSlots in the store are used
// to generate the UI Grid displayed in the Sequencer component
const quarterNoteDivisions = {
    '8n': ['0', '2'],
    '16n': ['0', '1', '2', '3'],
    '8t': ['0', '1.33', '2.66'],
}
const sixteenthNoteGuides = {
    '1': 'e',
    '2': '+',
    '3': 'a',
}

function generateTimeIds(res: GridResolutions, bars: number): Array<string> {
    const timeIds: Array<string> = [];
    [0, 1, 2, 3].slice(0, bars).forEach(barNum => {
        ['0', '1', '2', '3'].forEach((quarterNum) => {
            quarterNoteDivisions[res].forEach((sixNum) =>
                timeIds.push(`${barNum}:${quarterNum}:${sixNum}`)
            )
        })
    })
    return timeIds
}

function setGridTimeIds() {
    const bars = useToneStore.getState().activeBars
    const res = useToneStore.getState().resolution

    const activeTimeIds = generateTimeIds(res, bars)
    useToneStore.getState().setActiveTimeIds(activeTimeIds)
}

function timeIdToGuideName(timeId: any): string | undefined {
    const { bar, quarter, sixteenth } = parseTimeId(timeId)
    const str16 = sixteenth.split(".")[0] as '1' | '2' | '3'
    return sixteenth === '0' ? (quarter + 1).toString() : sixteenthNoteGuides[str16]
}

function parseTimeId(timeId: string): { bar: number, quarter: number, sixteenth: string } {
    const [bar, quarter, sixteenth] = timeId.split('|')[0].split(':')
    return { bar: parseInt(bar), quarter: parseInt(quarter), sixteenth }
}


const GridService = {
    setGridTimeIds,
    timeIdToGuideName,
    parseTimeId
}

export default GridService