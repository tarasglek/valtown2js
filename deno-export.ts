import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";
import { alias } from "https://esm.town/v/neverstew/alias";
export const val = await alias({
  username: "taras",
  valName: "scrape",
  // for private vals, pass your val town api token
  token: Deno.env.get("valtown"),
});

console.log(val);
const code = val.code;

// Generate a unique temporary directory for the TypeScript source code
const tmpDir = await Deno.makeTempDir();
const tmpFileName = `${tmpDir}/${val.name}.ts`;
await Deno.writeTextFile(tmpFileName, code);

// Ensure the npm directory is empty before building
await emptyDir("./npm");

// Use dnt to build the Node package
await build({
  entryPoints: [tmpFileName],
  outDir: "./npm",
  packageManager: "pnpm",
  shims: {
    deno: true,
  },
  mappings: {
    "https://esm.sh/linkedom": {
      name: "linkedom",
      version: "^0.16.8"
    },
  },
  package: {
    name: val.name,
    version: "1.0.0",
    description: "Your package description.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/username/repo.git",
    },
    bugs: {
      url: "https://github.com/username/repo/issues",
    },
    devDependencies: {
      "@types/turndown": "^5.0.4",
    },
  },
});

console.log("Build successful. Node package is in ./npm");

// Cleanup: Remove the temporary directory
await Deno.remove(tmpDir, { recursive: true }).catch((error) => {
  console.error("Failed to remove temporary directory:", error);
});
