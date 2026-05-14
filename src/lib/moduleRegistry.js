import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactJsxRuntime from "react/jsx-runtime";
import * as ReactJsxDevRuntime from "react/jsx-dev-runtime";
import * as LucideReact from "lucide-react";
import * as Recharts from "recharts";
import * as Clsx from "clsx";
import * as TailwindMerge from "tailwind-merge";
import * as ClassVarianceAuthority from "class-variance-authority";
import * as DateFns from "date-fns";
import * as ReactHookForm from "react-hook-form";
import * as HookformResolvers from "@hookform/resolvers/zod";
import * as Zod from "zod";

const shadcnModules = import.meta.glob("../components/ui/*.{js,jsx}", { eager: true });
const libModules = import.meta.glob("../lib/*.{js,jsx}", { eager: true });

const aliasMap = {};
for (const [filePath, mod] of Object.entries(shadcnModules)) {
  const name = filePath.replace(/^.*\/components\/ui\//, "").replace(/\.(js|jsx)$/, "");
  aliasMap[`@/components/ui/${name}`] = mod;
}
for (const [filePath, mod] of Object.entries(libModules)) {
  const name = filePath.replace(/^.*\/lib\//, "").replace(/\.(js|jsx)$/, "");
  aliasMap[`@/lib/${name}`] = mod;
}

const registry = {
  react: React,
  "react-dom": ReactDOM,
  "react/jsx-runtime": ReactJsxRuntime,
  "react/jsx-dev-runtime": ReactJsxDevRuntime,
  "lucide-react": LucideReact,
  recharts: Recharts,
  clsx: Clsx,
  "tailwind-merge": TailwindMerge,
  "class-variance-authority": ClassVarianceAuthority,
  "date-fns": DateFns,
  "react-hook-form": ReactHookForm,
  "@hookform/resolvers/zod": HookformResolvers,
  zod: Zod,
  ...aliasMap,
};

export function resolveModule(specifier) {
  if (specifier in registry) return registry[specifier];
  return null;
}

export function listRegisteredSpecifiers() {
  return Object.keys(registry).sort();
}
