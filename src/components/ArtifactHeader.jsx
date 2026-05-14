import React, { useEffect, useRef, useState } from "react";
import { Edit3, Check, X, History, Pencil, Trash2 } from "lucide-react";

export default function ArtifactHeader({
  artifact,
  selectedVersion,
  onSelectVersion,
  onRename,
  onEdit,
  onDelete,
}) {
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(artifact.name);
  const inputRef = useRef(null);

  useEffect(() => {
    setNameDraft(artifact.name);
  }, [artifact.name, artifact.id]);

  useEffect(() => {
    if (editingName) inputRef.current?.focus();
  }, [editingName]);

  const commitRename = async () => {
    const next = nameDraft.trim();
    setEditingName(false);
    if (!next || next === artifact.name) {
      setNameDraft(artifact.name);
      return;
    }
    try {
      await onRename(next);
    } catch {
      setNameDraft(artifact.name);
    }
  };

  return (
    <div className="px-5 py-3 border-b border-gray-200 bg-white flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 min-w-0">
        {editingName ? (
          <input
            ref={inputRef}
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") {
                setNameDraft(artifact.name);
                setEditingName(false);
              }
            }}
            className="text-sm font-semibold text-gray-900 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <>
            <h1 className="text-sm font-semibold text-gray-900 truncate">
              {artifact.name}
            </h1>
            <button
              type="button"
              onClick={() => setEditingName(true)}
              className="text-gray-400 hover:text-gray-700 p-1"
              title="Rename"
            >
              <Pencil size={13} />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <History size={13} className="text-gray-500" />
        <select
          value={selectedVersion}
          onChange={(e) => onSelectVersion(parseInt(e.target.value, 10))}
          className="text-xs px-2 py-1 border border-gray-300 rounded-md bg-white"
        >
          {artifact.versions.map((v) => (
            <option key={v.n} value={v.n}>
              v{v.n}
              {v.n === artifact.currentVersion ? " (latest)" : ""}
              {" — "}
              {new Date(v.createdAt).toLocaleString()}
            </option>
          ))}
        </select>
        {selectedVersion !== artifact.currentVersion && (
          <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            viewing older version
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          title="Open editor pre-filled with this version's source; Save creates a new version"
        >
          <Edit3 size={13} />
          {selectedVersion === artifact.currentVersion
            ? "Edit / new version"
            : `Edit from v${selectedVersion} (creates new version)`}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-red-200 bg-white text-red-700 hover:bg-red-50"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
}
