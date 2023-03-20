import styled from 'styled-components'
import TonerService from '../_services/toner'
import useToneStore, { selectIsFullGrid } from '../_store/store'
import { saveFile } from '../_services/midi';
import { recordAudio } from '../_services/audioExport';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStop, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const TempoBox = styled.div`
  display: flex;
  & div:first-child {
    width: 100px;
    background: var(--panel-color-2);
    padding: 2px 5px;
    margin-right: 5px;
    border-radius: 5px;
  }
  & input {
    width: 300px;
    accent-color: var(--off-color-1);
    cursor: pointer;
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
  const clearSteps = useToneStore(state => state.clearSchedule)

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
          TEMPO {bpm}
        </div>
        <div>
          <input
            type="range"
            min="24"
            max="240"
            step="1"
            value={bpm}
            onChange={handleChange}
          />
        </div>
      </TempoBox>

      <ControlBox>
      <button onClick={toggleTransporter}><FontAwesomeIcon icon={faPlay}/> <span></span><FontAwesomeIcon icon={faStop}/></button>
      <button onClick={clearSteps}><FontAwesomeIcon icon={faTrashCan}/></button>

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
