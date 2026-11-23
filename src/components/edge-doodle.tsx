import { HandshakeIcon } from "@phosphor-icons/react/dist/ssr/Handshake";
import { ChatsCircleIcon } from "@phosphor-icons/react/dist/ssr/ChatsCircle";
import { PlantIcon } from "@phosphor-icons/react/dist/ssr/Plant";
import { BridgeIcon } from "@phosphor-icons/react/dist/ssr/Bridge";
import { BookOpenTextIcon } from "@phosphor-icons/react/dist/ssr/BookOpenText";
import { PathIcon } from "@phosphor-icons/react/dist/ssr/Path";
import { HouseLineIcon } from "@phosphor-icons/react/dist/ssr/HouseLine";
import { HandHeartIcon } from "@phosphor-icons/react/dist/ssr/HandHeart";
import { ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { FileTextIcon } from "@phosphor-icons/react/dist/ssr/FileText";
import { EnvelopeOpenIcon } from "@phosphor-icons/react/dist/ssr/EnvelopeOpen";
import { UsersThreeIcon } from "@phosphor-icons/react/dist/ssr/UsersThree";
import { PersonArmsSpreadIcon } from "@phosphor-icons/react/dist/ssr/PersonArmsSpread";
import { LightbulbIcon } from "@phosphor-icons/react/dist/ssr/Lightbulb";
import { MegaphoneIcon } from "@phosphor-icons/react/dist/ssr/Megaphone";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";

export type EdgeDoodleMotif = "connection" | "conversation" | "growth" | "bridge" | "book" | "path" | "home" | "care" | "shield" | "document" | "mail" | "inclusion" | "accessibility" | "idea" | "awareness" | "review";

export const editorialDoodles: Record<string, Record<number, EdgeDoodleMotif>> = {
  why: { 0: "connection" }, mission: { 0: "path" }, vision: { 0: "bridge" }, goal: { 0: "growth" },
  "about-work": { 0: "conversation" },
  story: { 2: "connection", 5: "path", 10: "home", 22: "care" },
  founder: { 3: "conversation", 6: "connection", 8: "care" },
  "work-1": { 0: "connection" }, "work-2": { 0: "conversation" }, "work-5": { 0: "book" }, "work-8": { 0: "growth" },
  "approach-community": { 0: "connection" }, "approach-design": { 0: "path" }, "approach-grow": { 0: "growth" }, "approach-gets": { 0: "care" },
  "value-B": { 0: "home" }, "value-R": { 0: "conversation" }, "value-I": { 0: "connection" }, "value-E": { 0: "care" },
  "support-peer": { 0: "connection" }, "support-family": { 0: "home" }, "support-workshops": { 0: "book" }, "support-forums": { 0: "conversation" },
  "who-join": { 0: "home" },
};


const icons = { connection: HandshakeIcon, conversation: ChatsCircleIcon, growth: PlantIcon, bridge: BridgeIcon, book: BookOpenTextIcon, path: PathIcon, home: HouseLineIcon, care: HandHeartIcon, shield: ShieldCheckIcon, document: FileTextIcon, mail: EnvelopeOpenIcon, inclusion: UsersThreeIcon, accessibility: PersonArmsSpreadIcon, idea: LightbulbIcon, awareness: MegaphoneIcon, review: MagnifyingGlassIcon };

// Text-derived fallbacks keep every reading box relevant, including policy copy.
export function motifForContent(text: string): EdgeDoodleMotif {
  if (/privacy|confidential|safeguard|protect|security|consent|risk|danger/i.test(text)) return "shield";
  if (/accessib|adjustment|barrier|reading setting|font|spacing/i.test(text)) return "accessibility";
  if (/email|contact|mailbox|write to us/i.test(text)) return "mail";
  if (/review|monitor|evidence|record|retention|data|cookie|policy|legal|procedure/i.test(text)) return "document";
  if (/learn|education|workshop|book|training/i.test(text)) return "book";
  if (/listen|question|ask|voice|conversation|forum|respect/i.test(text)) return "conversation";
  if (/grow|future|sustain|develop|foundation|goal/i.test(text)) return "growth";
  if (/aware|understand|condition|diagnos/i.test(text)) return "awareness";
  if (/belong|home|family|families|welcome|place/i.test(text)) return "home";
  if (/bridge|vision/i.test(text)) return "bridge";
  if (/inclus|divers|equal|differen|together/i.test(text)) return "inclusion";
  if (/care|empathy|dignity|support/i.test(text)) return "care";
  if (/journey|next|step|mission|way|explor/i.test(text)) return "path";
  if (/idea|creat|design/i.test(text)) return "idea";
  return "connection";
}

// Rendered on the server: no external icon requests, players or animation.
export function EdgeDoodle({ motif }: { motif: EdgeDoodleMotif }) {
  const Icon = icons[motif];
  return <span className={`edge-doodle edge-doodle-${motif}`} data-edge-motif={motif} aria-hidden="true">
    <Icon weight="duotone" size="100%" focusable="false" />
  </span>;
}
