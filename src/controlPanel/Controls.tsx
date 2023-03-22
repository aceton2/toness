import styled from 'styled-components'
import TonerService from '../_services/toner'
import useToneStore, { selectIsFullGrid } from '../_store/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStop, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const ControlBox = styled.div`
  margin-bottom: 1.5rem;
  background: var(--off-color-1);
  border-radius: 5px;
  padding: 5px;
  display: flex;
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
  const changeBars = useToneStore(state => state.changeBars)
  const toggleResolution = useToneStore(state => state.toggleResolution)
  const resolutionDoubled = useToneStore(selectIsFullGrid)
  const changeTracks = useToneStore(state => state.changeTracks)
  const clearSteps = useToneStore(state => state.clearSchedule)

  function toggleTransporter() {
    TonerService.toggle()
    const e = document.activeElement as HTMLInputElement
    if ('blur' in e) {
      e.blur() // to avoid cross-canceling with spacebar listener
    }
  }

  return (
    <ControlBox>

      <button onClick={toggleTransporter}><FontAwesomeIcon icon={faPlay}/> <span></span><FontAwesomeIcon icon={faStop}/></button>
      <button onClick={clearSteps}><FontAwesomeIcon icon={faTrashCan}/></button>

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

    </ControlBox>
  )
}
