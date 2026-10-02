import { useState } from 'react';
import { FiMinimize2, FiTarget, FiSliders, FiCheck, FiArrowRight } from 'react-icons/fi';
import { formatBytes } from '../services/fileService';

const getDefaultTargetSize = (bytes) => {
  const kb = Math.round((bytes || 0) / 1024);
  if (kb > 1000) return Math.max(100, Math.round(kb * 0.4));
  if (kb > 200) return Math.max(50, Math.round(kb * 0.5));
  if (kb > 50) return Math.max(20, Math.round(kb * 0.6));
  return Math.max(10, Math.round((kb * 0.8) || 50));
};

function CompressionSettings({ selectedFile, onCompressTrigger }) {
  const [compressMode, setCompressMode] = useState('target'); // 'target' | 'quality'
  const [targetSize, setTargetSize] = useState(() => getDefaultTargetSize(selectedFile?.size));
  const [unit, setUnit] = useState('KB');
  const [qualityLevel, setQualityLevel] = useState('medium');

  const origBytes = selectedFile?.size || 0;

  const targetBytes = unit === 'MB' ? targetSize * 1024 * 1024 : targetSize * 1024;
  const estimatedSavingsPercent = (origBytes > 0 && origBytes > targetBytes)
    ? Math.round((1 - targetBytes / origBytes) * 100)
    : null;

  // Quick preset sizes
  const presetSizes = [
    { label: '50 KB', value: 50, unit: 'KB', hint: 'Govt forms & ID' },
    { label: '100 KB', value: 100, unit: 'KB', hint: 'Portals & upload' },
    { label: '200 KB', value: 200, unit: 'KB', hint: 'Balanced web' },
    { label: '500 KB', value: 500, unit: 'KB', hint: 'Email & sharing' },
  ];

  const handleCompressClick = () => {
    if (!onCompressTrigger) return;

    if (compressMode === 'target') {
      const parsed = parseFloat(targetSize) || getDefaultTargetSize(selectedFile?.size);
      const targetKb = unit === 'MB' ? parsed * 1024 : parsed;
      onCompressTrigger({
        mode: 'target',
        targetSizeKb: Math.max(1, Math.round(targetKb)),
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
          {compressMode === 'target' ? 'Target Size Mode' : 'Quality Presets'}
        </span>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="d-flex p-1 bg-light rounded-3 mb-4 border">
        <button
          type="button"
          className={`btn flex-fill py-2 d-flex align-items-center justify-content-center gap-2 border-0 fw-semibold ${
            compressMode === 'target' ? 'btn-white shadow-sm text-primary' : 'text-muted'
          }`}
          onClick={() => setCompressMode('target')}
        >
          <FiTarget size={16} />
          <span>Target File Size</span>
          <span className="badge bg-primary-subtle text-primary smaller ms-1">Popular</span>
        </button>

        <button
          type="button"
          className={`btn flex-fill py-2 d-flex align-items-center justify-content-center gap-2 border-0 fw-semibold ${
            compressMode === 'quality' ? 'btn-white shadow-sm text-primary' : 'text-muted'
          }`}
          onClick={() => setCompressMode('quality')}
        >
          <FiSliders size={16} />
          <span>Quality Presets</span>
        </button>
      </div>

      {/* Mode 1: Exact Target Size */}
      {compressMode === 'target' && (
        <div className="target-size-section">
          {/* Quick preset buttons */}
          <div className="mb-3">
            <label className="form-label text-muted small fw-semibold text-uppercase mb-2">
              Quick Target Presets
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
                max={unit === 'MB' ? 100 : 102400}
                step={unit === 'MB' ? '0.1' : '5'}
                className="form-control fw-bold fs-5 border-start-0"
                value={targetSize}
                onChange={(e) => setTargetSize(e.target.value)}
                onBlur={() => {
                  const val = parseFloat(targetSize);
                  if (isNaN(val) || val <= 0) {
                    setTargetSize(getDefaultTargetSize(selectedFile?.size));
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
                <option value="MB">MB</option>
              </select>
            </div>

            {/* Interactive Slider */}
            <input
              type="range"
              className="form-range custom-range mt-2"
              min="10"
              max={unit === 'MB' ? 20 : 2000}
              step={unit === 'MB' ? 0.5 : 20}
              value={Math.min(unit === 'MB' ? 20 : 2000, parseFloat(targetSize) || 100)}
              onChange={(e) => setTargetSize(parseFloat(e.target.value))}
              aria-label="Adjust target size"
            />
            <div className="d-flex justify-content-between text-muted smaller mt-1">
              <span>{unit === 'MB' ? '1 MB' : '10 KB'} (Max compression)</span>
              <span>{unit === 'MB' ? '20 MB' : '2000 KB'} (High quality)</span>
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

      {/* Mode 2: Quality Presets */}
      {compressMode === 'quality' && (
        <div className="quality-presets-section mb-4">
          <label className="form-label text-muted small fw-semibold text-uppercase mb-2">
            Select Quality Level
          </label>
          <div className="d-flex flex-column gap-2">
            {[
              {
                id: 'low',
                title: 'Low Compression (Highest Quality)',
                desc: 'Preserves maximum clarity and colors with subtle file reduction.'
              },
              {
                id: 'medium',
                title: 'Medium Compression (Balanced)',
                desc: 'Recommended. Good size reduction while keeping images sharp.'
              },
              {
                id: 'high',
                title: 'High Compression (Smallest Size)',
                desc: 'Maximum size reduction, best for speed and tight bandwidth.'
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

      {/* Action Button */}
      <button
        type="button"
        className="btn btn-primary-custom btn-lg w-100 py-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
        onClick={handleCompressClick}
      >
        <FiMinimize2 size={18} />
        <span>
          {compressMode === 'target'
            ? `Compress File to ${targetSize} ${unit}`
            : `Compress File (${qualityLevel.toUpperCase()})`}
        </span>
      </button>
    </div>
  );
}

export default CompressionSettings;
