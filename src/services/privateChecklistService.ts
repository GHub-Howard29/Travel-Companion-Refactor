import type { PrivateChecklist, PrivateChecklistItem } from "../types";
import {
  readStoredPrivateChecklist,
  writeStoredPrivateChecklist,
} from "../storage/privateChecklistStorage";

const createPrivateChecklistItemId = (): string => {
  return `private_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

export const getPrivateChecklist = (
  tripId: string,
  userEmail: string,
): PrivateChecklist => {
  return readStoredPrivateChecklist(tripId, userEmail);
};

export const createPrivateChecklistItem = (
  tripId: string,
  userEmail: string,
  label: string,
  currentItems: PrivateChecklistItem[],
): PrivateChecklist => {
  const now = new Date().toISOString();
  const nextChecklist: PrivateChecklist = {
    tripId,
    userEmail,
    items: [
      ...currentItems,
      {
        id: createPrivateChecklistItemId(),
        tripId,
        userEmail,
        label,
        isChecked: false,
        createdAt: now,
        updatedAt: now,
      },
    ],
    updatedAt: now,
  };

  writeStoredPrivateChecklist(nextChecklist);

  return nextChecklist;
};

export const updatePrivateChecklistItem = (
  tripId: string,
  userEmail: string,
  itemId: string,
  patch: Partial<Pick<PrivateChecklistItem, "label" | "isChecked">>,
  currentItems: PrivateChecklistItem[],
): PrivateChecklist => {
  const now = new Date().toISOString();
  const nextChecklist: PrivateChecklist = {
    tripId,
    userEmail,
    items: currentItems.map((item) =>
      item.id === itemId && item.tripId === tripId && item.userEmail === userEmail
        ? {
            ...item,
            ...patch,
            updatedAt: now,
          }
        : item,
    ),
    updatedAt: now,
  };

  writeStoredPrivateChecklist(nextChecklist);

  return nextChecklist;
};

export const deletePrivateChecklistItem = (
  tripId: string,
  userEmail: string,
  itemId: string,
  currentItems: PrivateChecklistItem[],
): PrivateChecklist => {
  const nextChecklist: PrivateChecklist = {
    tripId,
    userEmail,
    items: currentItems.filter(
      (item) =>
        !(
          item.id === itemId &&
          item.tripId === tripId &&
          item.userEmail === userEmail
        ),
    ),
    updatedAt: new Date().toISOString(),
  };

  writeStoredPrivateChecklist(nextChecklist);

  return nextChecklist;
};
