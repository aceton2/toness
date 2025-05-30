import styled from 'styled-components'
import GridService from '../../services/transport/grid'
import TriggersService from '../../services/transport/triggers'
import useToneStore from '../../store/store'
import { useCallback, useEffect, useState } from 'react'
import SequencerService from '../../services/transport/sequencer'

let colors = {
  odd: 'var(--main-faded)',
  free: 'rgba(0,0,0,0)',
  toggled: 'black',
}

const StepMargin = styled.div`
  height: 100%;
  position: relative;
  cursor: default;
  border: 0.5px solid var(--main);
  box-sizing: border-box;
`

const Step = styled.div`
  height: 100%;
  cursor: pointer;
`

const Head = styled.div<{ emph: boolean }>`
  position: relative;
  top: ${(props) => (props.emph ? '20%' : '80%')};
  height: 5%;
  background: var(--main);
`

const Guide = styled.div`
  position: absolute;
  top: -1rem;
  font-size: 0.7rem;
  text-align: center;
  width: 100%;
  z-index: 4;
`
const StrongGuide = styled.div`
  font-weight: 600;
  color: black;
`
const WeakGuide = styled.div`
  color: grey;
`

const ToggleBtn = styled.div`
  height: 50%;
  width: 100%;
`

interface ToggleProps {
  timeId: string
  instrumentId: number
  muted: boolean
}

export default function Toggle(props: ToggleProps) {
  const { bar, quarter, sixteenth } = GridService.parseTimeId(props.timeId)
  const guideName =
    props.instrumentId === 0 ? GridService.timeIdToGuideName(props.timeId) : null
  const addTriggerEvent = useToneStore((state) => state.addTriggerEvent)
  const removeTriggerEvent = useToneStore((state) => state.removeTriggerEvent)
  const scheduled = useToneStore((state) =>
    state.scheduledEvents.find(
      (e) => e.slice(0, -2) === `${props.timeId}|${props.instrumentId}`
    )
  )
  const activeBars = useToneStore((state) => state.activeBars)
  const [isActive, setIsActive] = useState(false)
  const setStep = useCallback(
    (step: string) => {
      const cycleBar = parseInt(step[0]) % activeBars
      const stepNormal = `${cycleBar}${step.substring(1)}`
      // split drops triplet sixteenth decimal
      setIsActive(!props.muted && stepNormal === props.timeId.split('.')[0])
    },
    [props.muted, activeBars, props.timeId]
  )

  useEffect(() => {
    SequencerService.stepEmitter.on('step', setStep)
    return () => {
      SequencerService.stepEmitter.off('step', setStep)
    }
  }, [setStep])

  function getBackgroundColor() {
    const odd = bar % 2 === 1
    return scheduled ? colors.toggled : odd ? colors.odd : colors.free
  }

  function toggleStep(emphasized: boolean) {
    scheduled
      ? removeTriggerEvent(props.timeId, props.instrumentId)
      : addTriggerEvent(props.timeId, props.instrumentId, emphasized)
  }

  return (
    <StepMargin style={{ opacity: isActive ? '0.2' : '1' }}>
      {guideName ? (
        <Guide>
          {parseInt(guideName) > 0 ? (
            <StrongGuide>{guideName}</StrongGuide>
          ) : (
            <WeakGuide>{guideName}</WeakGuide>
          )}
        </Guide>
      ) : (
        ''
      )}
      <Step style={{ backgroundColor: getBackgroundColor() }}>
        {scheduled && <Head emph={TriggersService.parseTrigger(scheduled)?.emphasized} />}
        <ToggleBtn onClick={() => toggleStep(true)}></ToggleBtn>
        <ToggleBtn onClick={() => toggleStep(false)}></ToggleBtn>
      </Step>
    </StepMargin>
  )
}
