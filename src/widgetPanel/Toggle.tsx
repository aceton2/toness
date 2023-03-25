import { useCallback } from 'react'
import styled from 'styled-components'

let colors = {
  odd: 'var(--off-color-3)',
  free: 'var(--off-color-1)',
  toggled: 'var(--off-color-2)',
}

const StepDiv = styled.div`
  padding: 2px;
  cursor: pointer;
  position: relative;
`

const Step = styled.div`
  height: 100%;
  border-radius: 2px;
`

const Guide = styled.div`
  position: absolute;
  top: -1rem;
  height: 1rem;
  font-size: 0.8rem;
  padding-left: 30%;
`

interface ToggleProps {
  isActive: boolean
  scheduledEvent: string
  scheduled: boolean
  toggle: () => void
}

const sixteenthStr = {
  '1': 'e',
  '2': '+',
  '3': 'a',
}

function slotToGuideName(slot: any): string | undefined {
  if(slot.split('|')[1] !== 0) return
  const [_, quarter, sixteenth] = slot.split('|')[0].split(':')
  return sixteenth === '0' ? (parseInt(quarter) + 1).toString() : sixteenthStr[sixteenth as '1' | '2' | '3']
}

export default function Toggle(props: ToggleProps) {
  let getGuideName = useCallback(() => slotToGuideName(props.scheduledEvent), [props.scheduledEvent])
  let guideName = getGuideName();

  function isOdd() {
    return Number(props.scheduledEvent.split('|')[0].split(':')[0]) % 2 === 1
  }

  function getBackgroundColor() {
    return props.scheduled ? colors.toggled : isOdd() ? colors.odd : colors.free
  }

  return (
    <StepDiv style={{ opacity: props.isActive ? '1' : '0.7' }}>
      { guideName ? <Guide>{guideName}</Guide> : '' }
      <Step style={{ backgroundColor: getBackgroundColor() }} onClick={() => props.toggle()}></Step>
    </StepDiv>
  )
}
