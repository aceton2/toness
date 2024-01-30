import styled from 'styled-components';
import { saveFile } from '../../services/exports/midi';
import { recordAudio } from '../../services/exports/audioExport';
import Tempo from './Tempo';

const HeaderDiv = styled.div`
  padding: 5px;
  background-color: var(--off-color-2);
  display: flex;
`;

const Title = styled.div`
    font-size: 1.2rem;
    padding-top: 2px;
`

const Stretch = styled.div`
  flex: 1;
`

export default function Header() {
    return (
        <HeaderDiv> 
            <Title>Toness</Title>
            <Stretch />
            <Tempo />
            <Stretch />
            <button onClick={saveFile}>Save Midi</button>
            <button onClick={() => recordAudio()}>Save Audio</button>
        </HeaderDiv>
    )
}