import { FiZap, FiArrowRight, FiShield, FiCpu, FiCheckCircle } from 'react-icons/fi';

const PRESETS = [
  {
    id: 'png-webp',
    source: 'PNG',
    target: 'WEBP',
    title: 'PNG → WebP',
    desc: 'Save ~75% file size for websites & blogs',
    tag: 'Next-Gen Web',
    badgeClass: 'bg-primary-subtle text-primary border-primary-subtle'
  },
  {
    id: 'video-gif',
    source: 'Video',
    target: 'GIF',
    title: 'Video → GIF',
    desc: 'Animated looping clip from MP4/WEBM/MOV',
    tag: 'Animated Clip',
    badgeClass: 'badge-purple'
  },
  {
    id: 'jpg-png',
    source: 'JPG',
    target: 'PNG',
    title: 'JPG → PNG',
    desc: 'Lossless raster with alpha transparency',
    tag: 'Lossless',
    badgeClass: 'bg-info-subtle text-info border-info-subtle'
  },
  {
    id: 'img-pdf',
    source: 'Image',
    target: 'PDF',
    title: 'Image → PDF',
    desc: 'Vector & raster printable document stream',
    tag: 'Print Document',
    badgeClass: 'bg-danger-subtle text-danger border-danger-subtle'
  },
  {
    id: 'video-mp3',
    source: 'Video',
    target: 'MP3',
    title: 'Video → MP3',
    desc: 'Extract 192k crystal-clear audio track',
    tag: 'Audio Stream',
    badgeClass: 'bg-success-subtle text-success border-success-subtle'
  },
  {
    id: 'webp-jpg',
    source: 'WebP',
    target: 'JPG',
    title: 'WebP → JPG',
    desc: 'Universal photo compatibility for legacy apps',
    tag: 'Universal',
    badgeClass: 'bg-secondary-subtle text-secondary border'
  }
];

function PopularConversions({ onSelectPreset }) {
  return (
    <div className="card custom-card p-4 shadow-sm text-start mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-light">
        <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 fs-6">
          <FiZap className="text-warning" size={18} />
          <span>1-Click Popular Conversions</span>
        </h5>
        <span className="badge bg-light text-secondary border smaller">
          Quick Launch
        </span>
      </div>

      <p className="text-muted smaller mb-3">
        Choose a target pairing below to pre-configure the engine and select your file immediately:
      </p>

      <div className="row g-2 mb-3">
        {PRESETS.map((preset) => (
          <div key={preset.id} className="col-12 col-sm-6">
            <button
              type="button"
              className="preset-card-btn h-100"
              onClick={() => onSelectPreset && onSelectPreset(preset.target)}
            >
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fw-bold text-dark fs-6 d-flex align-items-center gap-1.5">
                  <span>{preset.title}</span>
                </span>
                <span className={`badge border smaller px-1.5 py-0.5 ${preset.badgeClass}`} style={{ fontSize: '0.66rem' }}>
                  {preset.tag}
                </span>
              </div>
              <div className="text-muted smaller text-truncate" style={{ fontSize: '0.74rem' }}>
                {preset.desc}
              </div>
            </button>
          </div>
        ))}
      </div>

      <div className="pt-2.5 border-top border-light d-flex flex-wrap align-items-center justify-content-between gap-2 text-muted smaller">
        <span className="d-inline-flex align-items-center gap-1">
          <FiCpu className="text-primary" size={13} />
          <span>Hardware Transcoding Pipeline</span>
        </span>
        <span className="d-inline-flex align-items-center gap-1">
          <FiShield className="text-success" size={13} />
          <span>Full 24-bit sRGB Color Gamut</span>
        </span>
        <span className="d-inline-flex align-items-center gap-1">
          <FiCheckCircle className="text-primary" size={13} />
          <span>Instant Download Stream</span>
        </span>
      </div>
    </div>
  );
}

export default PopularConversions;
