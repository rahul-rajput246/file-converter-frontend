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
export const MAX_BATCH_FILES = 10;

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
  const videoExts = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv', '3gp', 'm4v'];
  const audioExts = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
  const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'ico'];

  let options = [];
  if (videoExts.includes(ext)) {
    // Video: primary targets are Animated GIF, Web Video, or extracted Audio/Snapshot
    options = ['GIF', 'MP4', 'WEBM', 'MP3', 'WAV', 'PNG', 'JPG'];
  } else if (audioExts.includes(ext)) {
    options = ['MP3', 'WAV', 'OGG', 'AAC'];
  } else if (imageExts.includes(ext)) {
    // Images: Animated GIF is a prime option, plus standard image formats & video clip
    options = ['GIF', 'JPG', 'PNG', 'WEBP', 'AVIF', 'BMP', 'ICO', 'PDF', 'MP4'];
  } else if (ext === 'pdf') {
    options = ['PNG', 'JPG', 'WEBP', 'AVIF', 'GIF', 'BMP', 'ICO', 'TXT'];
  } else {
    options = ['GIF', 'JPG', 'PNG', 'WEBP', 'MP4', 'MP3', 'PDF'];
  }

  const normalizedCurrent = ext === 'jpeg' ? 'jpg' : ext;
  
  return options.filter(f => {
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

  const ext = getFileExtension(file.name).toLowerCase();
  const supported = [
    'jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'ico',
    'mp4', 'webm', 'mov', 'avi', 'mkv', '3gp', 'm4v',
    'mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a',
    'pdf', 'txt'
  ];
  
  if (ext && !supported.includes(ext)) {
    return {
      valid: false,
      error: `The file format .${ext} is not supported. Supported: Images (JPG, PNG, WebP, GIF, AVIF, BMP, ICO), Videos (MP4, WEBM, MOV, AVI, MKV), and Audio (MP3, WAV, OGG, AAC).`
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/convert`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. The file took longer than 60 seconds to process.');
    }
    throw new Error('Network error or server unreachable. If the server was sleeping, please wait a few seconds and try again.');
  } finally {
    clearTimeout(timeoutId);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status} error.`);
    }
  }

  if (!response.ok) {
    const errorMsg = data?.errors?.file?.[0] || data?.errors?.format?.[0] || data?.message || 'File conversion failed.';
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/compress`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. The compression took longer than 60 seconds.');
    }
    throw new Error('Network error or server unreachable. If the server was sleeping, please wait a few seconds and try again.');
  } finally {
    clearTimeout(timeoutId);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status} error.`);
    }
  }

  if (!response.ok) {
    const errorMsg = data?.errors?.file?.[0] || data?.errors?.target_size_kb?.[0] || data?.errors?.compression_level?.[0] || data?.message || 'File compression failed.';
    throw new Error(errorMsg);
  }

  return data;
};

/**
 * Call Laravel API: POST /api/files/batch-convert
 * Convert up to 10 files in one request
 */
export const convertBatchFiles = async (fileInstances, targetFormat) => {
  const formData = new FormData();
  fileInstances.slice(0, MAX_BATCH_FILES).forEach((file) => {
    formData.append('files[]', file);
  });
  formData.append('format', targetFormat.toLowerCase());

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/batch-convert`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });
  } catch (err) {
    throw new Error('Network error or server unreachable. Please verify the backend is running.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status} error.`);
    }
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.errors?.files?.[0] || data?.errors?.format?.[0] || 'Batch conversion failed.';
    throw new Error(errorMsg);
  }

  return data;
};

/**
 * Call Laravel API: POST /api/files/batch-compress
 * Compress up to 10 files in one request
 */
export const compressBatchFiles = async (fileInstances, options = 'medium') => {
  const formData = new FormData();
  fileInstances.slice(0, MAX_BATCH_FILES).forEach((file) => {
    formData.append('files[]', file);
  });

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

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/batch-compress`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });
  } catch (err) {
    throw new Error('Network error or server unreachable. Please verify the backend is running.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status} error.`);
    }
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.errors?.files?.[0] || data?.errors?.compression_level?.[0] || 'Batch compression failed.';
    throw new Error(errorMsg);
  }

  return data;
};

/**
 * Call Laravel API: POST /api/files/create-zip
 */
