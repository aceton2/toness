import styled from 'styled-components'
import useToneStore from '../../store/store'
import { Instrument, InstrumentParam, InstrumentType, TrackParam } from '../../services/core/interfaces'

const Mask = styled.div`
  position: absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  background: rgba(0,0,0, 0.1);
  z-index: 2;
`

const TrackHeadBox = styled.div<{trackName: string}>`
  width: 65px;
  height: 75px;
  padding: 5px;
  border: 2px solid var(--black);
  border-bottom: 0px;
  background: ${props => `var(--${props.trackName});`}
  color: var(--black);
  cursor: default;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  & svg {
    width: 50%;
    height: 50%;
    padding-top: 1px;
  }

  &:last-child {
    border-bottom: 2px solid var(--black);
  }
`

const LabelName = styled.div`
  width: 100%;
  text-align: center;
`


const ToggleBtns = styled.div`
  display: flex;
  justify-content: center;
  flex: 1px;
`

const TrackIcon = styled.div<{active: string | null, clickable: boolean}>`
  border-radius: 3px;
  border: 1px solid var(--black);
  width: 15px;
  margin: 7.5px 2.5px 5px;
  padding: 0px 4px;
  height: 20px;
  text-align: center;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  background: var(${props => props.active});
  color: var(${props => props.active ? "--white" : "--black"});
  font-famiy: RoobertMono;
  font-size: 16px;
`

const VolInput = styled.input`
  width: 45px;
`

interface TrackHeadProps {
  instrument: Instrument, 
  instrumentParam: InstrumentParam,
  trackParam: TrackParam,
}

export default function TrackHead({instrument, instrumentParam, trackParam}: TrackHeadProps) {
  const toggleTrackMute = useToneStore(state => state.toggleTrackMute)
  const toggleTrackSolo = useToneStore(state => state.toggleTrackSolo)
  const setTrackVolume =  useToneStore(state => state.setTrackVolume)
  // this should be in instrumentParam
  const hasSound = instrumentParam.audioUrl || instrument.id < 3 || instrument.type === InstrumentType.chords

  return (
    <>
      {/* { !hasSound ? <Mask /> : '' } */}
      <TrackHeadBox trackName={instrument.name}>
        <LabelName color={instrument.name}>{instrument.name}</LabelName>
        <ToggleBtns>
            <TrackIcon active={trackParam?.mute ? '--black': null} clickable={true} onClick={() => toggleTrackMute(instrument.id)}>
              M
            </TrackIcon>
            <TrackIcon active={trackParam?.solo ? '--black': null} clickable={true} onClick={() => toggleTrackSolo(instrument.id)}>
              S
            </TrackIcon>
        </ToggleBtns>
          <VolInput type="range" 
              max={100}
              min={0}
              value={trackParam.volume} 
              onChange={e => setTrackVolume(instrument.id, parseInt(e.target.value))}
          />
      </TrackHeadBox>
    </>
  )
}
