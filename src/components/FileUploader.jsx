import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { 
  FiUploadCloud, FiFile, FiTrash2, FiAlertCircle, FiCheck, 
  FiFileText, FiImage, FiArchive, FiVideo, FiMusic, FiPlus, FiX 
} from 'react-icons/fi';
import { formatBytes, getFileExtension, getFriendlyFileType, validateFile, MAX_BATCH_FILES } from '../services/fileService';

const FileUploader = forwardRef(function FileUploader({ 
  selectedFiles = [], 
  selectedFile = null, 
  onFilesSelect, 
  onFileSelect, 
  onFileRemove,
  onClearAll 
}, ref) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [infoNotice, setInfoNotice] = useState(null);
  const fileInputRef = useRef(null);

  // Normalize selected files list
  const filesList = Array.isArray(selectedFiles) && selectedFiles.length > 0 
    ? selectedFiles 
    : (selectedFile ? [selectedFile] : []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const processIncomingFiles = (incomingFiles) => {
    if (!incomingFiles || incomingFiles.length === 0) return;

    setErrorMessage(null);
    setInfoNotice(null);

    const validNewMetas = [];
    let hadInvalid = false;
    let firstError = null;

    // Check capacity
    const currentCount = filesList.length;
    const remainingSlots = Math.max(0, MAX_BATCH_FILES - currentCount);

    if (remainingSlots <= 0) {
      setErrorMessage(`Maximum limit of ${MAX_BATCH_FILES} images reached. Remove some images to add new ones.`);
      return;
    }

    const filesToExamine = Array.from(incomingFiles);
    if (filesToExamine.length > remainingSlots) {
      setInfoNotice(`Limit is ${MAX_BATCH_FILES} images. Only ${remainingSlots} more image${remainingSlots > 1 ? 's' : ''} could be added.`);
    }

    const filesToProcess = filesToExamine.slice(0, remainingSlots);

    for (const file of filesToProcess) {
      const validation = validateFile(file);
      if (!validation.valid) {
        hadInvalid = true;
        if (!firstError) firstError = validation.error;
        continue;
      }

      let preview = null;
      if (file.type && file.type.startsWith('image/')) {
        try {
          preview = URL.createObjectURL(file);
        } catch {
          preview = null;
        }
      }

      validNewMetas.push({
        id: 'f-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        fileInstance: file,
        name: file.name,
        size: file.size,
        formattedSize: formatBytes(file.size),
        type: getFriendlyFileType(file),
        rawType: file.type || 'application/octet-stream',
        extension: getFileExtension(file.name).toUpperCase(),
        previewUrl: preview
      });
    }

    if (hadInvalid && validNewMetas.length === 0) {
      setErrorMessage(firstError || 'Selected files are not valid.');
      return;
    }

    if (validNewMetas.length > 0) {
      const combined = [...filesList, ...validNewMetas].slice(0, MAX_BATCH_FILES);
      if (onFilesSelect) {
        onFilesSelect(combined);
      } else if (onFileSelect) {
        onFileSelect(combined[0]);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processIncomingFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processIncomingFiles(e.target.files);
    }
    // Reset file input so user can pick the same file again if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChooseFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useImperativeHandle(ref, () => ({
    openFilePicker: handleChooseFileClick
  }));

  const removeSingleFile = (indexToRemove) => {
    const fileToRemove = filesList[indexToRemove];
    if (fileToRemove?.previewUrl) {
      try {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      } catch {}
    }

    const updated = filesList.filter((_, idx) => idx !== indexToRemove);
    if (onFilesSelect) {
      onFilesSelect(updated);
    } else if (onFileRemove) {
      onFileRemove(indexToRemove);
    }
    setErrorMessage(null);
    setInfoNotice(null);
  };

  const handleClearAllClick = () => {
    filesList.forEach((f) => {
      if (f.previewUrl) {
        try {
          URL.revokeObjectURL(f.previewUrl);
        } catch {}
      }
    });

    if (onClearAll) {
      onClearAll();
    } else if (onFilesSelect) {
      onFilesSelect([]);
    } else if (onFileRemove) {
      onFileRemove();
    }
    setErrorMessage(null);
    setInfoNotice(null);
  };

  const getFileIcon = (ext) => {
    const lower = (ext || '').toLowerCase();
    if (['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv', '3gp'].includes(lower)) {
      return <FiVideo className="text-info" size={24} />;
    }
    if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(lower)) {
      return <FiMusic className="text-success" size={24} />;
    }
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif', 'bmp', 'ico'].includes(lower)) {
      return <FiImage className="text-primary" size={24} />;
    }
    if (['zip', 'rar', 'tar', '7z'].includes(lower)) {
      return <FiArchive className="text-warning" size={24} />;
    }
    if (['pdf', 'docx', 'doc', 'txt'].includes(lower)) {
      return <FiFileText className="text-danger" size={24} />;
    }
    return <FiFile className="text-primary" size={24} />;
  };

  const count = filesList.length;
  const isMaxReached = count >= MAX_BATCH_FILES;

  return (
    <div className="card custom-card file-uploader-card p-4 shadow-sm mb-4">
      {/* Header bar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="card-title h5 mb-0 fw-bold d-flex align-items-center gap-2">
          <FiUploadCloud className="text-primary" />
          <span>Upload Images</span>
        </h3>
        <div className="d-flex align-items-center gap-2">
          <span className={`badge ${count > 0 ? 'bg-primary-subtle text-primary border border-primary-subtle' : 'bg-light text-muted border'} fw-semibold`}>
            {count > 0 ? `${count} / ${MAX_BATCH_FILES} Images Selected` : `Max Limit: ${MAX_BATCH_FILES} Images`}
          </span>
          <span className="badge bg-light text-muted border d-none d-sm-inline">Max 100 MB</span>
        </div>
      </div>

      {/* Error or Info Alerts */}
      {errorMessage && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between py-2 px-3 mb-3 rounded-3" role="alert">
          <div className="d-flex align-items-center gap-2 small">
            <FiAlertCircle className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button type="button" className="btn-close btn-close-white small p-1" onClick={() => setErrorMessage(null)} aria-label="Close"></button>
        </div>
      )}

      {infoNotice && (
        <div className="alert alert-info d-flex align-items-center justify-content-between py-2 px-3 mb-3 rounded-3" role="alert">
          <div className="d-flex align-items-center gap-2 small">
            <FiCheck className="flex-shrink-0 text-primary" />
            <span>{infoNotice}</span>
          </div>
          <button type="button" className="btn-close small p-1" onClick={() => setInfoNotice(null)} aria-label="Close"></button>
        </div>
      )}

      {/* Hidden native input with MULTIPLE enabled */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="d-none"
        multiple
        aria-label="Upload Files"
        accept="image/*,video/*,audio/*,.pdf,.zip"
      />

      {count === 0 ? (
        /* Empty State: Drag and Drop Zone */
        <div
          className={`dropzone-area p-4 p-md-5 text-center rounded-4 ${
            isDragOver ? 'dropzone-active' : ''
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleChooseFileClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleChooseFileClick()}
        >
          <div className="dropzone-icon-box mb-2.5 mx-auto">
            <FiUploadCloud size={28} className="dropzone-icon text-primary" />
          </div>

          <h5 className="fw-bold mb-1 fs-5">Drag &amp; drop images here</h5>
          <p className="text-muted small mb-3">
            Select <strong>up to 10 images</strong> at once for instant fast conversion
          </p>

          <button
            type="button"
            className="btn btn-primary-custom px-4 py-2.5 mb-3 shadow-sm d-inline-flex align-items-center gap-2 fw-semibold"
            onClick={(e) => {
              e.stopPropagation();
              handleChooseFileClick();
            }}
          >
            <FiUploadCloud size={18} />
            <span>Choose Images (Max 10)</span>
          </button>

          <div className="dropzone-footer pt-3 border-top border-light">
            <div className="d-flex flex-wrap justify-content-center align-items-center gap-1.5 mb-2">
              <span className="text-muted smaller fw-semibold me-1">Fast Formats:</span>
              {['JPG', 'PNG', 'WEBP', 'GIF', 'AVIF', 'BMP', 'ICO', 'PDF'].map((ext) => (
                <span key={ext} className="badge bg-white text-secondary border px-2 py-0.5 rounded shadow-xs" style={{ fontSize: '0.72rem' }}>
                  .{ext.toLowerCase()}
                </span>
              ))}
            </div>
            <span className="text-secondary smaller text-muted d-block">
              ⚡ Ultra-fast server processing • Multi-image batch conversion up to <strong>10 images</strong> with 1-click ZIP download
            </span>
          </div>
        </div>
      ) : (
        /* Selected Files List Area */
        <div className="selected-files-container rounded-4 border bg-light-subtle p-3 p-md-3">
          {/* Controls Bar */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-2 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold text-dark small">
                {count} image{count > 1 ? 's' : ''} queued
              </span>
              <span className="text-muted smaller">
                (Total: {formatBytes(filesList.reduce((acc, f) => acc + (f.size || 0), 0))})
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              {!isMaxReached && (
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill fw-semibold shadow-xs"
                  onClick={handleChooseFileClick}
                  title="Add more images up to 10"
                >
                  <FiPlus size={14} />
                  <span>Add More</span>
                </button>
              )}

              <button
                type="button"
                className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill fw-semibold shadow-xs"
                onClick={handleClearAllClick}
                title="Remove all images"
              >
                <FiTrash2 size={13} />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Files Grid */}
          <div className="row g-2 mb-2" style={{ maxHeight: '340px', overflowY: 'auto' }}>
            {filesList.map((fileItem, idx) => (
              <div key={fileItem.id || idx} className="col-12 col-sm-6">
                <div className="selected-file-tile d-flex align-items-center justify-content-between p-2.5 bg-white rounded-3 border shadow-xs transition-all">
                  <div className="d-flex align-items-center gap-2.5 overflow-hidden flex-grow-1">
                    {/* Thumbnail or Icon */}
                    <div 
                      className="file-thumb-box rounded-2 overflow-hidden flex-shrink-0 d-flex align-items-center justify-content-center bg-light border"
                      style={{ width: '42px', height: '42px' }}
                    >
                      {fileItem.previewUrl ? (
                        <img 
                          src={fileItem.previewUrl} 
                          alt={fileItem.name} 
                          className="w-100 h-100 object-fit-cover" 
                        />
                      ) : (
                        getFileIcon(fileItem.extension)
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="overflow-hidden text-start">
                      <div className="fw-semibold text-dark text-truncate small mb-0.5" title={fileItem.name}>
                        {fileItem.name}
                      </div>
                      <div className="d-flex align-items-center gap-1.5 text-muted smaller">
                        <span className="badge bg-primary-subtle text-primary fw-bold px-1.5 py-0.5 rounded" style={{ fontSize: '0.68rem' }}>
                          {fileItem.extension}
                        </span>
                        <span>{fileItem.formattedSize}</span>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    className="btn btn-link text-danger p-1 rounded-circle flex-shrink-0 ms-1 hover-bg-light"
                    onClick={() => removeSingleFile(idx)}
                    title="Remove this image"
                    aria-label={`Remove ${fileItem.name}`}
                  >
                    <FiX size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom helper */}
          <div className="pt-2 d-flex flex-wrap justify-content-between align-items-center text-muted smaller border-top">
            <span className="d-flex align-items-center text-success gap-1">
              <FiCheck size={14} /> Ready for fast conversion &amp; compression
            </span>
            <span className="text-secondary">
              {isMaxReached ? 'Max limit (10) reached' : `Can add ${MAX_BATCH_FILES - count} more`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

export default FileUploader;
