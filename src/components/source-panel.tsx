import { Children, createElement, isValidElement, type ReactNode } from "react";
import { EdgeDoodle, editorialDoodles, motifForContent } from "@/components/edge-doodle";
import supplied from "@/content/supplied-copy.json";
import { brandCopy } from "@/lib/brand-copy";

export type SourceBlock = { type: string; text?: string; items?: string[] };
export type SourceSection = { title: string; blocks: SourceBlock[]; table?: string[][] };
export const sourceCopy: Record<string, SourceSection> = Object.fromEntries(
  Object.entries(supplied).map(([key, section]) => [key, {
    ...section,
    title: key === "purpose" ? "Our Purpose" : brandCopy(section.title),
    blocks: (key === "mission" ? section.blocks.slice(0, 1) : section.blocks).map((block: SourceBlock) => ({
      ...block,
      ...(block.text !== undefined ? { text: brandCopy(block.text) } : {}),
      ...(block.items ? { items: block.items.map(brandCopy) } : {}),
    })),
  }]),
);
export const panelTones = ["blue", "amber", "teal", "cream", "coral"];
const toneAt = (tone: string, index: number) => panelTones[(Math.max(0, panelTones.indexOf(tone)) + index) % panelTones.length];

export function SourceBlocks({ blocks, headingLevel = 3, emphasis }: { blocks: SourceBlock[]; headingLevel?: number; emphasis?: string }) {
  return <>{blocks.map((block, i) => {
    if (block.type === "heading") return createElement(`h${Math.min(headingLevel, 6)}`, { key: i }, block.text);
    if (block.type === "list") return <ul key={i}>{block.items?.map((item, j) => <li key={j}>{item}</li>)}</ul>;
    if (emphasis === "question") return createElement(`h${Math.min(headingLevel, 6)}`, { className: "editorial-question", key: i }, block.text);
    const label = block.text?.match(/^(Commitment|Evidence):\s*/);
    return <p className={emphasis ? `editorial-${emphasis}` : undefined} key={i}>{label ? <><strong className="copy-label">{label[1]}:</strong>{" "}{block.text!.slice(label[0].length)}</> : block.text}</p>;
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

function contentText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (isValidElement<{ children?: ReactNode }>(node)) return contentText(node.props.children);
  return Children.toArray(node).map(child => isValidElement<{ children?: ReactNode }>(child) ? contentText(child.props.children) : String(child)).join(" ");
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
  return <>{groups.map((group, i) => <div className={`copy-panel panel-${toneAt(tone, i)} has-edge-doodle`} key={i}><EdgeDoodle motif={motifForContent(contentText(group))} />{group}</div>)}</>;
}

const emphasisBySource: Record<string, Record<number, string>> = {
  why: { 2: "quote", 5: "refrain" },
  story: { 0: "lead", 2: "statement", 5: "question", 7: "statement", 9: "statement", 10: "lead", 13: "refrain", 14: "refrain", 15: "refrain", 16: "refrain", 18: "refrain", 19: "refrain", 20: "refrain", 21: "refrain", 22: "statement" },
  founder: { 3: "statement", 6: "statement", 8: "lead" },
  "approach-community": { 0: "statement" },
};

export function SourcePanel({ source, level = 2, tone = "blue", id, children, artwork, collapsible = false, initiallyOpen = false, interlude }: {
  source: string; level?: 1 | 2 | 3; tone?: string; id?: string; children?: ReactNode; artwork?: ReactNode; collapsible?: boolean; initiallyOpen?: boolean; interlude?: { after: number; content: ReactNode };
}) {
  const section = sourceCopy[source];
  const headingId = id || `source-${source}`;
  const Container = collapsible ? "details" : "section";
  return <Container className={`source-section ${collapsible ? "policy-disclosure" : "editorial-source"}`} data-source-id={source} aria-labelledby={headingId} open={collapsible && initiallyOpen ? true : undefined}>
    {collapsible && <summary><EdgeDoodle motif={motifForContent(section.title)} />{createElement(`h${level}`, { id: headingId }, section.title)}<span className="disclosure-indicator" aria-hidden="true" /></summary>}
    {paragraphGroups(section.blocks).map((group, i) => {
      const paragraph = group.length === 1 && group[0].type === "paragraph" ? group[0].text?.trim() : undefined;
      const standalone = i > 0 && paragraph && paragraph.length <= 160 && paragraph.split(/\s+/).length <= 20 && !paragraph.endsWith(":");
      const fallback = standalone && paragraph ? (paragraph.endsWith("?") ? "question" : /^[“"‘]/.test(paragraph) ? "quote" : "statement") : undefined;
      const emphasis = !collapsible ? emphasisBySource[source]?.[i] ?? fallback : undefined;
      const motif = editorialDoodles[source]?.[i] ?? motifForContent(group.map(block => block.text || block.items?.join(" ") || "").join(" ") + " " + section.title);
      const panel = <div className={`copy-panel panel-${toneAt(tone, i)} ${emphasis ? `source-${emphasis}` : ""} has-edge-doodle`} data-copy-emphasis={emphasis} key={i}>
        <EdgeDoodle motif={motif} />
        {i === 0 && !collapsible && createElement(`h${level}`, { id: headingId }, section.title)}
        <SourceBlocks blocks={group} headingLevel={level + 1} emphasis={emphasis} />
      </div>;
      const content = i === 0 && artwork ? <div className="illustrated-source-header">{panel}<div className="editorial-art">{artwork}</div></div> : panel;
      return <div className="source-beat" key={i}>{content}{interlude?.after === i && <div className="editorial-interlude">{interlude.content}</div>}</div>;
    })}
    {section.table && <div className={`copy-panel panel-${tone} has-edge-doodle`}><EdgeDoodle motif="document" /><div className="retention-scroll" role="region" aria-label={section.title} tabIndex={0}>
      <table className="retention-table"><thead><tr>{section.table[0].map(cell => <th scope="col" key={cell}>{cell}</th>)}</tr></thead>
        <tbody>{section.table.slice(1).map(row => <tr key={row[0]}><th scope="row">{row[0]}</th>{row.slice(1).map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div></div>}
    {children && <div className="copy-panel panel-cream has-edge-doodle"><EdgeDoodle motif={motifForContent(contentText(children))} />{children}</div>}
  </Container>;
}

export function SourcePanels({ sources, collapsible = false }: { sources: string[]; collapsible?: boolean }) {
  return <div className="copy-panels">{sources.map((source, i) => <SourcePanel key={source} source={source} tone={panelTones[i % panelTones.length]} collapsible={collapsible} initiallyOpen={false} />)}</div>;
}
