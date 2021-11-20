export interface CropResult {
  blob: Blob;
  imageSrc: string;
}

export interface BlobWithType {
  blob: Blob;
  type: string;
}

export const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type?: string,
  quality?: any
): Promise<Blob> => {
  return new Promise<Blob>((resolve) => canvas.toBlob(resolve, type, quality));
};

export const getMimeType = (file: ArrayBufferLike, fallback?: string): string => {
  const byteArray = new Uint8Array(file).subarray(0, 4);

  let header = '';

  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }

  switch (header) {
    case '89504e47':
      return 'image/png';
    case '47494638':
      return 'image/gif';
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'image/jpeg';
    default:
      return fallback;
  }
};

export const readAsArrayBuffer = (file: File) => {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const getHTTPBlob = (url: string): Promise<Blob> => {
  return new Promise<Blob>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = reject;

    xhr.send();
  });
};
