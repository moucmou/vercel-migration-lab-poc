"use client";

import { useState } from "react";

type RunState = {
  label: string;
  status: "idle" | "loading" | "success" | "error";
  output: string;
};

const tests = [
  {
    label: "Node Function",
    path: "/api/health",
    description: "GET · 读取运行时、地域与部署元数据",
    method: "GET",
  },
  {
    label: "JSON Echo",
    path: "/api/echo",
    description: "POST · 验证请求体解析与响应头",
    method: "POST",
  },
  {
    label: "Legacy Edge",
    path: "/api/edge",
    description: "GET · Next 16 已弃用，仅做兼容观察",
    method: "GET",
  },
  {
    label: "Cron 防护",
    path: "/api/cron/heartbeat",
    description: "GET · 未携带密钥时应被拒绝",
    method: "GET",
  },
] as const;

const initialState: RunState = {
  label: "",
  status: "idle",
  output:
    "点击任意测试，结果会显示在这里。生产环境请用同一套探针分别请求 Vercel 与腾讯云。",
};

export function ApiLab() {
  const [state, setState] = useState<RunState>(initialState);

  async function runTest(test: (typeof tests)[number]) {
    setState({
      label: test.path,
      status: "loading",
      output: `requesting ${test.path} ...`,
    });

    try {
      const response = await fetch(test.path, {
        method: test.method,
        cache: "no-store",
        headers:
          test.method === "POST"
            ? { "content-type": "application/json" }
            : undefined,
        body:
          test.method === "POST"
            ? JSON.stringify({
                source: "migration-lab",
                message: "hello from the browser",
                at: new Date().toISOString(),
              })
            : undefined,
      });

      const text = await response.text();
      let body = text;

      try {
        body = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // Keep the raw response when the endpoint does not return JSON.
      }

      setState({
        label: test.path,
        status: response.ok ? "success" : "error",
        output: `HTTP ${response.status}\n\n${body}`,
      });
    } catch (error) {
      setState({
        label: test.path,
        status: "error",
        output:
          error instanceof Error ? error.message : "Unknown network error",
      });
    }
  }

  return (
    <div className="api-stack">
      {tests.map((test) => (
        <div className="api-test" key={test.path}>
          <div>
            <code>{test.path}</code>
            <p>
              {test.label} · {test.description}
            </p>
          </div>
          <button
            className="test-button"
            type="button"
            disabled={state.status === "loading"}
            onClick={() => runTest(test)}
          >
            {state.status === "loading" && state.label === test.path
              ? "请求中"
              : "执行"}
          </button>
        </div>
      ))}
      <pre
        className={`api-result ${
          state.status === "idle"
            ? "result-idle"
            : state.status === "error"
              ? "result-error"
              : ""
        }`}
      >
        {state.output}
      </pre>
    </div>
  );
}
