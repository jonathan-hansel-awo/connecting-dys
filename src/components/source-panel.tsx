import { Children, createElement, isValidElement, type ReactNode } from "react";
import supplied from "@/content/supplied-copy.json";

export type SourceBlock = { type: string; text?: string; items?: string[] };
export type SourceSection = { title: string; blocks: SourceBlock[]; table?: string[][] };
export const sourceCopy: Record<string, SourceSection> = supplied;
export const panelTones = ["blue", "amber", "teal", "cream", "coral"];
const toneAt = (tone: string, index: number) => panelTones[(Math.max(0, panelTones.indexOf(tone)) + index) % panelTones.length];

export function SourceBlocks({ blocks, headingLevel = 3 }: { blocks: SourceBlock[]; headingLevel?: number }) {
  return <>{blocks.map((block, i) => {
    if (block.type === "heading") return createElement(`h${Math.min(headingLevel, 6)}`, { key: i }, block.text);
    if (block.type === "list") return <ul key={i}>{block.items?.map((item, j) => <li key={j}>{item}</li>)}</ul>;
    return <p key={i}>{block.text}</p>;
  })}</>;
}

// Each paragraph gets its own panel. Keep a list with its introductory paragraph
// and carry a subheading into the next panel, preserving the source's order.
function paragraphGroups(blocks: SourceBlock[]) {
  const groups: SourceBlock[][] = [];
  let current: SourceBlock[] = [];
  for (const block of blocks) {
    if ((block.type === "paragraph" || block.type === "heading") && current.some(item => item.type !== "heading")) {
      groups.push(current); current = [];
    }
    current.push(block);
  }
  if (current.length) groups.push(current);
  return groups.length ? groups : [[]];
}

export function ParagraphPanels({ children, tone = "blue" }: { children: ReactNode; tone?: string }) {
  const groups: ReactNode[][] = [];
  let current: ReactNode[] = [];
  for (const child of Children.toArray(children)) {
    const startsParagraph = isValidElement(child) && child.type === "p";
    const hasParagraph = current.some(item => isValidElement(item) && item.type === "p");
    if (startsParagraph && hasParagraph) { groups.push(current); current = []; }
    current.push(child);
  }
  if (current.length) groups.push(current);
  return <>{groups.map((group, i) => <div className={`copy-panel panel-${toneAt(tone, i)}`} key={i}>{group}</div>)}</>;
}

export function SourcePanel({ source, level = 2, tone = "blue", id, children, artwork }: {
  source: string; level?: 1 | 2 | 3; tone?: string; id?: string; children?: ReactNode; artwork?: ReactNode;
}) {
  const section = sourceCopy[source];
  const headingId = id || `source-${source}`;
  return <section className="source-section" data-source-id={source} aria-labelledby={headingId}>
    {paragraphGroups(section.blocks).map((group, i) => {
      const panel = <div className={`copy-panel panel-${toneAt(tone, i)}`} key={i}>
        {i === 0 && createElement(`h${level}`, { id: headingId }, section.title)}
        <SourceBlocks blocks={group} headingLevel={level + 1} />
      </div>;
      return i === 0 && artwork ? <div className="illustrated-source-header" key={i}>{panel}<div className="editorial-art">{artwork}</div></div> : panel;
    })}
    {section.table && <div className={`copy-panel panel-${tone}`}><div className="retention-scroll" role="region" aria-label={section.title} tabIndex={0}>
      <table className="retention-table"><thead><tr>{section.table[0].map(cell => <th scope="col" key={cell}>{cell}</th>)}</tr></thead>
        <tbody>{section.table.slice(1).map(row => <tr key={row[0]}><th scope="row">{row[0]}</th>{row.slice(1).map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div></div>}
    {children && <div className="copy-panel panel-cream">{children}</div>}
  </section>;
}

export function SourcePanels({ sources }: { sources: string[] }) {
  return <div className="copy-panels">{sources.map((source, i) => <SourcePanel key={source} source={source} tone={panelTones[i % panelTones.length]} />)}</div>;
}
