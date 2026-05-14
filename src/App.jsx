import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { Plus } from "lucide-react";
import ArtifactList from "./components/ArtifactList";
import ArtifactRenderer from "./components/ArtifactRenderer";
import ArtifactHeader from "./components/ArtifactHeader";
import ArtifactEditor from "./components/ArtifactEditor";
import { clearArtifactCache, fetchArtifactSource } from "./lib/runArtifact";

function App() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [mode, setMode] = useState("view"); // 'view' | 'new' | 'edit'
  const [editorPrefill, setEditorPrefill] = useState(null);
  const [listError, setListError] = useState(null);

  const selected = useMemo(
    () => items.find((it) => it.id === selectedId) || null,
    [items, selectedId],
  );

  const refresh = useCallback(async (preferId, preferVersion) => {
    try {
      const res = await fetch("/api/artifacts");
      if (!res.ok) throw new Error(`List failed (${res.status})`);
      const list = await res.json();
      setItems(list);
      setListError(null);
      setSelectedId((current) => {
        const nextId =
          (preferId && list.some((i) => i.id === preferId) && preferId) ||
          (current && list.some((i) => i.id === current) && current) ||
          list[0]?.id ||
          null;
        if (nextId) {
          const a = list.find((i) => i.id === nextId);
          setSelectedVersion((v) => {
            if (preferId === nextId && preferVersion) return preferVersion;
            if (v && a.versions.some((x) => x.n === v)) return v;
            return a.currentVersion;
          });
        } else {
          setSelectedVersion(null);
        }
        return nextId;
      });
    } catch (err) {
      setListError(String(err.message || err));
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // When the selected artifact changes, pin to its current version
  useEffect(() => {
    if (!selected) return;
    setSelectedVersion((v) =>
      v && selected.versions.some((x) => x.n === v) ? v : selected.currentVersion,
    );
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    setMode("view");
  }, []);

  const handleNew = useCallback(() => {
    setEditorPrefill({ name: "", source: "" });
    setMode("new");
  }, []);

  const handleEdit = useCallback(async () => {
    if (!selected || !selectedVersion) return;
    try {
      const source = await fetchArtifactSource(selected.id, selectedVersion);
      setEditorPrefill({ name: selected.name, source });
      setMode("edit");
    } catch (err) {
      setListError(String(err.message || err));
    }
  }, [selected, selectedVersion]);

  const handleCancelEditor = useCallback(() => {
    setMode("view");
    setEditorPrefill(null);
  }, []);

  const handleSaveEditor = useCallback(
    async ({ name, source }) => {
      if (mode === "new") {
        const res = await fetch("/api/artifacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, source }),
        });
        if (!res.ok) throw new Error(`Create failed (${res.status})`);
        const created = await res.json();
        clearArtifactCache(created.id);
        setMode("view");
        setEditorPrefill(null);
        await refresh(created.id, created.currentVersion);
      } else if (mode === "edit" && selected) {
        const res = await fetch(
          `/api/artifacts/${encodeURIComponent(selected.id)}/versions`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ source }),
          },
        );
        if (!res.ok) throw new Error(`Save failed (${res.status})`);
        const { artifact, version } = await res.json();
        clearArtifactCache(artifact.id);
        setMode("view");
        setEditorPrefill(null);
        await refresh(artifact.id, version);
      }
    },
    [mode, selected, refresh],
  );

  const handleRename = useCallback(
    async (newName) => {
      if (!selected) return;
      const res = await fetch(`/api/artifacts/${encodeURIComponent(selected.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error(`Rename failed (${res.status})`);
      await refresh(selected.id, selectedVersion);
    },
    [selected, selectedVersion, refresh],
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        await fetch(`/api/artifacts/${encodeURIComponent(id)}`, { method: "DELETE" });
        clearArtifactCache(id);
        if (selectedId === id) {
          setSelectedId(null);
          setSelectedVersion(null);
          setMode("view");
        }
        await refresh();
      } catch (err) {
        setListError(String(err.message || err));
      }
    },
    [selectedId, refresh],
  );

  return (
    <div className="h-screen w-screen flex bg-gray-50">
      <aside className="w-72 shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="text-sm font-semibold text-gray-900">Artifacts</div>
          <div className="text-[11px] text-gray-500">Pasted or uploaded .jsx</div>
        </div>
        <div className="px-3 py-3 border-b border-gray-200">
          <button
            type="button"
            onClick={handleNew}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus size={14} />
            New artifact
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {listError ? (
            <div className="m-3 p-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
              {listError}
            </div>
          ) : (
            <ArtifactList
              items={items}
              selectedId={selectedId}
              onSelect={handleSelect}
              onDelete={handleDelete}
            />
          )}
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        {mode === "new" || mode === "edit" ? (
          <ArtifactEditor
            mode={mode}
            initialName={editorPrefill?.name || ""}
            initialSource={editorPrefill?.source || ""}
            onCancel={handleCancelEditor}
            onSave={handleSaveEditor}
          />
        ) : selected && selectedVersion ? (
          <>
            <ArtifactHeader
              artifact={selected}
              selectedVersion={selectedVersion}
              onSelectVersion={setSelectedVersion}
              onRename={handleRename}
              onEdit={handleEdit}
              onDelete={() => {
                if (confirm(`Delete "${selected.name}" and all its versions?`)) {
                  handleDelete(selected.id);
                }
              }}
            />
            <div className="flex-1 overflow-auto">
              <ArtifactRenderer id={selected.id} version={selectedVersion} />
            </div>
          </>
        ) : (
          <ArtifactRenderer id={null} />
        )}
      </main>
    </div>
  );
}

export default App;
