import { useState, useRef } from 'react';
import { FiUploadCloud, FiFile, FiTrash2, FiAlertCircle, FiCheck, FiFileText, FiImage, FiArchive } from 'react-icons/fi';
import { formatBytes, getFileExtension, getFriendlyFileType, validateFile } from '../services/fileService';

function FileUploader({ selectedFile, onFileSelect, onFileRemove }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

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

  const processFile = (file) => {
    if (!file) return;

    setErrorMessage(null);
    const validation = validateFile(file);

    if (!validation.valid) {
      setErrorMessage(validation.error);
      return;
    }

    const fileMeta = {
      fileInstance: file,
      name: file.name,
      size: file.size,
      formattedSize: formatBytes(file.size),
      type: getFriendlyFileType(file),
      rawType: file.type || 'application/octet-stream',
      extension: getFileExtension(file.name).toUpperCase()
    };

    onFileSelect(fileMeta);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const chosenFile = e.target.files[0];
      processFile(chosenFile);
    }
  };

  const handleChooseFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileIcon = (ext) => {
    const lower = (ext || '').toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(lower)) {
      return <FiImage className="text-primary" size={32} />;
    }
    if (['zip', 'rar', 'tar', '7z'].includes(lower)) {
      return <FiArchive className="text-warning" size={32} />;
    }
    if (['pdf', 'docx', 'doc', 'txt'].includes(lower)) {
      return <FiFileText className="text-danger" size={32} />;
    }
    return <FiFile className="text-primary" size={32} />;
  };

  return (
    <div className="card custom-card file-uploader-card p-4 shadow-sm mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="card-title h5 mb-0 fw-bold d-flex align-items-center gap-2">
          <FiUploadCloud className="text-primary" />
          <span>Upload Your File</span>
        </h3>
        <span className="badge bg-light text-muted border">Max 100 MB</span>
      </div>

      {errorMessage && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-3 rounded-3" role="alert">
          <FiAlertCircle className="flex-shrink-0" />
          <div className="small">{errorMessage}</div>
        </div>
      )}

      {/* Hidden native input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="d-none"
        aria-label="Upload File"
      />

      {!selectedFile ? (
        /* Drag and Drop Zone */
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
            <FiUploadCloud size={26} className="dropzone-icon text-primary" />
          </div>

          <h5 className="fw-bold mb-1 fs-6 fs-sm-5">Drag &amp; drop your file here</h5>
          <p className="text-muted small mb-3" style={{ fontSize: '0.875rem' }}>or browse from your computer or phone</p>

          <button
            type="button"
            className="btn btn-primary-custom px-3.5 py-2 mb-3 shadow-sm d-inline-flex align-items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              handleChooseFileClick();
            }}
          >
            <FiUploadCloud size={16} />
            <span>Choose File to Upload</span>
          </button>

          <div className="dropzone-footer pt-3 border-top border-light">
            <div className="d-flex flex-wrap justify-content-center align-items-center gap-1.5 mb-2">
              <span className="text-muted smaller fw-semibold me-1">Accepted Formats:</span>
              {['JPG', 'PNG', 'WEBP', 'AVIF', 'GIF', 'BMP', 'ICO'].map((ext) => (
                <span key={ext} className="badge bg-white text-secondary border px-2 py-0.5 rounded shadow-xs" style={{ fontSize: '0.72rem' }}>
                  .{ext.toLowerCase()}
                </span>
              ))}
            </div>
            <span className="text-secondary smaller text-muted d-block">
              Maximum file size: <strong>100 MB</strong> • Real transcoding into <strong>8 Formats</strong> including PDF
            </span>
          </div>
        </div>
      ) : (
        /* Selected File Details Card */
        <div className="selected-file-card p-3 p-md-4 rounded-4 border bg-light-subtle">
          <div className="d-flex align-items-start justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3 flex-grow-1 overflow-hidden">
              <div className="file-avatar-box p-3 bg-white rounded-3 shadow-sm">
                {getFileIcon(selectedFile.extension)}
              </div>
              <div className="file-meta-box text-start overflow-hidden">
                <h6 className="file-name text-truncate mb-1 fw-bold text-dark" title={selectedFile.name}>
                  {selectedFile.name}
                </h6>
                <div className="d-flex flex-wrap align-items-center gap-2 text-muted small">
                  <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1">
                    {selectedFile.extension}
                  </span>
                  <span>{selectedFile.formattedSize}</span>
                  <span className="text-secondary">• {selectedFile.type}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-3 py-2 rounded-3"
              onClick={onFileRemove}
              title="Remove selected file"
            >
              <FiTrash2 size={16} />
              <span className="d-none d-sm-inline">Remove</span>
            </button>
          </div>

          <div className="file-status-indicator mt-3 pt-3 border-top d-flex align-items-center justify-content-between text-muted small">
            <span className="d-flex align-items-center text-success gap-1">
              <FiCheck /> Ready for conversion or compression
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm text-decoration-none text-muted p-0"
              onClick={handleChooseFileClick}
            >
              Replace file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
