import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Controls from './components/controls/Controls'
import Sequencer from './components/sequencer/Sequencer'
import Header from './components/controls/Header'

import Mask from './components/misc/Mask'

import SamplerPanel from './components/pads/Sampler'
import SequencerService from './services/transport/sequencer'
import useToneStore, { STORE_VERSION } from './store/store'
import { APP_HEADER_HEIGHT, CTRLS_HEADER_HEIGHT, SAMPLER_HEIGHT } from './constants'

const AppLayout = styled.div`
  display: grid;
  grid-template-rows: ${APP_HEADER_HEIGHT}px 1fr;
  height: 100vh;
`

const MainFrame = styled.div`
  width: 90%;
  margin: auto;
`

const HeaderFrame = styled.div`
  height: ${APP_HEADER_HEIGHT}px;
  background: rgba(255, 255, 255, 0.01);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(25px);
  position: relative;
`
const SequencerFrame = styled.div`
  display: grid;
  grid-template-rows: ${SAMPLER_HEIGHT}px ${CTRLS_HEADER_HEIGHT}px 1fr;
  grid-gap: 5px;
`

export default function App() {
  const [sequencerOn, setSequencerOn] = useState(false)
  useEffect(() => {
    if (useToneStore.getState().storeVersion !== STORE_VERSION) {
      useToneStore.getState().resetStore()
    }
    SequencerService.initSequencer()
    setSequencerOn(true)
    return SequencerService.unsubSequencerSubscriptions
  }, [setSequencerOn])

  return (
    <div>
      <Mask />
      <AppLayout>
        <HeaderFrame>
          <Header />
        </HeaderFrame>
        <MainFrame>
          {sequencerOn && (
            <SequencerFrame>
              <SamplerPanel />
              <Controls />
              <Sequencer />
            </SequencerFrame>
          )}
        </MainFrame>
      </AppLayout>
    </div>
  )
}
