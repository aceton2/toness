import styled from 'styled-components'
import GridService from '../../services/transport/grid'
import TriggersService from '../../services/transport/triggers'
import useToneStore from '../../store/store'

let colors = {
  odd: 'var(--off-color-3)',
  free: 'var(--control-bar)',
  toggled: 'var(--off-color-2)',
}

const StepMargin = styled.div`
  margin-right: 4px;
  height: 100%;
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
}

export default function Toggle(props: ToggleProps) {
  const {bar, quarter, sixteenth} = GridService.parseTimeId(props.timeId)
  const guideName = props.instrumentId === 0 ? GridService.timeIdToGuideName(props.timeId) : null;
  const addTriggerEvent = useToneStore(state => state.addTriggerEvent)
  const removeTriggerEvent = useToneStore(state => state.removeTriggerEvent)
  const scheduled = useToneStore(state => 
    state.scheduledEvents.find(e => e.slice(0, -2) === `${props.timeId}|${props.instrumentId}`)
  ) 

  function getBackgroundColor() {
    const odd = bar % 2 === 1
    return scheduled ? colors.toggled : odd ? colors.odd : colors.free
  }

  function toggleStep(emphasized: boolean) {
    scheduled ? removeTriggerEvent(props.timeId, props.instrumentId) 
      : addTriggerEvent(props.timeId, props.instrumentId, emphasized)
  }

  return (
    <StepMargin style={{ opacity: props.isActive ? '1' : '0.7' }}>
      { guideName ? <Guide>{guideName}</Guide> : '' }
      <Step style={{ backgroundColor: getBackgroundColor() }} >
        {scheduled &&<Head emph={TriggersService.parseTrigger(scheduled)?.emphasized} />}
        <ToggleBtn onClick={() => toggleStep(true)}></ToggleBtn>
        <ToggleBtn onClick={() => toggleStep(false)}></ToggleBtn>
      </Step>
    </StepMargin>
  )
}
