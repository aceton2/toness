import styled from 'styled-components'
import Recorder from '../_services/recorder'

const SamplerBox = styled.div`
  padding: 1rem;

  .visualizer {
    margin-bottom: 1rem;
  }
`

const WaveViewPort = styled.div`
  position: relative;
  canvas {
    position: absolute;
  }
  .control {
    z-index: 2;
  }
`

export default function Sampler() {
  function startRecording() {
    Recorder.startRecorder()
    // add button color feedback
  }

  function stopRecording() {
    Recorder.stopRecorder()
    // add button color feedback
  }

  function addSample() {
    Recorder.addSampleToSequencer()
    Recorder.deleteSample()
  }

  //  ON STOPPED PLAYING playSampleButton.style.background = "";

  return (
    <SamplerBox>
      <button onClick={Recorder.startMic}>mike on</button>
      <button onClick={Recorder.stopMic}>mike off</button>
      <button onClick={startRecording}>record</button>
      <button onClick={stopRecording}>stop</button>

      <div className="main-controls">
        <canvas className="visualizer" height="60px" width="100px"></canvas>
        <div>
          <button onClick={Recorder.previewSample}>play sample</button>
          <button onClick={addSample}>add sample</button>
          <button onClick={Recorder.deleteSample}>delete sample</button>
        </div>
        <WaveViewPort>
          <canvas className="wave" height="60px" width="400px"></canvas>
          <canvas className="control" height="60px" width="400px"></canvas>
        </WaveViewPort>
      </div>
    </SamplerBox>
  )
}
