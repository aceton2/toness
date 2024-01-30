import styled from 'styled-components';
import useToneStore from '../../store/store';

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
    width: 56px;
    padding: 4px 0px;
`

export default function Tempo() {
    const [bpm, setBpm] = useToneStore(state => [state.bpm, state.setBpm])

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
                    onChange={e => setBpm(e.target.value)}
                />
            </div>
      </TempoBox>
    )
}