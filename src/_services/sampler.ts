import TonerService from './toner'
import { PadName, blobType } from './interfaces';

// STREAM
let mediaRecorder: MediaRecorder;
let mediaDeviceStream: MediaStream;

// BLOB 

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

function setupSampler(iam: PadName, parentEl: Element) {
  mediaRecorder = new MediaRecorder(mediaDeviceStream)

  let chunks: Array<Blob> = []

  mediaRecorder.onstop = function (e) {
    const blob = new Blob(chunks, blobType)
    chunks = []
    const audioURL = window.URL.createObjectURL(blob)
    saveBlob(blob, iam)
    TonerService.addSample(audioURL, iam)
  }

  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data)
  }
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

function startRecorder(iam: PadName, parentEl: Element) {
  setupSampler(iam, parentEl)
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
