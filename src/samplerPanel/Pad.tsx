import styled from "styled-components"
import SamplerService from "../_services/sampler"
import { faPlayCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PadName } from "../_services/interfaces";
import { useState } from "react";

const PadBox = styled.div`
    position: relative;
    background: var(--off-color-2);
    border-radius: 5px;
    margin: 5px;
    height: 150px;
    display: flex;
    flex-direction: column;   
    cursor: pointer; 
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

const Stretch = styled.div`
    flex: 1;
`

const PadControl = styled.div`
  height: 30px;
  border-radius: 0px 0px 5px 5px;
  background: #556d7c;
  text-align: center;
  & svg {
    margin-top: 0.75rem;
  }
`

export default function Pad(props: {iam: PadName}) {
    const [recording, setRecording] = useState(false)
    
    function startRecording() {
        setRecording(true)
        SamplerService.startRecorder(props.iam)
      }
    
      function stopRecording() {
        setRecording(false)
        SamplerService.stopRecorder()
      }

    return (
    <PadBox onMouseDown={() => startRecording()} onMouseUp={() => stopRecording()}>
        { !recording ? '' : (
            <Blur> <div> recording...</div> </Blur>
        )}
        <Title>{props.iam}</Title>
        <WaveViewPort className={`viewPort_${props.iam}`}>
          <canvas className="visualizer" height="60px" width="400px"></canvas>
          <canvas className="wave" height="60px" width="400px"></canvas>
          <canvas className="control" height="60px" width="400px"></canvas>
        </WaveViewPort>
        <Stretch />
        <PadControl>
            {/* <FontAwesomeIcon icon={faPlayCircle}/> */}
        </PadControl>
    </PadBox>
    )
}