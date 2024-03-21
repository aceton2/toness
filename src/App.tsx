import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Controls from './components/controls/Controls';
import Widget from './components/sequencer/Sequencer';
import Header from './components/controls/Header';

import Mask from './components/misc/Mask';

import SamplerPanel from './components/pads/Sampler';
import SequencerService from './services/transport/sequencer';
import useToneStore, { STORE_VERSION } from './store/store';


const MainFrame = styled.div`
  margin: 0rem 1rem 1rem;
  padding: 1.5rem 2rem;
  border-radius: 5px; 
`;

export default function App() {
  const [sequencerOn, setSequencerOn] = useState(false)
  useEffect(() => {
    if(useToneStore.getState().storeVersion !== STORE_VERSION) { 
      useToneStore.getState().resetStore() 
    }
    SequencerService.initSequencer();
    setSequencerOn(true)
    return SequencerService.unsubSequencerSubscriptions
  }, [setSequencerOn])

  return (
    <div>
      <Header />
      <Mask/>
      <MainFrame>
        { sequencerOn && <>
          <SamplerPanel />
          <Controls />
          <Widget/>
        </>
        }
      </MainFrame>
    </div>
  );
}
