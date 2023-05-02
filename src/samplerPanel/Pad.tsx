import { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components"
import SamplerService from "../_services/sampler"
import TonerService from "../_services/toner";
import { PadName, EnvelopeParam, defaultPad } from "../_services/interfaces";
import useToneStore, { selectPadAudioUrl } from "../_store/store";
import DrawerService from "../_services/drawer";
import useDebouncedTrigger from "./useDebouncedTrigger";

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
  height: 60px;
  canvas {
    position: absolute;
  }
  .control {
    z-index: 2;
  }
  & .edit {
    fill-opacity: 0;
  }
`

const Title = styled.div<{color: string}>`
  margin: 0px;
  height: 20px;
  text-align: center;
  border-radius: 5px 5px 0px 0px;
  background: var(${props => `--pad-${props.color}`});
`

interface ParamCfg {displayName: string, name: EnvelopeParam, min: number, max: number, step: number}
const paramConfigObj: {[key: string]: ParamCfg} = {
  offset: {displayName: 'start', name: EnvelopeParam.offset, min: 0, max: 99, step: 1},
  // fadeIn: {displayName: 'f-in', name: EnvelopeParam.fadeIn, min: 0, max: 99, step: 1},
  duration: {displayName: 'duration', name: EnvelopeParam.duration, min: 0, max: 99, step: 1},
  // fadeOut: {displayName: 'f-out', name: EnvelopeParam.fadeOut, min: 0, max: 99, step: 1},
  volume: {displayName: 'volume', name: EnvelopeParam.amplitude, min: -24, max: 24, step: 1},
  pitchShift: {displayName: 'pitch', name: EnvelopeParam.pitchShift, min: -48, max: 48, step: 1},
}
const paramConfigs: Array<ParamCfg> = Array.from(Object.values(paramConfigObj))

export default function Pad(props: {iam: PadName}) {
    const elementRef = useRef(null)
    const audioUrl = useToneStore(useCallback(state => selectPadAudioUrl(state, props.iam), [props.iam]))
    const trigger = TonerService.getPlayInstrumentTrigger(TonerService.getInstrumentByName(props.iam).id)
    const [padParams, setPadParams] = useToneStore(state => [state.padParams[props.iam], state.setPadParams])
    const [recording, setRecording] = useState(false)
    const [mouseDwn, setMouseDwn] = useState(false)
    const {triggered, initDebounce} = useDebouncedTrigger()

    const startRecording = useCallback(() => {
      if(!elementRef.current) return
      DrawerService.clearAllCanvas(elementRef.current)
      SamplerService.startRecorder(props.iam, elementRef.current)
      setRecording(true)
      setPadParams(props.iam, {...defaultPad})
    }, [props.iam, setPadParams])

    useEffect(() => {
      if(!elementRef.current) return
      DrawerService.drawAudioUrl(elementRef.current, audioUrl)
    }, [elementRef, audioUrl])

    useEffect(() => {
      if(!elementRef.current) return
      DrawerService.updateEditLayer(padParams, elementRef.current)
    }, [elementRef, padParams])

    useEffect(() => {
      if(triggered && mouseDwn) {
        startRecording()
      }
    }, [triggered, mouseDwn, startRecording])

    function mouseDown() {
      setMouseDwn(true)
      initDebounce()
    }

    function mouseUp() {
      setMouseDwn(false)
      stopRecording()
      if(!triggered) { trigger(0) }
    }

    function stopRecording() {
      if(recording) {
        SamplerService.stopRecorder()
        setRecording(false)
      }
    }

    function updateParams(value: string, paramName: EnvelopeParam) {
      setPadParams(props.iam, {...padParams, [paramName]: parseInt(value), custom: true})
    }

    return (
    <PadBox 
      onMouseLeave={() => mouseUp()} 
      onMouseUp={() => mouseUp()}>
        { !recording ? '' : (
            <Blur> <div> recording...</div> </Blur>
        )}
        <RecordingBox onMouseDown={() => mouseDown()}>
          <Title color={props.iam}></Title>
          <WaveViewPort ref={elementRef}>
            <canvas className="wave" height="60px" width="100px"></canvas>
            <canvas className="edit" height="60px" width="100px"></canvas>
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