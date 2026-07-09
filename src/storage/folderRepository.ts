/**
 * Folder Repository（資料存取層）
 *
 * 負責封裝 Folder 的 CRUD（新增、讀取、更新、刪除）操作。
 *
 * UI、Hook 或其他模組不直接操作 localStorage，
 * 一律透過 Repository 存取 Folder 資料。
 *
 * Repository 的目的：
 * 1. 統一 Folder 存取方式。
 * 2. 降低 UI 與 Storage 的耦合。
 * 3. 未來若改成 IndexedDB 或 Supabase，只需修改 Repository。
 * 4. 提供未來同步（Sync）功能的擴充點。
 */
import type { Folder } from "../types";
import {
  readStoredFolders,
  writeStoredFolders,
} from "./folderStorage";

export const getFoldersByTripId = (tripId: string): Folder[] => {
  return readStoredFolders(tripId);
};

export const saveFoldersByTripId = (
  tripId: string,
  folders: Folder[],
): void => {
  writeStoredFolders(tripId, folders);
};

export const addFolderToTrip = (
  tripId: string,
  folder: Folder,
): Folder[] => {
  const folders = readStoredFolders(tripId);
  const updatedFolders = [...folders, folder];

  writeStoredFolders(tripId, updatedFolders);

  return updatedFolders;
};

export const updateFolderInTrip = (
  tripId: string,
  updatedFolder: Folder,
): Folder[] => {
  const folders = readStoredFolders(tripId);

  const updatedFolders = folders.map((folder) =>
    folder.id === updatedFolder.id ? updatedFolder : folder,
  );

  writeStoredFolders(tripId, updatedFolders);

  return updatedFolders;
};

export const removeFolderFromTrip = (
  tripId: string,
  folderId: string,
): Folder[] => {
  const folders = readStoredFolders(tripId);

  const updatedFolders = folders.filter(
    (folder) => folder.id !== folderId,
  );

  writeStoredFolders(tripId, updatedFolders);

  return updatedFolders;
};