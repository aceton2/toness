import { useCallback } from 'react'
import styled from 'styled-components'
import TonerService from '../_services/toner'
import useToneStore, { selectPadAudioUrl, selectTrackSetting } from '../_store/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophoneLinesSlash } from '@fortawesome/free-solid-svg-icons';
import { faVolumeXmark } from '@fortawesome/free-solid-svg-icons'

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
  cursor: default;

  & svg {
    width: 50%;
    height: 50%;
    color: var(--off-color-1);
    margin-left: 20%;
    padding-top:5px;
  }
`

const LabelName = styled.div`
  width: 100%;
  border-radius: 2px;
  text-align: center;
  height: 12px;
  background: var(${props => `--pad-${props.color}`});
`

const TrackBars = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`

const TrackIcon = styled.div<{alert: boolean, clickable: boolean}>`
  margin-top: 10px;
  width: 38px;
  border-radius: 3px;
  margin: auto;
  margin-top: 6px;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  & svg {
    color: var(${props => props.alert ? '--panel-color-1' : props.clickable ? '--off-color-1' : '--inactive-color'});
  }
`

interface SoundProps {
  name: string
  children: any
}

export default function Track(props: SoundProps) {
  const instrument = TonerService.getInstrumentByName(props.name)
  const hasAudioUrl = useToneStore(useCallback(state => selectPadAudioUrl(state, props.name), [props.name]))
  const trackSetting = useToneStore(useCallback(state => selectTrackSetting(state, instrument.id), [instrument.id]))
  const toggleTrackMute = useToneStore(state => state.toggleTrackMute)
  const hasSound = instrument.id < 3 || hasAudioUrl

  function toggleMute() {
    toggleTrackMute(instrument.id)
  }

  return (
    <TrackWithLabel>
      { !hasSound ? <Mask /> : '' }
      <Label>
        <LabelName color={props.name}>{instrument.id < 3 ? props.name : ''}</LabelName>
        { hasSound ?
          <TrackIcon alert={trackSetting?.mute} clickable={true} onClick={toggleMute}><FontAwesomeIcon icon={faVolumeXmark}></FontAwesomeIcon></TrackIcon>
          : <TrackIcon alert={false} clickable={false}><FontAwesomeIcon icon={faMicrophoneLinesSlash}></FontAwesomeIcon></TrackIcon> }
      </Label>
      <TrackBars>{props.children}</TrackBars>
    </TrackWithLabel>
  )
}
