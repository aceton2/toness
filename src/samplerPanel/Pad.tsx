import styled from "styled-components"
import SamplerService from "../_services/sampler"
import TonerService from "../_services/toner";
import { PadName, ToneParams } from "../_services/interfaces";
import { useState } from "react";

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
  grid-template-columns: repeat(5, 1fr);

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
`

const Title = styled.div`
  margin: 0px auto;
  width: 50px;
  padding-top: 1rem;
  text-align: center;
`

type ParamName = 'duration' | 'fadeOut' | 'offset' | 'fadeIn' | 'pitchShift'

interface ParamCfg {displayName: string, name: ParamName, min: number, max: number, step: number, default: number}

const paramConfigObj: {[key: string]: ParamCfg} = {
  offset: {displayName: 'start', name: 'offset', min: 0, max: 99, step: 1, default: 0},
  fadeOut: {displayName: 'f-in', name: 'fadeOut', min: 0, max: 99, step: 1, default: 20},
  duration: {displayName: 'duration', name: 'duration', min: 0, max: 99, step: 1, default: 99},
  fadeIn: {displayName: 'f-out', name: 'fadeIn', min: 0, max: 99, step: 1, default: 20},
  pitchShift: {displayName: 'shift', name: 'pitchShift', min: -48, max: 48, step: 1, default: 0},
}
const paramConfigs: Array<ParamCfg> = Array.from(Object.values(paramConfigObj))

export default function Pad(props: {iam: PadName}) {
    const [recording, setRecording] = useState(false)
    const [active, setActive] = useState(false)
    const [params, setParams] = useState<ToneParams>({
      offset: paramConfigObj.offset.default,
      duration: paramConfigObj.duration.default,
      fadeOut: paramConfigObj.fadeOut.default,
      fadeIn: paramConfigObj.fadeIn.default,
      pitchShift: paramConfigObj.pitchShift.default
    })

    const instrument = TonerService.getPadByName(props.iam)

    function startRecording() {
      setRecording(true)
      SamplerService.startRecorder(props.iam)
    }
  
    function stopRecording() {
      if(recording) {
        setRecording(false)
        setActive(true)
        SamplerService.stopRecorder()
      }
    }

    function updateParams(value: string, key: ParamName) {
      setParams(state => {
        state[key] = parseFloat(value)
        if(instrument) { TonerService.updateInstrumentParams(instrument, state) }
        return {...state}
      })
    }

    return (
    <PadBox onMouseLeave={() => stopRecording()} onMouseUp={() => stopRecording()}>
        { !recording ? '' : (
            <Blur> <div> recording...</div> </Blur>
        )}
        <RecordingBox onMouseDown={() => startRecording()}>
          <Title>{props.iam}</Title>
          <WaveViewPort className={`viewPort_${props.iam}`}>
            <canvas className="wave" height="60px" width="100px"></canvas>
          </WaveViewPort>
        </RecordingBox>

        <PadControl>
            { active ? (
              paramConfigs.map((cfg) => (
                <div key={cfg.name}>
                  <div>{cfg.displayName}</div>
                  <input type="number" 
                    value={params[cfg.name]} 
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