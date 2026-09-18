import { STORAGE_KEYS, readJson, writeJson } from "@/lib/storage";

/**
 * The references a traveller otherwise keeps in a notes file or an inbox:
 * PNRs, permit numbers, booking confirmations. Kept against the booking task
 * they belong to, and available offline, which is the point.
 */

export interface WalletEntry {
  /** Booking task id this belongs to. */
  taskId: string;
  /** PNR, permit number, confirmation code. */
  reference: string;
  /** Anything else worth having at a checkpost: gate, coach, contact. */
  note?: string;
  booked: boolean;
  updatedAt: string;
}

type WalletStore = Record<string, Record<string, WalletEntry>>;

const KEY = `${STORAGE_KEYS.trips.split(".trips")[0]}.wallet.v1`;

export function loadWallet(tripId: string): Record<string, WalletEntry> {
  const store = readJson<WalletStore>(KEY, {});
  return store[tripId] ?? {};
}

export function saveWalletEntry(
  tripId: string,
  taskId: string,
  patch: Partial<Omit<WalletEntry, "taskId" | "updatedAt">>
): Record<string, WalletEntry> {
  const store = readJson<WalletStore>(KEY, {});
  const forTrip = store[tripId] ?? {};
  const existing = forTrip[taskId];
  const next: WalletEntry = {
    taskId,
    reference: patch.reference ?? existing?.reference ?? "",
    note: patch.note ?? existing?.note,
    booked: patch.booked ?? existing?.booked ?? false,
    updatedAt: new Date().toISOString(),
  };
  // An empty entry is not worth keeping around.
  if (!next.reference && !next.note && !next.booked) {
    delete forTrip[taskId];
  } else {
    forTrip[taskId] = next;
  }
  store[tripId] = forTrip;
  writeJson(KEY, store);
  return forTrip;
}

export function walletSummary(entries: Record<string, WalletEntry>, totalTasks: number) {
  const list = Object.values(entries);
  const booked = list.filter((e) => e.booked).length;
  const withRefs = list.filter((e) => e.reference.trim().length > 0).length;
  return { booked, withRefs, remaining: Math.max(0, totalTasks - booked) };
}
