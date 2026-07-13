/**
 * App 版本設定
 *
 * 此檔案是每次發布新版時的主要修改入口。
 * 更新 APP_VERSION、RELEASE_DATE、RELEASE_NOTES 與 FORCE_UPDATE 後，
 * 必須同步更新 public/app-version.json，
 * PWA 更新提示會使用這些資訊顯示版本內容。
 */
export const APP_VERSION = "3.1.4";

export const RELEASE_DATE = "2026-07-13";

export const RELEASE_NOTES = [
  "非強制更新恢復顯示更新提示，提供馬上更新與稍後更新選項",
  "選擇馬上更新時會先清除 App 暫存，再重新載入最新版本",
  "選擇稍後更新不會標記為已讀，重新整理或重新開啟 App 會再次提醒",
  "新增與編輯旅程時，參與者名稱與登入 Email 合併為名稱=Email 欄位，降低重複輸入",
  "預設幣別新增並排序為 TWD、JPY、KRW、USD、EUR",
  "TWD、JPY、KRW 分攤結算改為整數進位規則，零頭盈餘由代墊者承接",
  "更新提示補上未儲存資料警語，提醒先儲存後再更新",
];

export const FORCE_UPDATE = false;
