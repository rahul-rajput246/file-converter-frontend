import { FiFile, FiCheckSquare } from 'react-icons/fi';
import { formatBytes } from '../services/fileService';

function FileInfo({ selectedFile, targetFormat = 'WEBP', isCompressMode = false, outputSize = null }) {
  if (!selectedFile) {
    return (
      <div className="card custom-card p-4 shadow-sm mb-4 text-center text-muted">
        <FiFile size={36} className="mx-auto mb-2 opacity-50" />
        <p className="mb-0 small">Select or upload a file to view file inspection details.</p>
      </div>
    );
  }

  return (
    <div className="card custom-card p-4 shadow-sm mb-4">
      <h4 className="card-title h5 mb-3 fw-bold d-flex align-items-center gap-2">
        <FiCheckSquare className="text-primary" />
        <span>File Information</span>
      </h4>

      <div className="info-block mb-3 p-3 bg-light rounded-3 border">
        <div className="text-uppercase small fw-bold text-primary mb-2 tracking-wider">
          Original File
        </div>
        <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle">
          <span className="text-muted small">Name:</span>
          <span className="fw-semibold text-dark small text-truncate ms-2 max-w-200" title={selectedFile.name}>
            {selectedFile.name}
          </span>
        </div>
        <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle">
          <span className="text-muted small">Type:</span>
          <span className="text-dark small">{selectedFile.type}</span>
        </div>
        <div className="d-flex justify-content-between py-1">
          <span className="text-muted small">Size:</span>
          <span className="text-dark small fw-medium">{selectedFile.formattedSize}</span>
        </div>
      </div>

      <div className="info-block p-3 bg-light rounded-3 border">
        <div className="text-uppercase small fw-bold text-success mb-2 tracking-wider">
          Output File
        </div>
        <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle">
          <span className="text-muted small">Target Format:</span>
          <span className="badge bg-success-subtle text-success small">
            {isCompressMode ? selectedFile.extension : targetFormat}
          </span>
        </div>
        <div className="d-flex justify-content-between py-1">
          <span className="text-muted small">Estimated Size:</span>
          <span className="text-muted small italic">
            {outputSize ? formatBytes(outputSize) : '--'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FileInfo;
