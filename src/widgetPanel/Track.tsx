import { useState } from 'react'
import styled from 'styled-components'
import TonerService from '../_services/toner'
import useToneStore from '../_store/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophoneLinesSlash } from '@fortawesome/free-solid-svg-icons';

const TrackWithLabel = styled.div`
  display: flex;
  height: 60px;
  position: relative;
`
const Mask = styled.div`
  position: absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  background: none;
  z-index: 2;
`

const Label = styled.div`
  width: var(--track-label-width);
  margin: 2px;
  padding: 5px;
  border-radius: 5px;
  background: var(--off-color-2);
  opacity: 0.9;
  cursor: pointer;

  & svg {
    width: 50%;
    height: 50%;
    color: var(--off-color-1);
    margin-left: 20%;
    padding-top:5px;
  }
`

// INPUT SHOULD BE CHANGED
// https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/

const Controls = styled.div`
  & input {
    width: 80%;
    accent-color: var(--off-color-1);
    cursor: pointer;
    height: 2px;
    margin-top: 1.5rem;
  }
`

const TrackBars = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`

interface SoundProps {
  name: string
  children: any
}

export default function Track(props: SoundProps) {
  const instrument = TonerService.getInstrumentByName(props.name)
  const [volume, setVolume] = useState(0)
  const hasSound = useToneStore(state => state.activeInstruments.indexOf(props.name) !== -1)

  function playInstrument() {
    if(instrument?.player) {
      instrument.player.start()
    }
  }

  function changeVolume(value: string) {
    TonerService.setVolume(props.name, parseFloat(value))
    setVolume(parseFloat(value))
  }

  return (
    <TrackWithLabel>
      { !hasSound ? <Mask /> : '' }
      <Label onClick={playInstrument}>
        <div>{props.name}</div>
        { hasSound ?
          <Controls>
            <input type="range" 
              value={volume} 
              max={12}
              min={-12}
              onChange={e => changeVolume(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          </Controls>
          : <FontAwesomeIcon icon={faMicrophoneLinesSlash}></FontAwesomeIcon> }
      </Label>
      <TrackBars>{props.children}</TrackBars>
    </TrackWithLabel>
  )
}
