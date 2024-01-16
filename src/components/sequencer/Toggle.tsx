import { useCallback } from 'react'
import styled from 'styled-components'

let colors = {
  odd: 'var(--off-color-3)',
  free: 'var(--off-color-1)',
  toggled: 'var(--off-color-2)',
}

const StepMargin = styled.div`
  margin: 2px;
  height: 54px;
  position: relative;
  cursor: default;
`

const Step = styled.div`
  height: 100%;
  border-radius: 2px;
  margin:auto;
  cursor: pointer;
`

const Guide = styled.div`
  position: absolute;
  top: -1.4rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  width: 100%;
`

interface ToggleProps {
  isActive: boolean
  scheduledEvent: string
  scheduled: boolean
  toggle: () => void
}

const subCounts = {
  '1': 'e',
  '2': '+',
  '3': 'a',
}

function slotToGuideName(slot: any): string | undefined {
  if(slot.split('|')[1] !== '0') return
  const [_, quarter, sixteenth] = slot.split('|')[0].split(':')
  const str16 = sixteenth.split(".")[0] as '1' | '2' | '3'
  return sixteenth === '0' ? (parseInt(quarter) + 1).toString() : subCounts[str16]
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
    <StepMargin style={{ opacity: props.isActive ? '1' : '0.7' }}>
      { guideName ? <Guide>{guideName}</Guide> : '' }
      <Step style={{ backgroundColor: getBackgroundColor() }} onClick={() => props.toggle()}>
      </Step>
    </StepMargin>
  )
}