export const createZipArchive = async (filenamesOrItems) => {
  try {
    const res = await fetch(`${API_BASE_URL}/create-zip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ files: filenamesOrItems }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data && data.success && data.zip_filename) ? data : null;
  } catch {
    return null;
  }
};

/**
 * High-speed parallel concurrent conversion of multiple files.
 * Provides instant live progress per file as it finishes on multi-threaded server.
 */
export const convertFilesParallel = async (filesList, targetFormat, onProgress) => {
  if (!filesList || filesList.length === 0) {
    throw new Error('No files provided.');
  }

  const list = filesList.slice(0, MAX_BATCH_FILES);
  const total = list.length;
  let completed = 0;
  const results = new Array(total);

  // Check for heavy media (PDF, Video) to throttle concurrency and avoid exhausting server RAM
  const hasHeavyMedia = list.some(item => {
    const ext = getFileExtension(item.name || item.fileInstance?.name || '').toLowerCase();
    return ['pdf', 'mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext);
  });
  const queue = list.map((item, idx) => ({ item, idx }));
  const CONCURRENCY = Math.min(hasHeavyMedia ? 2 : 3, total);

  if (onProgress) {
    onProgress({
      completedCount: 0,
      totalCount: total,
      percent: Math.min(20, Math.round(100 / total / 2)),
      latestResult: null,
    });
  }

  const runWorker = async () => {
    while (queue.length > 0) {
      const task = queue.shift();
      if (!task) break;
      const { item, idx } = task;
      const fileInstance = item.fileInstance || item;

      try {
        const res = await convertFile(fileInstance, targetFormat);

        results[idx] = {
          id: item.id || `file_${idx}`,
          original_name: item.name || fileInstance.name,
          original_size: item.size || fileInstance.size,
          filename: res.filename,
          format: targetFormat.toLowerCase(),
          size: res.size || item.size || 0,
          download_url: res.download_url,
          success: true,
        };
      } catch (err) {
        results[idx] = {
          id: item.id || `file_${idx}`,
          original_name: item.name || fileInstance?.name || `File ${idx + 1}`,
          original_size: item.size || 0,
          filename: null,
          format: targetFormat.toLowerCase(),
          size: 0,
          download_url: null,
          success: false,
          error: err.message || 'Conversion error',
        };
      } finally {
        completed++;
        if (onProgress) {
          onProgress({
            completedCount: completed,
            totalCount: total,
            percent: Math.round((completed / total) * 100),
            latestResult: results[idx],
          });
        }
      }
    }
  };

  const workers = Array.from({ length: CONCURRENCY }, () => runWorker());
  await Promise.all(workers);

  // Generate zip bundle if more than 1 file succeeded
  const successfulFiles = results.filter((r) => r && r.success && r.filename);
  let zipData = null;
  if (successfulFiles.length > 1) {
    const zipPayload = successfulFiles.map((f) => ({
      filename: f.filename,
      original_name: (f.original_name || 'file').replace(/\.[^.]+$/, '') + '.' + f.format,
    }));
    zipData = await createZipArchive(zipPayload);
  }

  return {
    total,
    converted_count: successfulFiles.length,
    target_format: targetFormat,
    files: results,
    filename: results[0]?.filename || null,
    download_url: results[0]?.download_url || null,
    size: results[0]?.size || 0,
    original_size: results[0]?.original_size || 0,
    zip_filename: zipData?.zip_filename || null,
    zip_download_url: zipData?.download_url || null,
  };
};

/**
 * High-speed parallel concurrent compression of multiple files.
 */
export const compressFilesParallel = async (filesList, options = 'medium', onProgress) => {
  if (!filesList || filesList.length === 0) {
    throw new Error('No files provided.');
  }

  const list = filesList.slice(0, MAX_BATCH_FILES);
  const total = list.length;
  let completed = 0;
  const results = new Array(total);

  const queue = list.map((item, idx) => ({ item, idx }));
  const CONCURRENCY = Math.min(4, total);

  if (onProgress) {
    onProgress({
      completedCount: 0,
      totalCount: total,
      percent: Math.min(20, Math.round(100 / total / 2)),
      latestResult: null,
    });
  }

  const runWorker = async () => {
    while (queue.length > 0) {
      const task = queue.shift();
      if (!task) break;
      const { item, idx } = task;
      const fileInstance = item.fileInstance || item;

      try {
        const res = await compressFile(fileInstance, options);

        results[idx] = {
          id: item.id || `file_${idx}`,
          original_name: item.name || fileInstance.name,
          original_size: res.original_size || item.size,
          processed_size: res.processed_size,
          size: res.processed_size,
          filename: res.filename,
          format: res.format,
          compression_level: res.compression_level,
          download_url: res.download_url,
          success: true,
        };
      } catch (err) {
        results[idx] = {
          id: item.id || `file_${idx}`,
          original_name: item.name || fileInstance?.name || `File ${idx + 1}`,
          original_size: item.size || 0,
          processed_size: 0,
          size: 0,
          filename: null,
          format: null,
          download_url: null,
          success: false,
          error: err.message || 'Compression error',
        };
      } finally {
        completed++;
        if (onProgress) {
          onProgress({
            completedCount: completed,
            totalCount: total,
            percent: Math.round((completed / total) * 100),
            latestResult: results[idx],
          });
        }
      }
    }
  };

  const workers = Array.from({ length: CONCURRENCY }, () => runWorker());
  await Promise.all(workers);

  const successfulFiles = results.filter((r) => r && r.success && r.filename);
  let zipData = null;
  if (successfulFiles.length > 1) {
    const zipPayload = successfulFiles.map((f) => ({
      filename: f.filename,
      original_name: (f.original_name || 'file').replace(/\.[^.]+$/, '') + '_compressed.' + (f.format || 'jpg'),
    }));
    zipData = await createZipArchive(zipPayload);
  }

  return {
    total,
    processed_count: successfulFiles.length,
    files: results,
    filename: results[0]?.filename || null,
    download_url: results[0]?.download_url || null,
    processed_size: results[0]?.processed_size || 0,
    original_size: results[0]?.original_size || 0,
    format: results[0]?.format || null,
    zip_filename: zipData?.zip_filename || null,
    zip_download_url: zipData?.download_url || null,
  };
};

/**
 * Trigger download from Laravel backend
 */
export const downloadFile = (downloadUrlOrFilename) => {
  if (!downloadUrlOrFilename) return;

  let url = downloadUrlOrFilename.startsWith('http')
    ? downloadUrlOrFilename
    : `${API_BASE_URL}/download/${downloadUrlOrFilename}`;

  // If page is HTTPS and download URL is HTTP, force HTTPS to prevent browser mixed content block
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
