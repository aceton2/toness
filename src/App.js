import { useState } from 'react';
import styled from 'styled-components';
import Controls from './controlPanel/Controls';
import Widget from './widgetPanel/Widget';
import Mask from './auxComps/Mask';
import Toner from './_services/toner';
import Sequencer from './_services/sequencer';

const Header = styled.div`
  padding: 5px;
  background-color: var(--off-color-2);
`;

const MainFrame = styled.div`
  margin: 1rem;
  padding: 2rem;
  border-radius: 5px; 
`;

export default function App() {

  const [tracks, setTracks] = useState(1);
  const [slots, setSlots] = useState(Sequencer.getSlots())

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
        tracks={tracks}
        slots={slots}
      />
    ))
  }

  function updateSlots() {
    setSlots(Sequencer.getSlots())
  }

  return (
    <div>
      <Header> Simple Sequencer for the Kids </Header>
      <Mask />
      <MainFrame>
        <Controls
          addTrack={addTrack}
          removeTrack={removeTrack}
          updateSlots={updateSlots}
        />
        {getWidgets()}
      </MainFrame>
    </div>
  );
}