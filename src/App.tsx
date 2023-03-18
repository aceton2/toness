import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Controls from './controlPanel/Controls';
import Widget from './widgetPanel/Widget';
import Modal from './modalPanel/Modal';

import Mask from './auxComps/Mask';

import { createMidiJson, saveFile } from './_services/midi';
import { initSequencer, unsubSequencerSubscriptions } from './_services/sequencer';
import { recordAudio } from './_services/audioExport';
import useToneStore from './_store/store';

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

const DropBox = styled.div`
  margin: auto;
  padding: 20px;
  text-align: center;
  border-radius: 5px;
  height: 150px;
  width: 150px;
  background: var(--off-color-2);
  margin-bottom: 100px;
`

initSequencer();

export default function App() {
  const [showSampler, setShowSampler] = useState(false);
  const bars = useToneStore(state => state.activeBars)

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
    <div>
      <Header> 124 sample sequencer ⛵ </Header>
      <Mask />
      <MainFrame>
        <button onClick={saveFile}>Save Midi</button>
        <button onClick={() => recordAudio(bars)}>Save Audio</button>
        <Controls showSamplerModal={() => setShowSampler(true)}/>
        <Widget/>
      </MainFrame>
      <Modal show={showSampler} hideModal={() => setShowSampler(false)} />
      <DropBox
        id="drop_zone"
        onDrop={dropHandler}>
        <p>Drag one or more files to this <i>drop zone</i>.</p>
      </DropBox>
    </div>
  );
}