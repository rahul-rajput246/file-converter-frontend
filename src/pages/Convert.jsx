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
import { convertFile, downloadFile, formatBytes } from '../services/fileService';
import { getStoredRecentFiles, saveRecentFile } from '../utils/historyStorage';

function Convert() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('WEBP');
  const [processingState, setProcessingState] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resultData, setResultData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [recentList, setRecentList] = useState(() => getStoredRecentFiles());
  const uploaderRef = useRef(null);

  const handleConvertTrigger = async (conversionData) => {
    if (!selectedFile?.fileInstance) {
      setErrorMessage('Please select a valid image file first.');
      setProcessingState('error');
      return;
    }

    setTargetFormat(conversionData.targetFormat);
    setErrorMessage(null);
    setProcessingState('uploading');
    setUploadProgress(40);

    const progTimer = setTimeout(() => {
      setUploadProgress(85);
      setProcessingState('processing');
    }, 300);

    try {
      const data = await convertFile(selectedFile.fileInstance, conversionData.targetFormat);
      clearTimeout(progTimer);
      setUploadProgress(100);
      setResultData(data);
      setProcessingState('completed');

      const newEntry = {
        id: 'f-' + Date.now(),
        file: data.filename,
        conversion: `${selectedFile.extension} → ${conversionData.targetFormat}`,
        size: formatBytes(data.size || selectedFile.size),
        status: 'Completed',
        downloadUrl: data.download_url,
        date: 'Just now'
      };
      const updated = saveRecentFile(newEntry);
      setRecentList(updated);
    } catch (err) {
      clearTimeout(progTimer);
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
              <ConversionSettings
                selectedFile={selectedFile}
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
              originalSize={selectedFile?.size}
              processedSize={resultData?.size}
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
