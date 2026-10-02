import { Link } from 'react-router-dom';
import { FiLayers, FiShield } from 'react-icons/fi';

function Footer() {
  return (
    <footer className="footer-custom bg-white border-top mt-auto pt-5 pb-4">
      <div className="container">
        <div className="row g-4 justify-content-between mb-4">
          {/* Brand & Mission */}
          <div className="col-12 col-md-4 text-start">
            <Link className="navbar-brand d-inline-flex align-items-center gap-2 mb-3 text-decoration-none" to="/">
              <div className="brand-icon-wrapper">
                <FiLayers className="brand-icon" />
              </div>
              <span className="brand-text">
                File<span className="text-primary-gradient">Flow</span>
              </span>
            </Link>
            <p className="text-muted small mb-3" style={{ maxWidth: '320px' }}>
              Simple tools for converting and optimizing your files. Fast, secure, client-ready file utilities built for modern creators.
            </p>
            <div className="d-flex align-items-center gap-2 text-muted small">
              <FiShield className="text-primary" />
              <span>TLS 256-bit Encrypted Pipeline</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-2 text-start">
            <h6 className="fw-bold text-dark text-uppercase small tracking-wider mb-3">Tools</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/convert" className="text-muted text-decoration-none hover-primary">
                  File Converter
                </Link>
              </li>
              <li>
                <Link to="/compress" className="text-muted text-decoration-none hover-primary">
                  File Compressor
                </Link>
              </li>
              <li>
                <Link to="/convert" className="text-muted text-decoration-none hover-primary">
                  Image Optimizer
                </Link>
              </li>
              <li>
                <Link to="/convert" className="text-muted text-decoration-none hover-primary">
                  PDF Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Resources */}
          <div className="col-6 col-md-2 text-start">
            <h6 className="fw-bold text-dark text-uppercase small tracking-wider mb-3">Company</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/" className="text-muted text-decoration-none hover-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted text-decoration-none hover-primary">
                  About FileFlow
                </Link>
              </li>
              <li>
                <a 
                  href="#privacy" 
                  onClick={(e) => { e.preventDefault(); alert('Privacy Policy: All temporary uploaded files are automatically expunged after processing.'); }}
                  className="text-muted text-decoration-none hover-primary"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#terms" 
                  onClick={(e) => { e.preventDefault(); alert('Terms: FileFlow is free to use for personal and commercial file transformation.'); }}
                  className="text-muted text-decoration-none hover-primary"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Live Engine Status */}
          <div className="col-12 col-md-3 text-start">
            <h6 className="fw-bold text-dark text-uppercase small tracking-wider mb-3">Live Processing Engine</h6>
            <p className="text-muted small mb-2">
              Connected live to Laravel 11 REST API engine with real Intervention Image v3 and GD transcoding.
            </p>
            <div className="d-inline-flex align-items-center gap-2 badge bg-success-subtle text-success border border-success-subtle px-3 py-1.5 rounded-pill">
              <span className="pulse-dot"></span>
              <span className="fw-semibold">Engine Online (REST API)</span>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-3 border-top border-light d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 text-muted small">
          <div>
            &copy; 2026 FileFlow Pro. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-2">
            <span>Powered by Laravel 11 + PHP 8.2 GD + React 19</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
