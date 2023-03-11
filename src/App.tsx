import { useState } from 'react';
import styled from 'styled-components';
import Controls from './controlPanel/Controls';
import Widget from './widgetPanel/Widget';
import Modal from './modalPanel/Modal';

import Mask from './auxComps/Mask';
import TonerService from './_services/toner';
import Sequencer from './_services/sequencer';

import { createMidiJson, saveFile } from './_services/midi';
import { recordAudio } from './_services/audioExport';

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

interface Instrument {
  group: string
}

export default function App() {

  const [tracks, setTracks] = useState(1);
  const [slots, setSlots] = useState(Sequencer.getSlots());
  const [showSampler, setShowSampler] = useState(false);

  function addTrack() {
    if (tracks < TonerService.getInstruments().length) {
      setTracks(tracks + 1);
    }
  }

  function removeTrack() {
    if (tracks > 1) {
      setTracks(tracks - 1);
    }
  }

  function getWidgets() {
    const groups: Array<string> = Array.from(new Set(TonerService.getInstruments().map((i: Instrument) => i.group)));
    return groups.map(group => (
      <Widget
        key={group}
        group={group}
        tracks={tracks}
        slots={slots}
      />
    ))
  }

  function dropHandler(ev: any) {
    console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          handleFile(file)
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach((file, i) => {
        handleFile(file)
      });
    }
  }

  function handleFile(file: File) {
    createMidiJson(file)
  }

  function dragOverHandler(event: any) {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
  }

  function updateSlots() {
    setSlots(Sequencer.getSlots())
  }

  return (
    <div>
      <Header> 124 sample sequencer ⛵ </Header>
      <Mask />
      <MainFrame>
        <button onClick={saveFile}>Save Midi</button>
        <button onClick={() => recordAudio(Sequencer.getActiveBarCount())}>Save Audio</button>
        <Controls
          addTrack={addTrack}
          removeTrack={removeTrack}
          updateSlots={updateSlots}
          showSamplerModal={() => setShowSampler(true)}
        />
        {getWidgets()}
      </MainFrame>
      <Modal show={showSampler} hideModal={() => setShowSampler(false)} />
      <DropBox
        id="drop_zone"
        onDrop={dropHandler}
        onDragOver={dragOverHandler}>
        <p>Drag one or more files to this <i>drop zone</i>.</p>
      </DropBox>
    </div>
  );
}