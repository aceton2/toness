import styled from 'styled-components';
import { saveFile } from '../../services/exports/midi';
import { recordAudio } from '../../services/exports/audioExport';
import Tempo from './Tempo';

const HeaderDiv = styled.div`
  position: absolute;
  box-sizing: border-box;
  padding: 5px 10px;
  display: flex;
  width: 100%;
  height: 36px;
`;

const HeaderButton = styled.button`
  background: var(--black);
  color: var(--white);
`

const Title = styled.div`
  font-family: "Roobert";
  font-size: 26px;
  font-weight: 600;
  line-height: 26px;
`

const Stretch = styled.div`
  flex: 1;
`

export default function Header() {
    return (
        <HeaderDiv> 
            <Title>STEPS</Title>
            <Stretch />
            <Tempo />
            <Stretch />
            <HeaderButton onClick={saveFile}>Save Midi</HeaderButton>
            <HeaderButton onClick={() => recordAudio()}>Save Audio</HeaderButton>
        </HeaderDiv>
    )
}