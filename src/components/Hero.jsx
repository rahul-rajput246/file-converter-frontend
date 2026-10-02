import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiImage, FiZap, FiMinimize2, FiSliders, FiFileText, FiShield } from 'react-icons/fi';

const SUPPORTED_PILLS = ['WEBP', 'AVIF', 'PNG', 'JPG', 'PDF', 'ICO', 'GIF', 'BMP'];

function Hero({ onGetStartedClick }) {
  return (
    <section className="hero-section py-5 my-2">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left Column: Copy & Actions */}
          <div className="col-12 col-lg-6 text-start">
            <div className="badge-pill mb-3">
              <span className="pulse-dot"></span>
              <span>Next-Gen Image &amp; Document Engine</span>
            </div>

            <h1 className="hero-title fw-bold mb-3">
              Transform &amp; Compress Files at <span className="text-primary-gradient">Light Speed</span>
            </h1>

            <p className="hero-subtitle text-muted mb-4 lead" style={{ fontSize: '1.18rem', lineHeight: '1.6' }}>
              Real-time transcoding across <strong>8 formats</strong> with zero quality degradation. Built with high-performance Laravel image processing and instant downloads.
            </p>

            {/* Quick Format Ticker Pills */}
            <div className="d-flex flex-wrap align-items-center gap-1 mb-4">
              <span className="text-muted smaller fw-semibold me-2">Supported:</span>
              {SUPPORTED_PILLS.map((ext) => (
                <span
                  key={ext}
                  className="badge bg-white text-dark border px-2 py-1 rounded-2 shadow-xs fw-bold"
                  style={{ fontSize: '0.75rem' }}
                >
                  .{ext.toLowerCase()}
                </span>
              ))}
            </div>

            <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
              {onGetStartedClick ? (
                <button
                  type="button"
                  onClick={onGetStartedClick}
                  className="btn btn-primary-custom btn-lg px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  <FiZap size={18} />
                  <span>Start Converting Free</span>
                  <FiArrowRight size={18} />
                </button>
              ) : (
                <Link
                  to="/convert"
                  className="btn btn-primary-custom btn-lg px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  <FiZap size={18} />
                  <span>Start Converting Free</span>
                  <FiArrowRight size={18} />
                </Link>
              )}

              <Link
                to="/compress"
                className="btn btn-outline-custom btn-lg px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2"
              >
                <FiMinimize2 size={18} className="text-primary" />
                <span>Compress File</span>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="d-flex flex-wrap gap-4 text-muted small pt-2 border-top border-light">
              <div className="d-flex align-items-center gap-2">
                <FiCheckCircle className="text-success" size={16} />
                <span>Up to 100 MB / file</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FiShield className="text-primary" size={16} />
                <span>No sign-up needed</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FiCheckCircle className="text-success" size={16} />
                <span>Ephemeral &amp; auto-deleted</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Live Conversion Visual */}
          <div className="col-12 col-lg-6">
            <div className="hero-visual-card position-relative p-4 p-md-5">

              {/* Source File Preview Node */}
              <div className="visual-file-node source-node shadow-sm p-3 rounded-4 bg-white d-flex align-items-center gap-3 mb-3">
                <div className="node-icon bg-primary-subtle text-primary p-3 rounded-3 shadow-xs">
                  <FiImage size={28} />
                </div>
                <div className="text-start flex-grow-1 overflow-hidden">
                  <div className="fw-bold text-dark text-truncate">design_presentation_hero.png</div>
                  <div className="small text-muted d-flex align-items-center gap-2 mt-1">
                    <span className="badge bg-secondary-subtle text-secondary px-2 py-0.5">PNG 24-bit</span>
                    <span className="text-secondary fw-semibold">4.8 MB</span>
                  </div>
                </div>
                <span className="badge bg-light text-muted border d-none d-sm-inline-block">Original</span>
              </div>

              {/* Dynamic Connection Indicator */}
              <div className="visual-connector my-2 d-flex align-items-center justify-content-center">
                <div className="pulse-circle d-flex align-items-center justify-content-center shadow-sm">
                  <FiSliders className="text-primary" size={20} />
                </div>
                <div className="connector-badge shadow-sm d-flex align-items-center gap-1">
                  <FiZap size={14} />
                  <span>-75% Size Saved</span>
                </div>
              </div>

              {/* Target File Preview Node */}
              <div className="visual-file-node target-node shadow-sm p-3 rounded-4 bg-white d-flex align-items-center gap-3">
                <div className="node-icon bg-success-subtle text-success p-3 rounded-3 shadow-xs">
                  <FiFileText size={28} />
                </div>
                <div className="text-start flex-grow-1 overflow-hidden">
                  <div className="fw-bold text-dark text-truncate">design_presentation_hero.webp</div>
                  <div className="small text-success fw-medium d-flex align-items-center gap-2 mt-1">
                    <span className="badge bg-success-subtle text-success px-2 py-0.5">WEBP Next-Gen</span>
                    <span className="fw-bold">1.2 MB</span>
                  </div>
                </div>
                <div className="badge bg-success text-white px-3 py-1.5 rounded-pill small fw-semibold shadow-xs">
                  Ready
                </div>
              </div>

              {/* Floating Feature Tags */}
              <div className="floating-badge shadow-sm">
                <FiZap className="text-warning me-1.5" size={15} />
                <span>Instant Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
