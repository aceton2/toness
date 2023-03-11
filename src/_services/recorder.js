import TonerService from './toner'
import { ToneAudioBuffer, Player } from 'tone'

let mediaRecorder
let defaultPlayRates = {
  offset: 0,
  duration: 20,
  fadeOut: 0.1,
}
let currentPlayer
let playRates
let audioMicTrack
let initMarker
let drawingFFT = false

// CANVAS
let canvas
let waveCanvas
let controlCanvas
let audioCtx
let canvasCtx
let waveCtx
let ctrlCtx

function bindCanvasElements() {
  const mainSection = document.querySelector('.main-controls')
  canvas = document.querySelector('.visualizer')
  waveCanvas = document.querySelector('.wave')
  controlCanvas = document.querySelector('.control')
  canvasCtx = canvas.getContext('2d')
  waveCtx = waveCanvas.getContext('2d')
  ctrlCtx = controlCanvas.getContext('2d')

  controlCanvas.addEventListener('click', editCurrentSample)

  window.onresize = function () {
    canvas.width = mainSection.clientWidth
    waveCanvas.width = mainSection.clientWidth
    controlCanvas.width = mainSection.clientWidth
  }

  window.onresize()
}

function initSampler() {
  initMarker = null
  playRates = { ...defaultPlayRates }

  if (navigator.mediaDevices.getUserMedia) {
    const constraints = { audio: true }
    let chunks = []

    let onSuccess = function (stream) {
      mediaRecorder = new MediaRecorder(stream)

      bindAnalyser(stream)

      audioMicTrack = stream.getAudioTracks()[0]

      mediaRecorder.onstop = function (e) {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
        chunks = []
        const audioURL = window.URL.createObjectURL(blob)
        currentPlayer = new Player(audioURL).toDestination()
        currentPlayer.connect(TonerService.recorder);
        const buffer = new ToneAudioBuffer(audioURL, () => {
          drawSample(buffer.getChannelData(0))
        })
      }

      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data)
      }
    }

    let onError = function (err) {
      console.log('The following error occured: ' + err)
    }

    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError)
  } else {
    console.log('getUserMedia not supported on your browser!')
  }
}

// SETUP

function bindAnalyser(stream) {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }

  const source = audioCtx.createMediaStreamSource(stream)
  const analyser = audioCtx.createAnalyser()

  analyser.fftSize = 2048
  source.connect(analyser)

  drawingFFT = true
  drawFFT(analyser)
}

// EDITING

function editCurrentSample(e) {
  if (currentPlayer) {
    let [start, stop] = drawSampleBox(e.offsetX)

    if (start && stop) {
      const length = currentPlayer.buffer.length * currentPlayer.sampleTime
      playRates.offset = start * length
      playRates.duration = (stop - start) * length
    }
  }
}

// DRAWING

function clearSampleWave() {
  waveCtx.fillStyle = 'rgb(212, 97, 116)'
  waveCtx.fillRect(0, 0, waveCanvas.width, waveCanvas.height)
  ctrlCtx.clearRect(0, 0, controlCanvas.width, controlCanvas.height)
}

function clearFFT() {
  drawingFFT = false
  setTimeout(() => {
    canvasCtx.fillStyle = 'rgb(212, 97, 116)'
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
  }, 50)
}

function drawSampleBox(marker) {
  if (initMarker && marker > initMarker) {
    ctrlCtx.beginPath()
    ctrlCtx.fillStyle = 'rgba(84, 84, 84, 0.3)'
    ctrlCtx.strokeStyle = 'rgb(0, 0, 0)'
    ctrlCtx.lineWidth = 1
    ctrlCtx.fillRect(initMarker, -1, marker - initMarker, controlCanvas.height + 2)
    ctrlCtx.strokeRect(initMarker, -1, marker - initMarker, controlCanvas.height + 2)
    let startStop = [initMarker / controlCanvas.width, marker / controlCanvas.width]
    initMarker = null
    return startStop
  } else {
    ctrlCtx.clearRect(0, 0, controlCanvas.width, controlCanvas.height)
    ctrlCtx.beginPath()
    ctrlCtx.lineWidth = 1
    ctrlCtx.strokeStyle = 'rgb(0, 0, 0)'
    ctrlCtx.moveTo(marker, 0)
    ctrlCtx.lineTo(marker, controlCanvas.height)
    ctrlCtx.stroke()
    initMarker = marker
    return [false, false]
  }
}

function drawSample(channelBuffer) {
  const WIDTH = waveCanvas.width
  const HEIGHT = waveCanvas.height

  waveCtx.fillStyle = 'rgb(212, 97, 116)'
  waveCtx.fillRect(0, 0, WIDTH, HEIGHT)

  waveCtx.lineWidth = 2
  waveCtx.strokeStyle = 'rgb(245,245,245)'

  const stepSize = WIDTH / channelBuffer.length
  let currentX = 0

  waveCtx.beginPath()
  waveCtx.moveTo(currentX, HEIGHT)

  for (let i = 0; i < channelBuffer.length; i++) {
    currentX += stepSize
    waveCtx.lineTo(currentX, ((channelBuffer[i] + 1) / 2) * HEIGHT)
  }

  waveCtx.stroke()
}

function drawFFT(analyser) {
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  draw()

  function draw() {
    const WIDTH = canvas.width
    const HEIGHT = canvas.height

    if (drawingFFT) {
      requestAnimationFrame(draw)
    }

    analyser.getByteFrequencyData(dataArray)

    canvasCtx.fillStyle = 'rgb(212, 97, 116)'
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

    canvasCtx.lineWidth = 2
    canvasCtx.strokeStyle = 'rgb(245,245,245)'

    canvasCtx.beginPath()

    let sliceWidth = (WIDTH * 1.0) / bufferLength
    let x = 0

    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 255
      let y = HEIGHT * (1 - v)

      i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y)
      x += sliceWidth
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2)
    canvasCtx.stroke()
  }
}

// EXPORTS

function addSampleToSequencer() {
  if (currentPlayer) {
    TonerService.addSample(currentPlayer, playRates)
    playRates = { ...TonerService.defaultPlayRates }
  }
}

function deleteSample() {
  if (currentPlayer) {
    clearSampleWave()
    currentPlayer = null
  }
}

function previewSample() {
  if (currentPlayer) {
    currentPlayer.fadeOut = playRates.fadeOut
    currentPlayer.start('+0', playRates.offset, playRates.duration)
    // playSampleButton.style.background = "red";
  }
}

function startRecorder() {
  mediaRecorder.start()
}

function stopRecorder() {
  mediaRecorder.stop()
}

function startMic() {
  if (!canvas) {
    bindCanvasElements()
  }
  initSampler()
}

function stopMic() {
  audioMicTrack.stop()
  clearFFT()
}

const api = {
  startRecorder,
  stopRecorder,
  addSampleToSequencer,
  previewSample,
  stopMic,
  startMic,
  deleteSample,
}

export default api
