"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { brand } from "@/content/site";
import { membershipEmail, type InterestKind } from "@/lib/membership-email";

const subscribe = () => () => {};
export function MembershipInterestForm({ kind }: { kind: InterestKind }) {
  const young = kind === "young-people";
  const [age, setAge] = useState("");
  const [draft, setDraft] = useState<ReturnType<typeof membershipEmail> | null>(null);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const ownContact = !young || age === "16" || age === "17";
  const id = (field: string) => `${kind}-${field}`;

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const message = membershipEmail(kind, new FormData(event.currentTarget), brand.email);
    setDraft(message);
    window.location.href = message.href;
  }

  return <section id={kind} className="membership-option surface-soft" aria-labelledby={id("title")}>
    <p className="eyebrow">{young ? "Ages 13–17" : "Ages 18–24"}</p>
    <h2 id={id("title")}>{young ? "Young people" : "Young adults"}</h2>
    <p>{young ? "A short form for you and your parent or guardian." : "A short form you can complete for yourself."} Fields marked * are required.</p>
    {young && <div className="membership-age-guidance"><p>Ages 13–15: your parent or guardian will be our main contact.</p><p>Ages 16–17: please provide your contact details and your parent or guardian’s details.</p></div>}
    <form className="interest-form" aria-labelledby={id("title")} action={`mailto:${brand.email}`} method="post" encType="text/plain" onSubmit={prepareEmail} onChange={() => setDraft(null)}>
      <fieldset><legend>About you</legend>
        <label htmlFor={id("full-name")}>Full name *</label><input id={id("full-name")} name="fullName" autoComplete="name" required maxLength={120} />
        <label htmlFor={id("preferred-name")}>What would you like us to call you? (optional)</label><input id={id("preferred-name")} name="preferredName" autoComplete="nickname" maxLength={80} />
        <label htmlFor={id("age")}>{young ? "Age" : "Age band"} *</label><select id={id("age")} name="age" required value={age} onChange={event => setAge(event.target.value)}><option value="" disabled>Choose your {young ? "age" : "age band"}</option>{(young ? ["13", "14", "15", "16", "17"] : ["18–20", "21–24"]).map(option => <option key={option} value={option}>{option}</option>)}</select>
      </fieldset>
      {ownContact && <fieldset><legend>Your contact details</legend>
        <label htmlFor={id("email")}>Your email address *</label><input id={id("email")} name="email" type="email" autoComplete="email" required maxLength={254} />
        <label htmlFor={id("phone")}>Your phone number (optional)</label><input id={id("phone")} name="phone" type="tel" autoComplete="tel" maxLength={40} />
      </fieldset>}
      {young && <fieldset><legend>Parent / guardian details</legend>
        <label htmlFor={id("guardian-name")}>Parent / guardian full name *</label><input id={id("guardian-name")} name="guardianName" autoComplete="section-guardian name" required maxLength={120} />
        <label htmlFor={id("relationship")}>Relationship to you *</label><input id={id("relationship")} name="relationship" required maxLength={80} />
        <label htmlFor={id("guardian-email")}>Parent / guardian email address *</label><input id={id("guardian-email")} name="guardianEmail" type="email" autoComplete="section-guardian email" required maxLength={254} />
        <label htmlFor={id("guardian-phone")}>Parent / guardian phone number *</label><input id={id("guardian-phone")} name="guardianPhone" type="tel" autoComplete="section-guardian tel" required maxLength={40} />
      </fieldset>}
      <fieldset className="interest-pack"><legend>How would you like to receive your information? *</legend>
        <label><input type="radio" name="informationPreference" value="By email" required />By email</label>
        <label><input type="radio" name="informationPreference" value="I would like someone to contact me first" required />I would like someone to contact me first</label>
      </fieldset>
      <label className="interest-confirmation"><input name="acknowledgement" type="checkbox" required /><span>I understand this is an expression of interest only. I will receive information about membership before deciding whether to join. *</span></label>
      <p id={id("email-help")}>This opens a draft in your email app. Review it and press Send there to email Connecting Dys.</p>
      <button type="submit" className="button" aria-describedby={id("email-help")} disabled={!ready}>Open email with my answers</button>
      <noscript><p>To prepare your answers in an email, please enable JavaScript or <a href={`mailto:${brand.email}?subject=Membership%20interest`}>email us to express interest</a>.</p></noscript>
      <div role="status">{draft && <p>Your message is ready. Please review it and press Send in your email app.</p>}</div>
      {draft && <details className="more-detail"><summary>Email app didn’t open?</summary><p><a href={draft.href}>Try opening your email draft again</a>, or copy the message below into an email to <a href={`mailto:${brand.email}`}>{brand.email}</a>.</p><label htmlFor={id("message")}>Your message</label><textarea id={id("message")} readOnly rows={12} value={draft.body} /></details>}
    </form>
  </section>;
}
