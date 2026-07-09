import type { Folder, FolderType } from "../types";

/**
 * 建立新的 Folder
 */
export const createFolder = (
  tripId: string,
  parentId: string | null,
  title: string,
  type: FolderType = "custom",
  order = 0,
  isSystem = false,
): Folder => {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    tripId,
    parentId,
    title,
    type,
    order,
    isSystem,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * 更新 Folder 時間
 */
export const updateFolderTimestamp = (
  folder: Folder,
): Folder => ({
  ...folder,
  updatedAt: new Date().toISOString(),
});

/**
 * Root Folder
 */
export const getRootFolders = (
  folders: Folder[],
): Folder[] => {
  return folders.filter(
    (folder) => folder.parentId === null,
  );
};

/**
 * 取得子 Folder
 */
export const getChildFolders = (
  folders: Folder[],
  parentId: string,
): Folder[] => {
  return folders.filter(
    (folder) => folder.parentId === parentId,
  );
};