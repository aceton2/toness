import styled from 'styled-components'

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
  scheduledEvent: string
  scheduled: boolean
  toggle: () => void
}



export default function Toggle(props: ToggleProps) {
  function isOdd() {
    return Number(props.scheduledEvent.split('|')[0].split(':')[0]) % 2 === 1
  }

  function getBackgroundColor() {
    return props.scheduled ? colors.toggled : isOdd() ? colors.odd : colors.free
  }

  return (
    <StepDiv style={{ opacity: props.isActive ? '1' : '0.7' }}>
      <div style={{ backgroundColor: getBackgroundColor() }} onClick={() => props.toggle()}></div>
    </StepDiv>
  )
}
