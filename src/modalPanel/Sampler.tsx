import styled from 'styled-components';
import loadRecs from '../_services/recorder';

const SamplerBox = styled.div`
    padding: 1rem;
`;

const WaveViewPort = styled.div`
  position: relative;
  canvas {
    position: absolute
  }
  .control {
    z-index: 2;
  }
`;

export default function Sampler() {
    return (
        <SamplerBox>
            <button onClick={loadRecs}>init recorder</button>
            <button className="record">record</button>
            <button className="stop">stop</button>
            <button className="playSample">play sample</button>
            <button className="addSample">add sample</button>

            <div className="main-controls">
                <canvas className="visualizer" height="60px" width="100px"></canvas>
                <WaveViewPort>
                    <canvas className="wave" height="60px" width="400px"></canvas>
                    <canvas className="control" height="60px" width="400px"></canvas>
                </WaveViewPort>
            </div>
        </SamplerBox>
    )
}