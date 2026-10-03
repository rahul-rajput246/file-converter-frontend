import { FiFile, FiCheckSquare, FiActivity, FiShield, FiCpu, FiTrendingDown, FiSliders, FiLayers } from 'react-icons/fi';
import { formatBytes } from '../services/fileService';

function FileInfo({ selectedFile, selectedFiles = [], targetFormat = 'WEBP', isCompressMode = false, outputSize = null }) {
  const filesList = Array.isArray(selectedFiles) && selectedFiles.length > 0 
    ? selectedFiles 
    : (selectedFile ? [selectedFile] : []);
  const count = filesList.length;
  const primaryFile = filesList[0] || selectedFile;

  if (count === 0) {
    return (
      <div className="card custom-card p-4 shadow-sm mb-4 text-start">
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-light">
          <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 fs-6">
            <FiActivity className="text-primary" size={18} />
            <span>Live File Inspector</span>
          </h5>
          <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1.5 px-2.5 py-1">
            <span className="pulse-dot"></span>
            <span>Fast Engine Ready</span>
          </span>
        </div>

        {/* Real-time System Specs Grid */}
        <div className="row g-2 mb-3">
          <div className="col-6">
            <div className="spec-tile">
              <div className="spec-tile-label">Format Engine</div>
              <div className="spec-tile-value text-truncate">High-Speed Native GD</div>
            </div>
          </div>
          <div className="col-6">
            <div className="spec-tile">
              <div className="spec-tile-label">Batch Capacity</div>
              <div className="spec-tile-value text-truncate">Up to 10 Images</div>
            </div>
          </div>
          <div className="col-6">
            <div className="spec-tile">
              <div className="spec-tile-label">Data Privacy</div>
              <div className="spec-tile-value text-truncate">Auto-Purged (60m)</div>
            </div>
          </div>
          <div className="col-6">
            <div className="spec-tile">
              <div className="spec-tile-label">Batch Download</div>
              <div className="spec-tile-value text-truncate">1-Click ZIP Archive</div>
            </div>
          </div>
        </div>

        {/* Prompt Box */}
        <div className="p-3 rounded-3 bg-light-subtle border border-dashed text-center">
          <FiSliders size={20} className="text-muted mb-1.5 opacity-75" />
          <p className="mb-0 text-muted smaller">
            Select up to 10 images to inspect total payload, extensions, format targets, and compression benchmarks.
          </p>
        </div>
      </div>
    );
  }

  const totalInputBytes = filesList.reduce((acc, f) => acc + (f.size || 0), 0);

  // Calculate size change percentage if output size is known
  let savingsPercent = null;
  if (outputSize && totalInputBytes) {
    const diff = totalInputBytes - outputSize;
    savingsPercent = Math.round((diff / totalInputBytes) * 100);
  }

  return (
    <div className="card custom-card p-4 shadow-sm mb-4 text-start">
      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-light">
        <h4 className="card-title h6 mb-0 fw-bold d-flex align-items-center gap-2">
          {count > 1 ? <FiLayers className="text-primary" size={18} /> : <FiCheckSquare className="text-primary" size={18} />}
          <span>{count > 1 ? `Batch Inspector (${count} Images)` : 'Asset Inspector & Diagnostics'}</span>
        </h4>
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-0.5 smaller">
          {count > 1 ? `${count} Images Queued` : 'Verified Asset'}
        </span>
      </div>

      {/* Input File Inspection */}
      <div className="info-block mb-3 p-3 bg-light rounded-3 border">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-uppercase small fw-bold text-primary tracking-wider" style={{ fontSize: '0.72rem' }}>
            {count > 1 ? 'Batch Payload' : 'Source Asset'}
          </span>
          <span className="badge bg-white text-dark border px-2 py-0.5 fw-bold" style={{ fontSize: '0.7rem' }}>
            {count > 1 ? `${count} Files` : primaryFile.extension}
          </span>
        </div>

        {count > 1 ? (
          <div>
            <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle">
              <span className="text-muted small">Total Files:</span>
              <span className="fw-bold text-dark small">{count} Images (Max 10)</span>
            </div>
            <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle">
              <span className="text-muted small">Combined Size:</span>
              <span className="text-dark small fw-bold">{formatBytes(totalInputBytes)}</span>
            </div>
            <div className="d-flex justify-content-between py-1">
              <span className="text-muted small">Processing:</span>
              <span className="text-success small fw-semibold">Multi-Threaded Server</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle">
              <span className="text-muted small">File Name:</span>
              <span className="fw-semibold text-dark small text-truncate ms-2" style={{ maxWidth: '210px' }} title={primaryFile.name}>
                {primaryFile.name}
              </span>
            </div>
            <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle">
              <span className="text-muted small">MIME Type:</span>
              <span className="text-dark small font-monospace" style={{ fontSize: '0.78rem' }}>
                {primaryFile.rawType || primaryFile.type}
              </span>
            </div>
            <div className="d-flex justify-content-between py-1">
              <span className="text-muted small">Native Size:</span>
              <span className="text-dark small fw-bold">{primaryFile.formattedSize}</span>
            </div>
          </div>
        )}
      </div>

      {/* Output Configuration Inspection */}
      <div className="info-block p-3 bg-light rounded-3 border mb-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-uppercase small fw-bold text-success tracking-wider" style={{ fontSize: '0.72rem' }}>
            Target Specification
          </span>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-0.5 fw-bold" style={{ fontSize: '0.7rem' }}>
            {isCompressMode ? 'COMPRESSED' : targetFormat}
          </span>
        </div>
        <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle">
          <span className="text-muted small">Pipeline Mode:</span>
          <span className="text-dark small fw-medium">
            {count > 1 ? (isCompressMode ? 'Batch Compression' : 'Batch Transcoding') : (isCompressMode ? 'Adaptive Compression' : 'Multi-Format Transcoding')}
          </span>
        </div>
        <div className="d-flex justify-content-between py-1">
          <span className="text-muted small">Bundle Output:</span>
          <span className="text-dark small fw-semibold">
            {count > 1 ? 'ZIP Archive + Individual' : 'Direct Download'}
          </span>
        </div>
      </div>

      {/* Security Guarantee Micro-Badge */}
      <div className="d-flex align-items-center justify-content-between text-muted smaller pt-1">
        <span className="d-inline-flex align-items-center gap-1">
          <FiShield className="text-primary" size={13} />
          <span>In-Memory Safe Processing</span>
        </span>
        <span className="d-inline-flex align-items-center gap-1 text-success">
          <FiCpu size={13} />
          <span>High-Speed Native GD</span>
        </span>
      </div>
    </div>
  );
}

export default FileInfo;
