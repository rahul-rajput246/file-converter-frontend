import { FiImage, FiFileText, FiArchive } from 'react-icons/fi';

const FORMAT_CATEGORIES = [
  {
    category: 'Images',
    icon: <FiImage className="text-primary" size={20} />,
    formats: [
      { name: 'WEBP', desc: 'Modern High Compression' },
      { name: 'AVIF', desc: 'Ultra Next-Gen Quality' },
      { name: 'PNG', desc: 'Lossless & Transparency' },
      { name: 'JPG', desc: 'Universal Photo Format' },
      { name: 'GIF', desc: 'Graphics & Animations' },
      { name: 'ICO', desc: 'Icons & Favicons' },
      { name: 'BMP', desc: 'Standard Windows Bitmap' }
    ]
  },
  {
    category: 'Documents',
    icon: <FiFileText className="text-danger" size={20} />,
    formats: [
      { name: 'PDF', desc: 'Portable Document' },
      { name: 'DOCX', desc: 'Word Processing' },
      { name: 'XLSX', desc: 'Excel Spreadsheet' },
      { name: 'TXT', desc: 'Plain Text' }
    ]
  },
  {
    category: 'Archives & Media',
    icon: <FiArchive className="text-warning" size={20} />,
    formats: [
      { name: 'ZIP', desc: 'Standard Archive' },
      { name: 'RAR', desc: 'Compressed Archive' },
      { name: 'MP3', desc: 'Audio Stream' },
      { name: 'MP4', desc: 'HD Video' }
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
