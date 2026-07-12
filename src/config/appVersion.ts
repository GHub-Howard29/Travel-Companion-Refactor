/**
 * App 版本設定
 *
 * 此檔案是每次發布新版時的主要修改入口。
 * 更新 APP_VERSION、RELEASE_DATE、RELEASE_NOTES 與 FORCE_UPDATE 後，
 * 必須同步更新 public/app-version.json，
 * PWA 更新提示會使用這些資訊顯示版本內容。
 */
export const APP_VERSION = "3.1.0";

export const RELEASE_DATE = "2026-07-11";

export const RELEASE_NOTES = [
  "修正版本更新提示，同版本或第一次開啟不再誤跳更新視窗",
  "其他資訊與自駕 / 領隊資訊改為先瀏覽、需要時再進入管理",
  "旅費記帳本可單獨移除已上傳的附件，不會刪除帳目",
  "手機新增或編輯照片附件時，可選擇拍照或既有照片",
  "補上其他資訊未來雲端同步所需的資料表與權限設計",
];

export const FORCE_UPDATE = false;
