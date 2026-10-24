#!/usr/bin/env node
// Independent MCP stdio verification: performs the real initialize -> tools/list
// handshake against the registered `rea` server and prints the result.
import { spawn } from "node:child_process";

const proc = spawn("npx", ["-y", "rea-agents@6.7.0", "mcp"], {
  stdio: ["pipe", "pipe", "pipe"],
});

let buf = "";
const pending = new Map();
let stderr = "";

proc.stderr.on("data", (d) => (stderr += d.toString()));

proc.stdout.on("data", (chunk) => {
  buf += chunk.toString();
  let idx;
  while ((idx = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, idx).trim();
    buf = buf.slice(idx + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    if (msg.id !== undefined && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  }
});

function send(id, method, params = {}) {
  const payload = { jsonrpc: "2.0", id, method, params };
  proc.stdin.write(JSON.stringify(payload) + "\n");
  return new Promise((resolve, reject) => {
    pending.set(id, resolve);
    setTimeout(() => reject(new Error(`timeout waiting for ${method}`)), 90000);
  });
}

function notify(method, params = {}) {
  proc.stdin.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
}

const fail = (m) => { console.error("FAIL:", m); proc.kill("SIGKILL"); process.exit(1); };

setTimeout(() => fail("overall timeout"), 120000);

try {
  const init = await send(1, "initialize", {
    protocolVersion: "2025-06-18",
    capabilities: { roots: {} },
    clientInfo: { name: "antiuber-verify", version: "1.0.0" },
  });

  const info = init.result?.serverInfo ?? {};
  console.log("serverInfo      :", JSON.stringify(info));
  console.log("protocolVersion :", init.result?.protocolVersion);
  console.log("capabilities    :", JSON.stringify(init.result?.capabilities ?? {}));

  notify("notifications/initialized");

  const tools = await send(2, "tools/list", {});
  const list = tools.result?.tools ?? [];
  console.log("tools/list      :", list.length, "tools");

  const prompts = await send(3, "prompts/list", {});
  const plist = prompts.result?.prompts ?? [];
  console.log("prompts/list    :", plist.length, "prompts");
  console.log("sample tools    :", list.slice(0, 6).map((t) => t.name).join(", "));
  console.log("sample prompts  :", plist.map((p) => p.name).join(", "));

  const ok = info.name === "rea" && list.length > 0;
  console.log("STDERR bytes    :", stderr.length);
  if (!ok) fail("server identity or tool inventory did not match");
  console.log("\nRESULT: PASS — 'rea' responds over stdio with", list.length, "tools");
  proc.kill("SIGTERM");
  process.exit(0);
} catch (e) {
  fail(e.message);
}
