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
import { convertFile, compressFile, downloadFile, formatBytes } from '../services/fileService';

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('convert'); // 'convert' | 'compress'
  const [targetFormat, setTargetFormat] = useState('WEBP');
  const [processingState, setProcessingState] = useState('idle'); // 'idle' | 'uploading' | 'processing' | 'completed' | 'error'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resultData, setResultData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [recentList, setRecentList] = useState([
    {
      id: 'f-1',
      file: 'product-showcase.png',
      conversion: 'PNG → JPG',
      size: '2.4 MB',
      status: 'Completed',
      date: '10 mins ago'
    },
    {
      id: 'f-2',
      file: 'camera-raw-photo.jpg',
      conversion: 'JPG → WEBP',
      size: '4.1 MB',
      status: 'Completed',
      date: '25 mins ago'
    }
  ]);

  const workspaceRef = useRef(null);
  const uploaderRef = useRef(null);

  const scrollToWorkspace = () => {
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFileSelect = (fileData) => {
    setSelectedFile(fileData);
    setProcessingState('idle');
    setResultData(null);
    setErrorMessage(null);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setProcessingState('idle');
    setResultData(null);
    setErrorMessage(null);
  };

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

      // Add to recent files history
      const newEntry = {
        id: 'f-' + Date.now(),
        file: data.filename,
        conversion: `${selectedFile.extension} → ${conversionData.targetFormat}`,
        size: formatBytes(data.size || selectedFile.size),
        status: 'Completed',
        downloadUrl: data.download_url,
        date: 'Just now'
      };
      setRecentList((prev) => [newEntry, ...prev]);
    } catch (err) {
      clearTimeout(progTimer);
      setErrorMessage(err.message || 'Failed to convert file on server.');
      setProcessingState('error');
    }
  };

  const handleCompressTrigger = async (compressData) => {
    if (!selectedFile?.fileInstance) {
      setErrorMessage('Please select a valid image file first.');
      setProcessingState('error');
      return;
    }

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

      // Add to recent files history
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
      setRecentList((prev) => [newEntry, ...prev]);
    } catch (err) {
      clearTimeout(progTimer);
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
            <span className="badge-pill mb-2">Instant Tooling</span>
            <h2 className="section-title fw-bold">File Optimization Suite</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '550px' }}>
              Upload your JPG, PNG, or WEBP image to convert formats or reduce file size immediately with our Laravel API.
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
                <span className="fw-semibold">Convert Format</span>
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
                <span className="fw-semibold">Compress File</span>
              </button>
            </div>
          </div>

          {/* Core Upload & Settings Grid */}
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-lg-7">
              {/* Main File Upload Area */}
              <FileUploader
                ref={uploaderRef}
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
              />

              {/* Conversion or Compression Settings */}
              {selectedFile && activeTab === 'convert' && (
                <ConversionSettings
                  selectedFile={selectedFile}
                  onConvertTrigger={handleConvertTrigger}
                />
              )}

              {selectedFile && activeTab === 'compress' && (
                <CompressionSettings
                  selectedFile={selectedFile}
                  onCompressTrigger={handleCompressTrigger}
                />
              )}

              {!selectedFile && activeTab === 'convert' && (
                <PopularConversions
                  onSelectPreset={(target) => {
                    setTargetFormat(target);
                    uploaderRef.current?.openFilePicker();
                  }}
                />
              )}

              {!selectedFile && activeTab === 'compress' && (
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
        <RecentFiles recentList={recentList} />
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
