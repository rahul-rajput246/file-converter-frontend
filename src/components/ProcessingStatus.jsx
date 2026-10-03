import { FiCheckCircle, FiAlertTriangle, FiDownload, FiRotateCcw, FiLoader, FiTrendingDown, FiArchive, FiCheck, FiX } from 'react-icons/fi';
import { formatBytes, downloadFile } from '../services/fileService';

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
 * - batchResult: object ({ total, converted_count, processed_count, target_format, files, zip_filename, zip_download_url })
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
  batchResult = null,
  onDownload,
  onRetry,
  onReset
}) {
  if (status === 'idle') return null;

  const isBatch = Boolean(batchResult && Array.isArray(batchResult.files) && batchResult.files.length > 0);

  const handleSingleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (downloadUrl) {
      downloadFile(downloadUrl);
    }
  };

  const handleZipDownload = () => {
    if (batchResult?.zip_download_url) {
      downloadFile(batchResult.zip_download_url);
    } else if (batchResult?.zip_filename) {
      downloadFile(batchResult.zip_filename);
    }
  };

  const hasZip = Boolean(batchResult?.zip_download_url || batchResult?.zip_filename);
  const successFiles = batchResult?.files?.filter(f => f.success && (f.download_url || f.filename)) || [];
  const hasMultipleSuccess = successFiles.length > 1;

  const handleDownloadAll = () => {
    if (hasZip) {
      handleZipDownload();
    } else if (successFiles.length > 0) {
      successFiles.forEach((f, index) => {
        setTimeout(() => {
          downloadFile(f.download_url || f.filename);
        }, index * 250);
      });
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
          <h5 className="fw-bold mb-2 fs-5">Uploading to fast server pipeline...</h5>
          <p className="text-muted small mb-3">Transmitting image payload to multi-threaded server...</p>

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
          <h5 className="fw-bold mb-2 fs-5">Processing files on server...</h5>
          <p className="text-muted small mb-3 mx-auto" style={{ maxWidth: '480px' }}>
            High-speed document &amp; media engine is converting and optimizing your files.
          </p>

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

      {/* Completed State */}
      {status === 'completed' && (
        <div className="text-center py-3 py-sm-4">
          <div className="success-icon-box mx-auto mb-2.5">
            <FiCheckCircle size={30} />
          </div>

          {isBatch ? (
            /* Multi-file batch completed view */
            <div>
              <h4 className="fw-bold text-success mb-1 fs-5">
                Batch Completed! ({batchResult.converted_count || batchResult.processed_count || batchResult.files.length} of {batchResult.total} Files Ready)
              </h4>
              <p className="text-muted small mb-3">
                All selected files processed at ultra-fast speed. Download individually or batch download all with one click.
              </p>

              {/* Prominent Download All Button */}
              {hasMultipleSuccess && (
                <div className="mb-4">
                  <button
                    type="button"
                    className="btn btn-success px-4 py-2.5 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm fw-bold fs-6"
                    style={{ background: 'var(--success-gradient)', border: 'none' }}
                    onClick={handleDownloadAll}
                  >
                    <FiArchive size={20} />
                    <span>{hasZip ? 'Download All Files as ZIP' : 'Download All Files'}</span>
                  </button>
                  <div className="text-muted smaller mt-1">
                    {hasZip 
                      ? 'One-click download of all converted files in a .zip archive' 
                      : 'Download all processed files to your device'}
                  </div>
                </div>
              )}

              {/* Individual Files Result List */}
              <div className="text-start mb-3">
                <div className="fw-bold small text-muted text-uppercase mb-2">
                  Processed Files:
                </div>
                <div className="d-flex flex-column gap-2" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {batchResult.files.map((fileItem, idx) => {
                    const isSuccess = fileItem.success;
                    const percentSaved = (fileItem.original_size && fileItem.size && fileItem.original_size > fileItem.size)
                      ? Math.round((1 - fileItem.size / fileItem.original_size) * 100)
                      : null;

                    return (
                      <div 
                        key={fileItem.id || idx} 
                        className="d-flex flex-wrap align-items-center justify-content-between p-2.5 bg-light rounded-3 border"
                      >
                        <div className="d-flex align-items-center gap-2 overflow-hidden flex-grow-1 me-2">
                          <span className={`badge rounded-circle p-1 ${isSuccess ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                            {isSuccess ? <FiCheck size={12} /> : <FiX size={12} />}
                          </span>
                          <div className="overflow-hidden text-truncate">
                            <span className="fw-semibold text-dark small text-truncate d-block" title={fileItem.original_name}>
                              {fileItem.original_name}
                            </span>
                            <div className="d-flex align-items-center gap-2 smaller text-muted">
                              {fileItem.original_size && (
                                <span className="text-decoration-line-through">
                                  {formatBytes(fileItem.original_size)}
                                </span>
                              )}
                              {fileItem.size > 0 && (
                                <span className="fw-bold text-dark">
                                  → {formatBytes(fileItem.size)}
                                </span>
                              )}
                              {percentSaved > 0 && (
                                <span className="badge bg-success-subtle text-success py-0 px-1 rounded">
                                  -{percentSaved}%
                                </span>
                              )}
                              {fileItem.format && (
                                <span className="badge bg-secondary-subtle text-secondary py-0 px-1 rounded text-uppercase">
                                  {fileItem.format}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Individual Download Action */}
                        {isSuccess && fileItem.download_url && (
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill fw-semibold shadow-xs flex-shrink-0"
                            onClick={() => downloadFile(fileItem.download_url)}
                            title={`Download ${fileItem.original_name}`}
                          >
                            <FiDownload size={13} />
                            <span>Download</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reset button */}
              {onReset && (
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 py-2 fw-semibold mt-2"
                  onClick={onReset}
                >
                  Convert More Images
                </button>
              )}
            </div>
          ) : (
            /* Single file completed view */
            <div>
              <h4 className="fw-bold text-success mb-1.5 fs-5">File Ready for Download!</h4>
              <p className="text-muted small mb-2">
                Your file was successfully processed and optimized at ultra-fast speed.
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
                  {originalSize && originalSize > processedSize && (
                    <span className="badge bg-success text-white smaller px-2 py-0.5 rounded-pill">
                      <FiTrendingDown className="me-1" />
                      {Math.round((1 - processedSize / originalSize) * 100)}% smaller
                    </span>
                  )}
                </div>
              )}

              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2.5 mt-2">
                <button
                  type="button"
                  className="btn btn-success px-4 py-2.5 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm fw-bold"
                  style={{ background: 'var(--success-gradient)', border: 'none' }}
                  onClick={handleSingleDownload}
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
            {errorMessage || 'We encountered an error processing your files. Please check file format limits and try again.'}
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
