import styled from 'styled-components'
import useToneStore from '../../store/store'
import { Instrument, InstrumentParam, InstrumentType, TrackParam } from '../../services/core/interfaces'

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
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

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


const ToggleBtns = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 6px;
  flex: 1;
`

const TrackIcon = styled.div<{active: string | null, clickable: boolean}>`
  border-radius: 3px;
  width: 15px;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  background: var(${props => props.active});
  color: var(${props => !props.clickable ? '--inactive-color' : props.active ? '--off-color-2' : '--control-bar'});
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
      { !hasSound ? <Mask /> : '' }
      <Label>
        <LabelName color={instrument.name}>{instrument.name}</LabelName>
        <ToggleBtns>
        { hasSound ?
          <>
            <TrackIcon active={trackParam?.mute ? '--control-bar': null} clickable={true} onClick={() => toggleTrackMute(instrument.id)}>
              M
            </TrackIcon>
            <TrackIcon active={trackParam?.solo ? '--control-bar': null} clickable={true} onClick={() => toggleTrackSolo(instrument.id)}>
              S
            </TrackIcon>
          </>
          : <TrackIcon active={null} clickable={false}> - </TrackIcon> 
          }
        </ToggleBtns>
          <VolInput type="range" 
              max={100}
              min={0}
              value={trackParam.volume} 
              onChange={e => setTrackVolume(instrument.id, parseInt(e.target.value))}
          />
      </Label>
    </>
  )
}
