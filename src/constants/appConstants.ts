/**
 * =====================================
 * Travel Companion
 * 檔案：appConstants.ts
 * 功能：集中管理專案常數
 * =====================================
 */

// 支援手動切換的常用幣別選單配置
export const SUPPORTED_CURRENCIES = [
  { code: 'TWD', symbol: 'NT$', name: '新台幣' },
  { code: 'JPY', symbol: '¥', name: '日圓' },
  { code: 'KRW', symbol: '₩', name: '韓元' },
  { code: 'USD', symbol: '$', name: '美金' },
  { code: 'EUR', symbol: '€', name: '歐元' },
];

// Supabase Storage Bucket 名稱
export const ATTACHMENT_BUCKET = 'expense-attachments';

// IndexedDB 資料庫名稱
export const ATTACHMENT_DB_NAME = 'travel-companion-attachments';

// IndexedDB Object Store 名稱
export const ATTACHMENT_STORE_NAME = 'expense-attachments';

// 單張照片最大容量（1MB）
export const MAX_ATTACHMENT_BYTES = 1024 * 1024;

// 壓縮後照片最長邊限制
export const MAX_ATTACHMENT_EDGE = 1800;
