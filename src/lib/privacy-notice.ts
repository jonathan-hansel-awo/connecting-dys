export const NOTICE_KEY = "connecting-dys-privacy-notice";
export const NOTICE_VERSION = 1;
export const NOTICE_DURATION = 183 * 24 * 60 * 60 * 1000;

export function isNoticeAcknowledged(value: unknown, now = Date.now()): boolean {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return record.version === NOTICE_VERSION && typeof record.acknowledgedAt === "number"
    && Number.isFinite(record.acknowledgedAt) && record.acknowledgedAt <= now
    && now - record.acknowledgedAt < NOTICE_DURATION;
}
