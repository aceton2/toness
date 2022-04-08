import { useState } from 'react';
import styled from 'styled-components';
import Controls from './controlPanel/Controls';
import Widget from './widgetPanel/Widget';
import Mask from './auxComps/Mask';
import Toner from './_services/toner';

const Header = styled.div`
  padding: 5px;
  background-color: var(--off-color-2);
`;

const MainFrame = styled.div`
  margin: 1rem;
  padding: 2rem;
  border-radius: 5px; 
`;

export default function App(props) {

  const [bars, setBars] = useState(2);
  const [tracks, setTracks] = useState(1);

  function addTrack() {
    if (tracks < Toner.getInstruments().length) {
      setTracks(tracks + 1);
    }
  }

  function removeTrack() {
    if (tracks > 1) {
      setTracks(tracks - 1);
    }
  }

  function getWidgets() {
    const groups = Array.from(new Set(Toner.getInstruments().map(i => i.group)));
    return groups.map(group => (
      <Widget
        key={group}
        group={group}
        bars={bars}
        tracks={tracks}
      />
    ))
  }

  getWidgets();

  return (
    <div>

      <Header> Simple Sequencer for the Kids </Header>
      <Mask />
      <MainFrame>
        <Controls
          setBars={setBars}
          bars={bars}
          addTrack={addTrack}
          removeTrack={removeTrack}
        />
        {getWidgets()}
      </MainFrame>
    </div>
  );
}