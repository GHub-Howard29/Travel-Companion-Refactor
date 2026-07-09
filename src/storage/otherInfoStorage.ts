/**
 * Other Info Storage（其他資訊本機儲存）
 *
 * 負責讀取與寫入「其他資訊」本機覆寫資料。
 *
 * V3-1 階段先使用 localStorage 作為新增 / 編輯 / 刪除資料來源，
 * 未來若改為 JSON 檔、IndexedDB 或 Supabase，
 * 可再集中調整此檔案。
 */


import type { OtherInfoItem } from "../types";

const OTHER_INFO_STORAGE_PREFIX = "travel_companion_other_info";

const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

const isNumber = (value: unknown): value is number => {
  return typeof value === "number" && Number.isFinite(value);
};

const isStoredOtherInfoItem = (value: unknown): value is OtherInfoItem => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<OtherInfoItem>;

  return (
    isString(item.id) &&
    isString(item.tripId) &&
    isString(item.folderId) &&
    isString(item.title) &&
    isString(item.content) &&
    isNumber(item.order) &&
    isString(item.createdAt) &&
    isString(item.updatedAt) &&
    (item.isDeleted === undefined || typeof item.isDeleted === "boolean")
  );
};

const getOtherInfoStorageKey = (tripId: string): string => {
  return `${OTHER_INFO_STORAGE_PREFIX}_${tripId}`;
};

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

    return parsedData.filter(isStoredOtherInfoItem);
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
