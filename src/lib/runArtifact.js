import { resolveModule } from "./moduleRegistry";

let babelPromise = null;
function getBabel() {
  if (!babelPromise) babelPromise = import("@babel/standalone");
  return babelPromise;
}

const componentCache = new Map();

function key(id, version) {
  return `${id}:${version}`;
}

export function clearArtifactCache(id) {
  if (!id) {
    componentCache.clear();
    return;
  }
  for (const k of Array.from(componentCache.keys())) {
    if (k.startsWith(`${id}:`)) componentCache.delete(k);
  }
}

export async function compileArtifact(source) {
  const babel = await getBabel();
  const { code } = babel.transform(source, {
    presets: [
      ["env", { modules: "cjs", targets: { esmodules: true } }],
      ["react", { runtime: "automatic" }],
    ],
    filename: "artifact.jsx",
    sourceMaps: false,
    compact: false,
  });

  const require = (specifier) => {
    const mod = resolveModule(specifier);
    if (!mod) {
      throw new Error(
        `Artifact import not registered: "${specifier}". ` +
          `Add it to src/lib/moduleRegistry.js (and run npm install if needed).`,
      );
    }
    return mod;
  };

  const module = { exports: {} };
  const fn = new Function("require", "module", "exports", code);
  fn(require, module, module.exports);

  const exported = module.exports;
  const Component =
    (exported && exported.default) ||
    (typeof exported === "function" ? exported : null);

  if (!Component) {
    throw new Error(
      "Artifact has no default export. Expected `export default function ...` or `export default <Component>`.",
    );
  }
  return Component;
}

export async function fetchArtifactSource(id, version) {
  const res = await fetch(
    `/api/artifacts/${encodeURIComponent(id)}/versions/${encodeURIComponent(version)}`,
  );
  if (!res.ok) throw new Error(`Failed to fetch artifact source (${res.status})`);
  return res.text();
}

export async function loadArtifact(id, version) {
  const k = key(id, version);
  if (componentCache.has(k)) return componentCache.get(k);
  const source = await fetchArtifactSource(id, version);
  const Component = await compileArtifact(source);
  const entry = { Component, source };
  componentCache.set(k, entry);
  return entry;
}
