/**
 * Other Info Service（其他資訊服務層）
 *
 * 負責整合：
 * - 預設 Folder
 * - 靜態資料
 * - Repository
 *
 * UI 不直接操作 Storage 或 Constants，
 * 一律透過 Service 取得資料。
 */

// ================================
// Import
// ================================

import type { Folder, OtherInfoItem } from "../types";

import {
  createDefaultFoldersForTrip,
  ensureDefaultFoldersForTrip,
} from "../utils/folderDefaults";

import {
  sortFoldersByOrder,
} from "../utils/folderUtils";

import {
  sortOtherInfoItemsByOrder,
} from "../utils/otherInfoUtils";

import {
  OTHER_INFO_DATA_BY_TRIP_ID,
} from "../constants/otherInfoData";

import {
  getFoldersByTripId,
} from "../storage/folderRepository";

import {
  readStoredOtherInfoItems,
} from "../storage/otherInfoStorage";

// ================================
// Public Functions
// ================================

/**
 * 取得指定 Trip 的第一層固定分類
 */
export const getDefaultFolders = (
  tripId: string,
): Folder[] => {
  return createDefaultFoldersForTrip(tripId);
};

/**
 * 取得指定 Trip 的所有 Folder
 */
export const getFolders = (
  tripId: string,
): Folder[] => {
  const seedFolders = OTHER_INFO_DATA_BY_TRIP_ID[tripId]?.folders ?? [];
  const storedFolders = getFoldersByTripId(tripId);
  const mergedFoldersById = new Map<string, Folder>();

  createDefaultFoldersForTrip(tripId).forEach((folder) => {
    mergedFoldersById.set(folder.id, folder);
  });

  seedFolders.forEach((folder) => {
    mergedFoldersById.set(folder.id, folder);
  });

  storedFolders.forEach((folder) => {
    mergedFoldersById.set(folder.id, folder);
  });

  const folders = ensureDefaultFoldersForTrip(
    tripId,
    Array.from(mergedFoldersById.values()),
  );

  return sortFoldersByOrder(folders);
};

/**
 * 取得指定 Trip 的所有內容
 */
export const getItems = (
  tripId: string,
): OtherInfoItem[] => {
  const seedItems = OTHER_INFO_DATA_BY_TRIP_ID[tripId]?.items ?? [];
  const storedItems = readStoredOtherInfoItems(tripId);
  const mergedItemsById = new Map<string, OtherInfoItem>();

  seedItems.forEach((item) => {
    mergedItemsById.set(item.id, item);
  });

  storedItems.forEach((item) => {
    mergedItemsById.set(item.id, item);
  });

  return sortOtherInfoItemsByOrder(Array.from(mergedItemsById.values()));
};
