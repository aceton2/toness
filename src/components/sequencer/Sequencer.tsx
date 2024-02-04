import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import SequencerService from '../../services/transport/sequencer'
import Toggle from './Toggle'
import TrackHead from './TrackHead'
import useToneStore, { GridResolutions } from '../../store/store'
import InstrumentsService from '../../services/core/instruments'
import GridService from '../../services/transport/grid'
import DubTrack from './DubTrack'


const SequencerBox = styled.div`
  --track-label-width: 50px;
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

const Grid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`

const resolutionToRepeat = {
'16n': 16,
'8n': 8,
'8t': 12,
} 

const Bar = styled.div<{ gridResolution: GridResolutions }>`
  display: grid;
  grid-template-columns: repeat(${props => resolutionToRepeat[props.gridResolution]}, 1fr);
  border-radius: 2px
`

export default function Sequencer() {
  const [activeStep, setActiveStep] = useState('')
  const timeIds = useToneStore(state => state.activeTimeIds)
  const activeTracks = useToneStore(state => state.activeTracks)
  const bars = useToneStore(state => state.activeBars)
  const gridResolution = useToneStore(state => state.resolution)
  const setStep = useCallback((step: string) => setActiveStep(step), [])

  useEffect(() => {
    SequencerService.stepEmitter.on('step', setStep)
    return () => {
      SequencerService.stepEmitter.off('step', setStep)
    }
  }, [setStep])

  function getBars(soundId: number) {
    return Array.from(Array(bars).keys()).map((bar: number) => (
      <Bar gridResolution={gridResolution} key={bar}>
        {getToggles(
          soundId,
          timeIds.filter((timeId) => GridService.parseTimeId(timeId).bar === bar)
        )}
      </Bar>
    ))
  }

  function getToggles(instrumentId: number, timeIds: Array<string>) {
    return timeIds.map((timeId) => {
      return (
        <Toggle 
          key={`${timeId}|${instrumentId}`}
          // split drops triplet sixteenth decimal
          isActive={activeStep === timeId.split(".")[0]}
          timeId={timeId}
          instrumentId={instrumentId}
        />
      )
    })
  }

  return (
    <SequencerBox>
      {InstrumentsService.instruments.slice(0, activeTracks).map((instrument) => (
        <TrackDiv key={instrument.id}>
          <TrackHead instrument={instrument} />
          <Grid>
            {
              instrument.id === InstrumentsService.overdub.id ? 
              <DubTrack /> :
              getBars(instrument.id)
            }
          </Grid>
      </TrackDiv>))}
    </SequencerBox>
  )
}
