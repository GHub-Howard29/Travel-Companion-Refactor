/**
 * Folder Defaults（預設資料夾）
 *
 * 負責建立每個 Trip 預設需要的系統資料夾。
 * 例如機票、飯店、交通、票券、保險、簽證等。
 *
 * 此檔案只負責產生預設 Folder 資料，
 * 不負責儲存，也不直接操作 localStorage。
 */

// ================================
// Import
// ================================

import type { Folder, FolderType } from "../types";
import { createFolder } from "./folderUtils";

// ================================
// Types
// ================================

interface DefaultFolderConfig {
  title: string;
  type: FolderType;
  order: number;
}

// ================================
// Constants
// ================================

const DEFAULT_FOLDER_CONFIGS: DefaultFolderConfig[] = [
  { title: "機票", type: "flight", order: 1 },
  { title: "飯店", type: "hotel", order: 2 },
  { title: "交通", type: "transport", order: 3 },
  { title: "票券", type: "ticket", order: 4 },
  { title: "保險", type: "insurance", order: 5 },
  { title: "簽證", type: "visa", order: 6 },
  { title: "Reference", type: "reference", order: 7 },
  { title: "Checklist", type: "checklist", order: 8 },
  { title: "Expense", type: "expense", order: 9 },
];

// ================================
// Public Functions
// ================================

/**
 * 建立指定 Trip 的預設系統 Folder
 */
export const createDefaultFoldersForTrip = (tripId: string): Folder[] => {
  return DEFAULT_FOLDER_CONFIGS.map((config) =>
    createFolder(
      tripId,
      null,
      config.title,
      config.type,
      config.order,
      true,
    ),
  );
};

/**
 * 確保指定 Trip 已包含預設系統 Folder
 */
export const ensureDefaultFoldersForTrip = (
  tripId: string,
  folders: Folder[],
): Folder[] => {
  const missingDefaultFolders = DEFAULT_FOLDER_CONFIGS.filter(
    (config) =>
      !folders.some(
        (folder) =>
          folder.isSystem === true &&
          folder.parentId === null &&
          folder.type === config.type,
      ),
  );

  if (missingDefaultFolders.length === 0) {
    return folders;
  }

  const newDefaultFolders = missingDefaultFolders.map((config) =>
    createFolder(
      tripId,
      null,
      config.title,
      config.type,
      config.order,
      true,
    ),
  );

  return [...folders, ...newDefaultFolders];
};