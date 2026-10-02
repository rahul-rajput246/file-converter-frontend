import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import CompressionSettings from '../components/CompressionSettings';
import FileInfo from '../components/FileInfo';
import ProcessingStatus from '../components/ProcessingStatus';
import RecentFiles from '../components/RecentFiles';
import { FiMinimize2, FiCheck, FiTrendingDown } from 'react-icons/fi';
import { compressFile, downloadFile, formatBytes } from '../services/fileService';

function Compress() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processingState, setProcessingState] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resultData, setResultData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [recentList, setRecentList] = useState([]);
  const [lastCompressSettings, setLastCompressSettings] = useState({ level: 'medium' });

  const handleCompressTrigger = async (compressData) => {
    if (!selectedFile?.fileInstance) {
      setErrorMessage('Please select a valid image file first.');
      setProcessingState('error');
      return;
    }

    setLastCompressSettings(compressData);
    setErrorMessage(null);
    setProcessingState('uploading');
    setUploadProgress(45);

    const progTimer = setTimeout(() => {
      setUploadProgress(90);
      setProcessingState('processing');
    }, 300);

    try {
      const data = await compressFile(selectedFile.fileInstance, compressData);
      clearTimeout(progTimer);
      setUploadProgress(100);
      setResultData(data);
      setProcessingState('completed');

      const conversionLabel = compressData.targetSizeKb
        ? `Target: ${compressData.targetSizeKb} KB`
        : `Compress (${compressData.level || 'medium'})`;

      const newEntry = {
        id: 'f-' + Date.now(),
        file: data.filename,
        conversion: conversionLabel,
        size: formatBytes(data.processed_size),
        status: 'Completed',
        downloadUrl: data.download_url,
        date: 'Just now'
      };
      setRecentList((prev) => [newEntry, ...prev]);
    } catch (err) {
      clearTimeout(progTimer);
      setErrorMessage(err.message || 'Compression failed on server.');
      setProcessingState('error');
    }
  };

  return (
    <div className="compress-page py-4">
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-5">
          <div className="badge-pill mb-2">
            <FiMinimize2 className="text-success me-1" />
            <span>Smart Compression Algorithm</span>
          </div>
          <h1 className="fw-bold mb-3">Compress Files &amp; Shrink Storage</h1>
          <p className="text-muted lead mx-auto" style={{ maxWidth: '650px' }}>
            Reduce file sizes by up to 80% without noticeable degradation in visual fidelity or textual formatting.
          </p>
        </div>

        {/* Workspace Layout */}
        <div className="row g-4 justify-content-center mb-5">
          <div className="col-12 col-lg-7">
            <FileUploader
              selectedFile={selectedFile}
              onFileSelect={(file) => {
                setSelectedFile(file);
                setProcessingState('idle');
                setResultData(null);
                setErrorMessage(null);
              }}
              onFileRemove={() => {
                setSelectedFile(null);
                setProcessingState('idle');
                setResultData(null);
                setErrorMessage(null);
              }}
            />

            {selectedFile && (
              <CompressionSettings
                key={`${selectedFile.name}_${selectedFile.size}`}
                selectedFile={selectedFile}
                onCompressTrigger={handleCompressTrigger}
              />
            )}

            <ProcessingStatus
              status={processingState}
              progress={uploadProgress}
              errorMessage={errorMessage}
              outputFileName={resultData?.filename}
              downloadUrl={resultData?.download_url}
              originalSize={resultData?.original_size}
              processedSize={resultData?.processed_size}
              onDownload={() => downloadFile(resultData?.download_url || resultData?.filename)}
              onReset={() => {
                setProcessingState('idle');
                setResultData(null);
                setErrorMessage(null);
              }}
              onRetry={() => handleCompressTrigger(lastCompressSettings)}
            />
          </div>

          <div className="col-12 col-lg-5">
            <FileInfo
              selectedFile={selectedFile}
              isCompressMode={true}
              outputSize={resultData?.processed_size}
            />

            {/* Benefits & Tips Card */}
            <div className="card custom-card p-4 shadow-sm text-start">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FiTrendingDown className="text-success" />
                <span>Why Compress with FileFlow?</span>
              </h5>
              <ul className="list-unstyled d-flex flex-column gap-3 mb-0 small text-muted">
                <li className="d-flex align-items-start gap-2">
                  <FiCheck className="text-success flex-shrink-0 mt-1" />
                  <span><strong>Lightning-fast web uploads:</strong> Smaller assets load faster on client websites and apps.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <FiCheck className="text-success flex-shrink-0 mt-1" />
                  <span><strong>Email attachments ready:</strong> Overcome rigid 25 MB email payload barriers easily.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <FiCheck className="text-success flex-shrink-0 mt-1" />
                  <span><strong>Lossless &amp; smart lossy:</strong> Advanced quantization preserves metadata and crisp edges.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="mt-5">
          <RecentFiles recentList={recentList} />
        </div>
      </div>
    </div>
  );
}

export default Compress;
