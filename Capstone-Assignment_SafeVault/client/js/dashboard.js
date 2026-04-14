// SafeVault Dashboard Utilities
// Main logic is embedded in dashboard.html for single-file simplicity
// This file can be used for additional utilities

const SVUtils = {
  formatBytes: (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  },
  formatDate: (date) => new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  }),
  scorePassword: (pwd) => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (pwd.length >= 12) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s; // 0-5
  }
};

window.SVUtils = SVUtils;
