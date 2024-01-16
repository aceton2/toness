import { useEffect } from 'react';
import styled from 'styled-components';
import Controls from './components/controls/Controls';
import Widget from './components/sequencer/Sequencer';
import Header from './components/controls/Header';

import Mask from './components/misc/Mask';

import SamplerPanel from './components/pads/Sampler';
import SequencerService from './services/transport/sequencer';


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
