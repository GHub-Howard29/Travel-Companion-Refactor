# Travel Companion V3-1 Handoff

更新日期：2026-07-09

---

# 目前開發狀態

V3-1 已完成底層架構建立，並已完成 Other Info / Reference 簡易本機管理工具第一階段串接。
Checklist Module 也已完成第一階段拆分與 Trip-scoped local persistence。

目前已完成：

## Folder

完成：

- Folder Type 重構為純樹狀模型
- folderStorage
- folderRepository
- folderUtils
- folderDefaults
- createFolderWithId()

目前 Folder 已定案：

- 第一層：系統固定分類
- 第二層開始：自由建立
- 不使用 FolderType
- 不使用 category
- 以 parentId 建立 Tree

---

## Checklist

已完成：

- checklist.ts
- checklistStorage.ts
- checklistService.ts
- useChecklistState.ts
- ChecklistPage.tsx
- App.tsx checklist UI 抽出

目前：

- 「共同檢查清單」勾選狀態已依 tripId 寫入 localStorage
- F5 後可保留已勾選項目
- 自由行 / 跟團各自保留勾選狀態
- App.tsx 不再直接持有 checkedItems state
- ChecklistPage 自行管理分類、進度、空狀態與 item toggle
- Hook 只透過 checklistService 取得 / 更新資料
- checklistService 統一處理 progress payload
- checklistStorage 負責 localStorage 讀寫與 runtime validation
- 進度計算會忽略已不存在的 item id

尚未完成：

- Public Checklist / Private Checklist 拆分
- App 內新增 / 編輯 / 刪除 checklist item
- 雲端同步
- 權限過濾

---

## Other Info

已完成：

- otherInfo.ts
- otherInfoUtils.ts
- otherInfoStorage.ts
- otherInfoRepository.ts
- otherInfoService.ts
- otherInfoData.ts（第一批 seed data）
- OtherInfoPage 簡易管理 UI
- App.tsx otherInfo 類型串接
- AppSidebar.tsx otherInfo icon mapping
- Trip sidebarConfig 新增「其他資訊」
- Other Info 內容 URL 自動轉換為可點擊超連結

目前：

- 自由行與跟團旅程皆已顯示「其他資訊」
- Reference 資料由 seed data + local stored data 合併後呈現
- 可新增、編輯、刪除 Other Info item
- 目前只存 localStorage，不同步雲端
- seed data 保留為預設資料
- 編輯 seed item 會以 localStorage 覆蓋
- 刪除 seed item 會寫入 `isDeleted` 標記
- Folder chips 自動換行，不使用水平 scrollbar
- 顯示資料筆數、空狀態與 item card
- 內容中的 `http` / `https` URL 會自動轉為超連結並以新分頁開啟

---

## Service

已建立：

OtherInfoService

目前提供：

- getDefaultFolders()
- getFolders()
- getItems()
- createOtherInfoItem()
- updateOtherInfoItem()
- deleteOtherInfoItem()

作為 UI 唯一資料入口。

---

# 已完成檔案

src/types/

- folder.ts
- otherInfo.ts
- checklist.ts

src/storage/

- folderStorage.ts
- folderRepository.ts
- otherInfoStorage.ts
- otherInfoRepository.ts
- checklistStorage.ts

src/utils/

- folderUtils.ts
- folderDefaults.ts
- otherInfoUtils.ts

src/services/

- otherInfoService.ts
- checklistService.ts

src/hooks/

- useChecklistState.ts
- useOtherInfoForm.ts

src/components/

- ChecklistPage.tsx
- OtherInfoPage.tsx

src/constants/

- otherInfoData.ts

---

# Build

目前已執行並通過：

```bash
npm.cmd run build
```

僅剩 Vite chunk size warning，非 V3-1 阻塞項目。

---

# 下一步

建議流程：

1. 瀏覽器手測 Other Info：
   - 左側是否出現「其他資訊」
   - 自由行 / 跟團切換後資料是否各自正確
   - folder chips 是否換行整齊
   - 新增、編輯、刪除後 localStorage 是否正確保留
   - 編輯 / 刪除 seed item 後是否正確覆蓋預設資料
   - `http` / `https` URL 是否可點擊並開新分頁
   - 原本文字頁是否仍維持 Text Page 呈現

2. 瀏覽器手測 Checklist：
   - 勾選項目後 F5 是否保留
   - 自由行 / 跟團切換後是否各自保留
   - 勾選進度是否正確
   - 若 trip seed item 變動，已不存在的 checked id 是否不影響進度

3. 下一步建議：
   - 規劃 Public Checklist / Private Checklist 資料模型
   - 再決定是否提供 APP 內新增 / 編輯 / 刪除 checklist item
   - 評估 Checklist 是否需要 cloud sync / pending queue
