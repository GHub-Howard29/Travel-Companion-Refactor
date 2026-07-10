import { useCallback, useMemo, useState } from "react";

import type { PrivateChecklistItem } from "../types";
import {
  createPrivateChecklistItem,
  deletePrivateChecklistItem,
  getPrivateChecklist,
  updatePrivateChecklistItem,
} from "../services/privateChecklistService";

const normalizeUserEmail = (userEmail: string | null): string => {
  return userEmail?.trim().toLowerCase() ?? "";
};

export const usePrivateChecklistState = (
  tripId: string,
  userEmail: string | null,
) => {
  const [itemsByScope, setItemsByScope] = useState<
    Record<string, PrivateChecklistItem[]>
  >({});
  const ownerEmail = normalizeUserEmail(userEmail);
  const canUsePrivateChecklist = Boolean(tripId && ownerEmail);
  const scopeKey = `${tripId}:${ownerEmail}`;
  const items = useMemo(
    () =>
      canUsePrivateChecklist
        ? itemsByScope[scopeKey] ??
          getPrivateChecklist(tripId, ownerEmail).items
        : [],
    [canUsePrivateChecklist, itemsByScope, ownerEmail, scopeKey, tripId],
  );

  const addItem = useCallback((label: string) => {
    if (!canUsePrivateChecklist) {
      return;
    }

    setItemsByScope((currentItemsByScope) => {
      const currentItems =
        currentItemsByScope[scopeKey] ??
        getPrivateChecklist(tripId, ownerEmail).items;
      const nextChecklist = createPrivateChecklistItem(
        tripId,
        ownerEmail,
        label,
        currentItems,
      );

      return {
        ...currentItemsByScope,
        [scopeKey]: nextChecklist.items,
      };
    });
  }, [canUsePrivateChecklist, ownerEmail, scopeKey, tripId]);

  const toggleItem = useCallback((itemId: string) => {
    if (!canUsePrivateChecklist) {
      return;
    }

    setItemsByScope((currentItemsByScope) => {
      const currentItems =
        currentItemsByScope[scopeKey] ??
        getPrivateChecklist(tripId, ownerEmail).items;
      const targetItem = currentItems.find((item) => item.id === itemId);

      if (!targetItem) {
        return currentItemsByScope;
      }

      const nextChecklist = updatePrivateChecklistItem(
        tripId,
        ownerEmail,
        itemId,
        { isChecked: !targetItem.isChecked },
        currentItems,
      );

      return {
        ...currentItemsByScope,
        [scopeKey]: nextChecklist.items,
      };
    });
  }, [canUsePrivateChecklist, ownerEmail, scopeKey, tripId]);

  const renameItem = useCallback((itemId: string, label: string) => {
    if (!canUsePrivateChecklist) {
      return;
    }

    setItemsByScope((currentItemsByScope) => {
      const currentItems =
        currentItemsByScope[scopeKey] ??
        getPrivateChecklist(tripId, ownerEmail).items;
      const nextChecklist = updatePrivateChecklistItem(
        tripId,
        ownerEmail,
        itemId,
        { label },
        currentItems,
      );

      return {
        ...currentItemsByScope,
        [scopeKey]: nextChecklist.items,
      };
    });
  }, [canUsePrivateChecklist, ownerEmail, scopeKey, tripId]);

  const removeItem = useCallback((itemId: string) => {
    if (!canUsePrivateChecklist) {
      return;
    }

    setItemsByScope((currentItemsByScope) => {
      const currentItems =
        currentItemsByScope[scopeKey] ??
        getPrivateChecklist(tripId, ownerEmail).items;
      const nextChecklist = deletePrivateChecklistItem(
        tripId,
        ownerEmail,
        itemId,
        currentItems,
      );

      return {
        ...currentItemsByScope,
        [scopeKey]: nextChecklist.items,
      };
    });
  }, [canUsePrivateChecklist, ownerEmail, scopeKey, tripId]);

  return {
    items,
    addItem,
    toggleItem,
    renameItem,
    removeItem,
  };
};
