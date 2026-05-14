import React, { useRef, useState } from "react";
import { FileUp, Save, X } from "lucide-react";

export default function ArtifactEditor({
  mode,
  initialName = "",
  initialSource = "",
  busyLabel,
  onCancel,
  onSave,
}) {
  const [name, setName] = useState(initialName);
  const [source, setSource] = useState(initialSource);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const title =
    mode === "new" ? "New artifact" : `New version of "${initialName}"`;

  const submit = async () => {
    if (!source.trim()) {
      setError("Paste some JSX first");
      return;
    }
    if (mode === "new" && !name.trim()) {
      setError("Give it a name");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSave({ name: name.trim(), source });
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setBusy(false);
    }
  };

  const loadFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setError("File too large (1 MB max)");
      return;
    }
    const text = await file.text();
    setSource(text);
    if (mode === "new" && !name.trim()) {
      setName(file.name.replace(/\.jsx$/i, ""));
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          <div className="text-[11px] text-gray-500">
            {mode === "new"
              ? "Paste the JSX and give it a name"
              : "Saving will append a new version"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            <FileUp size={14} />
            Load from file...
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".jsx,text/jsx,text/plain"
            onChange={loadFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            <X size={14} />
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <Save size={14} />
            {busy ? busyLabel || "Saving..." : mode === "new" ? "Create" : "Save new version"}
          </button>
        </div>
      </div>

      <div className="px-5 py-3 border-b border-gray-200 flex items-center gap-3">
        <label className="text-xs font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="my-artifact"
          disabled={mode !== "new"}
          className="flex-1 max-w-md text-sm px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
        />
        {mode !== "new" && (
          <span className="text-[11px] text-gray-500">
            Rename from the header above
          </span>
        )}
      </div>

      {error && (
        <div className="mx-5 mt-3 px-3 py-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      <textarea
        value={source}
        onChange={(e) => setSource(e.target.value)}
        spellCheck={false}
        placeholder="// paste your JSX here..."
        className="flex-1 m-5 mt-3 p-3 border border-gray-300 rounded-md text-xs font-mono leading-relaxed text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    </div>
  );
}
