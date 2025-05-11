import { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import RecorderService from '../../services/sampling/recorder'
import SampleService from '../../services/sampling/sample'
import { Instrument } from '../../services/core/interfaces'
import useToneStore, { selectPadAudioUrl } from '../../store/store'
import DrawerService from '../../services/sampling/waveRender'
import InstrumentsService from '../../services/core/instruments'
import useWindowResize from '../useWindowResize'
import TrashIcon from './trashIcon'
import WavesIcon from './wavesIcon'
import PadControl from './PadControl'
import SliderIcon from './sliderlcon'
import { SAMPLER_PAD_HEIGHT } from '../../constants'

const PadBox = styled.div`
  position: relative;
  border-radius: 5px;
  display: flex
  flex-direction: column;
  height: 165px;
  border: 1.5px solid var(--black);
  background: var(--main);
  border-radius: 3px;
`

const RecordingBox = styled.div`
  cursor: pointer;
`

const Blur = styled.div`
  position: absolute;
  border-radius: 5px;
  backdrop-filter: blur(4px);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  & div {
    text-align: center;
    font-style: italic;
    margin-top: 1rem;
  }
`

const WaveViewPort = styled.div`
  position: relative;
  padding: 5px;
  height: ${SAMPLER_PAD_HEIGHT}px;
  canvas {
    position: absolute;
  }
  & .edit {
    fill-opacity: 0;
  }
`

const Wave = styled.div`
  width: 100%;
  height: 100%;
`

const TopBar = styled.div`
  position: absolute;
  z-index: 2;
  top: 10px;
  left: 0;
  right: 0;
  text-align: center;
  font-weight: 600;
  font-size: 1.5rem;
  cursor: default;
  & button {
    position: absolute;
    right: 0px;
    background: none;
    font-weight: 600;
    border: 0px;
  }
`

const BottomBar = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 2px;
  width: 100%;
  box-sizing: border-box;
  color: var(--contrast);
  padding-left: 10px;
  display: flex;
  & button {
    background: var(--main-light);
    display: flex;
    width: 30px;
    height: 30px;
    padding: 5px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 3.846px;
    background: var(--Mittel-Grau, #b9abeb);
  }
`

const ButtonBox = styled.div`
  margin: 5px;
  position: absolute;
  right: 0;
  bottom: 0;
`

const PadTitle = styled.div`
  margin-left: 8px;
`

const Slice = styled.div`
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50px;
  background: #92d5fb;
  opacity: 0.9;
  z-index: 10;
`

export default function Pad(props: { pad: Instrument }) {
  const elementRef = useRef<HTMLDivElement>(null)
  const audioUrl = useToneStore(
    useCallback((state) => selectPadAudioUrl(state, props.pad.id), [props.pad.id])
  )
  const [padParams, setPadParams] = useToneStore((state) => [
    state.instrumentParams[props.pad.id],
    state.setInstrumentParams,
  ])
  const [recording, setRecording] = useState(false)
  const [showPadCtrl, setShowPadCtrl] = useState(false)
  const windowSize = useWindowResize()

  const startRecording = useCallback(() => {
    if (!elementRef.current) return
    DrawerService.clearAllCanvas(elementRef.current)
    RecorderService.startRecorder(props.pad.id, elementRef.current)
    setRecording(true)
    setPadParams(props.pad.id)
  }, [props.pad.id, setPadParams])

  useEffect(() => {
    if (!elementRef.current) return
    DrawerService.drawAudioUrl(elementRef.current, audioUrl)
  }, [elementRef, audioUrl, windowSize])

  useEffect(() => {
    if (!elementRef.current) return
    DrawerService.updateEditLayer(padParams, elementRef.current)
  }, [elementRef, padParams, windowSize])

  function recordOrPlay() {
    const trigger = InstrumentsService.getPlayInstrumentTrigger(props.pad.id, true)
    audioUrl ? trigger(0) : startRecording()
  }

  function stopRecording() {
    if (recording) {
      RecorderService.stopRecorder()
      setRecording(false)
    }
  }

  function clearPad() {
    SampleService.removeSample(props.pad.id)
  }

  return (
    <PadBox onMouseLeave={() => stopRecording()} onMouseUp={() => stopRecording()}>
      <TopBar>
        {audioUrl && (
          <button onClick={clearPad}>
            <TrashIcon />
          </button>
        )}
      </TopBar>

      {!recording ? (
        ''
      ) : (
        <Blur>
          {' '}
          <div> recording...</div>{' '}
        </Blur>
      )}

      {/* <Slice style={{ width: '50px' }} /> */}

      <RecordingBox
        onMouseDown={() => recordOrPlay()}
        onMouseMove={(e) => e.buttons > 0 && console.log(e.clientX)}
        onDragStart={console.log}
        onTouchStart={console.log}
      >
        <WaveViewPort>
          <Wave ref={elementRef}>
            <canvas className="wave" height="0px" width="0px"></canvas>
            <canvas className="edit" height="0px" width="0px"></canvas>
          </Wave>
        </WaveViewPort>
      </RecordingBox>

      <BottomBar>
        <div>
          <WavesIcon />
        </div>
        <PadTitle> {props.pad.name} </PadTitle>
        <ButtonBox>
          {audioUrl && (
            <button onClick={() => setShowPadCtrl(!showPadCtrl)}>
              <SliderIcon />
            </button>
          )}
        </ButtonBox>
      </BottomBar>

      {showPadCtrl && audioUrl && <PadControl padId={props.pad.id} />}
    </PadBox>
  )
}
