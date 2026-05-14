import React from "react";
import { Trash2, FileCode } from "lucide-react";

export default function ArtifactList({ items, selectedId, onSelect, onDelete }) {
  if (!items.length) {
    return (
      <div className="text-xs text-gray-500 px-3 py-6 text-center">
        No artifacts yet.
      </div>
    );
  }
  return (
    <ul className="flex flex-col">
      {items.map((it) => {
        const active = it.id === selectedId;
        return (
          <li key={it.id}>
            <div
              className={`group flex items-center justify-between gap-2 px-3 py-2 cursor-pointer border-l-2 ${
                active
                  ? "bg-blue-50 border-blue-600"
                  : "border-transparent hover:bg-gray-50"
              }`}
              onClick={() => onSelect(it.id)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileCode size={14} className="text-gray-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm text-gray-900 truncate">{it.name}</div>
                  <div className="text-[10px] text-gray-500">
                    v{it.currentVersion} · {it.versionCount} version
                    {it.versionCount === 1 ? "" : "s"} ·{" "}
                    {new Date(it.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete "${it.name}" and all its versions?`)) {
                    onDelete(it.id);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 p-1"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
