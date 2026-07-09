import type { Folder } from "../types";

const FOLDER_STORAGE_PREFIX = "travel_companion_folders";

const getFolderStorageKey = (tripId: string): string => {
  return `${FOLDER_STORAGE_PREFIX}_${tripId}`;
};

export const readStoredFolders = (tripId: string): Folder[] => {
  const rawData = localStorage.getItem(getFolderStorageKey(tripId));

  if (!rawData) {
    return [];
  }

  try {
    const parsedData = JSON.parse(rawData);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData as Folder[];
  } catch {
    return [];
  }
};

export const writeStoredFolders = (
  tripId: string,
  folders: Folder[],
): void => {
  localStorage.setItem(getFolderStorageKey(tripId), JSON.stringify(folders));
};

export const clearStoredFolders = (tripId: string): void => {
  localStorage.removeItem(getFolderStorageKey(tripId));
};