import styled from 'styled-components'
import GridService from '../../services/transport/grid'
import TriggersService from '../../services/transport/triggers'

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

const Head = styled.div<{emph: boolean}>`
  position: relative;
  top: ${props => props.emph ? "10%" : "80%"};
  bottom: ${props => props.emph ? "0px" : "10px"};
  height: 10%;
  background: var(--panel-color-1);
  border-radius: 2px;
`

const Guide = styled.div`
  position: absolute;
  top: -1.4rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  width: 100%;
`

const ToggleBtn = styled.div`
  height: 50%;
  width: 100%;
`

interface ToggleProps {
  isActive: boolean;
  timeId: string;
  instrumentId: number;
  scheduledEvent: string | undefined;
  toggle: (empasized: boolean) => void;
}

export default function Toggle(props: ToggleProps) {
  const {bar, quarter, sixteenth} = GridService.parseTimeId(props.timeId)
  const guideName = props.instrumentId === 0 ? GridService.timeIdToGuideName(props.timeId) : null;
  const parsedTrigger = props.scheduledEvent ? TriggersService.parseTrigger(props.scheduledEvent) : undefined;

  function getBackgroundColor() {
    const odd = bar % 2 === 1
    return parsedTrigger ? colors.toggled : odd ? colors.odd : colors.free
  }

  return (
    <StepMargin style={{ opacity: props.isActive ? '1' : '0.7' }}>
      { guideName ? <Guide>{guideName}</Guide> : '' }
      <Step style={{ backgroundColor: getBackgroundColor() }} >
        {parsedTrigger &&<Head emph={parsedTrigger?.emphasized} />}
        <ToggleBtn onClick={() => props.toggle(true)}></ToggleBtn>
        <ToggleBtn onClick={() => props.toggle(false)}></ToggleBtn>
      </Step>
    </StepMargin>
  )
}
