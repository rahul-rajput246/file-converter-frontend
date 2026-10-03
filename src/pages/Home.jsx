import { useState, useRef } from 'react';
import Hero from '../components/Hero';
import FileUploader from '../components/FileUploader';
import ConversionSettings from '../components/ConversionSettings';
import CompressionSettings from '../components/CompressionSettings';
import FileInfo from '../components/FileInfo';
import ProcessingStatus from '../components/ProcessingStatus';
import RecentFiles from '../components/RecentFiles';
import Features from '../components/Features';
import SupportedFormats from '../components/SupportedFormats';
import ConversionWorkflow from '../components/ConversionWorkflow';
import CompressionWorkflow from '../components/CompressionWorkflow';
import PopularConversions from '../components/PopularConversions';
import CompressionPresets from '../components/CompressionPresets';
import { FiRefreshCw, FiMinimize2 } from 'react-icons/fi';
import { 
  convertFile, 
  convertBatchFiles, 
  convertFilesParallel,
  compressFile, 
  compressBatchFiles, 
  compressFilesParallel,
  downloadFile, 
  formatBytes,
  MAX_BATCH_FILES 
} from '../services/fileService';
import { getStoredRecentFiles, saveRecentFile } from '../utils/historyStorage';

function Home() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('convert'); // 'convert' | 'compress'
  const [targetFormat, setTargetFormat] = useState('WEBP');
  const [processingState, setProcessingState] = useState('idle'); // 'idle' | 'uploading' | 'processing' | 'completed' | 'error'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resultData, setResultData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [recentList, setRecentList] = useState(() => getStoredRecentFiles());

  const workspaceRef = useRef(null);
  const uploaderRef = useRef(null);

  const selectedFile = selectedFiles[0] || null;

  const scrollToWorkspace = () => {
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      setErrorMessage(err.message || 'Failed to convert file on server.');
      setProcessingState('error');
    }
  };

  const handleCompressTrigger = async (compressData) => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select at least one image file first.');
      setProcessingState('error');
      return;
    }

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
                ? `Compress → ${compressData.targetSizeKb} KB`
                : `Compress (${(compressData.level || 'medium').toUpperCase()})`,
              size: formatBytes(item.processed_size),
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
          conversion: compressData.mode === 'target'
            ? `Compress → ${compressData.targetSizeKb} KB`
            : `Compress (${(compressData.level || 'medium').toUpperCase()})`,
          size: formatBytes(data.processed_size),
          status: 'Completed',
          downloadUrl: data.download_url,
          date: 'Just now'
        };
        const updated = saveRecentFile(newEntry);
        setRecentList(updated);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to compress file on server.');
      setProcessingState('error');
    }
  };

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <Hero onGetStartedClick={scrollToWorkspace} />

      {/* 2. Main Tool Workspace */}
      <div className="workspace-container py-4" ref={workspaceRef} id="workspace">
        <div className="container">
          <div className="text-center mb-4">
            <span className="badge-pill mb-2">⚡ Ultra-Fast Batch Processing</span>
            <h2 className="section-title fw-bold">Image Converter &amp; Compressor</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Convert and compress <strong>up to 10 images</strong> simultaneously at lightning speed with native GD acceleration and 1-click ZIP bundle downloads.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="d-flex justify-content-center mb-4">
            <div className="nav-tab-pill-box p-1 bg-light rounded-pill border d-inline-flex gap-1 shadow-sm">
              <button
                type="button"
                className={`btn btn-pill-tab rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 ${
                  activeTab === 'convert' ? 'btn-primary-custom shadow-sm' : 'btn-light text-muted'
                }`}
                onClick={() => {
                  setActiveTab('convert');
                  setProcessingState('idle');
                }}
              >
                <FiRefreshCw size={16} />
                <span className="fw-semibold">Convert Format (Up to 10)</span>
              </button>
              <button
                type="button"
                className={`btn btn-pill-tab rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 ${
                  activeTab === 'compress' ? 'btn-primary-custom shadow-sm' : 'btn-light text-muted'
                }`}
                onClick={() => {
                  setActiveTab('compress');
                  setProcessingState('idle');
                }}
              >
                <FiMinimize2 size={16} />
                <span className="fw-semibold">Compress Files (Up to 10)</span>
              </button>
            </div>
          </div>

          {/* Core Upload & Settings Grid */}
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-lg-7">
              {/* Main File Upload Area */}
              <FileUploader
                ref={uploaderRef}
                selectedFiles={selectedFiles}
                selectedFile={selectedFile}
                onFilesSelect={handleFilesSelect}
                onFileSelect={(f) => handleFilesSelect([f])}
                onFileRemove={handleFileRemove}
                onClearAll={handleClearAll}
              />

              {/* Conversion or Compression Settings */}
              {selectedFiles.length > 0 && activeTab === 'convert' && (
                <ConversionSettings
                  selectedFile={selectedFile}
                  selectedFiles={selectedFiles}
                  onConvertTrigger={handleConvertTrigger}
                />
              )}

              {selectedFiles.length > 0 && activeTab === 'compress' && (
                <CompressionSettings
                  selectedFile={selectedFile}
                  selectedFiles={selectedFiles}
                  onCompressTrigger={handleCompressTrigger}
                />
              )}

              {selectedFiles.length === 0 && activeTab === 'convert' && (
                <PopularConversions
                  onSelectPreset={(target) => {
                    setTargetFormat(target);
                    uploaderRef.current?.openFilePicker();
                  }}
                />
              )}

              {selectedFiles.length === 0 && activeTab === 'compress' && (
                <CompressionPresets
                  onSelectPreset={(_level) => {
                    uploaderRef.current?.openFilePicker();
                  }}
                />
              )}

              {/* Processing Feedback States */}
              <ProcessingStatus
                status={processingState}
                progress={uploadProgress}
                errorMessage={errorMessage}
                outputFileName={resultData?.filename}
                downloadUrl={resultData?.download_url}
                originalSize={resultData?.original_size || selectedFile?.size}
                processedSize={resultData?.processed_size || resultData?.size}
                batchResult={resultData?.files ? resultData : null}
                onDownload={() => downloadFile(resultData?.download_url || resultData?.filename)}
                onReset={() => {
                  setProcessingState('idle');
                  setResultData(null);
                  setErrorMessage(null);
                }}
                onRetry={() => {
                  if (activeTab === 'convert') {
                    handleConvertTrigger({ targetFormat });
                  } else {
                    handleCompressTrigger({ level: 'medium' });
                  }
                }}
              />
            </div>

            {/* Sidebar Column: File Meta */}
            <div className="col-12 col-lg-5">
              <FileInfo
                selectedFile={selectedFile}
                selectedFiles={selectedFiles}
                targetFormat={targetFormat}
                isCompressMode={activeTab === 'compress'}
                outputSize={resultData?.processed_size || resultData?.size}
              />

              {/* Dynamic Processing Architecture & Stepper */}
              {activeTab === 'convert' ? <ConversionWorkflow /> : <CompressionWorkflow />}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recent Files / History */}
      <div className="container my-5">
        <RecentFiles recentList={recentList} onClear={() => setRecentList([])} />
      </div>

      {/* 4. Features Section */}
      <div className="container my-5">
        <Features />
      </div>

      {/* 5. Supported Formats Section */}
      <div className="container my-5">
        <SupportedFormats />
      </div>
    </div>
  );
}

export default Home;
