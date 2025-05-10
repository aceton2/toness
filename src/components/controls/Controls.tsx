import styled from 'styled-components'
import SequencerService from '../../services/transport/sequencer'
import useToneStore from '../../store/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStop, faPlay } from '@fortawesome/free-solid-svg-icons'
import InstrumentsService from '../../services/core/instruments'
import SampleService from '../../services/sampling/sample'

import { shallow } from 'zustand/shallow'
import NoteIcon from './NoteIcon'

const ControlBox = styled.div`
  margin: 10px 0;
  border: solid black 2px;
  border-radius: 5px;
  display: flex;
  position: relative;
  display: flex;
  flex-direction: horizontal;
  button {
    height: 100%;
    border: 2px solid black;
    &:hover {
      background: var(--main-light);
    }
  }
`

const ControlSection = styled.div<{ disabled?: boolean }>`
  border-right: solid black 2px;
  padding: 10px;
  &:first-child {
    flex: 1;
  }
  &:last-child {
    border-right: 0px;
  }
`

const MultiSelectBtn = styled.button`
  margin-left: 5px;
  position: relative;
  height: 100%;

  & div {
    flex: 1;
    border-right: 1px solid black;
    background: var(--white);
    text-align: center;
  }
  &.active {
    background: var(--main);
    color: var(--white);
  }
`

const PlaybackSelect = styled.label`
  color: black;
  font-weight: bold;
  margin: 2px 0px;
  position: relative;
  select {
    margin: 0px 5px;
    width: calc(100% - 10px);
    height: 100%;
    background: none;
    border: 2px solid var(--off-color-2);
    border-radius: 5px;
    font-size: 12px;
    cursor: pointer;
    padding-left: 33px;
    font-family: 'RoobertMono';
  }
`

const IconBox = styled.div`
  position: absolute;
  z-index: 2;
  left: 13px;
  top: 2px;
  > svg {
    height: 14px;
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
  const changeBars = useToneStore((state) => state.changeBars)
  const [res, toggleRes] = useToneStore(
    (state) => [state.resolution, state.toggleResolution],
    shallow
  )
  const [sig, toggleSig] = useToneStore(
    (state) => [state.signature, state.setGridSignature],
    shallow
  )
  const changeTracks = useToneStore((state) => state.changeTracks)
  const resetSequencer = useToneStore((state) => state.resetSequencer)
  const clearSchedule = useToneStore((state) => state.clearSchedule)
  const [playback, setPlayback] = useToneStore(
    (state) => [state.playbackSample, state.setPlaybackSample],
    shallow
  )

  function toggleTransporter() {
    SequencerService.toggleTransport()
    const e = document.activeElement as HTMLInputElement
    if ('blur' in e) {
      e.blur() // to avoid cross-canceling with spacebar listener
    }
  }

  function clearAll() {
    resetSequencer()
    InstrumentsService.pads.forEach((i) => {
      SampleService.removeSample(i.id)
    })
  }

  return (
    <ControlBox>
      <ControlSection>
        <button onClick={toggleTransporter}>
          <FontAwesomeIcon icon={faPlay} /> <span></span>
          <FontAwesomeIcon icon={faStop} />
        </button>
        <button onClick={clearSchedule}>Clear Steps</button>
        <button onClick={clearAll}>Reset All</button>
      </ControlSection>

      {/* <Stretch /> */}

      <ControlSection className={'playback'}>
        <PlaybackSelect>
          <IconBox>
            <NoteIcon />
          </IconBox>

          <select
            onChange={(e) => setPlayback(parseInt(e.target.value))}
            defaultValue={playback}
          >
            <option value={-1}>KEIN PLAYBACK</option>
            {InstrumentsService.playbacks.map((pb, index) => (
              <option key={pb.name} value={index}>
                {pb.name}
              </option>
            ))}
          </select>
        </PlaybackSelect>
      </ControlSection>

      {/* <ControlSection>
        <button onClick={() => changeTracks(1)}>+ TRACK</button>
        <button onClick={() => changeTracks(-1)}>- TRACK</button>
        <button onClick={() => changeBars(1)}>+ BAR</button>
        <button onClick={() => changeBars(-1)}>- BAR</button>
      </ControlSection> */}

      <ControlSection disabled={playback !== -1}>
        {/* {playback !== -1 && <DisableMask />} */}
        <MultiSelectBtn
          className={sig === '4' ? 'active' : ''}
          onClick={(e) => toggleSig('4')}
        >
          4/4
        </MultiSelectBtn>
        <MultiSelectBtn
          className={sig === '3' ? 'active' : ''}
          onClick={(e) => toggleSig('3')}
        >
          3/4
        </MultiSelectBtn>
      </ControlSection>

      <ControlSection>
        <MultiSelectBtn
          className={res === '8n' ? 'active' : ''}
          onClick={(e) => toggleRes('8n')}
        >
          8ths
        </MultiSelectBtn>
        <MultiSelectBtn
          className={res === '8t' ? 'active' : ''}
          onClick={(e) => toggleRes('8t')}
        >
          Triplets
        </MultiSelectBtn>
        <MultiSelectBtn
          className={res === '16n' ? 'active' : ''}
          onClick={(e) => toggleRes('16n')}
        >
          16ths
        </MultiSelectBtn>
      </ControlSection>
    </ControlBox>
  )
}
