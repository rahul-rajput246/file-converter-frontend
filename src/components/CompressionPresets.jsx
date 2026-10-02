import { FiTrendingDown, FiShield, FiGlobe, FiMail, FiCamera, FiZap, FiCheckCircle } from 'react-icons/fi';

const PRESETS = [
  {
    id: 'web',
    icon: <FiGlobe className="text-primary" size={16} />,
    title: 'Web Core Vitals & PageSpeed',
    level: 'high',
    desc: 'Slashes payload by 70% to 85% for lightning-fast LCP scores.',
    badge: 'High (85%)',
    badgeClass: 'bg-primary-subtle text-primary border-primary-subtle'
  },
  {
    id: 'email',
    icon: <FiMail className="text-success" size={16} />,
    title: 'Email & Messaging Quotas',
    level: 'medium',
    desc: 'Balanced 45% reduction to easily bypass strict 25 MB email limits.',
    badge: 'Balanced (45%)',
    badgeClass: 'bg-success-subtle text-success border-success-subtle'
  },
  {
    id: 'photo',
    icon: <FiCamera className="text-purple" size={16} style={{ color: '#7c3aed' }} />,
    title: 'Photography & Portfolio Fidelity',
    level: 'low',
    desc: 'Maximum perceptual clarity with subtle lossless byte quantization.',
    badge: 'Lossless (25%)',
    badgeClass: 'bg-purple-subtle text-purple border'
  }
];

function CompressionPresets({ onSelectPreset }) {
  return (
    <div className="card custom-card p-4 shadow-sm text-start mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-light">
        <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 fs-6">
          <FiTrendingDown className="text-success" size={18} />
          <span>Smart Compression Modes</span>
        </h5>
        <span className="badge bg-light text-secondary border smaller">
          Quick Launch
        </span>
      </div>

      <p className="text-muted smaller mb-3">
        Select an optimization target to pre-set compression parameters and choose your file:
      </p>

      <div className="d-flex flex-column gap-2 mb-3">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="preset-card-btn"
            onClick={() => onSelectPreset && onSelectPreset(preset.level)}
          >
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fw-bold text-dark fs-6 d-flex align-items-center gap-2">
                {preset.icon}
                <span>{preset.title}</span>
              </span>
              <span className={`badge border smaller px-2 py-0.5 ${preset.badgeClass}`} style={{ fontSize: '0.68rem' }}>
                {preset.badge}
              </span>
            </div>
            <div className="text-muted smaller ps-4" style={{ fontSize: '0.76rem' }}>
              {preset.desc}
            </div>
          </button>
        ))}
      </div>

      <div className="pt-2.5 border-top border-light d-flex flex-wrap align-items-center justify-content-between gap-2 text-muted smaller">
        <span className="d-inline-flex align-items-center gap-1">
          <FiZap className="text-warning" size={13} />
          <span>Adaptive SSIM Analysis</span>
        </span>
        <span className="d-inline-flex align-items-center gap-1">
          <FiShield className="text-primary" size={13} />
          <span>Zero Color Distortion</span>
        </span>
        <span className="d-inline-flex align-items-center gap-1">
          <FiCheckCircle className="text-success" size={13} />
          <span>Exact Target Size Guarantee</span>
        </span>
      </div>
    </div>
  );
}

export default CompressionPresets;
