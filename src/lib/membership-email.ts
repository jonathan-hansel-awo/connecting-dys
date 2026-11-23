import { membershipCopy } from "../content/membership-copy.ts";

export type InterestKind = "young-people" | "young-adults";

// Values belong only in the encoded message body, never in the page URL or headers.
export function membershipEmail(kind: InterestKind, data: FormData, recipient: string) {
  const value = (key: string) => String(data.get(key) || "").trim();
  const young = kind === "young-people";
  const ownContact = !young || ["16", "17"].includes(value("age"));
  const lines = [
    "Connecting Dys CIC — Membership interest",
    young ? "Young people (ages 13–17)" : "Young adults (ages 18–24)",
    "", "About me",
    `Full name: ${value("fullName")}`,
    `Preferred name: ${value("preferredName") || "Not provided"}`,
    `Age${young ? "" : " band"}: ${value("age")}`,
  ];
  if (ownContact) lines.push("", "My contact details", `Email: ${value("email")}`, `Phone (optional): ${value("phone") || "Not provided"}`);
  if (young) lines.push("", "Parent / guardian details", `Full name: ${value("guardianName")}`, `Relationship: ${value("relationship")}`, `Email: ${value("guardianEmail")}`, `Phone: ${value("guardianPhone")}`, `Main contact: ${ownContact ? "Young person and parent / guardian" : "Parent / guardian"}`);
  lines.push("", `Information pack preference: ${value("informationPreference")}`, "", membershipCopy[kind].acknowledgement);
  const subject = `Membership interest — ${young ? "ages 13–17" : "ages 18–24"}`;
  const body = lines.join("\r\n");
  return { body, href: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
