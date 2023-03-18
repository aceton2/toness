import styled from 'styled-components'
import TonerService from '../_services/toner'
import useToneStore from '../_store/store'

const ControlBox = styled.div`
  margin-bottom: 1rem;
  position: relative;

  button {
    margin-right: 0.5rem;
  }
`

interface controlProps {
  showSamplerModal: () => void
}

export default function Controls(props: controlProps) {
  const [bpm, setBpm] = useToneStore(state => [state.bpm, state.setBpm])
  const changeBars = useToneStore(state => state.changeBars)
  const changeTracks = useToneStore(state => state.changeTracks)
  const clearSteps = useToneStore(state => state.clearSchedule)
  const toggleResolution = useToneStore(state => state.toggleResolution)

  function handleChange(e: any) {
    setBpm(e.target.value)
  }

  function toggleTransporter() {
    TonerService.toggle()
    const e = document.activeElement as HTMLInputElement
    if ('blur' in e) {
      e.blur() // to avoid cross-canceling with spacebar listener
    }
  }

  return (
    <ControlBox>
      <button onClick={toggleTransporter}>start/stop</button>
      <button onClick={() => changeTracks(1)}>+T</button>
      <button onClick={() => changeTracks(-1)}>-T</button>
      <button onClick={clearSteps}>clear steps</button>
      <button onClick={() => changeBars(1)}>add bar</button>
      <button onClick={() => changeBars(-1)}>remove bar</button>
      <button onClick={props.showSamplerModal}>open sampler</button>
      <button onClick={toggleResolution}>16ths</button>

      <input
        type="range"
        min="33"
        max="330"
        step="1"
        value={bpm}
        onChange={handleChange}
      />
      {bpm}
    </ControlBox>
  )
}
