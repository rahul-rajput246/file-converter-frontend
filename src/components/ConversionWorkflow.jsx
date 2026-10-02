import { FiLayers, FiShield, FiZap, FiCheckCircle } from 'react-icons/fi';

function ConversionWorkflow() {
  return (
    <div className="card custom-card p-4 shadow-sm text-start mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3.5 pb-2 border-bottom border-light">
        <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 fs-6">
          <FiLayers className="text-primary" size={18} />
          <span>Conversion Pipeline</span>
        </h5>
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 smaller">
          Engine v3.2 Active
        </span>
      </div>

      <div className="workflow-stepper">
        {/* Step 01 */}
        <div className="workflow-step">
          <div className="workflow-track"></div>
          <div className="workflow-badge">01</div>
          <div className="flex-grow-1">
            <span className="workflow-tag bg-primary-subtle text-primary mb-1">
              STAGE 01 • INGESTION
            </span>
            <div className="workflow-title">Select or Drop Source Assets</div>
            <div className="workflow-desc">
              Upload photos, graphics, or media up to 100 MB. Instant in-memory parsing validates container headers, dimensions, and alpha channels in &lt;50ms without server latency.
            </div>
          </div>
        </div>

        {/* Step 02 */}
        <div className="workflow-step">
          <div className="workflow-track"></div>
          <div className="workflow-badge">02</div>
          <div className="flex-grow-1">
            <span className="workflow-tag bg-purple-subtle text-purple mb-1" style={{ color: '#7c3aed', backgroundColor: '#f3e8ff' }}>
              STAGE 02 • TRANSCODING
            </span>
            <div className="workflow-title">Adaptive Multi-Format Engine</div>
            <div className="workflow-desc">
              Transcode seamlessly between 16+ production formats (WebP, AVIF, PNG, JPG, GIF, MP4). Real-time palette optimization and Lanczos scaling preserve razor-sharp pixel fidelity.
            </div>
          </div>
        </div>

        {/* Step 03 */}
        <div className="workflow-step">
          <div className="workflow-badge">03</div>
          <div className="flex-grow-1">
            <span className="workflow-tag bg-success-subtle text-success mb-1">
              STAGE 03 • STREAM &amp; PURGE
            </span>
            <div className="workflow-title">Direct Stream Download &amp; Auto-Purge</div>
            <div className="workflow-desc">
              Grab your converted asset with direct zero-latency stream delivery. Files are processed in isolated sandbox memory and permanently expunged after 60 minutes for complete privacy.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-top border-light d-flex flex-wrap align-items-center justify-content-between gap-2 text-muted smaller">
        <span className="d-inline-flex align-items-center gap-1">
          <FiShield className="text-primary" size={13} />
          <span>256-bit TLS Encrypted</span>
        </span>
        <span className="d-inline-flex align-items-center gap-1">
          <FiZap className="text-warning" size={13} />
          <span>Sub-second Output</span>
        </span>
        <span className="d-inline-flex align-items-center gap-1">
          <FiCheckCircle className="text-success" size={13} />
          <span>Zero Watermarks</span>
        </span>
      </div>
    </div>
  );
}

export default ConversionWorkflow;
