/**
 * Other Info Data（其他資訊靜態資料）
 *
 * 負責集中維護「其他資訊」的預設資料。
 *
 * 本功能目前定位為管理者預先整理資料後發布，
 * 不提供一般使用者於 APP 內新增、編輯或刪除。
 *
 * 新增旅程其他資訊時，主要維護此檔案內容，
 * 再重新 Build 並部署。
 */

// ================================
// Import
// ================================

import type { Folder, OtherInfoItem } from "../types";

// ================================
// Types
// ================================

interface OtherInfoTripData {
  folders: Folder[];
  items: OtherInfoItem[];
}

// ================================
// Constants
// ================================

export const OTHER_INFO_DATA_BY_TRIP_ID: Record<string, OtherInfoTripData> = {};