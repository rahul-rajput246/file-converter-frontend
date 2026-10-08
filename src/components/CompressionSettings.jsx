import { useState, useEffect } from 'react';
import { FiMinimize2, FiTarget, FiSliders, FiCheck, FiArrowRight, FiShield, FiAlertTriangle } from 'react-icons/fi';
import { formatBytes } from '../services/fileService';

const getDefaultTargetSize = (bytes) => {
  const origKb = Math.max(1, Math.round((bytes || 0) / 1024));
  const half = Math.round(origKb * 0.5);
  return Math.max(1, Math.min(half, Math.max(1, origKb - 1)));
};

function CompressionSettings({ selectedFile, selectedFiles = [], onCompressTrigger }) {
  const filesList = Array.isArray(selectedFiles) && selectedFiles.length > 0 
    ? selectedFiles 
    : (selectedFile ? [selectedFile] : []);
  const count = filesList.length;
  const primaryFile = filesList[0] || selectedFile;

  const [compressMode, setCompressMode] = useState('quality'); // 'quality' (default) | 'target'
  const [targetSize, setTargetSize] = useState(() => getDefaultTargetSize(primaryFile?.size));
  const [unit, setUnit] = useState('KB');
  const [qualityLevel, setQualityLevel] = useState('medium');

  const origBytes = primaryFile?.size || 0;
  const origKb = Math.max(1, Math.round(origBytes / 1024));

  // Sync target size whenever file changes
  useEffect(() => {
    if (origBytes > 0) {
      setTargetSize(getDefaultTargetSize(origBytes));
      setUnit('KB');
    }
  }, [origBytes, primaryFile?.name]);

  const targetBytes = unit === 'MB' ? targetSize * 1024 * 1024 : targetSize * 1024;
  const targetKb = unit === 'MB' ? targetSize * 1024 : targetSize;
  const isTargetLargerThanOrig = origBytes > 0 && targetBytes >= origBytes;

  const estimatedSavingsPercent = (origBytes > 0 && origBytes > targetBytes)
    ? Math.round((1 - targetBytes / origBytes) * 100)
    : null;

  // Dynamic preset sizes strictly proportional to the uploaded file
  const presetSizes = [
    {
      label: '75% Size',
      sub: '-25% reduction',
      value: Math.max(1, Math.round(origKb * 0.75)),
      unit: 'KB',
      hint: 'Ultra crisp & sharp'
    },
    {
      label: '50% Size',
      sub: '-50% reduction',
      value: Math.max(1, Math.round(origKb * 0.5)),
      unit: 'KB',
      hint: 'Optimal balance'
    },
    {
      label: '25% Size',
      sub: '-75% reduction',
      value: Math.max(1, Math.round(origKb * 0.25)),
      unit: 'KB',
      hint: 'High storage savings'
    },
    {
      label: '10% Size',
      sub: '-90% reduction',
      value: Math.max(1, Math.round(origKb * 0.1)),
      unit: 'KB',
      hint: 'Maximum compression'
    },
  ];

  const handleCompressClick = () => {
    if (!onCompressTrigger) return;

    if (compressMode === 'target') {
      let parsed = parseFloat(targetSize);
      if (isNaN(parsed) || parsed <= 0) {
        parsed = getDefaultTargetSize(origBytes);
      }
      let finalKb = unit === 'MB' ? parsed * 1024 : parsed;

      // Strict guarantee: target size MUST be less than original file size
      if (origKb > 1 && finalKb >= origKb) {
        finalKb = Math.max(1, Math.round(origKb * 0.85));
      }

      onCompressTrigger({
        mode: 'target',
        targetSizeKb: Math.max(1, Math.round(finalKb)),
        level: 'medium'
      });
    } else {
      onCompressTrigger({
        mode: 'quality',
        level: qualityLevel
      });
    }
  };

  return (
    <div className="card custom-card p-4 shadow-sm mb-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="card-title h5 mb-0 fw-bold d-flex align-items-center gap-2">
          <FiMinimize2 className="text-primary" />
          <span>Compression Mode</span>
        </h4>
        <span className="badge bg-success-subtle text-success">
          {compressMode === 'quality' ? 'Quality Presets (Sharp)' : 'Target Size Mode'}
        </span>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="d-flex p-1 bg-light rounded-3 mb-4 border">
        <button
          type="button"
          className={`btn flex-fill py-2 d-flex align-items-center justify-content-center gap-2 border-0 fw-semibold ${
            compressMode === 'quality' ? 'btn-white shadow-sm text-primary' : 'text-muted'
          }`}
          onClick={() => setCompressMode('quality')}
        >
          <FiSliders size={16} />
          <span>Quality Presets</span>
          <span className="badge bg-primary-subtle text-primary smaller ms-1">Recommended</span>
        </button>

        <button
          type="button"
          className={`btn flex-fill py-2 d-flex align-items-center justify-content-center gap-2 border-0 fw-semibold ${
            compressMode === 'target' ? 'btn-white shadow-sm text-primary' : 'text-muted'
          }`}
          onClick={() => setCompressMode('target')}
        >
          <FiTarget size={16} />
          <span>Target File Size</span>
        </button>
      </div>

      {/* Fidelity & Sharpness Guarantee Notice */}
      <div className="alert alert-info py-2 px-3 d-flex align-items-center gap-2 mb-3 border-0 bg-info-subtle text-info-emphasis rounded-3 small">
        <FiShield className="flex-shrink-0 text-primary" size={18} />
        <span>
          <strong>Zero Blur Guarantee:</strong> Full 1:1 image dimensions and sharpness are maintained. File size strictly reduces below original.
        </span>
      </div>

      {/* Mode 1: Quality Presets */}
      {compressMode === 'quality' && (
        <div className="quality-presets-section mb-4">
          <label className="form-label text-muted small fw-semibold text-uppercase mb-2">
            Select Quality Level
          </label>
          <div className="d-flex flex-column gap-2">
            {[
              {
                id: 'low',
                title: 'Low Compression (Highest Visual Quality)',
                desc: '88% Quality. Preserves 100% crystal clear edges and colors with gentle file size reduction.'
              },
              {
                id: 'medium',
                title: 'Medium Compression (Balanced & Sharp)',
                desc: '80% Quality. Recommended. Optimal file size reduction while keeping images sharp, crisp, and vibrant.'
              },
              {
                id: 'high',
                title: 'High Compression (Maximum Size Reduction)',
                desc: '70% Quality. Strongest byte reduction while maintaining full original resolution without blur.'
              },
            ].map((preset) => {
              const isSelected = qualityLevel === preset.id;
              return (
                <div
                  key={preset.id}
                  className={`p-3 rounded-3 border cursor-pointer transition-all ${
                    isSelected ? 'border-primary bg-primary-subtle' : 'bg-white'
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setQualityLevel(preset.id)}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-bold text-dark">{preset.title}</span>
                    {isSelected && <FiCheck className="text-primary fw-bold" size={18} />}
                  </div>
                  <div className="text-muted small">{preset.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: Exact Target Size */}
      {compressMode === 'target' && (
        <div className="target-size-section">
          {/* Quick preset buttons */}
          <div className="mb-3">
            <label className="form-label text-muted small fw-semibold text-uppercase mb-2">
              Select Target Reduction Preset
            </label>
            <div className="row g-2">
              {presetSizes.map((preset) => {
                const isSelected = targetSize === preset.value && unit === preset.unit;
                return (
                  <div key={preset.label} className="col-6 col-sm-3">
                    <button
                      type="button"
                      className={`btn w-100 p-2 text-center rounded-3 border transition-all ${
                        isSelected
                          ? 'btn-primary text-white shadow-sm'
                          : 'btn-outline-light text-dark bg-white border-secondary-subtle'
                      }`}
                      onClick={() => {
                        setTargetSize(preset.value);
                        setUnit(preset.unit);
                      }}
                    >
                      <div className="fw-bold">{preset.label}</div>
                      <div className="small fw-semibold">{preset.value} {preset.unit}</div>
                      <div className={`smaller ${isSelected ? 'text-white-50' : 'text-muted'}`}>
                        {preset.hint}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Size Input + Range Slider */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <label htmlFor="customTargetSize" className="form-label text-muted small fw-semibold text-uppercase mb-0">
                Or Customize Desired Target Size
              </label>
              <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">
                {targetSize} {unit}
              </span>
            </div>
            
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text bg-light text-primary border-end-0">
                <FiTarget />
              </span>
              <input
                id="customTargetSize"
                type="number"
                min="1"
                max={unit === 'MB' ? Math.max(1, (origBytes / (1024 * 1024)).toFixed(1)) : Math.max(1, origKb)}
                step={unit === 'MB' ? '0.1' : '5'}
                className="form-control fw-bold fs-5 border-start-0"
                value={targetSize}
                onChange={(e) => setTargetSize(e.target.value)}
                onBlur={() => {
                  const val = parseFloat(targetSize);
                  if (isNaN(val) || val <= 0) {
                    setTargetSize(getDefaultTargetSize(origBytes));
                  }
                }}
                placeholder="e.g. 100"
              />
              <select
                className="form-select fw-semibold bg-light flex-grow-0"
                style={{ width: '105px' }}
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                aria-label="Target Size Unit"
              >
                <option value="KB">KB</option>
                {origKb >= 1024 && <option value="MB">MB</option>}
              </select>
            </div>

            {/* Warning if user typed a target size >= original size */}
            {isTargetLargerThanOrig && (
              <div className="alert alert-warning py-1.5 px-3 small d-flex align-items-center gap-2 mb-2 rounded-2">
                <FiAlertTriangle className="flex-shrink-0 text-warning-emphasis" size={15} />
                <span>
                  Target ({targetSize} {unit}) is larger than the original file ({formatBytes(origBytes)}). It will be adjusted so the file reduces in size.
                </span>
              </div>
            )}

            {/* Interactive Slider constrained strictly below original size */}
            <input
              type="range"
              className="form-range custom-range mt-2"
              min="1"
              max={unit === 'MB' ? Math.max(0.1, Number((origBytes / (1024 * 1024) * 0.95).toFixed(2))) : Math.max(2, Math.round(origKb * 0.95))}
              step={unit === 'MB' ? 0.05 : 1}
              value={Math.min(
                unit === 'MB' ? Math.max(0.1, Number((origBytes / (1024 * 1024) * 0.95).toFixed(2))) : Math.max(2, Math.round(origKb * 0.95)),
                parseFloat(targetSize) || 1
              )}
              onChange={(e) => setTargetSize(parseFloat(e.target.value))}
              aria-label="Adjust target size"
            />
            <div className="d-flex justify-content-between text-muted smaller mt-1">
              <span>1 {unit} (Maximum compression)</span>
              <span>{unit === 'MB' ? `${(origBytes / (1024 * 1024) * 0.95).toFixed(1)} MB` : `${Math.round(origKb * 0.95)} KB`} (Light compression)</span>
            </div>
          </div>

          {/* Live Compression Preview Badge */}
          {origBytes > 0 && (
            <div className="bg-light p-3 rounded-3 border mb-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div className="d-flex align-items-center gap-2 small">
                <span className="text-muted">Original:</span>
                <span className="fw-semibold text-dark">{formatBytes(origBytes)}</span>
                <FiArrowRight className="text-muted" />
                <span className="text-muted">Target:</span>
                <span className="fw-bold text-primary">~{parseFloat(targetSize) || 0} {unit}</span>
              </div>
              {estimatedSavingsPercent !== null && estimatedSavingsPercent > 0 && (
                <span className="badge bg-success-subtle text-success small">
                  ~{estimatedSavingsPercent}% size reduction
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <button
        type="button"
        className="btn btn-primary-custom w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 shadow-sm fs-6 fw-bold"
        onClick={handleCompressClick}
      >
        <FiMinimize2 size={16} />
        <span>
          {compressMode === 'target'
            ? `Compress ${count > 1 ? count + ' Images' : 'File'} to ~${targetSize} ${unit}`
            : `Compress ${count > 1 ? count + ' Images' : 'File'} (${qualityLevel.toUpperCase()})`}
        </span>
      </button>
    </div>
  );
}

export default CompressionSettings;
