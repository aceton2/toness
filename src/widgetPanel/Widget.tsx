import { useEffect, useState } from 'react'
import styled from 'styled-components'
import TonerService from '../_services/toner'
import { Slot, SoundCfg } from '../_services/interfaces';
import Guide from './Guide'
import Toggle from './Toggle'
import Track from './Track'

const titles: { [key: string]: string } = {
  drum: 'Drums',
  bass: 'Bass',
  chords: 'Chords',
  samples: 'Samples',
}

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

const Bar = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
`

export default function Widget(props: {
  group: string
  tracks: number
  slots: Array<Slot>
}) {
  const [activeStep, setActiveStep] = useState('')

  useEffect(() => {
    TonerService.SequenceEmitter.on('step', setStep)
    return () => {
      TonerService.SequenceEmitter.off('step', setStep)
    }
  }, [])

  function setStep(step: string) {
    setActiveStep(step)
  }

  function getLiveSounds(): Array<SoundCfg> {
    return TonerService.getInstruments()
      .slice(0, props.tracks)
      .filter((inst) => inst.group === props.group)
  }

  // COMPONENTS

  function getTracks() {
    return getLiveSounds().map((sound) => (
      <Track key={sound.id} name={sound.name}>
        {getBars(sound.id)}
      </Track>
    ))
  }

  function getBars(soundId: number) {
    const bars = Array.from(new Set(props.slots.map((i) => i.bar)))
    return bars.map((bar: number) => (
      <Bar key={bar}>
        {getToggles(
          soundId,
          props.slots.filter((slot) => slot.bar === bar)
        )}
      </Bar>
    ))
  }

  function getToggles(soundId: number, slots: Array<Slot>) {
    return slots.map((slot, index) => (
      <Toggle
        key={index.toString()}
        timeId={slot.id}
        instrumentId={soundId}
        isActive={activeStep === slot.id}
      />
    ))
  }

  // RENDER

  return (
    <WidgetBox className={getLiveSounds().length < 1 ? 'hidden' : ''}>
      <WidgetTitle>{titles[props.group]}</WidgetTitle>
      <Guide slots={props.slots} activeStep={activeStep} />
      {getTracks()}
    </WidgetBox>
  )
}
