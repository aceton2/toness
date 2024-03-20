import { Key } from "tonal";
import styled from 'styled-components';
import { useRef } from "react";
import useToneStore from "../../store/store";

const ChordPlay = styled.div`
    margin-top: 15px;
    margin-left: var(--track-label-width);
`

const ChordPallete = styled.div`
    display: flex;
`;
const ChordChip = styled.div`
    background: var(--off-color-2);
    border-radius: 5px;
    width: 50px;
    margin-right: 5px;
    text-align: center;
    cursor: pointer;
`

const Arrangment = styled.div`
    margin-top: 5px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    height: 21px;
`
const Bar = styled.div`
    background: var(--off-color-2);
    padding: 3px;
    display: flex;
    border-radius: 3px;
    margin: 0px 2px;
    overflow: hidden;
`
const ChordArr = styled.div`
    background: var(--panel-color-1);
    color: var(--off-color-2);
    font-weight: bold;
    padding-left: 2px;
    flex: 1;
`

const key = Key.majorKey("C")
const chords = Array.prototype.concat(key.chords , key.secondaryDominants, ["Ø"]).filter(a => a.length > 0)



export default function Chords() {
    const currentDrag = useRef<string>()
    const [songArrangement, setArrangement] = useToneStore(state => [state.songArrangement, state.updateArrangement])
    const activeBars = useToneStore(state => state.activeBars)

    function ondrop(e: any, bar: number, cycleIndex: number) {
        e.preventDefault()
        if(currentDrag.current) {
            const barArr = songArrangement[cycleIndex][bar] || []
            const prunedBarArr = barArr.filter(c => c != currentDrag.current).filter((c, i) => i < 1)
            const newArragement = [...songArrangement]
            newArragement[cycleIndex][bar] = [currentDrag.current].concat(prunedBarArr)
            setArrangement(newArragement)
        }
    }

    function onCycleChange(add: boolean) {
        if(add) {
            console.log(songArrangement.concat([[]]))
            setArrangement(songArrangement.concat([[]]))
        } else {
            setArrangement(songArrangement.slice(0, -1))
        }
    }

    function onover(e: any) {
        e.preventDefault()
    }

    console.log(songArrangement)

    return <ChordPlay>
        <ChordPallete>
            <button onClick={() => onCycleChange(true)}>Add</button>
            <button onClick={() => onCycleChange(false)}>Sub</button>
            {chords.map((name: string) => (
                <ChordChip draggable={true} onDrag={() => currentDrag.current = name}>{name}</ChordChip>
            ))}
        </ChordPallete>
            { songArrangement.map((cycle, index) => 
                <Arrangment>
                {  Array.from(Array(activeBars).keys()).map(bar => (
                    <Bar onDrop={e=> ondrop(e, bar, index)} onDragOver={onover}>
                        { (cycle[bar] || []).map(chord => (<ChordArr>{ chord || "_"}</ChordArr>)) }
                    </Bar>
                    ))
                }
                </Arrangment>
            )}
    </ChordPlay>
}