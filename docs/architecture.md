# 系統架構

## Storage

目前存在三種資料來源

### LocalStorage

用途：

- 個人帳本
- 快取
- 離線新增

主要 Key

```
cached_expenses_xxx
offline_expenses
```

---

### IndexedDB

用途：

儲存照片附件。

包含：

- Blob
- attachment id
- expense id
- trip id

---

### Supabase

用途：

共用帳本。

內容：

- expense
- attachment metadata

真正照片：

Supabase Storage

---

## 同步流程

新增

↓

LocalStorage

↓

Supabase Expense

↓

IndexedDB

↓

Supabase Storage

---

## 已知問題

目前 attachment 同步流程仍需整理。