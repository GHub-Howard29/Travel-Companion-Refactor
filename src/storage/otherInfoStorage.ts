/**
 * Other Info Storage（其他資訊本機儲存）
 *
 * 負責讀取與寫入「其他資訊」唯讀內容資料。
 *
 * V3-1 階段先使用 localStorage 作為本機資料來源，
 * 未來若改為 JSON 檔、IndexedDB 或 Supabase，
 * 可再集中調整此檔案。
 */

// ================================
// Import
// ================================

import type { OtherInfoItem } from "../types";

// ================================
// Constants
// ================================

const OTHER_INFO_STORAGE_PREFIX = "travel_companion_other_info";

// ================================
// Private Functions
// ================================

const getOtherInfoStorageKey = (tripId: string): string => {
  return `${OTHER_INFO_STORAGE_PREFIX}_${tripId}`;
};

// ================================
// Public Functions
// ================================

/**
 * 讀取指定 Trip 的其他資訊內容
 */
export const readStoredOtherInfoItems = (
  tripId: string,
): OtherInfoItem[] => {
  const rawData = localStorage.getItem(getOtherInfoStorageKey(tripId));

  if (!rawData) {
    return [];
  }

  try {
    const parsedData = JSON.parse(rawData);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData as OtherInfoItem[];
  } catch {
    return [];
  }
};

/**
 * 寫入指定 Trip 的其他資訊內容
 */
export const writeStoredOtherInfoItems = (
  tripId: string,
  items: OtherInfoItem[],
): void => {
  localStorage.setItem(getOtherInfoStorageKey(tripId), JSON.stringify(items));
};

/**
 * 清除指定 Trip 的其他資訊內容
 */
export const clearStoredOtherInfoItems = (tripId: string): void => {
  localStorage.removeItem(getOtherInfoStorageKey(tripId));
};