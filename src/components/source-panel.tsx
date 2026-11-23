import { createElement, type ReactNode } from "react";
import supplied from "@/content/supplied-copy.json";

export type SourceBlock = { type: string; text?: string; items?: string[] };
export type SourceSection = { title: string; blocks: SourceBlock[]; table?: string[][] };
export const sourceCopy: Record<string, SourceSection> = supplied;

export function SourceBlocks({ blocks, headingLevel = 3 }: { blocks: SourceBlock[]; headingLevel?: number }) {
  return <>{blocks.map((block, i) => {
    if (block.type === "heading") return createElement(`h${Math.min(headingLevel, 6)}`, { key: i }, block.text);
    if (block.type === "list") return <ul key={i}>{block.items?.map((item, j) => <li key={j}>{item}</li>)}</ul>;
    return <p key={i}>{block.text}</p>;
  })}</>;
}

export function SourcePanel({ source, level = 2, tone = "blue", id, children }: {
  source: string; level?: 1 | 2 | 3; tone?: string; id?: string; children?: ReactNode;
}) {
  const section = sourceCopy[source];
  const headingId = id || `source-${source}`;
  return <section className={`copy-panel panel-${tone}`} data-source-id={source} aria-labelledby={headingId}>
    {createElement(`h${level}`, { id: headingId }, section.title)}
    <SourceBlocks blocks={section.blocks} headingLevel={level + 1} />
    {section.table && <div className="retention-scroll" role="region" aria-label={section.title} tabIndex={0}>
      <table className="retention-table"><thead><tr>{section.table[0].map(cell => <th scope="col" key={cell}>{cell}</th>)}</tr></thead>
        <tbody>{section.table.slice(1).map(row => <tr key={row[0]}><th scope="row">{row[0]}</th>{row.slice(1).map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>}
    {children}
  </section>;
}

export const panelTones = ["blue", "amber", "teal", "cream", "coral"];
export function SourcePanels({ sources }: { sources: string[] }) {
  return <div className="copy-panels">{sources.map((source, i) => <SourcePanel key={source} source={source} tone={panelTones[i % panelTones.length]} />)}</div>;
}
