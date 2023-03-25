import { ToneAudioBuffer } from 'tone'

function clearSample(parentEl: Element) {
  const waveCanvas = parentEl.querySelector('.wave') as HTMLCanvasElement
  const waveCtx = waveCanvas.getContext('2d') as CanvasRenderingContext2D
  waveCtx.fillStyle = '#36454f' //off-color-2
  waveCtx.fillRect(0, 0, waveCanvas.width, waveCanvas.height)
}

function drawAudioUrl(audioURL: string, parentEl: Element) {
    const buffer = new ToneAudioBuffer(audioURL, () => {
        drawSample(buffer.getChannelData(0), parentEl)
      })
}

function drawSample(channelBuffer: Float32Array, parentEl: Element) {
    const waveCanvas = parentEl.querySelector('.wave') as HTMLCanvasElement
    waveCanvas.width = parentEl.clientWidth - 10 ;

    const waveCtx = waveCanvas.getContext('2d') as CanvasRenderingContext2D
    const WIDTH = waveCanvas.width
    const HEIGHT = waveCanvas.height
  
    waveCtx.fillStyle = '#36454f' //off-color-2
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
  
const exp = {
    drawAudioUrl,
    clearSample
}

export default exp





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


