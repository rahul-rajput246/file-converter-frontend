import { useState } from 'react';
import { FiClock, FiDownload, FiCheckCircle, FiFile, FiTrash2 } from 'react-icons/fi';
import { downloadFile } from '../services/fileService';

const INITIAL_RECENT_FILES = [
  {
    id: 'f-1',
    file: 'product-showcase.png',
    conversion: 'PNG → JPG',
    size: '2.4 MB',
    status: 'Completed',
    date: '10 mins ago'
  },
  {
    id: 'f-2',
    file: 'camera-raw-photo.jpg',
    conversion: 'JPG → WEBP',
    size: '4.1 MB',
    status: 'Completed',
    date: '25 mins ago'
  },
  {
    id: 'f-3',
    file: 'sample-image.png',
    conversion: 'Compress (Medium)',
    size: '1.2 MB',
    status: 'Completed',
    date: '1 hour ago'
  }
];

function RecentFiles({ recentList = INITIAL_RECENT_FILES }) {
  const [cleared, setCleared] = useState(false);
  const files = cleared ? [] : recentList;

  const handleDownload = (row) => {
    downloadFile(row.downloadUrl || row.filename || row.id);
  };

  const handleClearHistory = () => {
    setCleared(true);
  };

  return (
    <div className="card custom-card p-4 shadow-sm mb-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
        <div>
          <h4 className="card-title h5 mb-1 fw-bold d-flex align-items-center gap-2">
            <FiClock className="text-primary" />
            <span>Recent Files</span>
          </h4>
          <p className="text-muted small mb-0">History of your recently converted and compressed files</p>
        </div>

        {files.length > 0 && (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 self-start"
            onClick={handleClearHistory}
          >
            <FiTrash2 size={14} />
            <span>Clear List</span>
          </button>
        )}
      </div>

      {files.length === 0 ? (
        <div className="text-center py-4 text-muted border rounded-3 bg-light-subtle">
          <FiFile size={32} className="opacity-50 mb-2" />
          <p className="small mb-0">No recent files found. Start converting above!</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 custom-table">
            <thead className="table-light text-uppercase small">
              <tr>
                <th scope="col" className="py-3">File</th>
                <th scope="col" className="py-3">Conversion</th>
                <th scope="col" className="py-3">Size</th>
                <th scope="col" className="py-3">Status</th>
                <th scope="col" className="py-3 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {files.map((row) => (
                <tr key={row.id}>
                  <td className="fw-semibold text-dark">
                    <div className="d-flex align-items-center gap-2">
                      <div className="table-file-icon p-2 bg-light rounded text-primary">
                        <FiFile size={16} />
                      </div>
                      <span className="text-truncate" style={{ maxWidth: '180px' }} title={row.file}>
                        {row.file}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      {row.conversion}
                    </span>
                  </td>
                  <td className="text-muted small">{row.size}</td>
                  <td>
                    <span className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1 px-2 py-1">
                      <FiCheckCircle size={12} />
                      <span>{row.status}</span>
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 px-3"
                      onClick={() => handleDownload(row)}
                    >
                      <FiDownload size={14} />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentFiles;
