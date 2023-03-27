import TonerService from './toner'
import { PadName } from './interfaces';

// RECORDER
let mediaRecorder: MediaRecorder | undefined;

async function setStream() {
  if (navigator.mediaDevices.getUserMedia) {
    return await navigator.mediaDevices.getUserMedia({ audio: true })
  } else {
    console.log('getUserMedia not supported on your browser!')
  }
}

async function setupSampler(iam: PadName, parentEl: Element): Promise<MediaRecorder | undefined> {
  const mediaDeviceStream = await setStream()
  if(!mediaDeviceStream) return;
  const mediaRecorder = new MediaRecorder(mediaDeviceStream)

  let chunks: Array<Blob> = []

  mediaRecorder.onstop = function (e) {
    const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"})
    chunks = []
    const audioURL = window.URL.createObjectURL(blob)
    saveBlob(blob, iam)
    TonerService.addSample(audioURL, iam)
    mediaDeviceStream.getAudioTracks()[0].stop()
  }

  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data)
  }

  return mediaRecorder
}

async function saveBlob(blob: Blob, padName: PadName) {
  const reader = new FileReader()
  reader.addEventListener('loadend', (event:ProgressEvent) => {
    if(typeof(reader.result) === 'string') {
      localStorage.setItem(`audioBlob_${padName}`, reader.result)
    }
  })
  reader.readAsDataURL(blob)
}

// EXPORTS

async function startRecorder(iam: PadName, parentEl: Element) {
  mediaRecorder = await setupSampler(iam, parentEl)
  if(mediaRecorder) {
    mediaRecorder.start()
  }
}

function stopRecorder() {
  if(mediaRecorder) {
    mediaRecorder.stop()
  }
}

const api = {
  startRecorder,
  stopRecorder,
}

export default api
