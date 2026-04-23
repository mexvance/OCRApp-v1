const STORAGE_KEY = 'ocr_scan_log';

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const saveEntry = ({ barcode, rawOCR, filteredOCR, similarity, rule }) => {
  const log = getEntries();
  const id = newId();
  log.push({
    id,
    timestamp: new Date().toISOString(),
    barcode: barcode ?? '',
    rawOCR: rawOCR ?? '',
    filteredOCR: filteredOCR ?? '',
    similarity: similarity ?? 0,
    rule: rule ?? '',
    disposition: null,
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  return id;
};

export const updateEntry = (id, updates) => {
  if (!id) return;
  const log = getEntries();
  const idx = log.findIndex((e) => e.id === id);
  if (idx !== -1) {
    log[idx] = { ...log[idx], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  }
};

export const getEntries = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const clearEntries = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const exportCSV = () => {
  const entries = getEntries();
  if (!entries.length) return;

  const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
  const headers = ['Timestamp', 'Rule Used', 'Barcode Input', 'Filtered OCR', 'Raw OCR', 'Similarity %', 'Disposition'];
  const rows = entries.map((e) => [
    q(e.timestamp),
    q(e.rule),
    q(e.barcode),
    q(e.filteredOCR),
    q(e.rawOCR),
    e.similarity != null ? e.similarity.toFixed(2) : '',
    q(e.disposition ?? ''),
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ocr-scan-log-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
