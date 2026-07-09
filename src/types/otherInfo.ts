/**
 * Other Info Type（其他資訊內容型別）
 *
 * 定義「其他資訊」功能的唯讀內容資料。
 *
 * Folder 負責分類與分層。
 * OtherInfoItem 負責實際顯示內容。
 *
 * 本功能目前定位為管理者預先整理資料後發布，
 * 不提供一般使用者於 APP 內新增、編輯或刪除。
 *
 * allowedRoles 先作為未來權限控管的擴充欄位，
 * V3-1 先不實作 Role 過濾邏輯。
 */

// ================================
// Import
// ================================

import type { Role } from "../permissions/roles";

// ================================
// Public Types
// ================================

export interface OtherInfoItem {
  /** 唯一 ID */
  id: string;

  /** 所屬 Trip */
  tripId: string;

  /** 所屬 Folder */
  folderId: string;

  /** 內容標題 */
  title: string;

  /** 主要文字內容 */
  content: string;

  /** 可閱讀角色，未設定代表不限制 */
  allowedRoles?: Role[];

  /** 排序 */
  order: number;

  /** 建立時間 */
  createdAt: string;

  /** 更新時間 */
  updatedAt: string;
}