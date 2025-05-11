import styled from 'styled-components'
import useToneStore from '../../store/store'
import { shallow } from 'zustand/shallow'

const TempoBox = styled.div`
  display: flex;
  & input {
    width: 116px;
    height: 25px;
  }
  & button {
    margin: 0px 0.1rem;
  }
`

const ValDisplay = styled.div`
  padding: 0px 5px;
  width: 73px;
  line-height: 26px;
  &.swing {
    width: 105px;
  }
`

export default function Tempo() {
  const [bpm, setBpm] = useToneStore((state) => [state.bpm, state.setBpm], shallow)
  const [swing, setSwing] = useToneStore(
    (state) => [state.swing, state.setSwing],
    shallow
  )
  const playback = useToneStore((state) => state.playbackSample)

  return (
    <TempoBox>
      <ValDisplay>Bpm {bpm}</ValDisplay>
      <div>
        <input
          type="range"
          min="24"
          max="241"
          step="1"
          value={bpm}
          disabled={playback > -1}
          onChange={(e) => setBpm(e.target.value)}
        />
      </div>
      <ValDisplay className="swing">Swing {swing > 0 ? swing / 100 : '-'}</ValDisplay>
      <div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={swing}
          onChange={(e) => setSwing(parseInt(e.target.value))}
        />
      </div>
    </TempoBox>
  )
}
