import { useState } from 'react'
import styled from 'styled-components'
import Sequencer from '../_services/sequencer'
import TonerService from '../_services/toner'

const ControlBox = styled.div`
  margin-bottom: 1rem;
  position: relative;

  button {
    margin-right: 0.5rem;
  }
`

interface controlProps {
  updateSlots: () => void
  addTrack: () => void
  removeTrack: () => void
  showSamplerModal: () => void
}

export default function Controls(props: controlProps) {
  const [bpm, setBpm] = useState(Sequencer.getBpm())

  function handleChange(e: any) {
    setBpm(e.target.value)
    Sequencer.setBpm(e.target.value)
  }

  function addBar() {
    if (Sequencer.addBar()) {
      props.updateSlots()
    }
  }

  function removeBar() {
    if (Sequencer.removeBar()) {
      props.updateSlots()
    }
  }

  function clearAll() {
    TonerService.clearAll()
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
      <button onClick={props.addTrack}>+T</button>
      <button onClick={props.removeTrack}>-T</button>
      <button onClick={clearAll}>clear steps</button>
      <button onClick={addBar}>add bar</button>
      <button onClick={removeBar}>remove bar</button>
      <button onClick={props.showSamplerModal}>open sampler</button>

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
