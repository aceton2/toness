import { useCallback } from 'react'
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
  const [addEv, removeEv] = useToneStore(store => [store.addScheduledEvent, store.removeScheduledEvent])
  const eventId = `${props.timeId}|${props.instrumentId}`;

  const scheduled = useToneStore(useCallback((state) => state.scheduledEvents.some(ev => ev === eventId), [eventId]))

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
