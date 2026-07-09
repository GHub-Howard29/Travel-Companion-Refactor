import type { ChecklistProgress } from "../types";

const CHECKLIST_STORAGE_PREFIX = "travel_companion_checklist";

const getChecklistStorageKey = (tripId: string): string => {
  return `${CHECKLIST_STORAGE_PREFIX}_${tripId}`;
};

const isChecklistProgress = (value: unknown): value is ChecklistProgress => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const progress = value as Partial<ChecklistProgress>;

  return (
    typeof progress.tripId === "string" &&
    Array.isArray(progress.checkedItemIds) &&
    progress.checkedItemIds.every((itemId) => typeof itemId === "string") &&
    typeof progress.updatedAt === "string"
  );
};

export const readStoredChecklistProgress = (
  tripId: string,
): ChecklistProgress => {
  const fallback: ChecklistProgress = {
    tripId,
    checkedItemIds: [],
    updatedAt: "",
  };
  const rawData = localStorage.getItem(getChecklistStorageKey(tripId));

  if (!rawData) {
    return fallback;
  }

  try {
    const parsedData = JSON.parse(rawData);

    if (!isChecklistProgress(parsedData) || parsedData.tripId !== tripId) {
      return fallback;
    }

    return parsedData;
  } catch {
    return fallback;
  }
};

export const writeStoredChecklistProgress = (
  progress: ChecklistProgress,
): void => {
  localStorage.setItem(
    getChecklistStorageKey(progress.tripId),
    JSON.stringify(progress),
  );
};

export const clearStoredChecklistProgress = (tripId: string): void => {
  localStorage.removeItem(getChecklistStorageKey(tripId));
};
