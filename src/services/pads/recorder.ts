import PadService from './pad'
import InstrumentsService from '../instruments';

// RECORDER
let mediaRecorder: MediaRecorder | undefined;

async function setStream() {
  if (navigator.mediaDevices.getUserMedia) {
    return await navigator.mediaDevices.getUserMedia({ audio: true })
  } else {
    console.log('getUserMedia not supported on your browser!')
  }
}

async function setupRecorder(id: number, parentEl: Element): Promise<MediaRecorder | undefined> {
  const mediaDeviceStream = await setStream()
  if (!mediaDeviceStream) return;
  const mediaRecorder = new MediaRecorder(mediaDeviceStream)

  let chunks: Array<Blob> = []

  mediaRecorder.onstop = function (e) {
    const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" })
    chunks = []
    const audioURL = window.URL.createObjectURL(blob)
    saveBlob(blob, id)
    PadService.addSample(audioURL, InstrumentsService.instruments[id])
    mediaDeviceStream.getAudioTracks()[0].stop()
  }

  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data)
  }

  return mediaRecorder
}

async function saveBlob(blob: Blob, id: number) {
  const reader = new FileReader()
  reader.addEventListener('loadend', (event: ProgressEvent) => {
    if (typeof (reader.result) === 'string') {
      localStorage.setItem(`audioBlob_${id}`, reader.result)
    }
  })
  reader.readAsDataURL(blob)
}

// EXPORTS

async function startRecorder(id: number, parentEl: Element) {
  mediaRecorder = await setupRecorder(id, parentEl)
  if (mediaRecorder) {
    mediaRecorder.start()
  }
}

function stopRecorder() {
  if (mediaRecorder) {
    mediaRecorder.stop()
  }
}

const api = {
  startRecorder,
  stopRecorder,
}

export default api
