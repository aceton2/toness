import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import TonerService from '../_services/toner'

const TrackWithLabel = styled.div`
  display: flex;
  height: 60px;
`

const Label = styled.div`
  width: var(--track-label-width);
  padding: 2px;
  padding: 5px;
  border-radius: 5px;
  height: 46px;
  background: var(--off-color-2);
  opacity: 0.9;
  cursor: pointer;
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

  function playInstrument() {
    if(instrument?.player) {
      instrument.player.start()
    }
  }

  function changeVolume(value: string) {
    // here this should change the vol node on the player
    TonerService.setVolume(props.name, parseFloat(value))
    setVolume(parseFloat(value))
  }

  return (
    <TrackWithLabel>
      <Label onClick={playInstrument}>
        <div>{props.name}</div>
        <Controls>
          <input type="range" 
            value={volume} 
            max={12}
            min={-12}
            onChange={e => changeVolume(e.target.value)}
            onClick={e => e.stopPropagation()}
          />
        </Controls>
      </Label>
      <TrackBars>{props.children}</TrackBars>
    </TrackWithLabel>
  )
}
