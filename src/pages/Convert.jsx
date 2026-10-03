import { useState, useRef } from 'react';
import FileUploader from '../components/FileUploader';
import ConversionSettings from '../components/ConversionSettings';
import FileInfo from '../components/FileInfo';
import ProcessingStatus from '../components/ProcessingStatus';
import SupportedFormats from '../components/SupportedFormats';
import RecentFiles from '../components/RecentFiles';
import ConversionWorkflow from '../components/ConversionWorkflow';
import PopularConversions from '../components/PopularConversions';
import { FiRefreshCw } from 'react-icons/fi';
import { 
  convertFile, 
  convertFilesParallel, 
  downloadFile, 
  formatBytes,
  MAX_BATCH_FILES 
} from '../services/fileService';
import { getStoredRecentFiles, saveRecentFile } from '../utils/historyStorage';

function Convert() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [targetFormat, setTargetFormat] = useState('WEBP');
  const [processingState, setProcessingState] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resultData, setResultData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [recentList, setRecentList] = useState(() => getStoredRecentFiles());
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

  const handleConvertTrigger = async (conversionData) => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select at least one image file first.');
      setProcessingState('error');
      return;
    }

    const chosenFormat = conversionData.targetFormat || targetFormat;
    setTargetFormat(chosenFormat);
    setErrorMessage(null);
    setProcessingState('processing');
    setUploadProgress(20);

    try {
      let data;
      const fileInstances = selectedFiles.map((f) => f.fileInstance);

      if (fileInstances.length > 1) {
        data = await convertFilesParallel(selectedFiles, chosenFormat, (prog) => {
          setUploadProgress(Math.max(20, prog.percent));
        });
      } else {
        setUploadProgress(50);
        data = await convertFile(fileInstances[0], chosenFormat);
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
              conversion: `→ ${chosenFormat.toUpperCase()}`,
              size: formatBytes(item.size),
              status: 'Completed',
              downloadUrl: item.download_url,
              date: 'Just now'
            };
            updated = saveRecentFile(entry);
          }
        });
        setRecentList(updated);
      } else if (data.filename) {
        const newEntry = {
          id: 'f-' + Date.now(),
          file: data.filename,
          conversion: `${selectedFile?.extension || 'IMG'} → ${chosenFormat}`,
          size: formatBytes(data.size || selectedFile?.size),
          status: 'Completed',
          downloadUrl: data.download_url,
          date: 'Just now'
        };
        const updated = saveRecentFile(newEntry);
        setRecentList(updated);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Conversion failed on server.');
      setProcessingState('error');
    }
  };

  return (
    <div className="convert-page py-4">
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-5">
          <div className="badge-pill mb-2">
            <FiRefreshCw className="text-primary me-1" />
            <span>Format Transformation Engine</span>
          </div>
          <h1 className="fw-bold mb-3">Convert Files Instantly</h1>
          <p className="text-muted lead mx-auto" style={{ maxWidth: '650px' }}>
            Transform documents, images, and media across hundreds of format pairings with maximum precision.
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
              <ConversionSettings
                selectedFile={selectedFile}
                selectedFiles={selectedFiles}
                onConvertTrigger={handleConvertTrigger}
              />
            ) : (
              <PopularConversions
                onSelectPreset={(target) => {
                  setTargetFormat(target);
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
              processedSize={resultData?.size}
              batchResult={resultData?.files ? resultData : null}
              onDownload={() => downloadFile(resultData?.download_url || resultData?.filename)}
              onReset={() => {
                setProcessingState('idle');
                setResultData(null);
                setErrorMessage(null);
              }}
              onRetry={() => handleConvertTrigger({ targetFormat })}
            />
          </div>

          <div className="col-12 col-lg-5">
            <FileInfo
              selectedFile={selectedFile}
              selectedFiles={selectedFiles}
              targetFormat={targetFormat}
              outputSize={resultData?.size}
            />

            {/* High-Speed Conversion Pipeline Card */}
            <ConversionWorkflow />
          </div>
        </div>

        {/* Formats Grid */}
        <SupportedFormats />

        {/* History */}
        <div className="mt-5">
          <RecentFiles recentList={recentList} onClear={() => setRecentList([])} />
        </div>
      </div>
    </div>
  );
}

export default Convert;
