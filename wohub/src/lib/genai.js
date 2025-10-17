export async function genaiText(payload) {
  const url = import.meta.env.VITE_FN_GENAI_TEXT;
  if (!url) throw new Error("VITE_FN_GENAI_TEXT not set");
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.ok) throw new Error(j.error || r.statusText);
  return j; // { ok, text, model, usage }
}
