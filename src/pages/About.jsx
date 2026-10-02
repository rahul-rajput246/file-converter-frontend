import { FiShield, FiServer, FiLock, FiHelpCircle } from 'react-icons/fi';

function About() {
  const faqs = [
    {
      q: 'Is FileFlow completely free to use?',
      a: 'Yes! FileFlow provides free file conversion and compression for files up to 100 MB without subscription barriers.'
    },
    {
      q: 'How long are my files stored on the server?',
      a: 'Temporary files are automatically deleted after 2 hours. We never permanently retain or inspect private document contents.'
    },
    {
      q: 'Which formats are supported?',
      a: 'FileFlow supports all popular formats including JPG, PNG, WEBP, PDF, DOCX, XLSX, MP3, MP4, and ZIP archives.'
    },
    {
      q: 'How will the backend be structured?',
      a: 'The frontend is engineered with reusable hooks and a dedicated service layer (src/services/fileService.js), ready for direct integration with a Laravel 11 REST API and queuing engine.'
    }
  ];

  return (
    <div className="about-page py-4 text-start">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="badge-pill mb-2">
            <FiShield className="text-primary me-1" />
            <span>Modern &amp; Secure File Utilities</span>
          </div>
          <h1 className="fw-bold mb-3">About FileFlow</h1>
          <p className="text-muted lead mx-auto" style={{ maxWidth: '650px' }}>
            A lightweight, developer-friendly, and high-performance platform for seamless file format transformations.
          </p>
        </div>

        {/* Mission & Overview */}
        <div className="row g-4 mb-5">
          <div className="col-12 col-md-6">
            <div className="card custom-card p-4 h-100 shadow-sm border-0">
              <h4 className="fw-bold mb-3 text-dark">Our Mission</h4>
              <p className="text-muted">
                FileFlow was built to eliminate the hassle of converting files, dealing with incompatible formats, or sluggish uploads due to bloated file sizes.
              </p>
              <p className="text-muted mb-0">
                We believe in clean UI, transparent privacy, and blazingly fast tools that get out of the way so you can focus on building and sharing your work.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card custom-card p-4 h-100 shadow-sm border-0">
              <h4 className="fw-bold mb-3 text-dark">Frontend &amp; Backend Roadmap</h4>
              <p className="text-muted">
                This client application is crafted with React 19, Vite, Bootstrap 5.3, and modular React Icons.
              </p>
              <div className="p-3 bg-light rounded-3 border small">
                <span className="fw-bold text-primary">Architecture:</span> Single Page React App ➔ RESTful JSON Bridge ➔ Laravel Queue Engine (FFmpeg, ImageMagick, Ghostscript).
              </div>
            </div>
          </div>
        </div>

        {/* Security Pillars */}
        <div className="card custom-card p-4 p-md-5 shadow-sm border-0 mb-5 bg-gradient-subtle">
          <h3 className="fw-bold text-center mb-4">Our Security Commitments</h3>
          <div className="row g-4">
            <div className="col-12 col-md-4 text-center">
              <div className="p-3 bg-white rounded-circle d-inline-flex mb-3 shadow-sm text-primary">
                <FiLock size={28} />
              </div>
              <h6 className="fw-bold mb-1">Encrypted Transport</h6>
              <p className="text-muted small mb-0">All communication runs over hardened TLS 1.3 encryption.</p>
            </div>
            <div className="col-12 col-md-4 text-center">
              <div className="p-3 bg-white rounded-circle d-inline-flex mb-3 shadow-sm text-success">
                <FiShield size={28} />
              </div>
              <h6 className="fw-bold mb-1">Strict Data Privacy</h6>
              <p className="text-muted small mb-0">We never share, sell, or index your private uploaded data.</p>
            </div>
            <div className="col-12 col-md-4 text-center">
              <div className="p-3 bg-white rounded-circle d-inline-flex mb-3 shadow-sm text-warning">
                <FiServer size={28} />
              </div>
              <h6 className="fw-bold mb-1">Automated Purging</h6>
              <p className="text-muted small mb-0">Garbage collection cron jobs wipe all temp files every 2 hours.</p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="faq-section mb-5">
          <h3 className="fw-bold text-center mb-4">Frequently Asked Questions</h3>
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="d-flex flex-column gap-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="card custom-card p-4 border-0 shadow-sm">
                    <h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                      <FiHelpCircle className="text-primary flex-shrink-0" />
                      <span>{faq.q}</span>
                    </h6>
                    <p className="text-muted small mb-0 ps-4">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
