import styled from 'styled-components';
import useToneStore from '../../store/store';
import { shallow } from 'zustand/shallow';

const TempoBox = styled.div`
  display: flex;
  & input {
    width: 120px;
    cursor: pointer;
    margin-top: 9px;
  }
  & button {
    margin: 0px 0.1rem;
  }
`

const TempoDisplay = styled.div`
    padding: 4px 4px;
    width: 53px;
    &.swing {
      width: 64px;
    }
`

export default function Tempo() {
    const [bpm, setBpm] = useToneStore(state => [state.bpm, state.setBpm], shallow)
    const [swing, setSwing] = useToneStore(state => [state.swing, state.setSwing], shallow)
    const playback = useToneStore(state => state.playbackSample)

    return (
        <TempoBox>
            <TempoDisplay>
                BPM {bpm}
            </TempoDisplay>
            <div>
                <input
                    type="range"
                    min="24"
                    max="241"
                    step="1"
                    value={bpm}
                    disabled={playback > -1}
                    onChange={e => setBpm(e.target.value)}
                />
            </div>
            <TempoDisplay className="swing">
              Swing {swing > 0 ? swing / 100 : "-"}
            </TempoDisplay>
            <div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={swing}
                    onChange={e => setSwing(parseInt(e.target.value))}
                />
            </div>
      </TempoBox>
    )
}