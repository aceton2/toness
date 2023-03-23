import TonerService from './toner'
import { ToneAudioBuffer } from 'tone'
import { PadName } from './interfaces';

// STREAM
let mediaRecorder: MediaRecorder;
let mediaDeviceStream: MediaStream;

function bindCanvasElements(iam: string): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const parentEl  = document.querySelector(`.viewPort_${iam}`) as Element
  const waveCanvas = parentEl.querySelector('.wave') as HTMLCanvasElement
  const waveCtx = waveCanvas.getContext('2d') as CanvasRenderingContext2D

  window.onresize = function () {
    // NEEDS TO REDRAW THE WAVES
  }

  const targetWidth = parentEl.clientWidth - 10 ;
  waveCanvas.width = targetWidth

  return [waveCanvas, waveCtx]
}

let attemptingStream = false;
async function setStream() {
  attemptingStream = true;
  if (navigator.mediaDevices.getUserMedia) {
    await navigator.mediaDevices.getUserMedia({ audio: true }).then(
      stream => mediaDeviceStream = stream, 
      error => console.log('The following error occured: ' + error))
  } else {
    console.log('getUserMedia not supported on your browser!')
  }
}

function setupSampler(iam: PadName) {
  mediaRecorder = new MediaRecorder(mediaDeviceStream)
  const waveEls = bindCanvasElements(iam)

  let chunks: Array<Blob> = []

  mediaRecorder.onstop = function (e) {
    const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
    chunks = []
    const audioURL = window.URL.createObjectURL(blob)

    // add to tone library
    TonerService.addSample(audioURL, iam)

    // draw wave to bound canvas element
    const buffer = new ToneAudioBuffer(audioURL, () => {
      drawSample(buffer.getChannelData(0), waveEls)
    })
  }

  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data)
  }
}

function drawSample(channelBuffer: Float32Array, waveEls: [HTMLCanvasElement, CanvasRenderingContext2D]) {
  const [waveCanvas, waveCtx] = waveEls
  const WIDTH = waveCanvas.width
  const HEIGHT = waveCanvas.height

  waveCtx.fillStyle = '#36454f'
  waveCtx.fillRect(0, 0, WIDTH, HEIGHT)

  waveCtx.lineWidth = 2
  waveCtx.strokeStyle = 'rgb(245,245,245)'

  const stepSize = WIDTH / channelBuffer.length
  let currentX = 0

  waveCtx.beginPath()
  waveCtx.moveTo(currentX, HEIGHT / 2)

  for (let i = 0; i < channelBuffer.length; i++) {
    currentX += stepSize
    waveCtx.lineTo(currentX, ((channelBuffer[i] + 1) / 2) * HEIGHT)
  }

  waveCtx.stroke()
}


// EXPORTS

function startRecorder(iam: PadName) {
  setupSampler(iam)
  mediaRecorder.start()
}

function stopRecorder() {
  if(mediaRecorder) {
    mediaRecorder.stop()
  }
}

async function startMic() {
  if(!attemptingStream) {
    await setStream()
  }
}

const api = {
  startRecorder,
  stopRecorder,
  startMic,
}

export default api


// //// EDITING WAVE
// // ------------------------------------------------------------------------

// function editCurrentSample(e) {
//   if (currentPlayer) {
//     let [start, stop] = drawSampleBox(e.offsetX)

//     if (start && stop) {
//       const length = currentPlayer.buffer.length * currentPlayer.sampleTime
//       playRates.offset = start * length
//       playRates.duration = (stop - start) * length
//     }
//   }
// }


// function drawSampleBox(marker) {
//   if (initMarker && marker > initMarker) {
//     ctrlCtx.beginPath()
//     ctrlCtx.fillStyle = 'rgba(84, 84, 84, 0.3)'
//     ctrlCtx.strokeStyle = 'rgb(0, 0, 0)'
//     ctrlCtx.lineWidth = 1
//     ctrlCtx.fillRect(initMarker, -1, marker - initMarker, controlCanvas.height + 2)
//     ctrlCtx.strokeRect(initMarker, -1, marker - initMarker, controlCanvas.height + 2)
//     let startStop = [initMarker / controlCanvas.width, marker / controlCanvas.width]
//     initMarker = null
//     return startStop
//   } else {
//     ctrlCtx.clearRect(0, 0, controlCanvas.width, controlCanvas.height)
//     ctrlCtx.beginPath()
//     ctrlCtx.lineWidth = 1
//     ctrlCtx.strokeStyle = 'rgb(0, 0, 0)'
//     ctrlCtx.moveTo(marker, 0)
//     ctrlCtx.lineTo(marker, controlCanvas.height)
//     ctrlCtx.stroke()
//     initMarker = marker
//     return [false, false]
//   }
// }


