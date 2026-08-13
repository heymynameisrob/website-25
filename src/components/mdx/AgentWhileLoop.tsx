import type { CSSProperties, ReactNode } from "react";

const agentWhileLoopCode = `while (!done) {
  const response = await callLLM();
  messages.push(response);
  if (response.toolCalls) {
    const calls = response.toolCalls.map((tc) => tool(tc.args));
    messages.push(
      ...(await Promise.all(calls)),
    );
  } else {
    messages.push(getUserMessage());
  }
}`;

type ShikiStyle = CSSProperties & { "--shiki-dark": string };

const shikiStyles = {
  keyword: { color: "#cf222e", "--shiki-dark": "#ff7b72" },
  variable: { color: "#24292f", "--shiki-dark": "#e6edf3" },
  function: { color: "#8250df", "--shiki-dark": "#d2a8ff" },
  property: { color: "#0550ae", "--shiki-dark": "#79c0ff" },
  punctuation: { color: "#24292f", "--shiki-dark": "#e6edf3" },
} satisfies Record<string, ShikiStyle>;

const tokenPattern =
  /(while|const|await|if|else)\b|([A-Za-z_$][\w$]*)(?=\()|(?<=\.)([A-Za-z_$][\w$]*)|([A-Za-z_$][\w$]*)|([!().,;{}])/g;

function Token({ children, kind }: { children: ReactNode; kind: keyof typeof shikiStyles }) {
  return <span style={shikiStyles[kind]}>{children}</span>;
}

function highlightLine(line: string) {
  const tokens: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of line.matchAll(tokenPattern)) {
    const index = match.index ?? 0;

    if (index > lastIndex) {
      tokens.push(line.slice(lastIndex, index));
    }

    const [value, keyword, fn, property, variable, punctuation] = match;
    const kind = keyword
      ? "keyword"
      : fn
        ? "function"
        : property
          ? "property"
          : punctuation
            ? "punctuation"
            : "variable";

    tokens.push(
      <Token key={`${index}-${value}`} kind={kind}>
        {value}
      </Token>
    );

    lastIndex = index + value.length;
  }

  if (lastIndex < line.length) {
    tokens.push(line.slice(lastIndex));
  }

  return tokens;
}

export function AgentWhileLoop() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-primary">Agents can be as simple as this.</p>
      <pre className="astro-code overflow-hidden rounded-md bg-gray-2 p-2 text-xs overflow-x-auto">
        <code>
          {agentWhileLoopCode.split("\n").map((line, index, lines) => {
            const lineKey = `${line}-${lines.slice(0, index).join("\n").length}`;

            return (
              <span className="line" key={lineKey}>
                {highlightLine(line)}
                {index < lines.length - 1 ? "\n" : null}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
