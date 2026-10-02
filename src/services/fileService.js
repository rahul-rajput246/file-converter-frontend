/**
 * FileFlow Service - Live Laravel REST API Bridge
 * 
 * Connected to backend running on http://localhost:8000
 */

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/files').replace(/\/+$/, '');

export const SUPPORTED_FORMATS = {
  images: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'ico', 'pdf'],
  documents: ['pdf', 'docx', 'doc', 'txt', 'rtf', 'xlsx', 'pptx'],
  archives: ['zip', 'rar', 'tar', 'gz', '7z'],
  audio: ['mp3', 'wav', 'ogg', 'aac', 'flac'],
  video: ['mp4', 'webm', 'mov', 'avi', 'mkv']
};

export const MAX_FILE_SIZE_MB = 100;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Format bytes into human readable string (e.g. 2.4 MB)
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Extract file extension from filename
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

/**
 * Get friendly file type label
 */
export const getFriendlyFileType = (file) => {
  if (!file) return 'Unknown';
  if (file.type) {
    if (file.type.startsWith('image/')) return 'Image File';
    if (file.type.startsWith('video/')) return 'Video File';
    if (file.type.startsWith('audio/')) return 'Audio File';
    if (file.type.includes('pdf')) return 'PDF Document';
    if (file.type.includes('word') || file.type.includes('document')) return 'Word Document';
    if (file.type.includes('sheet') || file.type.includes('excel')) return 'Spreadsheet';
    if (file.type.includes('zip') || file.type.includes('compressed')) return 'Archive File';
  }
  const ext = getFileExtension(file.name).toUpperCase();
  return ext ? `${ext} File` : 'File';
};

/**
 * Get supported target conversion formats based on input extension
 */
export const getTargetConversionOptions = (inputExtension) => {
  const ext = (inputExtension || '').toLowerCase();
  const all = ['JPG', 'PNG', 'WEBP', 'AVIF', 'GIF', 'BMP', 'ICO', 'PDF'];
  const normalizedCurrent = ext === 'jpeg' ? 'jpg' : ext;
  
  return all.filter(f => {
    const norm = f.toLowerCase() === 'jpeg' ? 'jpg' : f.toLowerCase();
    return norm !== normalizedCurrent;
  });
};

/**
 * Validate selected file
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB.`
    };
  }

  const ext = getFileExtension(file.name);
  const supported = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'ico'];
  
  if (ext && !supported.includes(ext)) {
    return {
      valid: false,
      error: `The file format .${ext} is not supported. Supported image formats: JPG, PNG, WEBP, AVIF, GIF, BMP, ICO.`
    };
  }

  return { valid: true, error: null };
};

/**
 * Fetch supported formats from Laravel backend
 */
export const getSupportedFormats = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/supported-formats`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to fetch supported formats');
    const data = await res.json();
    return data.formats || ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'ico', 'pdf'];
  } catch {
    return ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'ico', 'pdf'];
  }
};

/**
 * Call Laravel API: POST /api/files/convert
 */
export const convertFile = async (fileInstance, targetFormat) => {
  const formData = new FormData();
  formData.append('file', fileInstance);
  formData.append('format', targetFormat.toLowerCase());

  const response = await fetch(`${API_BASE_URL}/convert`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.errors?.file?.[0] || data.errors?.format?.[0] || data.message || 'File conversion failed.';
    throw new Error(errorMsg);
  }

  return data;
};

/**
 * Call Laravel API: POST /api/files/compress
 */
export const compressFile = async (fileInstance, options = 'medium') => {
  const formData = new FormData();
  formData.append('file', fileInstance);

  if (typeof options === 'object' && options !== null) {
    if (options.targetSizeKb) {
      formData.append('target_size_kb', options.targetSizeKb);
    }
    if (options.level) {
      formData.append('compression_level', options.level.toLowerCase());
    }
  } else if (typeof options === 'string') {
    formData.append('compression_level', options.toLowerCase());
  }

  const response = await fetch(`${API_BASE_URL}/compress`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.errors?.file?.[0] || data.errors?.target_size_kb?.[0] || data.errors?.compression_level?.[0] || data.message || 'File compression failed.';
    throw new Error(errorMsg);
  }

  return data;
};

/**
 * Trigger download from Laravel backend
 */
export const downloadFile = (downloadUrlOrFilename) => {
  if (!downloadUrlOrFilename) return;

  const url = downloadUrlOrFilename.startsWith('http')
    ? downloadUrlOrFilename
    : `${API_BASE_URL}/download/${downloadUrlOrFilename}`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
