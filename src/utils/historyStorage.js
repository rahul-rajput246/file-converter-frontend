const STORAGE_KEY = 'fileflow_recent_files';

/**
 * Retrieve saved conversion/compression history from localStorage.
 */
export function getStoredRecentFiles() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Could not read recent files from localStorage', err);
    return [];
  }
}

/**
 * Add a new converted/compressed file entry to localStorage history.
 */
export function saveRecentFile(entry) {
  if (typeof window === 'undefined') return [];
  try {
    const current = getStoredRecentFiles();
    // Exclude duplicates by ID or downloadUrl
    const filtered = current.filter(
      (item) => item.id !== entry.id && (!entry.downloadUrl || item.downloadUrl !== entry.downloadUrl)
    );
    const updated = [entry, ...filtered].slice(0, 15); // keep latest 15
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('fileflow_history_changed', { detail: updated }));
    return updated;
  } catch (err) {
    console.warn('Could not save recent file to localStorage', err);
    return [];
  }
}

/**
 * Permanently clear recent files history from localStorage.
 */
export function clearStoredRecentFiles() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('fileflow_history_changed', { detail: [] }));
  } catch (err) {
    console.warn('Could not clear recent files from localStorage', err);
  }
}
