import React, { useEffect, useState } from "react";
import { loadArtifact } from "../lib/runArtifact";
import ErrorBoundary from "./ErrorBoundary";

export default function ArtifactRenderer({ id, version }) {
  const [state, setState] = useState({ status: "idle", Component: null, error: null });

  useEffect(() => {
    if (!id || !version) {
      setState({ status: "idle", Component: null, error: null });
      return;
    }
    let cancelled = false;
    setState({ status: "loading", Component: null, error: null });
    loadArtifact(id, version)
      .then(({ Component }) => {
        if (!cancelled) setState({ status: "ready", Component, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ status: "error", Component: null, error: err });
      });
    return () => {
      cancelled = true;
    };
  }, [id, version]);

  if (!id) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
        Create or select an artifact to get started.
      </div>
    );
  }
  if (state.status === "loading") {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
        Compiling artifact...
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div className="m-6 p-4 border border-red-300 bg-red-50 text-red-900 rounded-md text-sm font-mono whitespace-pre-wrap">
        <div className="font-semibold mb-2">Failed to load artifact</div>
        {String(state.error?.message || state.error)}
      </div>
    );
  }
  if (state.status !== "ready" || !state.Component) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
        Preparing artifact...
      </div>
    );
  }

  const { Component } = state;
  return (
    <ErrorBoundary resetKey={`${id}:${version}`}>
      <Component />
    </ErrorBoundary>
  );
}
