# Travel Companion V3-1 Handoff

更新日期：2026-07-10

---

# 目前開發狀態

V3-1 已完成底層架構建立，並已完成其他資訊 / 參考資訊簡易本機管理工具第一階段串接。
檢查清單模組已完成第一階段拆分、依旅程區分的本機持久化，以及私人確認清單最小雲端同步。

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
- privateChecklistStorage.ts
- privateChecklistService.ts
- useChecklistState.ts
- usePrivateChecklistState.ts
- ChecklistPage.tsx
- PrivateChecklistPage.tsx
- App.tsx 檢查清單畫面抽出

目前：

- 「共同檢查清單」勾選狀態已依 `tripId` 寫入 localStorage
- 「私人確認清單」已建立獨立功能選單入口，位於共同檢查清單下方
- 私人確認清單已依 `userEmail + tripId` 寫入 localStorage
- 私人確認清單支援新增、編輯、刪除、勾選與進度顯示
- 私人確認清單已接上最小雲端同步
- `trip_editor` / `super_admin` 可同步自己的私人確認清單到 Supabase
- 私人確認清單雲端同步只讀寫 `owner_user_id = auth.uid()` 的資料，不可讀取其他使用者私人清單
- 私人確認清單雲端 item 使用 `client_item_id` 對應本機 `private_...` item id
- 私人確認清單 UI 會顯示同步中、已同步、同步失敗等狀態
- 未登入使用者不顯示私人確認清單入口
- 未登入狀態停留在私人確認清單或記帳本時，會自動導回行程頁
- 重新整理後可保留已勾選項目
- 自由行 / 跟團各自保留勾選狀態
- App.tsx 不再直接持有 checkedItems state
- ChecklistPage 自行管理分類、進度、空狀態與 item toggle
- Hook 只透過 checklistService 取得 / 更新資料
- checklistService 統一處理進度資料
- checklistStorage 負責 localStorage 讀寫與執行期資料驗證
- 進度計算會忽略已不存在的 item id

尚未完成：

- 共同檢查清單 App 內新增 / 編輯 / 刪除 item
- 共同檢查清單雲端同步
- 共同檢查清單 seed 初始化至 Supabase
- Checklist sync policy 尚未接進前端
- Checklist Pending Queue / Conflict Resolution 尚未實作

權限定案：

共同檢查清單：

| 角色 | 可見 | 勾選 |
|---|---|---|
| guest | 可 | 不可 |
| user | 可 | 不可 |
| trip_editor | 可 | 可 |
| super_admin | 可 | 可 |

私人檢查清單：

| 角色 | 功能選單 | 可見 | 勾選 | 編輯（新增 / 刪除） | 雲端同步 |
|---|---|---|---|---|---|
| guest | 不顯示，或點選時要求登入 | 不可 | 不可 | 不可 | 不可 |
| user | 顯示 | 可，僅自己的私人清單 | 可，僅自己的私人清單 | 可，本機保存 | 不可 |
| trip_editor | 顯示 | 可，僅自己的私人清單 | 可，僅自己的私人清單 | 可 | 可 |
| super_admin | 顯示 | 可，僅自己的私人清單 | 可，僅自己的私人清單 | 可 | 可 |

已定案：

- `trip_editor` 依 `tripId` 分別定義。
- 私人檢查清單本機 ownership 使用 `userEmail + tripId`。
- `user` 可進入私人檢查清單，可新增 / 編輯 / 刪除，但只能保存於本機。
- `trip_editor` / `super_admin` 可新增 / 編輯 / 刪除自己的私人檢查清單，並可自動同步到雲端。
- `trip_editor` / `super_admin` 都不可查看其他使用者的私人檢查清單。
- 私人檢查清單放在左上角功能選單中，位置在共同檢查清單下方；不放進共同檢查清單頁面內。
- 共同檢查清單下一步雲端同步仍維持 guest / user 可見不可勾選，`trip_editor` / `super_admin` 可勾選。

---

## 其他資訊

已完成：

- otherInfo.ts
- otherInfoUtils.ts
- otherInfoStorage.ts
- otherInfoRepository.ts
- otherInfoService.ts
- otherInfoData.ts（第一批預設資料）
- OtherInfoPage 簡易管理畫面
- App.tsx otherInfo 類型串接
- AppSidebar.tsx otherInfo icon mapping
- Trip sidebarConfig 新增「其他資訊」
- 其他資訊內容 URL 自動轉換為可點擊超連結

目前：

- 自由行與跟團旅程皆已顯示「其他資訊」
- 參考資訊資料由預設資料 + 本機儲存資料合併後呈現
- 可新增、編輯、刪除其他資訊項目
- 目前只存 localStorage，不同步雲端
- 預設資料保留為預設內容
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

作為畫面唯一資料入口。

---

## Supabase Checklist Schema

已新增 SQL 設計檔：

- `docs/sql/001_checklist_cloud_schema.sql`

已由 Product Owner 在 Supabase SQL Editor 執行並人工確認完成。

此 SQL 採用目前既有的 `admin_users(email, role, trip_id)` 作為權限來源。

新增旅程或新增 `trip_editor` 時，只需維護 Supabase `admin_users` 資料，不需要修改程式。

私人確認清單雲端 RLS 以 `owner_user_id = auth.uid()` 限制。

因此：

- `super_admin` 不可查看其他使用者私人確認清單。
- `trip_editor` 不可查看其他使用者私人確認清單。
- `trip_editor` / `super_admin` 只可同步自己的私人確認清單。
- `checklist_items.client_item_id` 已建立，用來保存前端本機 item id。
- `checklist_items_one_client_item_per_checklist` index 已建立，用於穩定 upsert / mapping。
- validation SQL 已由 Product Owner 人工確認：RLS、policies、functions、indexes、`admin_users(email, role, trip_id)` 皆符合要求。

目前已確認：

- 私人確認清單新增 / 勾選可同步到 `checklist_items`。
- Supabase Table Editor 可看到 private item rows。
- 共同檢查清單尚未同步到雲端，仍使用 Trip JSON seed + localStorage 勾選進度。

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
- privateChecklistStorage.ts

src/utils/

- folderUtils.ts
- folderDefaults.ts
- otherInfoUtils.ts

src/services/

- otherInfoService.ts
- checklistService.ts
- privateChecklistService.ts
- privateChecklistCloudService.ts

src/hooks/

- useChecklistState.ts
- usePrivateChecklistState.ts
- useOtherInfoForm.ts

src/components/

- ChecklistPage.tsx
- PrivateChecklistPage.tsx
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

1. 新對話先接「共同檢查清單最小雲端同步」。
2. 共同清單同步建議範圍：
   - App 第一次進共同清單時，若 Supabase 沒有 `scope = shared` checklist，就用 Trip JSON `checklistData` 建立 shared checklist rows。
   - 之後共同清單優先讀雲端資料。
   - `guest` / `user` 可見但不可勾選。
   - `trip_editor` / `super_admin` 可勾選並同步 `is_checked`。
   - 暫時不做 App 內新增、編輯、刪除共同項目。
3. 暫緩項目：
   - Checklist Pending Queue。
   - Conflict Resolution。
   - 共同清單 item 管理。
   - 其他資訊雲端同步。
4. 下一輪交付前執行：
   - `npm run lint`
   - `npm run build`
