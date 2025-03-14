import styled from 'styled-components';
import useToneStore from '../../store/store';
import { shallow } from 'zustand/shallow';

const TempoBox = styled.div`
  display: flex;
  & input {
    width: 116px;
    cursor: pointer;
    margin-top: 5px;
  }
  & button {
    margin: 0px 0.1rem;
  }
`

const TempoDisplay = styled.div`
    padding: 0px 5px;
    width: 73px;
    line-height: 26px;
    &.swing {
      width: 105px;
    }
`

export default function Tempo() {
    const [bpm, setBpm] = useToneStore(state => [state.bpm, state.setBpm], shallow)
    const [swing, setSwing] = useToneStore(state => [state.swing, state.setSwing], shallow)
    const playback = useToneStore(state => state.playbackSample)

    return (
        <TempoBox>
            <TempoDisplay>
                Bpm {bpm}
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