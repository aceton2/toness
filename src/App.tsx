import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Controls from './controlPanel/Controls';
import Widget from './widgetPanel/Widget';
import Modal from './modalPanel/Modal';
import { createMidiJson } from './_services/midi';

import Mask from './auxComps/Mask';

import { initSequencer, unsubSequencerSubscriptions } from './_services/sequencer';

const Header = styled.div`
  padding: 5px;
  background-color: var(--off-color-2);
  font-style: italic;
`;

const MainFrame = styled.div`
  margin: 1rem;
  padding: 2rem;
  border-radius: 5px; 
`;

initSequencer();

export default function App() {
  const [showSampler, setShowSampler] = useState(false);

  useEffect(() => {
    return unsubSequencerSubscriptions
  }, [])

  function dropHandler(ev: any) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          createMidiJson(file)
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach((file, i) => {
        createMidiJson(file)
      });
    }
  }

  return (
    <div id="drop_zone" onDrop={dropHandler} onDragEnter={ev => ev.preventDefault()}>
      <Header> 124 sample sequencer ⛵ </Header>
      <Mask />
      <MainFrame>
        <Controls showSamplerModal={() => setShowSampler(true)}/>
        <Widget/>
      </MainFrame>
      <Modal show={showSampler} hideModal={() => setShowSampler(false)} />
    </div>
  );
}