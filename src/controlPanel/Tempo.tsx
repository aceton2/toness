import styled from 'styled-components';
import useToneStore from '../_store/store';

const TempoBox = styled.div`
  display: flex;
  & input {
    width: 120px;
    accent-color: var(--off-color-1);
    cursor: pointer;
    height: 2px;
    margin-top: 11px;
  }
  & button {
    margin: 0px 0.25rem;
  }
`

const TempoDisplay = styled.div`
    width: 120px;
    background: var(--panel-color-2);
    padding: 4px;
    margin-right: 5px;
    border-radius: 5px;
`

export default function Tempo() {
    const [bpm, setBpm] = useToneStore(state => [state.bpm, state.setBpm])

    return (
        <TempoBox>
            <TempoDisplay>
                Current Tempo: {bpm}
            </TempoDisplay>
            <div>
                <input
                    type="range"
                    min="24"
                    max="240"
                    step="1"
                    value={bpm}
                    onChange={e => setBpm(e.target.value)}
                />
            </div>
      </TempoBox>
    )
}