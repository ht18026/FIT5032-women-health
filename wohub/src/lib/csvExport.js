// src/lib/csvExport.js
function esc(value) {
  if (value === null || value === undefined) return "";
  let s = String(value);
  s = s.replace(/"/g, '""');
  if (/[",\n\r]/.test(s)) s = `"${s}"`;
  return s;
}

export function toCSV(rows, headers) {
  if (!Array.isArray(rows)) rows = [];
  // headers: [{ key:'title', label:'Title' }, ...]
  const cols = headers?.length
    ? headers
    : Object.keys(rows[0] || {}).map(k => ({ key: k, label: k }));

  const head = cols.map(c => esc(c.label ?? c.key)).join(",");
  const lines = rows.map(r => cols.map(c => esc(r[c.key])).join(","));
  return [head, ...lines].join("\r\n");
}

export function downloadCSV(filename, rows, headers) {
  const csv = toCSV(rows, headers);
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function dateStamp() {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
