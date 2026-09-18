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
