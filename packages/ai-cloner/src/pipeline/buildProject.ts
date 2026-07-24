import { spawn } from "node:child_process";

function run(command: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (d) => (output += d.toString()));
    child.stderr.on("data", (d) => (output += d.toString()));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}\n${output.slice(-4000)}`));
    });
  });
}

/** Step 20 (build): actually installs and builds the generated Next.js project, not just writes files. */
export async function buildNextProject(nextAppDir: string): Promise<void> {
  await run("npm", ["install"], nextAppDir);
  await run("npm", ["run", "build"], nextAppDir);
}
