import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import TonerService from '../_services/toner'
import { Slot } from '../_services/interfaces'
import Guide from './Guide'
import Toggle from './Toggle'
import Track from './Track'
import useToneStore from '../_store/store'


const WidgetBox = styled.div`
  --track-label-width: 50px;

  &.hidden {
    display: none;
  }
`

const WidgetTitle = styled.div`
  margin: 1rem 0rem 0.5rem;
  padding: 5px;
  background-color: var(--off-color-2);
  border-radius: 5px;
`

const Bar = styled.div<{ doubled: boolean }>`
  display: grid;
  grid-template-columns: repeat(${props => props.doubled ? 16 : 8}, 1fr);
`
/**
 * This widget represents a instrument group
 */
export default function Widget() {
  const [activeStep, setActiveStep] = useState('')
  const slots = useToneStore(state => state.activeSlots)
  const tracks = useToneStore(state => state.activeTracks)
  const doubledGrid = useToneStore(state => state.resolution === '16n')

  useEffect(() => {
    TonerService.SequenceEmitter.on('step', setStep)
    return () => {
      TonerService.SequenceEmitter.off('step', setStep)
    }
  }, [])

  const setStep = useCallback((step: string) => {
    if(step !== 'stop') {
        setActiveStep(step)
    }
  }, [])

  // COMPONENTS

  function getTracks() {
    return TonerService.getInstruments()
      .slice(0, tracks)
      .map((sound) => (
      <Track key={sound.id} name={sound.name}>
        {getBars(sound.id)}
      </Track>
    ))
  }

  function getBars(soundId: number) {
    const bars = Array.from(new Set(slots.map(slot => slot.bar)))
    return bars.map((bar: number) => (
      <Bar doubled={doubledGrid} key={bar}>
        {getToggles(
          soundId,
          slots.filter((slot) => slot.bar === bar)
        )}
      </Bar>
    ))
  }

  function getToggles(soundId: number, slots: Array<Slot>) {
    return slots.map((slot, index) => (
      <Toggle
        key={index.toString()}
        timeId={slot.timeId}
        instrumentId={soundId}
        isActive={activeStep === slot.timeId}
      />
    ))
  }

  // RENDER

  return (
    <WidgetBox>
      <WidgetTitle>Tracks</WidgetTitle>
      <Guide slots={slots} activeStep={activeStep} />
      {getTracks()}
    </WidgetBox>
  )
}
