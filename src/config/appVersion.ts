/**
 * App 版本設定
 *
 * 此檔案是每次發布新版時的主要修改入口。
 * 更新 APP_VERSION、RELEASE_DATE、RELEASE_NOTES 與 FORCE_UPDATE 後，
 * 必須同步更新 public/app-version.json，
 * PWA 更新提示會使用這些資訊顯示版本內容。
 */
export const APP_VERSION = "3.1.1";

export const RELEASE_DATE = "2026-07-12";

export const RELEASE_NOTES = [
  "其他資訊開始接上雲端同步基礎，有權限者新增、編輯或刪除後會嘗試同步到 Supabase",
  "開啟旅程時會優先讀取雲端其他資訊，讀不到時仍保留原本旅程資料作為備援",
  "刪除旅程時會一併清理該旅程的其他資訊雲端資料",
  "此版本仍保留本機與 Trip 內容備援，避免雲端資料表尚未啟用時影響使用",
];

export const FORCE_UPDATE = false;
