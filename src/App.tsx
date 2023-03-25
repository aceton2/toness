import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Controls from './controlPanel/Controls';
import Widget from './widgetPanel/Widget';
import Header from './controlPanel/Header';
import { createMidiJson } from './_services/midi';

import Mask from './auxComps/Mask';

import SamplerPanel from './samplerPanel/Sampler';
import SamplerService from './_services/sampler';
import SequencerService from './_services/sequencer';


const MainFrame = styled.div`
  margin: 0rem 1rem 1rem;
  padding: 1.5rem 2rem;
  border-radius: 5px; 
`;

export default function App() {
  const elementRef = useRef(null);

  useEffect(() => {
    if(elementRef.current) {
      const width = (elementRef.current as HTMLDivElement).getBoundingClientRect().width
      if(width > 800) {
        SequencerService.initSequencer();
        SamplerService.startMic();
      }
    }
    return SequencerService.unsubSequencerSubscriptions
  }, [elementRef])

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
    <div id="drop_zone" onDrop={dropHandler} onDragEnter={ev => ev.preventDefault()} ref={elementRef}>
      <Header />
      <Mask/>
      <MainFrame>
        <SamplerPanel />
        <Controls />
        <Widget/>
      </MainFrame>
    </div>
  );
}
