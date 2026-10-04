import { STORAGE_KEYS, newId, readJson, writeJson } from "@/lib/storage";

/**
 * Spend the traveller records themselves. The app never supplies a price —
 * it only adds up what they tell it.
 */

export const EXPENSE_CATEGORIES = [
  "Transport",
  "Stay",
  "Food",
  "Entry & permits",
  "Guides",
  "Shopping",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Expense {
  id: string;
  tripId: string;
  category: ExpenseCategory;
  label: string;
  /** Whole rupees. */
  amount: number;
  /** Day of the trip, when they want it tied to one. */
  day?: number;
  createdAt: string;
}

type ExpenseStore = Record<string, Expense[]>;

export function loadExpenses(tripId: string): Expense[] {
  const store = readJson<ExpenseStore>(STORAGE_KEYS.expenses, {});
  const list = store[tripId];
  return Array.isArray(list) ? list : [];
}

export function saveExpenses(tripId: string, expenses: Expense[]): void {
  const store = readJson<ExpenseStore>(STORAGE_KEYS.expenses, {});
  store[tripId] = expenses;
  writeJson(STORAGE_KEYS.expenses, store);
}

export function addExpense(
  tripId: string,
  input: { category: ExpenseCategory; label: string; amount: number; day?: number }
): Expense[] {
  const expenses = loadExpenses(tripId);
  const next = [
    ...expenses,
    {
      id: newId("exp"),
      tripId,
      category: input.category,
      label: input.label.trim() || input.category,
      amount: Math.max(0, Math.round(input.amount)),
      day: input.day,
      createdAt: new Date().toISOString(),
    },
  ];
  saveExpenses(tripId, next);
  return next;
}

export function removeExpense(tripId: string, id: string): Expense[] {
  const next = loadExpenses(tripId).filter((e) => e.id !== id);
  saveExpenses(tripId, next);
  return next;
}

export function totalsByCategory(expenses: Expense[]): { category: ExpenseCategory; total: number }[] {
  const map = new Map<ExpenseCategory, number>();
  expenses.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amount));
  return [...map.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function sumExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * How the spend so far sits against the traveller's own budget. Pure, so the
 * demo and the tests share it. `daysIn` is the day of the trip they are on,
 * when the trip has started; before it starts (a day number below 1) or
 * after it ends there is no pace to judge, only the daily figure.
 */
export function budgetBurn({
  total,
  budget,
  days,
  daysIn,
}: {
  total: number;
  budget?: number;
  days: number;
  daysIn?: number;
}): { left: number; percent: number; note?: string } {
  if (!budget || budget <= 0) return { left: 0, percent: 0 };
  const left = budget - total;
  const percent = Math.round((total / budget) * 100);
  let note: string | undefined;
  if (left < 0) {
    note = "Over budget. Nothing wrong with that if it was a choice — but the next few days should be the cheap ones.";
  } else if (daysIn && daysIn >= 1 && days > 0 && daysIn <= days) {
    const daysLeft = days - daysIn + 1;
    const dailyLeft = Math.round(left / daysLeft);
    const dailyPlanned = Math.round(budget / days);
    note =
      dailyLeft < dailyPlanned * 0.7
        ? `Day ${daysIn} of ${days}: ${formatRupees(dailyLeft)} a day left, against ${formatRupees(dailyPlanned)} a day planned. Spending is running ahead.`
        : `Day ${daysIn} of ${days}: ${formatRupees(dailyLeft)} a day to spend for the rest of the trip.`;
  } else if (days > 0) {
    note = `That is ${formatRupees(Math.round(budget / days))} a day across ${days} days, all in.`;
  }
  return { left, percent, note };
}
