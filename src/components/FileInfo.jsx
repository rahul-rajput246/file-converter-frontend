import { FiFile, FiCheckSquare, FiActivity, FiShield, FiCpu, FiTrendingDown, FiSliders } from 'react-icons/fi';
import { formatBytes } from '../services/fileService';

function FileInfo({ selectedFile, targetFormat = 'WEBP', isCompressMode = false, outputSize = null }) {
  if (!selectedFile) {
    return (
      <div className="card custom-card p-4 shadow-sm mb-4 text-start">
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-light">
          <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 fs-6">
            <FiActivity className="text-primary" size={18} />
            <span>Live File Inspector</span>
          </h5>
          <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1.5 px-2.5 py-1">
            <span className="pulse-dot"></span>
            <span>Engine Ready</span>
          </span>
        </div>

        {/* Real-time System Specs Grid */}
        <div className="row g-2 mb-3">
          <div className="col-6">
            <div className="spec-tile">
              <div className="spec-tile-label">Format Engine</div>
              <div className="spec-tile-value text-truncate">Intervention v3 + FFmpeg</div>
            </div>
          </div>
          <div className="col-6">
            <div className="spec-tile">
              <div className="spec-tile-label">Color Fidelity</div>
              <div className="spec-tile-value text-truncate">24-bit sRGB + Alpha</div>
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
              <div className="spec-tile-label">Max File Size</div>
              <div className="spec-tile-value text-truncate">100 MB Free</div>
            </div>
          </div>
        </div>

        {/* Prompt Box */}
        <div className="p-3 rounded-3 bg-light-subtle border border-dashed text-center">
          <FiSliders size={20} className="text-muted mb-1.5 opacity-75" />
          <p className="mb-0 text-muted smaller">
            Select or drag a file to inspect native resolution, container headers, color profiles, and size benchmarks.
          </p>
        </div>
      </div>
    );
  }

  // Calculate size change percentage if output size is known
  let savingsPercent = null;
  if (outputSize && selectedFile?.size) {
    const diff = selectedFile.size - outputSize;
    savingsPercent = Math.round((diff / selectedFile.size) * 100);
  }

  return (
    <div className="card custom-card p-4 shadow-sm mb-4 text-start">
      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-light">
        <h4 className="card-title h6 mb-0 fw-bold d-flex align-items-center gap-2">
          <FiCheckSquare className="text-primary" size={18} />
          <span>Asset Inspector &amp; Diagnostics</span>
        </h4>
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-0.5 smaller">
          Verified Asset
        </span>
      </div>

      {/* Input File Inspection */}
      <div className="info-block mb-3 p-3 bg-light rounded-3 border">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-uppercase small fw-bold text-primary tracking-wider" style={{ fontSize: '0.72rem' }}>
            Source Asset
          </span>
          <span className="badge bg-white text-dark border px-2 py-0.5 fw-bold" style={{ fontSize: '0.7rem' }}>
            {selectedFile.extension}
          </span>
        </div>
        <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle">
          <span className="text-muted small">File Name:</span>
          <span className="fw-semibold text-dark small text-truncate ms-2" style={{ maxWidth: '210px' }} title={selectedFile.name}>
            {selectedFile.name}
          </span>
        </div>
        <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle">
          <span className="text-muted small">MIME Type:</span>
          <span className="text-dark small font-monospace" style={{ fontSize: '0.78rem' }}>
            {selectedFile.rawType || selectedFile.type}
          </span>
        </div>
        <div className="d-flex justify-content-between py-1">
          <span className="text-muted small">Native Size:</span>
          <span className="text-dark small fw-bold">{selectedFile.formattedSize}</span>
        </div>
      </div>

      {/* Output Configuration Inspection */}
      <div className="info-block p-3 bg-light rounded-3 border mb-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-uppercase small fw-bold text-success tracking-wider" style={{ fontSize: '0.72rem' }}>
            Target Specification
          </span>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-0.5 fw-bold" style={{ fontSize: '0.7rem' }}>
            {isCompressMode ? `${selectedFile.extension} (OPTIMIZED)` : targetFormat}
          </span>
        </div>
        <div className="d-flex justify-content-between py-1 border-bottom border-light-subtle">
          <span className="text-muted small">Pipeline Mode:</span>
          <span className="text-dark small fw-medium">
            {isCompressMode ? 'Adaptive Size Compression' : 'Multi-Format Transcoding'}
          </span>
        </div>
        <div className="d-flex justify-content-between py-1">
          <span className="text-muted small">Result Size:</span>
          {outputSize ? (
            <div className="d-flex align-items-center gap-1.5">
              <span className="text-dark small fw-bold">{formatBytes(outputSize)}</span>
              {savingsPercent !== null && (
                <span className={`badge ${savingsPercent >= 0 ? 'bg-success text-white' : 'bg-secondary text-white'}`} style={{ fontSize: '0.68rem' }}>
                  {savingsPercent >= 0 ? `-${savingsPercent}%` : `+${Math.abs(savingsPercent)}%`}
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted small italic">Calculated upon processing</span>
          )}
        </div>
      </div>

      {/* Security Guarantee Micro-Badge */}
      <div className="d-flex align-items-center justify-content-between text-muted smaller pt-1">
        <span className="d-inline-flex align-items-center gap-1">
          <FiShield className="text-primary" size={13} />
          <span>Sandboxed In-Memory Processing</span>
        </span>
        <span className="d-inline-flex align-items-center gap-1 text-success">
          <FiCpu size={13} />
          <span>GPU/CPU Accelerated</span>
        </span>
      </div>
    </div>
  );
}

export default FileInfo;
