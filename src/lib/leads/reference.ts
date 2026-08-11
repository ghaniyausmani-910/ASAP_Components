/**
 * Server-issued RFQ/lead reference number, e.g. "ASAP-K4F2A9".
 *
 * Replaces the old client-side `'ASAP-' + Math.random()` placeholder: the server
 * is now the authority for the reference the customer sees, so it's stable,
 * loggable, and ready to be persisted to a CRM/order system later.
 */
export function makeReference(): string {
  const time = Date.now().toString(36).toUpperCase().slice(-4)
  const rand = Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, '0')
  return `ASAP-${time}${rand}`
}
