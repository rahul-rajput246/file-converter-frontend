import { useState } from 'react';
import { FiRefreshCw, FiArrowRight, FiSliders, FiCheck } from 'react-icons/fi';
import { getTargetConversionOptions } from '../services/fileService';

const FORMAT_METADATA = {
  WEBP: { label: 'WebP', desc: 'Modern Web, High Compression', tag: 'Recommended' },
  PNG: { label: 'PNG', desc: 'Lossless & Transparency', tag: 'Popular' },
  JPG: { label: 'JPG / JPEG', desc: 'Standard Photo Format', tag: 'Standard' },
  AVIF: { label: 'AVIF', desc: 'Next-Gen Superior Quality', tag: 'Next-Gen' },
  GIF: { label: 'GIF', desc: 'Graphics & Animations', tag: 'Media' },
  BMP: { label: 'BMP', desc: 'Uncompressed Bitmap', tag: 'Legacy' },
  ICO: { label: 'ICO', desc: 'Windows & Web Favicon (256px)', tag: 'Icon' },
  PDF: { label: 'PDF', desc: 'Printable Document Stream', tag: 'Document' },
};

function ConversionSettings({ selectedFile, onConvertTrigger }) {
  const fileExt = selectedFile?.extension || 'FILE';
  const availableOptions = getTargetConversionOptions(fileExt);

  // Store user explicit choice or default
  const defaultTarget = availableOptions.find(opt => opt.toLowerCase() !== fileExt.toLowerCase()) || availableOptions[0] || 'WEBP';
  const [selectedTarget, setSelectedTarget] = useState(defaultTarget);

  // Derive active target ensuring it is always valid for the currently selected file
  const activeTarget = availableOptions.includes(selectedTarget)
    ? selectedTarget
    : defaultTarget;

  const handleConvertClick = () => {
    if (onConvertTrigger) {
      onConvertTrigger({
        sourceFormat: fileExt,
        targetFormat: activeTarget
      });
    }
  };

  return (
    <div className="card custom-card p-4 shadow-sm mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="card-title h5 mb-0 fw-bold d-flex align-items-center gap-2">
          <FiSliders className="text-primary" />
          <span>Conversion Settings</span>
        </h4>
        <span className="badge bg-primary-subtle text-primary">All Formats Supported</span>
      </div>

      <div className="row g-3 align-items-center mb-3">
        {/* Source format badge */}
        <div className="col-12 col-md-5">
          <label className="form-label text-muted small fw-semibold text-uppercase mb-1">
            Input Format
          </label>
          <div className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between">
            <span className="fw-bold text-dark fs-5">{fileExt}</span>
            <span className="badge bg-secondary-subtle text-secondary">Detected File</span>
          </div>
        </div>

        {/* Transition arrow */}
        <div className="col-12 col-md-2 text-center d-none d-md-block">
          <div className="arrow-divider p-2 bg-light rounded-circle d-inline-flex text-muted shadow-xs">
            <FiArrowRight size={22} />
          </div>
        </div>

        {/* Target format selector */}
        <div className="col-12 col-md-5">
          <label htmlFor="targetFormatSelect" className="form-label text-muted small fw-semibold text-uppercase mb-1">
            Target Format
          </label>
          <select
            id="targetFormatSelect"
            className="form-select form-select-lg rounded-3 fs-6 fw-semibold"
            value={activeTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
          >
            {availableOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} — {FORMAT_METADATA[opt]?.label || opt} ({FORMAT_METADATA[opt]?.tag || 'Format'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Format Pills Grid */}
      <div className="mb-4">
        <label className="form-label text-muted small fw-semibold text-uppercase mb-2 d-block">
          Choose Target Format ({availableOptions.length} Options)
        </label>
        <div className="row g-2">
          {availableOptions.map((opt) => {
            const isSelected = activeTarget === opt;
            const meta = FORMAT_METADATA[opt] || { label: opt, desc: '', tag: 'Format' };
            return (
              <div key={opt} className="col-6 col-sm-4 col-md-3">
                <button
                  type="button"
                  onClick={() => setSelectedTarget(opt)}
                  className={`btn w-100 text-start p-2 rounded-3 border transition-all ${
                    isSelected
                      ? 'btn-primary shadow-sm border-primary text-white'
                      : 'btn-outline-light text-dark bg-white border-secondary-subtle hover-shadow'
                  }`}
                  style={{ minHeight: '62px' }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-bold fs-6">{opt}</span>
                    {isSelected ? (
                      <FiCheck size={16} className="text-white" />
                    ) : (
                      <span className="badge bg-light text-secondary border smaller" style={{ fontSize: '0.65rem' }}>
                        {meta.tag}
                      </span>
                    )}
                  </div>
                  <div className={`smaller text-truncate ${isSelected ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.72rem' }}>
                    {meta.desc}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary-custom w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 shadow-sm fs-6 fw-bold"
        onClick={handleConvertClick}
      >
        <FiRefreshCw size={18} />
        <span>Convert to {activeTarget}</span>
      </button>
    </div>
  );
}

export default ConversionSettings;
