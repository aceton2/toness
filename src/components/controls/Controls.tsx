import styled from 'styled-components'
import SequencerService from '../../services/transport/sequencer'
import useToneStore from '../../store/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStop, faPlay } from '@fortawesome/free-solid-svg-icons';
import InstrumentsService from '../../services/core/instruments';
import SampleService from '../../services/sampling/sample';

import { shallow } from 'zustand/shallow'

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

const MultiSelect = styled.div<{disabled?: boolean}>`
  display: flex;
  border-radius: 5px;
  cursor: ${props => props.disabled ? "cursor" : "pointer"};
  overflow: hidden;
  padding: 0px;
  margin-left: 5px;
  position: relative;
  
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

const PlaybackSelect = styled.label`
  color: black;
  font-size: 1rem;
  font-weight: bold;
  margin: 2px 0px;
  select {
    margin-left: 5px;
    background: var(--off-color-1);
    border: 2px solid var(--off-color-2);
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
  }
`

const DisableMask = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0.4;
  background: var(--off-color-1);
`

export default function Controls() {
  const changeBars = useToneStore(state => state.changeBars)
  const [res, toggleRes] = useToneStore(state => [state.resolution, state.toggleResolution], shallow)
  const [sig, toggleSig] = useToneStore(state => [state.signature, state.setGridSignature], shallow)
  const changeTracks = useToneStore(state => state.changeTracks)
  const resetSequencer = useToneStore(state => state.resetSequencer)
  const clearSchedule = useToneStore(state => state.clearSchedule)
  const [playback, setPlayback] = useToneStore(state => [state.playbackSample, state.setPlaybackSample], shallow)

  function toggleTransporter() {
    SequencerService.toggleTransport()
    const e = document.activeElement as HTMLInputElement
    if ('blur' in e) {
      e.blur() // to avoid cross-canceling with spacebar listener
    }
  }

  function clearAll() {
    resetSequencer()
    InstrumentsService.pads.forEach(i => {
      SampleService.removeSample(i.id)
    })
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

      <PlaybackSelect>
        Playback:
        <select onChange={e => setPlayback(parseInt(e.target.value))} defaultValue={playback}>
          <option value={-1}>Free</option>
          {InstrumentsService.playbacks.map((pb, index) => 
            <option key={pb.name} value={index}>{pb.name}</option>
          )}
        </select>
      </PlaybackSelect>
      <Stretch />
     
      <MultiSelect disabled={playback !== -1}>
        {playback !== -1 && <DisableMask />}
        <div className={sig === '4' ? 'active' : ''} onClick={e => toggleSig('4')}>4/4</div>
        <div className={sig === '3' ? 'active' : ''} onClick={e => toggleSig('3')}>3/4</div>
      </MultiSelect>

      <MultiSelect>
        <div className={res === '8n' ? 'active' : ''} onClick={e => toggleRes('8n')}>8ths</div>
        <div className={res === '8t' ? 'active' : ''} onClick={e => toggleRes('8t')}>Triplets</div>
        <div className={res === '16n' ? 'active' : ''} onClick={e => toggleRes('16n')}>16ths</div>
      </MultiSelect>

    </ControlBox>
  )
}
