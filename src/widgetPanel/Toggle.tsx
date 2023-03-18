import { useState, useEffect } from 'react'
import styled from 'styled-components'
import useToneStore from '../_store/store'

let colors = {
  odd: 'var(--off-color-3)',
  free: 'var(--off-color-1)',
  toggled: 'var(--off-color-2)',
}

const StepDiv = styled.div`
  padding: 2px;
  cursor: pointer;

  div {
    height: 100%;
    border-radius: 2px;
  }
`

interface ToggleProps {
  isActive: boolean
  timeId: string
  instrumentId: number
}

export default function Toggle(props: ToggleProps) {
  const [scheduled, setScheduled] = useState(false)
  const [scheduledEv, addEv, removeEv] = useToneStore(store => [store.scheduledEvents, store.addScheduledEvent, store.removeScheduledEvent])
  const eventId = `${props.timeId}|${props.instrumentId}`;
  // create a selector callback for the specific timeslot and then listen in effect whether scheduled or not

  useEffect(() => {
    setScheduled(scheduledEv.some(ev => ev === eventId))
  }, [scheduledEv, eventId])

  function handleClick() {
    !scheduled
      ? addEv(eventId)
      : removeEv(eventId)
  }

  function isOdd() {
    return Number(props.timeId.split(':')[0]) % 2 === 1
  }

  function getBackgroundColor() {
    return scheduled ? colors.toggled : isOdd() ? colors.odd : colors.free
  }

  return (
    <StepDiv style={{ opacity: props.isActive ? '1' : '0.7' }}>
      <div style={{ backgroundColor: getBackgroundColor() }} onClick={handleClick}></div>
    </StepDiv>
  )
}
