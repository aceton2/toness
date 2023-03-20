import styled from 'styled-components'
import TonerService from '../_services/toner'
import useToneStore, { selectIsFullGrid } from '../_store/store'
import { saveFile } from '../_services/midi';
import { recordAudio } from '../_services/audioExport';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStop, faPlay, faRefresh } from '@fortawesome/free-solid-svg-icons';

const TempoBox = styled.div`
  display: flex;
  & div {
    margin-right: 1rem;
  }
`

const ControlBox = styled.div`
  margin: 1rem 0px 0.5rem;
  background: var(--off-color-1);
  border-radius: 5px;
  padding: 5px;
  display: flex;
`

const SubControlBox = styled.div`
  display: flex;
  justify-content: center;
  margin: 0.5rem;
  button {
    background: var(--off-color-2);
    &:hover {
      background: var(--panel-color-1)
    }
  }
`

const MultiSelect = styled.div`
  display: flex;
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;
  padding: 0px;
  width: 120px;
  margin: 4px 0px;
  & div {
    flex: 1;
    padding: 5px;
    background: var(--panel-color-1);
    text-align: center;
  }
  & .active {background: var(--off-color-2) }
`
const Stretch = styled.div`
  flex: 1;
`

interface controlProps {
  showSamplerModal: () => void
}

export default function Controls(props: controlProps) {
  const [bpm, setBpm] = useToneStore(state => [state.bpm, state.setBpm])
  const changeBars = useToneStore(state => state.changeBars)
  const toggleResolution = useToneStore(state => state.toggleResolution)
  const resolutionDoubled = useToneStore(selectIsFullGrid)
  const changeTracks = useToneStore(state => state.changeTracks)

  function handleChange(e: any) {
    setBpm(e.target.value)
  }

  function toggleTransporter() {
    TonerService.toggle()
    const e = document.activeElement as HTMLInputElement
    if ('blur' in e) {
      e.blur() // to avoid cross-canceling with spacebar listener
    }
  }

  return (
    <div>

      <TempoBox>
        <div>
          Tempo {bpm}
        </div>
        <div>
          <input
            type="range"
            min="33"
            max="330"
            step="1"
            value={bpm}
            onChange={handleChange}
          />
        </div>
      </TempoBox>

      <ControlBox>
      <button onClick={toggleTransporter}><FontAwesomeIcon icon={faPlay}/> - <FontAwesomeIcon icon={faStop}/></button>

      <Stretch />

      <button onClick={saveFile}>Save Midi</button>
      <button onClick={() => recordAudio()}>Save Audio</button>

      </ControlBox>

      <SubControlBox>
        <Stretch />
        <button onClick={() => changeTracks(1)}>+ Voice</button>
        <button onClick={() => changeTracks(-1)}>- Voice</button>
        <button onClick={() => changeBars(1)}>+ Bar</button>
        <button onClick={() => changeBars(-1)}>- Bar</button>
        <Stretch />
        <MultiSelect onClick={toggleResolution}>
          <div className={!resolutionDoubled ? 'active' : ''}>8ths</div>
          <div className={resolutionDoubled ? 'active' : ''}>16ths</div>
        </MultiSelect>
      </SubControlBox>
    </div>
  )
}
