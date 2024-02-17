#!/usr/bin/env -S deno run -A
import { alias } from "https://esm.town/v/neverstew/alias?v=5";
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

type ValMeta = { username: string; valName: string; }

/**
 * Attempts to execute a function (synchronous or asynchronous), captures any
 * thrown error, and allows for immediate error handling through an optional
 * provided error handler function. If no error handler is provided, logs the
 * error and exits.
 * @param fn The function to execute. Can be async.
 * @param errorHandler (Optional) A function to handle errors, if any.
 * @returns The result of the function if successful, or null if an error occurred.
 */
export async function tryFn<T>(
  fn: () => Promise<T> | T,
  errorHandler: (error: Error) => void = defaultErrorHandler
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    errorHandler(error as Error);
    Deno.exit(1);
  }
}

function defaultErrorHandler(error: Error): void {
  console.error(`Error: ${error.message}`);
}

function parseValTownURL(url: string): ValMeta {
  const parts = new URL(url).pathname.split('/').filter(p => p);
  if (parts.length === 3 && parts[0] === 'v') {
    return { username: parts[1], valName: parts[2] };
  }
  throw new Error('Invalid URL format');
}

if (Deno.args.length !== 1) {
  console.error("Usage: <ValTownURL>");
  Deno.exit(1);
}

const cfg = {
  ...await tryFn(() => parseValTownURL(Deno.args[0])),
  token: await tryFn(() => {
    const valtown_token = Deno.env.get("VALTOWN_TOKEN");
    if (!valtown_token)
      throw new Error("Please set env var VALTOWN_TOKEN")
    return valtown_token;
  }),
};
console.log(cfg);
const val = await tryFn(async () => await alias(
  cfg
));

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
