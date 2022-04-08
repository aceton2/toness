import { useState } from 'react';
import styled from 'styled-components';
import Toner from '../_services/toner.js';

const ControlBox = styled.div`
    margin-bottom: 1rem;
    position: relative;

    button {
        margin-right: 0.5rem;
    }
`;

export default function Controls(props) {

    const [bpm, setBpm] = useState(Toner.getDefaults().bpm);

    function handleChange(e) {
        setBpm(e.target.value)
        Toner.setBpm(e.target.value)
    }

    function addBar() {
        let newBars = props.bars + 1;
        if (newBars < 5) {
            props.setBars(newBars);
            Toner.setLoopEnd(newBars);
        }
    }

    function removeBar() {
        let newBars = props.bars - 1;
        if (newBars > 0) {
            props.setBars(newBars);
            Toner.setLoopEnd(newBars);
        }
    }

    function clearAll() {
        Toner.clearAll();
    }

    function toggleTransporter() {
        Toner.toggle();
        document.activeElement.blur(); // to avoid cross-canceling with spacebar listener
    }

    return (
        <ControlBox>
            <button onClick={toggleTransporter}>start/stop</button>
            <button onClick={props.addTrack}>+T</button>
            <button onClick={props.removeTrack}>-T</button>
            <button onClick={clearAll}>clear steps</button>
            <button onClick={addBar}>add bar</button>
            <button onClick={removeBar}>remove bar</button>

            <input
                type="range"
                min="33"
                max="330"
                step="1"
                value={bpm}
                onChange={handleChange} />
            {bpm}
        </ControlBox>
    );
}