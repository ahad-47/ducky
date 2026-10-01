// Recursive-descent evaluator for the calculator and the terminal's `calc`.
// No eval(). Grammar:
//   expr   := term (('+' | '-') term)*
//   term   := power (('*' | '/' | 'mod') power)*
//   power  := unary ('^' power)?
//   unary  := ('-' | '+') unary | postfix
//   postfix:= primary ('%' | '!')*
//   primary:= number | const | func '(' expr ')' | '(' expr ')' | func primary

const funcs: Record<string, (x: number) => number> = {
  sqrt: Math.sqrt,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  ln: Math.log,
  log: Math.log10,
  abs: Math.abs,
  exp: Math.exp,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
};

const consts: Record<string, number> = { pi: Math.PI, π: Math.PI, e: Math.E };

type Tok = { t: "num"; v: number } | { t: "id"; v: string } | { t: "op"; v: string };

function tokenize(src: string): Tok[] {
  const s = src
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/√/g, "sqrt")
    .replace(/\*\*/g, "^");
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c) || c === ",") {
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      if (s[j] === "e" && /[0-9+-]/.test(s[j + 1] ?? "") && !/[a-z]/i.test(s[j + 2] ?? "")) {
        j++;
        if (s[j] === "+" || s[j] === "-") j++;
        while (j < s.length && /[0-9]/.test(s[j])) j++;
      }
      const text = s.slice(i, j);
      if ((text.match(/\./g) ?? []).length > 1) throw new Error("bad number");
      out.push({ t: "num", v: parseFloat(text) });
      i = j;
      continue;
    }
    if (/[a-zπ]/i.test(c)) {
      let j = i;
      while (j < s.length && /[a-zπ]/i.test(s[j])) j++;
      out.push({ t: "id", v: s.slice(i, j).toLowerCase() });
      i = j;
      continue;
    }
    if ("+-*/^()%!".includes(c)) {
      out.push({ t: "op", v: c });
      i++;
      continue;
    }
    throw new Error(`unexpected "${c}"`);
  }
  return out;
}

export function evaluate(src: string): number {
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const isOp = (v: string) => peek()?.t === "op" && peek()?.v === v;

  function expr(): number {
    let v = term();
    while (isOp("+") || isOp("-")) {
      const op = toks[p++].v;
      const r = term();
      v = op === "+" ? v + r : v - r;
    }
    return v;
  }
  function term(): number {
    let v = power();
    for (;;) {
      if (isOp("*") || isOp("/")) {
        const op = toks[p++].v;
        const r = power();
        v = op === "*" ? v * r : v / r;
      } else if (peek()?.t === "id" && peek()?.v === "mod") {
        p++;
        const r = power();
        v = ((v % r) + r) % r;
      } else if (peek() && (peek().t === "num" || isOp("(") || (peek().t === "id" && peek().v !== "mod"))) {
        // Implicit multiplication: 2pi, 3(4), 2sqrt(9)
        v *= power();
      } else break;
    }
    return v;
  }
  function power(): number {
    const base = unary();
    if (isOp("^")) {
      p++;
      return Math.pow(base, power());
    }
    return base;
  }
  function unary(): number {
    if (isOp("-")) {
      p++;
      return -unary();
    }
    if (isOp("+")) {
      p++;
      return unary();
    }
    return postfix();
  }
  function postfix(): number {
    let v = primary();
    for (;;) {
      if (isOp("%")) {
        p++;
        v = v / 100;
      } else if (isOp("!")) {
        p++;
        if (v < 0 || !Number.isInteger(v) || v > 170) throw new Error("bad factorial");
        let f = 1;
        for (let k = 2; k <= v; k++) f *= k;
        v = f;
      } else break;
    }
    return v;
  }
  function primary(): number {
    const tok = toks[p++];
    if (!tok) throw new Error("unexpected end");
    if (tok.t === "num") return tok.v;
    if (tok.t === "op" && tok.v === "(") {
      const v = expr();
      if (isOp(")")) p++;
      return v;
    }
    if (tok.t === "id") {
      if (tok.v in consts) return consts[tok.v];
      const fn = funcs[tok.v];
      if (fn) {
        if (isOp("(")) {
          p++;
          const v = expr();
          if (isOp(")")) p++;
          return fn(v);
        }
        return fn(power());
      }
      throw new Error(`unknown "${tok.v}"`);
    }
    throw new Error(`unexpected "${tok.v}"`);
  }

  const v = expr();
  if (p < toks.length) throw new Error(`unexpected "${toks[p].v}"`);
  return v;
}

export function formatNumber(v: number): string {
  if (Number.isNaN(v)) return "Error";
  if (!Number.isFinite(v)) return v > 0 ? "∞" : "-∞";
  const r = Number(v.toPrecision(12));
  if (Math.abs(r) >= 1e15 || (Math.abs(r) < 1e-9 && r !== 0)) return r.toExponential(6).replace(/\.?0+e/, "e");
  return String(r);
}
