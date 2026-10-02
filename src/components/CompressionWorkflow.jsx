import { FiTrendingDown, FiShield, FiZap, FiCheckCircle } from 'react-icons/fi';

function CompressionWorkflow() {
  return (
    <div className="card custom-card p-4 shadow-sm text-start mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3.5 pb-2 border-bottom border-light">
        <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 fs-6">
          <FiTrendingDown className="text-success" size={18} />
          <span>Compression Architecture</span>
        </h5>
        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 smaller">
          Smart Quantization
        </span>
      </div>

      <div className="workflow-stepper">
        {/* Step 01 */}
        <div className="workflow-step">
          <div className="workflow-track"></div>
          <div className="workflow-badge">01</div>
          <div className="flex-grow-1">
            <span className="workflow-tag bg-primary-subtle text-primary mb-1">
              STAGE 01 • PERCEPTUAL ANALYSIS
            </span>
            <div className="workflow-title">Structural Similarity (SSIM) Mapping</div>
            <div className="workflow-desc">
              Analyzes contrast gradients and high-frequency textures to protect essential focal points, skin tones, and typography while isolating compressible byte regions.
            </div>
          </div>
        </div>

        {/* Step 02 */}
        <div className="workflow-step">
          <div className="workflow-track"></div>
          <div className="workflow-badge">02</div>
          <div className="flex-grow-1">
            <span className="workflow-tag bg-purple-subtle text-purple mb-1" style={{ color: '#7c3aed', backgroundColor: '#f3e8ff' }}>
              STAGE 02 • DUAL-PASS ENCODING
            </span>
            <div className="workflow-title">Adaptive Palette &amp; Byte Pruning</div>
            <div className="workflow-desc">
              Cleans redundant EXIF metadata and optimizes color tables. Slashes asset payload by up to 85% with zero perceptible degradation on high-density Retina displays.
            </div>
          </div>
        </div>

        {/* Step 03 */}
        <div className="workflow-step">
          <div className="workflow-badge">03</div>
          <div className="flex-grow-1">
            <span className="workflow-tag bg-success-subtle text-success mb-1">
              STAGE 03 • TARGET GUARANTEE
            </span>
            <div className="workflow-title">Guaranteed Target Size Matching</div>
            <div className="workflow-desc">
              Specify an exact KB threshold (e.g. 500 KB or 2 MB) to reliably pass strict email attachment limits, portal upload quotas, or mobile app constraints.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-top border-light d-flex flex-wrap align-items-center justify-content-between gap-2 text-muted smaller">
        <span className="d-inline-flex align-items-center gap-1">
          <FiShield className="text-primary" size={13} />
          <span>Lossless Alpha Channels</span>
        </span>
        <span className="d-inline-flex align-items-center gap-1">
          <FiZap className="text-warning" size={13} />
          <span>Faster PageSpeed (LCP)</span>
        </span>
        <span className="d-inline-flex align-items-center gap-1">
          <FiCheckCircle className="text-success" size={13} />
          <span>Zero Artifacts</span>
        </span>
      </div>
    </div>
  );
}

export default CompressionWorkflow;
