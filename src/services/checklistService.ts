/**
 * Checklist Service（檢查清單服務層）
 *
 * 負責管理 Trip-scoped checklist progress。
 * UI / hooks 不直接操作 storage key 或 localStorage payload。
 */

import type { ChecklistProgress } from "../types";
import {
  readStoredChecklistProgress,
  writeStoredChecklistProgress,
} from "../storage/checklistStorage";

export const getChecklistProgress = (tripId: string): ChecklistProgress => {
  return readStoredChecklistProgress(tripId);
};

export const toggleChecklistItem = (
  tripId: string,
  itemId: string,
  checkedItemIds: string[],
): ChecklistProgress => {
  const nextCheckedItemIds = checkedItemIds.includes(itemId)
    ? checkedItemIds.filter((checkedItemId) => checkedItemId !== itemId)
    : [...checkedItemIds, itemId];
  const nextProgress: ChecklistProgress = {
    tripId,
    checkedItemIds: nextCheckedItemIds,
    updatedAt: new Date().toISOString(),
  };

  writeStoredChecklistProgress(nextProgress);

  return nextProgress;
};
