import { FiImage, FiFileText, FiArchive, FiVideo, FiMusic } from 'react-icons/fi';

const FORMAT_CATEGORIES = [
  {
    category: 'Images & Graphics',
    icon: <FiImage className="text-primary" size={20} />,
    formats: [
      { name: 'WEBP', desc: 'Modern High Compression' },
      { name: 'AVIF', desc: 'Next-Gen Ultra Quality' },
      { name: 'PNG', desc: 'Lossless & Transparency' },
      { name: 'JPG', desc: 'Standard Photo Format' },
      { name: 'GIF', desc: 'Clean 256-Color Graphics' },
      { name: 'ICO', desc: 'Multi-Res Favicon Stream' },
      { name: 'BMP', desc: 'Standard Windows Bitmap' }
    ]
  },
  {
    category: 'Video & Animation',
    icon: <FiVideo className="text-info" size={20} />,
    formats: [
      { name: 'MP4', desc: 'H.264 Universal Video' },
      { name: 'WEBM', desc: 'VP9 Web-Optimized Stream' },
      { name: 'MOV', desc: 'Apple QuickTime Container' },
      { name: 'AVI', desc: 'Legacy Windows Video' },
      { name: 'MKV', desc: 'Matroska Open Container' },
      { name: 'GIF', desc: 'True Animated Looping GIF' }
    ]
  },
  {
    category: 'Audio & Documents',
    icon: <FiMusic className="text-success" size={20} />,
    formats: [
      { name: 'MP3', desc: 'Universal Audio Soundtrack' },
      { name: 'WAV', desc: 'Lossless Studio Audio' },
      { name: 'OGG', desc: 'Vorbis Open Audio Stream' },
      { name: 'AAC', desc: 'High Quality Compressed' },
      { name: 'PDF', desc: 'Vector & Raster Document' },
      { name: 'TXT', desc: 'Extracted Plain Text File' }
    ]
  }
];

function SupportedFormats() {
  return (
    <section className="supported-formats-section py-5">
      <div className="text-center mb-5">
        <span className="badge-pill mb-2">Broad File Ecosystem</span>
        <h2 className="section-title fw-bold">Supported File Formats</h2>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Interchangeably convert and compress between standard images, documents, audio, and container formats.
        </p>
      </div>

      <div className="row g-4">
        {FORMAT_CATEGORIES.map((cat, idx) => (
          <div className="col-12 col-md-4" key={idx}>
            <div className="card format-category-card h-100 p-4 border-0 rounded-4 shadow-sm text-start bg-white">
              <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                <div className="p-2 bg-light rounded-3 d-inline-flex align-items-center justify-content-center">
                  {cat.icon}
                </div>
                <h5 className="fw-bold mb-0 text-dark">{cat.category}</h5>
              </div>

              <div className="d-flex flex-column gap-2">
                {cat.formats.map((fmt, fIdx) => (
                  <div
                    key={fIdx}
                    className="format-item p-2 px-3 rounded-3 d-flex align-items-center justify-content-between border bg-light-subtle"
                  >
                    <span className="badge bg-white text-dark border fw-bold px-2 py-1">
                      .{fmt.name.toLowerCase()}
                    </span>
                    <span className="small text-muted">{fmt.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SupportedFormats;
