import styled from 'styled-components';
import useToneStore from '../_store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPersonRunning } from '@fortawesome/free-solid-svg-icons';

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
    width: 40px;
    padding: 4px;
`

export default function Tempo() {
    const [bpm, setBpm] = useToneStore(state => [state.bpm, state.setBpm])

    return (
        <TempoBox>
            <TempoDisplay>
                <FontAwesomeIcon icon={faPersonRunning}/> {bpm}
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