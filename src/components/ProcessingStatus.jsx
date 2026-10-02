import { FiCheckCircle, FiAlertTriangle, FiDownload, FiRotateCcw, FiLoader, FiTrendingDown } from 'react-icons/fi';
import { formatBytes } from '../services/fileService';

/**
 * ProcessingStatus Component
 * Props:
 * - status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error'
 * - progress: number (0 - 100)
 * - errorMessage: string
 * - outputFileName: string
 * - downloadUrl: string
 * - originalSize: number
 * - processedSize: number
 * - onDownload: function
 * - onRetry: function
 * - onReset: function
 */
function ProcessingStatus({
  status = 'idle',
  progress = 65,
  errorMessage = null,
  outputFileName = 'fileflow_output',
  downloadUrl = null,
  originalSize = null,
  processedSize = null,
  onDownload,
  onRetry,
  onReset
}) {
  if (status === 'idle') return null;

  const percentSaved = (originalSize && processedSize && originalSize > processedSize)
    ? Math.round((1 - processedSize / originalSize) * 100)
    : null;

  const handleDownloadClick = () => {
    if (onDownload) {
      onDownload();
    } else if (downloadUrl) {
      window.location.href = downloadUrl;
    }
  };

  return (
    <div className="card custom-card p-4 shadow-sm mb-4">
      {/* Uploading State */}
      {status === 'uploading' && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="fw-bold mb-2 fs-5">Uploading file to server...</h5>
          <p className="text-muted small mb-3">Transmitting file to Laravel processing pipeline...</p>

          <div className="progress progress-shimmer mb-2 rounded-pill mx-auto" style={{ height: '12px', maxWidth: '420px' }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <span className="small text-muted fw-bold">{progress}% completed</span>
        </div>
      )}

      {/* Processing State */}
      {status === 'processing' && (
        <div className="text-center py-4">
          <div className="mx-auto mb-3 p-3 bg-primary-subtle text-primary rounded-circle d-inline-flex">
            <FiLoader className="spin-icon" size={40} />
          </div>
          <h5 className="fw-bold mb-2 fs-5">Processing your file...</h5>
          <p className="text-muted small mb-0 mx-auto" style={{ maxWidth: '450px' }}>
            Please wait while the image transcoding &amp; compression engine executes your request.
          </p>
        </div>
      )}

      {/* Completed State */}
      {status === 'completed' && (
        <div className="text-center py-3 py-sm-4">
          <div className="success-icon-box mx-auto mb-2.5">
            <FiCheckCircle size={30} />
          </div>
          <h4 className="fw-bold text-success mb-1.5 fs-5">File Ready for Download!</h4>
          <p className="text-muted small mb-2">
            Your file was successfully processed and optimized with high precision.
          </p>
          {outputFileName && (
            <div className="smaller text-muted mb-3 font-monospace bg-light p-1.5 px-3 rounded-3 d-inline-block border">
              {outputFileName}
            </div>
          )}

          {processedSize && (
            <div className="d-inline-flex flex-wrap align-items-center justify-content-center gap-2 bg-light p-2 px-3 rounded-3 border mb-3 shadow-xs">
              {originalSize && (
                <span className="smaller text-muted text-decoration-line-through">
                  Original: {formatBytes(originalSize)}
                </span>
              )}
              <span className="small fw-bold text-dark">
                Optimized: {formatBytes(processedSize)}
              </span>
              {percentSaved > 0 && (
                <span className="badge bg-success text-white smaller px-2 py-0.5 rounded-pill">
                  <FiTrendingDown className="me-1" />
                  {percentSaved}% smaller
                </span>
              )}
            </div>
          )}

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-2.5 mt-2">
            <button
              type="button"
              className="btn btn-success px-4 py-2.5 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm fw-bold"
              style={{ background: 'var(--success-gradient)', border: 'none' }}
              onClick={handleDownloadClick}
            >
              <FiDownload size={18} />
              <span>Download Processed File</span>
            </button>

            {onReset && (
              <button
                type="button"
                className="btn btn-outline-secondary px-3.5 py-2.5 fw-semibold"
                onClick={onReset}
              >
                Process Another File
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="text-center py-4">
          <div className="mx-auto mb-3 bg-danger-subtle text-danger p-3 rounded-circle d-inline-flex">
            <FiAlertTriangle size={42} />
          </div>
          <h4 className="fw-bold text-danger mb-2">Something went wrong.</h4>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '500px' }}>
            {errorMessage || 'We encountered an error processing your file. Please check format limits and try again.'}
          </p>

          <button
            type="button"
            className="btn btn-outline-danger btn-lg px-4 py-2.5 d-inline-flex align-items-center gap-2"
            onClick={onRetry || onReset}
          >
            <FiRotateCcw size={18} />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProcessingStatus;
