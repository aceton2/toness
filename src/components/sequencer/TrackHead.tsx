import styled from 'styled-components'
import useToneStore from '../../store/store'
import {
  Instrument,
  InstrumentParam,
  InstrumentType,
  TrackParam,
} from '../../services/core/interfaces'
import { TRACK_HEIGHT } from '../../constants'

const TRACK_SECTION_HEIGHT = TRACK_HEIGHT / 3

const TrackHeadBox = styled.div<{ trackName: string }>`
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--black);
  color: var(--black);
  cursor: default;
  box-sizing: border-box;
  display: grid;
  grid-auto-rows: ${TRACK_SECTION_HEIGHT}px;
  background: ${(props) => `var(--${props.trackName});`};

  & svg {
    width: 50%;
    height: 50%;
    padding-top: 1px;
  }
`

const LabelName = styled.div`
  font-size: 0.8rem;
  width: 100%;
  text-align: center;
`

const ButtonSection = styled.div`
  display: flex;
  justify-content: center;
  overflow: hidden;
`

const TrackIcon = styled.div<{ active: string | null; clickable: boolean }>`
  border-radius: 3px;
  border: 1px solid var(--black);
  width: 15px;
  margin: 0px 1px;
  padding: 0px 4px;
  overflow: hidden;
  text-align: center;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
  background: var(${(props) => props.active});
  color: var(${(props) => (props.active ? '--white' : '--black')});
  font-famiy: RoobertMono;
  font-size: 12.6px;
`
const VolSection = styled.div`
  text-align: center;
`

const VolInput = styled.input`
  width: calc(100% - 10px);
  height: ${TRACK_SECTION_HEIGHT}px;
  left: 3px;
`

interface TrackHeadProps {
  instrument: Instrument
  instrumentParam: InstrumentParam
  trackParam: TrackParam
}

export default function TrackHead({ instrument, trackParam }: TrackHeadProps) {
  const toggleTrackMute = useToneStore((state) => state.toggleTrackMute)
  const toggleTrackSolo = useToneStore((state) => state.toggleTrackSolo)
  const setTrackVolume = useToneStore((state) => state.setTrackVolume)
  return (
    <TrackHeadBox trackName={instrument.name}>
      <LabelName color={instrument.name}>{instrument.name}</LabelName>
      <ButtonSection>
        <TrackIcon
          active={trackParam?.mute ? '--black' : null}
          clickable={true}
          onClick={() => toggleTrackMute(instrument.id)}
        >
          M
        </TrackIcon>
        <TrackIcon
          active={trackParam?.solo ? '--black' : null}
          clickable={true}
          onClick={() => toggleTrackSolo(instrument.id)}
        >
          S
        </TrackIcon>
      </ButtonSection>
      <VolSection>
        <VolInput
          type="range"
          max={100}
          min={0}
          value={trackParam.volume}
          onChange={(e) => setTrackVolume(instrument.id, parseInt(e.target.value))}
        />
      </VolSection>
    </TrackHeadBox>
  )
}
