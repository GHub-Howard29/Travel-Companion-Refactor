import { useCallback, useEffect, useState } from "react";

import {
  getChecklistProgress,
  toggleChecklistItem as toggleChecklistItemProgress,
} from "../services/checklistService";

export const useChecklistState = (tripId: string) => {
  const [checkedItemIds, setCheckedItemIds] = useState<string[]>(() =>
    getChecklistProgress(tripId).checkedItemIds,
  );

  useEffect(() => {
    setCheckedItemIds(getChecklistProgress(tripId).checkedItemIds);
  }, [tripId]);

  const toggleChecklistItem = useCallback((itemId: string) => {
    setCheckedItemIds((currentIds) => {
      const nextProgress = toggleChecklistItemProgress(
        tripId,
        itemId,
        currentIds,
      );

      return nextProgress.checkedItemIds;
    });
  }, [tripId]);

  return {
    checkedItemIds,
    toggleChecklistItem,
  };
};
