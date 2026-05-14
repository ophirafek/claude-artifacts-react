import path from "path";
import fs from "fs";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const ARTIFACTS_DIR = path.resolve(__dirname, "./artifacts");
const MAX_BYTES = 1024 * 1024;

function ensureDir() {
  if (!fs.existsSync(ARTIFACTS_DIR)) fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

function safeSlug(name) {
  return (
    String(name || "")
      .replace(/\.jsx$/i, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "artifact"
  );
}

function safeId(raw) {
  const cleaned = path.basename(String(raw || "")).replace(/[^a-zA-Z0-9._-]+/g, "");
  return cleaned || null;
}

function artifactDir(id) {
  const s = safeId(id);
  return s ? path.join(ARTIFACTS_DIR, s) : null;
}

function listVersions(dir) {
  return fs
    .readdirSync(dir)
    .map((f) => {
      const m = f.match(/^v(\d+)\.jsx$/);
      if (!m) return null;
      const full = path.join(dir, f);
      const s = fs.statSync(full);
      return { n: parseInt(m[1], 10), file: f, mtimeMs: s.mtimeMs, size: s.size };
    })
    .filter(Boolean)
    .sort((a, b) => a.n - b.n);
}

function readMeta(dir) {
  const p = path.join(dir, "meta.json");
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; }
}

function writeMeta(dir, meta) {
  fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify(meta, null, 2), "utf8");
}

function describeArtifact(id) {
  const dir = artifactDir(id);
  if (!dir || !fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return null;
  const versions = listVersions(dir);
  const meta = readMeta(dir) || {};
  const stat = fs.statSync(dir);
  const latest = versions[versions.length - 1];
  return {
    id,
    name: meta.name || id,
    createdAt: meta.createdAt || stat.birthtimeMs || stat.ctimeMs,
    updatedAt: latest ? latest.mtimeMs : stat.mtimeMs,
    currentVersion: latest ? latest.n : 0,
    versionCount: versions.length,
    versions: versions.map((v) => ({ n: v.n, createdAt: v.mtimeMs, size: v.size })),
  };
}

function listArtifacts() {
  ensureDir();
  return fs
    .readdirSync(ARTIFACTS_DIR)
    .map((entry) => {
      const full = path.join(ARTIFACTS_DIR, entry);
      if (!fs.statSync(full).isDirectory()) return null;
      return describeArtifact(entry);
    })
    .filter(Boolean)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > MAX_BYTES) {
        reject(new Error("Payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function send(res, status, body, type = "application/json") {
  res.statusCode = status;
  res.setHeader("Content-Type", type);
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}

function parseJson(raw) {
  try { return JSON.parse(raw); } catch { return null; }
}

function artifactsPlugin() {
  return {
    name: "artifacts-api",
    configureServer(server) {
      server.middlewares.use("/api/artifacts", async (req, res, next) => {
        try {
          const url = new URL(req.url, "http://x");
          const segs = url.pathname.split("/").filter(Boolean);

          // /api/artifacts
          if (segs.length === 0) {
            if (req.method === "GET") return send(res, 200, listArtifacts());
            if (req.method === "POST") {
              const payload = parseJson(await readBody(req));
              if (!payload || typeof payload.source !== "string" || !payload.source.trim()) {
                return send(res, 400, { error: "Missing source" });
              }
              ensureDir();
              const slug = safeSlug(payload.name || "artifact");
              const id = `${Date.now()}-${slug}`;
              const dir = path.join(ARTIFACTS_DIR, id);
              fs.mkdirSync(dir);
              fs.writeFileSync(path.join(dir, "v1.jsx"), payload.source, "utf8");
              writeMeta(dir, {
                id,
                name: (payload.name && String(payload.name).trim()) || slug,
                createdAt: Date.now(),
              });
              return send(res, 201, describeArtifact(id));
            }
            return next();
          }

          const id = segs[0];
          const dir = artifactDir(id);
          if (!dir) return send(res, 400, { error: "Bad id" });

          // /api/artifacts/:id
          if (segs.length === 1) {
            if (req.method === "GET") {
              const info = describeArtifact(id);
              if (!info) return send(res, 404, { error: "Not found" });
              return send(res, 200, info);
            }
            if (req.method === "PATCH") {
              if (!fs.existsSync(dir)) return send(res, 404, { error: "Not found" });
              const payload = parseJson(await readBody(req)) || {};
              const newName = String(payload.name || "").trim();
              if (!newName) return send(res, 400, { error: "Missing name" });
              const meta = readMeta(dir) || { id, createdAt: Date.now() };
              meta.name = newName;
              writeMeta(dir, meta);
              return send(res, 200, describeArtifact(id));
            }
            if (req.method === "DELETE") {
              if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
              return send(res, 204, "");
            }
            return next();
          }

          // /api/artifacts/:id/versions
          if (segs.length === 2 && segs[1] === "versions") {
            if (!fs.existsSync(dir)) return send(res, 404, { error: "Not found" });
            if (req.method === "POST") {
              const payload = parseJson(await readBody(req));
              if (!payload || typeof payload.source !== "string" || !payload.source.trim()) {
                return send(res, 400, { error: "Missing source" });
              }
              const versions = listVersions(dir);
              const n = versions.length ? versions[versions.length - 1].n + 1 : 1;
              fs.writeFileSync(path.join(dir, `v${n}.jsx`), payload.source, "utf8");
              return send(res, 201, { artifact: describeArtifact(id), version: n });
            }
            return next();
          }

          // /api/artifacts/:id/versions/:v
          if (segs.length === 3 && segs[1] === "versions") {
            const n = parseInt(segs[2], 10);
            if (!Number.isFinite(n) || n <= 0) return send(res, 400, { error: "Bad version" });
            const file = path.join(dir, `v${n}.jsx`);
            if (req.method === "GET") {
              if (!fs.existsSync(file)) return send(res, 404, { error: "Not found" });
              return send(res, 200, fs.readFileSync(file, "utf8"), "text/plain; charset=utf-8");
            }
            return next();
          }

          return next();
        } catch (err) {
          return send(res, 500, { error: String(err.message || err) });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), artifactsPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
