import { useEffect } from 'react';
import styled from 'styled-components';
import Controls from './controlPanel/Controls';
import Widget from './widgetPanel/Widget';
import Header from './controlPanel/Header';

import Mask from './auxComps/Mask';

import SamplerPanel from './samplerPanel/Sampler';
import SequencerService from './_services/sequencer';


const MainFrame = styled.div`
  margin: 0rem 1rem 1rem;
  padding: 1.5rem 2rem;
  border-radius: 5px; 
`;

SequencerService.initSequencer();

export default function App() {
  useEffect(() => {
    return SequencerService.unsubSequencerSubscriptions
  }, [])

  return (
    <div>
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
