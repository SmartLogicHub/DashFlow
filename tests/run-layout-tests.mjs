import esbuild from "esbuild";
import { spawnSync } from "node:child_process";
import { rm } from "node:fs/promises";

const outfile = ".dashflow-layout-tests.mjs";

try {
  await esbuild.build({
    entryPoints: ["tests/layout.test.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node22",
    outfile,
    logLevel: "warning",
  });

  const result = spawnSync(process.execPath, ["--test", outfile], {
    stdio: "inherit",
  });

  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  await rm(outfile, { force: true });
}
