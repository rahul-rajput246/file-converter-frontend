import { useState, useRef } from 'react';
import FileUploader from '../components/FileUploader';
import CompressionSettings from '../components/CompressionSettings';
import FileInfo from '../components/FileInfo';
import ProcessingStatus from '../components/ProcessingStatus';
import RecentFiles from '../components/RecentFiles';
import CompressionWorkflow from '../components/CompressionWorkflow';
import CompressionPresets from '../components/CompressionPresets';
import { FiMinimize2 } from 'react-icons/fi';
import { compressFile, downloadFile, formatBytes } from '../services/fileService';
import { getStoredRecentFiles, saveRecentFile } from '../utils/historyStorage';

function Compress() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processingState, setProcessingState] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resultData, setResultData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [recentList, setRecentList] = useState(() => getStoredRecentFiles());
  const [lastCompressSettings, setLastCompressSettings] = useState({ level: 'medium' });
  const uploaderRef = useRef(null);

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
      const updated = saveRecentFile(newEntry);
      setRecentList(updated);
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
              ref={uploaderRef}
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

            {selectedFile ? (
              <CompressionSettings
                key={`${selectedFile.name}_${selectedFile.size}`}
                selectedFile={selectedFile}
                onCompressTrigger={handleCompressTrigger}
              />
            ) : (
              <CompressionPresets
                onSelectPreset={(level) => {
                  setLastCompressSettings({ level });
                  uploaderRef.current?.openFilePicker();
                }}
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

            {/* Compression Engine Architecture Card */}
            <CompressionWorkflow />
          </div>
        </div>

        {/* History */}
        <div className="mt-5">
          <RecentFiles recentList={recentList} onClear={() => setRecentList([])} />
        </div>
      </div>
    </div>
  );
}

export default Compress;
