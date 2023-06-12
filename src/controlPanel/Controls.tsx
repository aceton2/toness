import styled from 'styled-components'
import SequencerService from '../_services/sequencer'
import TonerService from '../_services/toner'
import useToneStore, { selectIsFullGrid } from '../_store/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStop, faPlay } from '@fortawesome/free-solid-svg-icons';

const ControlBox = styled.div`
  margin-bottom: 0.5rem;
  background: var(--off-color-1);
  border-radius: 5px;
  padding: 5px;
  padding-left: 60px;
  display: flex;
  position: relative;
  button {
    background: var(--off-color-2);
    &:hover {
      background: var(--panel-color-1)
    }
  }
`
const SelectLabel = styled.div`
  line-height: 2rem;
  font-weight: bold;
  color: var(--off-color-2);
  padding-right: 5px;
  padding-top: 1px;
`

const MultiSelect = styled.div`
  display: flex;
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;
  padding: 0px;
  width: 180px;
  & div {
    flex: 1;
    padding: 5px;
    background: var(--off-color-2);
    text-align: center;
  }
  & .active {background: var(--panel-color-1) }
`

const Stretch = styled.div`
  flex: 1;
`

const Floater = styled.div`
    position: absolute;
    left: -31px;
    top: -11px;
    background: var(--off-color-2);
    z-index: 1;
    border-radius: 2px;
    padding: 1px;
`

export default function Controls() {
  const changeBars = useToneStore(state => state.changeBars)
  const toggleResolution = useToneStore(state => state.toggleResolution)
  const resolutionDoubled = useToneStore(selectIsFullGrid)
  const changeTracks = useToneStore(state => state.changeTracks)
  const resetSequencer = useToneStore(state => state.resetSequencer)
  const clearSchedule = useToneStore(state => state.clearSchedule)

  function toggleTransporter() {
    SequencerService.toggleTransport()
    const e = document.activeElement as HTMLInputElement
    if ('blur' in e) {
      e.blur() // to avoid cross-canceling with spacebar listener
    }
  }

  function clearAll() {
    resetSequencer()
    clearPads()
  }

  function clearPads() {
    TonerService.clearPads()
  }

  return (
    <ControlBox>
      <Floater>SEQUENCER</Floater>

      <button onClick={toggleTransporter}><FontAwesomeIcon icon={faPlay}/> <span></span><FontAwesomeIcon icon={faStop}/></button>
      <button onClick={clearSchedule}>X STEPS</button>
      <button onClick={clearAll}>RESET</button>

      <Stretch />

      <button onClick={() => changeTracks(1)}>+ VOICE</button>
      <button onClick={() => changeTracks(-1)}>- VOICE</button>
      <button onClick={() => changeBars(1)}>+ BAR</button>
      <button onClick={() => changeBars(-1)}>- BAR</button>
      <Stretch />
     
      <SelectLabel>Select Grid:</SelectLabel>
      <MultiSelect onClick={toggleResolution}>
        <div className={!resolutionDoubled ? 'active' : ''}>8ths</div>
        <div className={resolutionDoubled ? 'active' : ''}>16ths</div>
      </MultiSelect>

    </ControlBox>
  )
}
