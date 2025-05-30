import { useCallback } from 'react'
import useToneStore, { GridSignature } from '../../store/store'
import styled from 'styled-components'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { Instrument, InstrumentType } from '../../services/core/interfaces'
import GridService from '../../services/transport/grid'
import Chords from '../chords/Chords'
import Toggle from './Toggle'
import TrackHead from './TrackHead'
import { TRACK_HEIGHT } from '../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const TrackDiv = styled.div`
  display: flex;
  position: relative;
  height: ${TRACK_HEIGHT}px;
`

const Head = styled.div`
  width: 65px;
`

const Bar = styled.div<{ togglesPerBeat: number }>`
  position: relative;
  display: grid;
  grid-template-columns: repeat(${(props) => props.togglesPerBeat}, 1fr);
  border-radius: 2px;
`

const Grid = styled.div<{ signature: GridSignature }>`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(${(props) => barsForSignature[props.signature]}, 1fr);
`

const Mask = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: white;
  z-index: 9;
`

interface TrackProps {
  instrument: Instrument
  togglesPerBeat: number
  timeIds: Array<string>
  gridSignature: GridSignature
}

const barsForSignature = {
  4: 4,
  3: 4,
}

export function Track({
  instrument,
  togglesPerBeat,
  timeIds,
  gridSignature,
}: TrackProps) {
  // we trigger rerenders on all trackSetting due to solo settings
  const trackSettings = useToneStore((state) => state.trackSettings)
  const instrumentParam = useToneStore(
    useCallback((state) => state.instrumentParams[instrument.id], [instrument])
  )
  const trackParam = useToneStore(
    useCallback((state) => state.trackSettings[instrument.id], [instrument.id])
  )
  const activeBars = useToneStore((state) => state.activeBars)
  const hasSound =
    instrumentParam.audioUrl ||
    instrument.id < 3 ||
    instrument.type === InstrumentType.chords
  return (
    <TrackDiv key={instrument.id}>
      {!hasSound && <Mask />}
      <Head>
        <TrackHead
          instrument={instrument}
          trackParam={trackParam}
          instrumentParam={instrumentParam}
        />
      </Head>
      {instrument.type === InstrumentType.chords ? (
        <Chords />
      ) : (
        <Grid signature={gridSignature}>
          {GridService.timeIdsByBar(timeIds).map((barInfo, index, arr) => (
            <Bar key={barInfo.bar} togglesPerBeat={togglesPerBeat}>
              {barInfo.timeIds.map((timeId) => (
                <Toggle
                  key={`${timeId}|${instrument.id}`}
                  timeId={timeId}
                  instrumentId={instrument.id}
                  muted={
                    instrument.channelVolume.mute ||
                    (instrument.id > 2 && !instrumentParam.audioUrl)
                  }
                />
              ))}
            </Bar>
          ))}
        </Grid>
      )}
    </TrackDiv>
  )
}
