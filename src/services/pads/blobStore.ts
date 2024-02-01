

function storeBlob(blob: Blob, id: number) {
    saveBlob(blob, id)
    return window.URL.createObjectURL(blob)
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

async function loadBlob(id: number) {
    const existingBlobStr = localStorage.getItem(`audioBlob_${id}`)
    if (existingBlobStr) {
        const res = await fetch(existingBlobStr);
        const blob = await res.blob();
        return window.URL.createObjectURL(blob)
    }
}

function deleteBlob(id: number) {
    localStorage.removeItem(`audioBlob_${id}`)
}

const BlobService = {
    storeBlob,
    loadBlob,
    deleteBlob
}

export default BlobService
