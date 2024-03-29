import { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components"
import RecorderService from "../../services/sampling/recorder"
import SampleService from "../../services/sampling/sample";
import { EnvelopeParam, Instrument } from "../../services/core/interfaces";
import useToneStore, { selectPadAudioUrl } from "../../store/store";
import DrawerService from "../../services/sampling/waveRender";
import InstrumentsService from "../../services/core/instruments";
import useWindowResize from "../useWindowResize";

const PadBox = styled.div`
  position: relative;
  border-radius: 5px;
  margin: 5px; 
`

const RecordingBox = styled.div`
  height: 120px;
  background: var(--off-color-2);
  border-radius: 5px 5px 0px 0px;

  display: flex;
  flex-direction: column;   
  cursor: pointer;
`

const PadControl = styled.div`
  height: 30px;
  background: #556d7c;
  border-radius: 0px 0px 5px 5px;
  
  text-align: center;
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  font-size: 0.8rem;

  & > div {
    margin: 0 0.1rem;
  }
  & input {
    width: 80%;
    font-size: 0.8rem;
    border: 1px solid whitesmoke;
    color: white;
    background: #556d7c;
    border-radius: 2px;
  }
`

const Blur = styled.div `
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
  height: 85px;
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

const Title = styled.div<{color: string}>`
  margin: 0px;
  height: 20px;
  text-align: center;
  border-radius: 5px 5px 0px 0px;
  background: var(${props => `--pad-${props.color}`});
`

const TopControl = styled.div`
  position: absolute;
  z-index: 2;
  top: -1px;
  left: 0;
  right: 0;
  text-align: center;
  font-weight: 600;
  font-size: 1.5rem;
  cursor: default;
  & button {
    position: absolute;
    right: 5px;
    top: 2px;
    background: none;
    font-weight: 600;
  }
`

interface ParamCfg {displayName: string, name: EnvelopeParam, min: number, max: number, step: number}
const paramConfigObj: {[key: string]: ParamCfg} = {
  offset: {displayName: 'start', name: EnvelopeParam.offset, min: 0, max: 99, step: 1},
  // fadeIn: {displayName: 'f-in', name: EnvelopeParam.fadeIn, min: 0, max: 99, step: 1},
  duration: {displayName: 'duration', name: EnvelopeParam.duration, min: 0, max: 99, step: 1},
  // fadeOut: {displayName: 'f-out', name: EnvelopeParam.fadeOut, min: 0, max: 99, step: 1},
  volume: {displayName: 'amplitude', name: EnvelopeParam.amplitude, min: -24, max: 24, step: 1},
  pitchShift: {displayName: 'pitch', name: EnvelopeParam.pitchShift, min: -48, max: 48, step: 1},
}
const paramConfigs: Array<ParamCfg> = Array.from(Object.values(paramConfigObj))

export default function Pad(props: {pad: Instrument}) {
    const elementRef = useRef<HTMLDivElement>(null)
    const audioUrl = useToneStore(useCallback(state => selectPadAudioUrl(state, props.pad.id), [props.pad.id]))
    const [padParams, setPadParams] = useToneStore(state => [state.instrumentParams[props.pad.id], state.setInstrumentParams])
    const [recording, setRecording] = useState(false)
    const windowSize = useWindowResize()

    const startRecording = useCallback(() => {
      if(!elementRef.current) return
      DrawerService.clearAllCanvas(elementRef.current)
      RecorderService.startRecorder(props.pad.id, elementRef.current)
      setRecording(true)
      setPadParams(props.pad.id)
    }, [props.pad.id, setPadParams])

    useEffect(() => {
      if(!elementRef.current) return
      DrawerService.drawAudioUrl(elementRef.current, audioUrl)
    }, [elementRef, audioUrl, windowSize])

    useEffect(() => {
      if(!elementRef.current) return
      DrawerService.updateEditLayer(padParams, elementRef.current)
    }, [elementRef, padParams, windowSize])

    function recordOrPlay() {
      const trigger = InstrumentsService.getPlayInstrumentTrigger(props.pad.id, true)
      audioUrl ?  trigger(0) : startRecording()
    }

    function stopRecording() {
      if(recording) {
        RecorderService.stopRecorder()
        setRecording(false)
      }
    }

    function updateParams(value: string, paramName: EnvelopeParam) {
      setPadParams(props.pad.id, {...padParams, [paramName]: parseInt(value), custom: true})
    }

    function clearPad() {
      SampleService.removeSample(props.pad.id)
    }

    return (
    <PadBox 
      onMouseLeave={() => stopRecording()} 
      onMouseUp={() => stopRecording()}>
          <TopControl>
            <div>{props.pad.name}</div>
            { audioUrl &&
              <button onClick={clearPad}>(x)</button> 
            }
          </TopControl>
        { !recording ? '' : (
            <Blur> <div> recording...</div> </Blur>
        )}
        <RecordingBox onMouseDown={() => recordOrPlay()}>
          <Title color={props.pad.name}></Title>
          <WaveViewPort>
            <Wave ref={elementRef}>
              <canvas className="wave" height="0px" width="0px"></canvas>
              <canvas className="edit" height="0px" width="0px"></canvas>
            </Wave>
          </WaveViewPort>
        </RecordingBox>

        <PadControl>
            { audioUrl ? (
              paramConfigs.map((cfg) => (
                <div key={cfg.name}>
                  <div>{cfg.displayName}</div>
                  <input type="number" 
                    value={padParams[cfg.name]} 
                    onChange={(e) => updateParams(e.target.value, cfg.name)} 
                    min={cfg.min}
                    max={cfg.max}
                    step={cfg.step}
                  />
                </div>
              ))
              ) : ''
            }
        </PadControl>
    </PadBox>
    )
}