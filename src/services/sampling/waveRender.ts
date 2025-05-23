import { ToneAudioBuffer } from 'tone'
import { InstrumentParam, EnvelopeParam } from '../core/interfaces'

function clearAllCanvas(parentEl: Element) {
  clearSample(parentEl, 'wave')
  clearSample(parentEl, 'edit')
}

function clearSample(parentEl: Element, className: 'wave' | 'edit') {
  const canvas = parentEl.querySelector(`.${className}`) as HTMLCanvasElement
  if (!canvas) return;
  canvas.width = 0
}

function updateEditLayer(params: InstrumentParam, parentEl: Element) {

  if (!params || !params.custom) { return }

  const canvas = parentEl.querySelector('.edit') as HTMLCanvasElement
  if (!canvas) return;
  canvas.height = parentEl.clientHeight;
  canvas.width = parentEl.clientWidth;

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const WIDTH = canvas.width
  const HEIGHT = canvas.height

  ctx.fillStyle = 'rgba(0,0,0,0)'
  ctx.lineWidth = 1

  const HEIGHT_PARAM_HIGH = HEIGHT * 0.2;
  const HEIGHT_PARAM_LOW = HEIGHT * 0.8;

  const unity = WIDTH / 100
  const startX = params[EnvelopeParam.offset] * unity
  const fillFullX = startX + params[EnvelopeParam.fadeIn] * unity
  const durationX = startX + params[EnvelopeParam.duration] * unity
  const fillDropX = durationX // - params[EnvelopeParam.fadeOut] * unity

  ctx.strokeStyle = 'rgba(0,0,0,0)'

  ctx.beginPath()
  ctx.moveTo(startX, HEIGHT_PARAM_LOW)
  ctx.lineTo(fillFullX, HEIGHT_PARAM_HIGH)
  ctx.lineTo(fillDropX, HEIGHT_PARAM_HIGH)
  ctx.lineTo(durationX, HEIGHT_PARAM_LOW)
  ctx.lineTo(startX, HEIGHT_PARAM_LOW)
  ctx.fillStyle = 'rgba(248,248,255, 0.5)'
  ctx.fill()
  ctx.stroke()
}

function drawAudioUrl(parentEl: Element, audioURL?: string,) {
  if (!audioURL) {
    clearAllCanvas(parentEl)
  }
  const buffer = new ToneAudioBuffer(audioURL, () => {
    drawSample(buffer.getChannelData(0), parentEl)
  })
}

function drawSample(channelBuffer: Float32Array, parentEl: Element) {
  const waveCanvas = parentEl.querySelector('.wave') as HTMLCanvasElement
  waveCanvas.width = parentEl.clientWidth;
  waveCanvas.height = parentEl.clientHeight;

  const waveCtx = waveCanvas.getContext('2d') as CanvasRenderingContext2D
  const WIDTH = waveCanvas.width
  const HEIGHT = waveCanvas.height

  waveCtx.fillStyle = 'rgba(0,0,0,0)' // '#36454f' //off-color-2
  waveCtx.fillRect(0, 0, WIDTH, HEIGHT)

  waveCtx.lineWidth = 2
  waveCtx.strokeStyle = 'rgb(255, 255, 255)' //white

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

const waveRender = {
  drawAudioUrl,
  clearAllCanvas,
  updateEditLayer
}

export default waveRender





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


