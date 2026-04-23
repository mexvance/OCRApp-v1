import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getEntries, clearEntries, exportCSV } from '../Services/logService';
import './ScanLog.css';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const ScanLog = () => {
  const [entries, setEntries] = useState(getEntries);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));
  const paginated = entries.slice((page - 1) * pageSize, page * pageSize);

  const handleClear = () => {
    if (window.confirm('Clear all scan log entries?')) {
      clearEntries();
      setEntries([]);
      setPage(1);
    }
  };

  const handlePageSize = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="scan-log-page">
      <div className="scan-log-header">
        <h2>Scan Log ({entries.length} entries)</h2>
              </div>
        <button onClick={exportCSV} disabled={!entries.length}>Export CSV</button>
        {/* <button onClick={handleClear} disabled={!entries.length}>Clear Log</button> */}


      {entries.length === 0 ? (
        <p>No scan entries yet.</p>
      ) : (
        <>
          <div className="table-scroll">
            <table className="scan-table">
              <thead>
                <tr>
                  {['Barcode Input', 'Filtered Text', 'Timestamp', 'Rule', 'Raw OCR', 'Similarity %', 'Disposition'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((e, i) => {
                  const sim = e.similarity ?? 0;
                  const rowClass = sim >= 100 ? 'row-success' : sim >= 75 ? 'row-warning' : 'row-error';
                  return (
                    <tr key={i} className={rowClass}>
                  
                      <td>{e.barcode}</td>
                      <td className="truncate">{e.filteredOCR}</td>
                      <td className="nowrap">{
                          new Date(e.timestamp).toLocaleString('en-US', {
                            month: 'numeric',
                            day: 'numeric',
                            year: '2-digit',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: false,
                          })}</td>
                      <td>{e.rule}</td>
                      <td className="truncate">{e.rawOCR}</td>
                      <td className="align-right">{sim.toFixed(2)}%</td>
                      <td className={`disposition disposition-${e.disposition ?? 'pending'}`}>
                        {e.disposition ?? '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button onClick={() => setPage(1)} disabled={page === 1}>&laquo;</button>
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>&lsaquo;</button>

            <span className="pagination-info">
              Page {page} of {totalPages}
            </span>

            <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>&rsaquo;</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>&raquo;</button>

            <label className="pagination-size">
              Rows:
              <select value={pageSize} onChange={handlePageSize}>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default ScanLog;
