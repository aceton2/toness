import PadService from './sample';
import InstrumentsService from '../core/instruments';
import BlobService from './blobStore';

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
    const url = BlobService.storeBlob(blob, id)
    PadService.addSample(url, InstrumentsService.instruments[id])
    mediaDeviceStream.getAudioTracks()[0].stop()

    // reset buffer
    chunks = []
  }

  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data)
  }

  return mediaRecorder
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
