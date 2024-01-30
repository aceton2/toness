import styled from 'styled-components'
import SequencerService from '../../services/transport/sequencer'
import useToneStore from '../../store/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStop, faPlay } from '@fortawesome/free-solid-svg-icons';
import PadService from '../../services/pads/pad';

const ControlBox = styled.div`
  margin-bottom: 2.5rem;
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
  const gridResolution = useToneStore(state => state.resolution)
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
    PadService.clearPads()
  }

  return (
    <ControlBox>
      <Floater>SEQUENCER</Floater>

      <button onClick={toggleTransporter}><FontAwesomeIcon icon={faPlay}/> <span></span><FontAwesomeIcon icon={faStop}/></button>
      <button onClick={clearSchedule}>X STEPS</button>
      <button onClick={clearAll}>RESET</button>

      <Stretch />

      <button onClick={() => changeTracks(1)}>+ TRACK</button>
      <button onClick={() => changeTracks(-1)}>- TRACK</button>
      <button onClick={() => changeBars(1)}>+ BAR</button>
      <button onClick={() => changeBars(-1)}>- BAR</button>
      <Stretch />
     
      <SelectLabel>Select Grid:</SelectLabel>
      <MultiSelect>
        <div className={gridResolution === '8n' ? 'active' : ''} onClick={e => toggleResolution('8n')}>8ths</div>
        <div className={gridResolution === '8t' ? 'active' : ''} onClick={e => toggleResolution('8t')}>Triplets</div>
        <div className={gridResolution === '16n' ? 'active' : ''} onClick={e => toggleResolution('16n')}>16ths</div>
      </MultiSelect>

    </ControlBox>
  )
}
