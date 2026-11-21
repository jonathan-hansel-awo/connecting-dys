"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NOTICE_KEY, NOTICE_VERSION, isNoticeAcknowledged } from "@/lib/privacy-notice";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const fromFooter = useRef(false);
  useEffect(() => {
    let acknowledged = false;
    try { acknowledged = isNoticeAcknowledged(JSON.parse(localStorage.getItem(NOTICE_KEY) || "null")); } catch { /* Storage may be unavailable. */ }
    // No focus theft or modal: the site remains readable while the notice is open.
    const timer = window.setTimeout(() => setVisible(!acknowledged), 0);
    const reopen = () => {
      fromFooter.current = true;
      setVisible(true);
      window.requestAnimationFrame(() => document.getElementById("cookie-title")?.focus());
    };
    window.addEventListener("connecting-dys:cookie-information", reopen);
    return () => { window.clearTimeout(timer); window.removeEventListener("connecting-dys:cookie-information", reopen); };
  }, []);
  function acknowledge() {
    try { localStorage.setItem(NOTICE_KEY, JSON.stringify({ version: NOTICE_VERSION, acknowledgedAt: Date.now() })); } catch { /* Close for this visit even when storage is blocked. */ }
    setVisible(false);
    document.getElementById(fromFooter.current ? "cookie-information" : "main-content")?.focus({ preventScroll: true });
  }
  return <div className="privacy-toolbar wrap" hidden={!visible}>
    <aside id="cookie-notice" className="cookie-notice surface-raised" aria-labelledby="cookie-title" hidden={!visible}>
      <div><h2 id="cookie-title" tabIndex={-1}>Your privacy, simply.</h2><p>We use no analytics or advertising cookies. Reading settings stay on your device. We remember when you acknowledge this notice.</p></div>
      <div className="cookie-actions"><Link href="/cookies">Learn about cookies & storage</Link><button className="button" onClick={acknowledge}>OK, understood</button></div>
    </aside>
  </div>;
}

export function CookieInformation() {
  return <Link id="cookie-information" className="cookie-information" href="/cookies" onClick={event => {
    event.preventDefault();
    window.dispatchEvent(new Event("connecting-dys:cookie-information"));
  }}>Cookie information</Link>;
}
