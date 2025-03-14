import styled from "styled-components"
import { EnvelopeParam } from "../../services/core/interfaces"
import useToneStore from "../../store/store"

const Box = styled.div`
  position: absolute;
  top: 100%;
  margin-top: 1px;
  padding: 5px;
  z-index: 3;
  background: var(--main-light);
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

interface CmpProps {
    padId: number
}

export default function PadControl({padId}: CmpProps) {
    
    const [padParams, setPadParams] = useToneStore(state => [state.instrumentParams[padId], state.setInstrumentParams])

    function updateParams(value: string, paramName: EnvelopeParam) {
        setPadParams(padId, {...padParams, [paramName]: parseInt(value), custom: true})
      }

    return <Box>
      { paramConfigs.map((cfg) => (
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
      )) }
</Box>
}