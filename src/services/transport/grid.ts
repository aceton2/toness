import useToneStore, { GridResolutions } from "../../store/store";
import { Slot } from "../interfaces";

// SLOTS set the ActiveSlots in the store are used
// for the actual UI Grid displayed in the widget

const eigthSubs = {
    '8n': ['0', '2'],
    '16n': ['0', '1', '2', '3'],
    '8t': ['0', '1.33', '2.66'],
}

function generateSlots(res: GridResolutions, bars: number): Array<Slot> {
    const slots: Array<Slot> = [];
    [0, 1, 2, 3].slice(0, bars).forEach(barNum => {
        ['0', '1', '2', '3'].forEach((quarterNum) => {
            eigthSubs[res].forEach((sixNum) =>
                slots.push({
                    bar: barNum,
                    timeId: `${barNum}:${quarterNum}:${sixNum}`,
                })
            )
        })
    })
    return slots
}

function setGridSlots() {
    const bars = useToneStore.getState().activeBars
    const res = useToneStore.getState().resolution

    const activeSlots = generateSlots(res, bars)
    useToneStore.getState().setActiveSlots(activeSlots)
}


const GridService = {
    setGridSlots
}

export default GridService