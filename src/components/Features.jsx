import { FiZap, FiMinimize2, FiMousePointer, FiShield } from 'react-icons/fi';

const FEATURES_DATA = [
  {
    icon: <FiZap size={28} className="text-primary" />,
    iconBg: 'bg-primary-subtle',
    title: 'Fast Conversion',
    description: 'Convert supported files in seconds with optimized multi-threaded background processing engines.'
  },
  {
    icon: <FiMinimize2 size={28} className="text-success" />,
    iconBg: 'bg-success-subtle',
    title: 'File Compression',
    description: 'Reduce file size by up to 80% while retaining pixel-perfect clarity and document formatting.'
  },
  {
    icon: <FiMousePointer size={28} className="text-warning" />,
    iconBg: 'bg-warning-subtle',
    title: 'Easy to Use',
    description: 'Simple drag-and-drop interface designed for efficiency with no steep learning curves or complex software.'
  },
  {
    icon: <FiShield size={28} className="text-info" />,
    iconBg: 'bg-info-subtle',
    title: 'Secure Processing',
    description: 'Keep user files protected during transit with TLS encryption and automatic server purge after 2 hours.'
  }
];

function Features() {
  return (
    <section className="features-section py-5">
      <div className="text-center mb-5">
        <span className="badge-pill mb-2">Why Choose FileFlow</span>
        <h2 className="section-title fw-bold">Engineered for Speed &amp; Simplicity</h2>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Everything you need to convert, compress, and organize your media assets with complete peace of mind.
        </p>
      </div>

      <div className="row g-4">
        {FEATURES_DATA.map((feature, idx) => (
          <div className="col-12 col-sm-6 col-lg-3" key={idx}>
            <div className="card feature-card h-100 p-4 border-0 rounded-4 shadow-sm text-start">
              <div className={`feature-icon-wrapper ${feature.iconBg} p-3 rounded-3 mb-3 d-inline-flex align-items-center justify-content-center`}>
                {feature.icon}
              </div>
              <h5 className="fw-bold mb-2 text-dark">{feature.title}</h5>
              <p className="text-muted small mb-0 lh-base">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
