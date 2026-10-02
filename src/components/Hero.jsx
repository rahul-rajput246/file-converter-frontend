import { Link } from 'react-router-dom';
import { FiCheckCircle, FiImage, FiZap, FiMinimize2, FiSliders, FiFileText, FiShield } from 'react-icons/fi';

const SUPPORTED_PILLS = ['WEBP', 'AVIF', 'PNG', 'JPG', 'GIF', 'MP4', 'WEBM', 'MOV', 'MP3', 'WAV', 'PDF', 'ICO'];

function Hero({ onGetStartedClick }) {
  return (
    <section className="hero-section py-4 py-lg-5 my-1 my-lg-2">
      <div className="container">
        <div className="row align-items-center g-4 g-lg-5">
          {/* Left Column: Copy & Actions */}
          <div className="col-12 col-lg-6 text-center text-lg-start">
            <div className="badge-pill mb-3 mx-auto ms-lg-0">
              <span className="pulse-dot"></span>
              <span>Enterprise-Grade Image &amp; Media Engine</span>
            </div>

            <h1 className="hero-title fw-bold mb-3">
              Transform, Compress &amp; Convert Files at <span className="text-primary-gradient">Light Speed</span>
            </h1>

            <p className="hero-subtitle text-muted mb-4 mx-auto ms-lg-0" style={{ maxWidth: '520px' }}>
              High-throughput transcoding across <strong>16+ formats</strong> with zero quality degradation. Dual-engine processing with hardware-accelerated FFmpeg &amp; Laravel stream pipelines.
            </p>

            {/* Quick Format Ticker Pills */}
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start align-items-center gap-1.5 mb-4">
              <span className="text-muted smaller fw-semibold me-2">Supported:</span>
              {SUPPORTED_PILLS.map((ext) => (
                <span
                  key={ext}
                  className="badge bg-white text-dark border px-2 py-0.5 rounded-2 shadow-xs fw-bold"
                  style={{ fontSize: '0.72rem' }}
                >
                  .{ext.toLowerCase()}
                </span>
              ))}
            </div>

            <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-2.5 mb-4">
              {onGetStartedClick ? (
                <button
                  type="button"
                  onClick={onGetStartedClick}
                  className="btn btn-primary-custom px-4 py-2.5 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  <FiZap size={16} />
                  <span>Start Converting Free</span>
                </button>
              ) : (
                <Link
                  to="/convert"
                  className="btn btn-primary-custom px-4 py-2.5 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  <FiZap size={16} />
                  <span>Start Converting Free</span>
                </Link>
              )}

              <Link
                to="/compress"
                className="btn btn-outline-custom px-4 py-2.5 d-inline-flex align-items-center justify-content-center gap-2"
              >
                <FiMinimize2 size={16} className="text-primary" />
                <span>Compress File</span>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 gap-sm-4 text-muted smaller pt-2 border-top border-light">
              <div className="d-flex align-items-center gap-1.5">
                <FiCheckCircle className="text-success" size={15} />
                <span>Up to 100 MB / file</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <FiShield className="text-primary" size={15} />
                <span>No sign-up needed</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <FiCheckCircle className="text-success" size={15} />
                <span>Auto-deleted in 2 hrs</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Live Conversion Visual */}
          <div className="col-12 col-lg-6">
            <div className="hero-visual-card position-relative p-3 p-sm-4 p-md-5 overflow-hidden">

              {/* Floating Feature Tags */}
              <div className="floating-badge shadow-xs d-none d-sm-flex">
                <FiZap className="text-warning me-1.5" size={15} />
                <span>Instant Processing</span>
              </div>

              {/* Source File Preview Node */}
              <div className="visual-file-node source-node shadow-sm p-2.5 p-sm-3 rounded-4 bg-white d-flex align-items-center gap-2 gap-sm-3 mb-3 overflow-hidden">
                <div className="node-icon bg-primary-subtle text-primary p-2.5 p-sm-3 rounded-3 shadow-xs flex-shrink-0">
                  <FiImage size={24} />
                </div>
                <div className="text-start flex-grow-1 overflow-hidden">
                  <div className="fw-bold text-dark text-truncate small fs-sm-6">design_presentation_hero.png</div>
                  <div className="smaller text-muted d-flex align-items-center gap-2 mt-1">
                    <span className="badge bg-secondary-subtle text-secondary px-2 py-0.5">PNG 24-bit</span>
                    <span className="text-secondary fw-semibold">4.8 MB</span>
                  </div>
                </div>
                <span className="badge bg-light text-muted border d-none d-md-inline-block flex-shrink-0">Original</span>
              </div>

              {/* Dynamic Connection Indicator */}
              <div className="visual-connector my-2 d-flex align-items-center justify-content-center">
                <div className="pulse-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0">
                  <FiSliders className="text-primary" size={18} />
                </div>
                <div className="connector-badge shadow-sm d-flex align-items-center gap-1 flex-shrink-0">
                  <FiZap size={14} />
                  <span>-75% Size Saved</span>
                </div>
              </div>

              {/* Target File Preview Node */}
              <div className="visual-file-node target-node shadow-sm p-2.5 p-sm-3 rounded-4 bg-white d-flex align-items-center gap-2 gap-sm-3 overflow-hidden">
                <div className="node-icon bg-success-subtle text-success p-2.5 p-sm-3 rounded-3 shadow-xs flex-shrink-0">
                  <FiFileText size={24} />
                </div>
                <div className="text-start flex-grow-1 overflow-hidden">
                  <div className="fw-bold text-dark text-truncate small fs-sm-6">design_presentation_hero.webp</div>
                  <div className="smaller text-success fw-medium d-flex align-items-center gap-2 mt-1">
                    <span className="badge bg-success-subtle text-success px-2 py-0.5">WEBP Next-Gen</span>
                    <span className="fw-bold">1.2 MB</span>
                  </div>
                </div>
                <div className="badge bg-success text-white px-2.5 py-1 rounded-pill smaller fw-semibold shadow-xs flex-shrink-0">
                  Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
