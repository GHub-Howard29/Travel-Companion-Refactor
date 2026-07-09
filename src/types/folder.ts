export type FolderType =
  | "flight"
  | "hotel"
  | "transport"
  | "ticket"
  | "insurance"
  | "visa"
  | "reference"
  | "checklist"
  | "expense"
  | "custom";

export interface Folder {
  /** 唯一 ID */
  id: string;

  /** 所屬 Trip */
  tripId: string;

  /** 父資料夾，Root 為 null */
  parentId: string | null;

  /** 資料夾類型 */
  type: FolderType;

  /** 顯示名稱 */
  title: string;

  /** 排序 */
  order: number;

  /** 是否預設資料夾 */
  isSystem: boolean;

  /** 建立時間 */
  createdAt: string;

  /** 更新時間 */
  updatedAt: string;
}