import styled from 'styled-components'
import Toggle from './Toggle'
import TrackHead from './TrackHead'
import useToneStore, { GridSignature } from '../../store/store'
import InstrumentsService from '../../services/core/instruments'
import GridService from '../../services/transport/grid'
import DubTrack from './DubTrack'
import { Instrument } from '../../services/core/interfaces'
import { useCallback } from 'react'


const SequencerBox = styled.div`
  margin-top: 1.5rem;

  &.hidden {
    display: none;
  }
`

const TrackDiv = styled.div`
  display: flex;
  height: 58px;
  position: relative;
  margin: 4px 0px;
`

const barsForSignature = {
  4: 4,
  3: 5
}

const Grid = styled.div<{ signature: GridSignature }>`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(${props => barsForSignature[props.signature]}, 1fr);
`

const resolutionPerBeat = {
'16n': 4,
'8n': 2,
'8t': 3,
} 

const Bar = styled.div<{ togglesPerBeat: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.togglesPerBeat}, 1fr);
  border-radius: 2px
`

export default function Sequencer() {
  const activeTracks = useToneStore(state => state.activeTracks)
  const timeIds = useToneStore(state => state.activeTimeIds)
  const gridResolution = useToneStore(state => state.resolution)
  const gridSignature = useToneStore(state => state.signature)
  return (
    <SequencerBox>
      {InstrumentsService.instruments.slice(0, activeTracks).map((instrument) => (
        <Track 
          instrument={instrument} 
          key={instrument.id} 
          togglesPerBeat={resolutionPerBeat[gridResolution] * parseInt(gridSignature)}
          gridSignature={gridSignature}
          timeIds={timeIds}
        />
      ))}
    </SequencerBox>
  )
}

interface TrackProps {
  instrument: Instrument; 
  togglesPerBeat: number;
  timeIds: Array<string>;
  gridSignature: GridSignature
}

function Track({
  instrument, 
  togglesPerBeat, 
  timeIds, 
  gridSignature,
}: TrackProps) {
  // we trigger rerenders on all trackSetting due to solo settings
  const trackSettings = useToneStore(state => state.trackSettings) 
  const instrumentParam = useToneStore(useCallback(state => state.instrumentParams[instrument.id], [instrument]))
  const trackParam = useToneStore(useCallback(state => state.trackSettings[instrument.id], [instrument.id]))
  return (
    <TrackDiv key={instrument.id}>
      <TrackHead instrument={instrument} trackParam={trackParam} instrumentParam={instrumentParam}/>
      <Grid signature={gridSignature}>
        {
          GridService.timeIdsByBar(timeIds).map(barInfo =>
            <Bar key={barInfo.bar} togglesPerBeat={togglesPerBeat}>
              { barInfo.timeIds.map((timeId) =>  (
              <Toggle 
                key={`${timeId}|${instrument.id}`}
                timeId={timeId}
                instrumentId={instrument.id}
                muted={instrument.channelVolume.mute || (instrument.id > 2 && !instrumentParam.audioUrl)}
              /> ))
              }
            </Bar>)
        }
      </Grid>
    </TrackDiv>
  )
}
