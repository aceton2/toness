import { useCallback } from 'react'
import styled from 'styled-components'
import useToneStore, { selectPadAudioUrl, selectTrackSetting } from '../../store/store'
import { Instrument } from '../../services/core/interfaces'

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
  padding: 5px;
  margin-right: 5px;
  border-radius: 5px;
  background: var(--off-color-2);
  opacity: 0.9;
  cursor: default;

  & svg {
    width: 50%;
    height: 50%;
    padding-top:1px;
  }
`

const LabelName = styled.div`
  width: 100%;
  border-radius: 2px;
  text-align: center;
  height: 15px;
  font-weight: 600;
  background: var(${props => `--pad-${props.color}`});
`

const TrackIcon = styled.div<{alert: boolean, clickable: boolean}>`
  width: 38px;
  border-radius: 3px;
  margin: auto;
  margin-top: 6px;
  text-align: center;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  color: var(${props => props.alert ? '--panel-color-1' : props.clickable ? '--control-bar' : '--inactive-color'});
`

const VolInput = styled.input`
  width: 45px;
`

export default function TrackHead(props: {instrument: Instrument}) {
  const instrument = props.instrument
  const hasAudioUrl = useToneStore(useCallback(state => selectPadAudioUrl(state, instrument.id), [instrument]))
  const trackSetting = useToneStore(useCallback(state => selectTrackSetting(state, instrument.id), [instrument.id]))
  const toggleTrackMute = useToneStore(state => state.toggleTrackMute)
  const setTrackVolume =  useToneStore(state => state.setTrackVolume)
  const hasSound = instrument.id < 3 || hasAudioUrl

  function toggleMute() {
    toggleTrackMute(instrument.id)
  }

  return (
    <>
      { !hasSound ? <Mask /> : '' }
      <Label>
        <LabelName color={instrument.name}>{props.instrument.name}</LabelName>
        { hasSound ?
          <TrackIcon alert={trackSetting?.mute} clickable={true} onClick={toggleMute}>
            M
          </TrackIcon>
          : <TrackIcon alert={false} clickable={false}> - </TrackIcon> }
          <VolInput type="range" 
              max={100}
              min={0}
              value={trackSetting.volume} 
              onChange={e => setTrackVolume(instrument.id, parseInt(e.target.value))}
          />
      </Label>
    </>
  )
}
