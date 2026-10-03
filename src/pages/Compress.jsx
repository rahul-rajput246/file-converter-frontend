import { useState, useRef } from 'react';
import FileUploader from '../components/FileUploader';
import CompressionSettings from '../components/CompressionSettings';
import FileInfo from '../components/FileInfo';
import ProcessingStatus from '../components/ProcessingStatus';
import RecentFiles from '../components/RecentFiles';
import CompressionWorkflow from '../components/CompressionWorkflow';
import CompressionPresets from '../components/CompressionPresets';
import { FiMinimize2 } from 'react-icons/fi';
import { 
  compressFile, 
  compressFilesParallel, 
  downloadFile, 
  formatBytes,
  MAX_BATCH_FILES 
} from '../services/fileService';
import { getStoredRecentFiles, saveRecentFile } from '../utils/historyStorage';

function Compress() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processingState, setProcessingState] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resultData, setResultData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [recentList, setRecentList] = useState(() => getStoredRecentFiles());
  const [lastCompressSettings, setLastCompressSettings] = useState({ level: 'medium' });
  const uploaderRef = useRef(null);

  const selectedFile = selectedFiles[0] || null;

  const handleFilesSelect = (files) => {
    const capped = Array.isArray(files) ? files.slice(0, MAX_BATCH_FILES) : [];
    setSelectedFiles(capped);
    setProcessingState('idle');
    setResultData(null);
    setErrorMessage(null);
  };

  const handleFileRemove = (index) => {
    if (typeof index === 'number') {
      setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
    } else {
      setSelectedFiles([]);
    }
    setProcessingState('idle');
    setResultData(null);
    setErrorMessage(null);
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setProcessingState('idle');
    setResultData(null);
    setErrorMessage(null);
  };

  const handleCompressTrigger = async (compressData) => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select at least one image file first.');
      setProcessingState('error');
      return;
    }

    setLastCompressSettings(compressData);
    setErrorMessage(null);
    setProcessingState('processing');
    setUploadProgress(20);

    try {
      let data;
      const fileInstances = selectedFiles.map((f) => f.fileInstance);

      if (fileInstances.length > 1) {
        data = await compressFilesParallel(selectedFiles, compressData, (prog) => {
          setUploadProgress(Math.max(20, prog.percent));
        });
      } else {
        setUploadProgress(50);
        data = await compressFile(fileInstances[0], compressData);
      }

      setUploadProgress(100);
      setResultData(data);
      setProcessingState('completed');

      // Add to recent files history
      if (data.files && Array.isArray(data.files)) {
        let updated = recentList;
        data.files.forEach((item) => {
          if (item.success && item.filename) {
            const entry = {
              id: 'f-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
              file: item.original_name,
              conversion: compressData.mode === 'target'
                ? `Target: ${compressData.targetSizeKb} KB`
                : `Compress (${(compressData.level || 'medium').toUpperCase()})`,
              size: formatBytes(item.processed_size || item.size),
              status: 'Completed',
              downloadUrl: item.download_url,
              date: 'Just now'
            };
            updated = saveRecentFile(entry);
          }
        });
        setRecentList(updated);
      } else if (data.filename) {
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
      }
    } catch (err) {
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
              selectedFiles={selectedFiles}
              onFileSelect={handleFilesSelect}
              onFileRemove={handleFileRemove}
              onClearAll={handleClearAll}
              maxFiles={MAX_BATCH_FILES}
            />

            {selectedFiles.length > 0 ? (
              <CompressionSettings
                key={`${selectedFiles.length}_${selectedFiles[0]?.name}`}
                selectedFile={selectedFile}
                selectedFiles={selectedFiles}
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
              originalSize={resultData?.original_size || selectedFile?.size}
              processedSize={resultData?.processed_size}
              batchResult={resultData?.files ? resultData : null}
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
              selectedFiles={selectedFiles}
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
