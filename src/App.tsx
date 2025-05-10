import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Controls from './components/controls/Controls';
import Sequencer from './components/sequencer/Sequencer';
import Header from './components/controls/Header';

import Mask from './components/misc/Mask';

import SamplerPanel from './components/pads/Sampler';
import SequencerService from './services/transport/sequencer';
import useToneStore, { STORE_VERSION } from './store/store';


const MainFrame = styled.div`
  margin: 0 10px;
  width: 90%;
  margin: auto;
`;

const HeaderFrame = styled.div`
  background: rgba(255, 255, 255, 0.01);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(25px);
  position: relative;
`

const HeaderPadding = styled.div`
  padding-bottom: 36px;
`

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
      <Mask/>

      <HeaderFrame>
        <Header />
        <HeaderPadding />
      </HeaderFrame>
      <MainFrame>
        { sequencerOn && <>
          <SamplerPanel />
          <Controls />
          <Sequencer/>
        </>
        }
      </MainFrame>
    </div>
  );
}
