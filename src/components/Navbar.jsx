import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiLayers, FiMenu, FiX, FiArrowRight, FiZap } from 'react-icons/fi';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top py-3">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" to="/" onClick={closeNavbar}>
          <div className="brand-icon-wrapper">
            <FiLayers className="brand-icon" />
          </div>
          <div className="d-flex flex-column text-start">
            <span className="brand-text lh-1">
              File<span className="text-primary-gradient">Flow</span>
            </span>
            <span className="text-muted smaller fw-semibold" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>
              PRO CONVERTER
            </span>
          </div>
        </Link>

        {/* Live Engine Status Badge (Desktop) */}
        <div className="d-none d-xl-flex align-items-center ms-3">
          <div className="badge-pill-live">
            <span className="pulse-dot"></span>
            <span>Laravel Engine v2.0 • 8 Formats Active</span>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none p-2 rounded-3 bg-light"
          type="button"
          onClick={toggleNavbar}
          aria-controls="fileflowNavbar"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? <FiX size={24} className="text-dark" /> : <FiMenu size={24} className="text-dark" />}
        </button>

        {/* Navigation Links & Actions */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="fileflowNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link custom-nav-link" to="/" end onClick={closeNavbar}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link custom-nav-link" to="/convert" onClick={closeNavbar}>
                Convert
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link custom-nav-link" to="/compress" onClick={closeNavbar}>
                Compress
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link custom-nav-link" to="/about" onClick={closeNavbar}>
                About
              </NavLink>
            </li>
          </ul>

          <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 mt-3 mt-lg-0">
            <div className="d-flex d-xl-none align-items-center justify-content-center mb-2 mb-lg-0">
              <div className="badge-pill-live w-100 justify-content-center">
                <span className="pulse-dot"></span>
                <span>8 Formats Real Transcoding</span>
              </div>
            </div>
            <Link 
              to="/convert" 
              className="btn btn-primary-custom px-4 py-2 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
              onClick={closeNavbar}
            >
              <FiZap size={16} />
              <span>Convert Now</span>
              <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
