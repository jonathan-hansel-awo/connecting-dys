import test from "node:test";
import assert from "node:assert/strict";
import { isNoticeAcknowledged, NOTICE_DURATION, NOTICE_VERSION } from "../src/lib/privacy-notice.ts";

test("privacy acknowledgement expires and does not accept invalid, future or old-version records", () => {
  const now = 1800000000000;
  assert.equal(isNoticeAcknowledged({ version: NOTICE_VERSION, acknowledgedAt: now }, now), true);
  assert.equal(isNoticeAcknowledged({ version: NOTICE_VERSION, acknowledgedAt: now - NOTICE_DURATION + 1 }, now), true);
  for (const input of [null, false, 1, "yes", {}, { version: 0, acknowledgedAt: now },
    { version: NOTICE_VERSION, acknowledgedAt: now + 1 }, { version: NOTICE_VERSION, acknowledgedAt: now - NOTICE_DURATION },
    { version: NOTICE_VERSION, acknowledgedAt: "yesterday" }, { version: NOTICE_VERSION, acknowledgedAt: NaN }]) {
    assert.equal(isNoticeAcknowledged(input, now), false);
  }
});
