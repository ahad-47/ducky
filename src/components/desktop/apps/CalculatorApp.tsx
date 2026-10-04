"use client";

import { useRef, useState } from "react";
import { evaluate, formatNumber } from "@/components/desktop/calc";

type Key = { label: string; insert?: string; action?: "clear" | "back" | "equals" | "square" | "negate"; kind?: "op" | "fn" | "eq" };

const keys: Key[] = [
  { label: "7" }, { label: "8" }, { label: "9" }, { label: "÷", insert: "÷", kind: "op" }, { label: "⌫", action: "back", kind: "fn" }, { label: "C", action: "clear", kind: "fn" },
  { label: "4" }, { label: "5" }, { label: "6" }, { label: "×", insert: "×", kind: "op" }, { label: "(", kind: "fn" }, { label: ")", kind: "fn" },
  { label: "1" }, { label: "2" }, { label: "3" }, { label: "−", insert: "−", kind: "op" }, { label: "x²", action: "square", kind: "fn" }, { label: "√", insert: "√(", kind: "fn" },
  { label: "0" }, { label: "." }, { label: "%", kind: "fn" }, { label: "+", insert: "+", kind: "op" }, { label: "±", action: "negate", kind: "fn" }, { label: "=", action: "equals", kind: "eq" },
];

export function CalculatorApp() {
  const [expr, setExpr] = useState("");
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  let preview = "";
  if (expr.trim()) {
    try {
      preview = formatNumber(evaluate(expr));
    } catch {
      preview = "";
    }
  }

  function equals() {
    if (!expr.trim()) return;
    let result: string;
    try {
      result = formatNumber(evaluate(expr));
    } catch {
      result = "Error";
    }
    setHistory((h) => [...h.slice(-30), { expr, result }]);
    setExpr(result === "Error" ? "" : result);
    setJustEvaluated(true);
  }

  function press(k: Key) {
    inputRef.current?.focus();
    if (k.action === "clear") {
      setExpr("");
      setJustEvaluated(false);
      return;
    }
    if (k.action === "back") {
      setExpr((e) => e.slice(0, -1));
      setJustEvaluated(false);
      return;
    }
    if (k.action === "equals") return equals();
    if (k.action === "square") {
      setExpr((e) => (e ? `(${e})^2` : e));
      setJustEvaluated(false);
      return;
    }
    if (k.action === "negate") {
      setExpr((e) => (e.startsWith("−(") && e.endsWith(")") ? e.slice(2, -1) : e ? `−(${e})` : "−"));
      setJustEvaluated(false);
      return;
    }
    const text = k.insert ?? k.label;
    const isDigit = /^[0-9.(√]/.test(text);
    setExpr((e) => (justEvaluated && isDigit ? text : e + text));
    setJustEvaluated(false);
  }

  return (
    <div className="flex h-full flex-col bg-[var(--os-surface)] p-3">
      <div className="mb-2 min-h-0 flex-1 overflow-y-auto rounded-lg bg-black/20 px-3 py-2 font-[family-name:var(--font-mono)] text-[12px] text-[var(--os-muted)]">
        {history.length === 0 ? (
          <p className="pt-1">History appears here. Click an entry to reuse it.</p>
        ) : (
          history.map((h, i) => (
            <button
              key={i}
              type="button"
              className="block w-full truncate rounded px-1 py-0.5 text-right hover:bg-white/5"
              onClick={() => {
                setExpr(h.expr);
                inputRef.current?.focus();
              }}
            >
              {h.expr} = <span className="text-[var(--os-fg)]">{h.result}</span>
            </button>
          ))
        )}
      </div>
      <div className="rounded-lg bg-black/30 px-3 py-2">
        <input
          ref={inputRef}
          data-autofocus
          data-keep-size
          value={expr}
          aria-label="Expression"
          onChange={(e) => {
            setExpr(e.target.value);
            setJustEvaluated(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "=") {
              e.preventDefault();
              equals();
            } else if (e.key === "Escape") {
              setExpr("");
            }
          }}
          className="w-full bg-transparent text-right font-[family-name:var(--font-mono)] text-[26px] text-[var(--os-fg)] outline-none"
          placeholder="0"
          spellCheck={false}
          inputMode="decimal"
        />
        <p className="h-5 text-right font-[family-name:var(--font-mono)] text-[13px] text-[var(--os-muted)]">
          {preview && preview !== expr ? `= ${preview}` : ""}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-6 gap-1.5">
        {keys.map((k) => (
          <button
            key={k.label}
            type="button"
            onClick={() => press(k)}
            className={`os-calc-key h-12 rounded-lg text-[17px] font-medium ${
              k.kind === "eq" ? "os-calc-eq" : k.kind === "op" ? "os-calc-op" : k.kind === "fn" ? "os-calc-fn" : ""
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  );
}
