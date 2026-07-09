# Travel Companion Agent Guide

## 最新交接摘要（2026-07-09）

本節是給另一台電腦 / 新 Codex thread 接續用的最新狀態。進入專案後請先讀本節，再依任務查閱 `docs/001 V3-1_Handoff.md`、`docs/002 V3-1_Architecture_Decisions.md`、`docs/04_資料庫設計.md`、`docs/09_待辦事項(TODO).md`。

### 目前 Git 狀態

- Branch：`develop`
- 最新 commit：`a748e82 落地檢查清單權限與私人清單本機版`
- 這個 commit 已在本機完成，尚未確認是否已 push 到遠端。
- commit message 規則：使用者已要求「中文 commit」，後續 Codex 建立 commit 時一律使用繁體中文。

### 目前開發進度

V3-1 目前已完成：

- Folder 架構定案為純 tree model。
- Other Info / 參考資訊第一階段本機管理已完成，支援新增、編輯、刪除、URL 轉連結。
- 共同檢查清單已抽成 `ChecklistPage -> useChecklistState -> checklistService -> checklistStorage -> localStorage`。
- 共同檢查清單勾選狀態已依 `tripId` 保存於 localStorage。
- 共同檢查清單權限矩陣已落地：
  - `guest` / `user`：可見、不可勾選。
  - `trip_editor` / `super_admin`：可見、可勾選。
- 私人確認清單本機版已落地：
  - 左上角功能選單中，位於共同檢查清單下方。
  - 未登入使用者不顯示私人確認清單入口。
  - 使用 Supabase Auth 的 `session.user.id` 作為 `userId`。
  - localStorage ownership 為 `userId + tripId`。
  - 支援新增、編輯、刪除、勾選與進度顯示。
- Supabase checklist tables / RLS 已設計成 SQL 檔，但尚未執行到遠端 Supabase。
- `npm run lint` 通過。
- `npm run build` 通過，僅剩 Vite chunk size warning。

### 本輪已完成修改

程式：

- `src/permissions/permission.ts`
  - 新增 checklist 權限欄位：
    - `canViewSharedChecklist`
    - `canToggleSharedChecklist`
    - `canViewPrivateChecklist`
    - `canTogglePrivateChecklist`
    - `canEditPrivateChecklist`
    - `canSyncPrivateChecklist`
  - `canSyncPrivateChecklist` 只給 `trip_editor` / `super_admin`。
  - 沒有任何「可讀取所有私人清單」權限。
- `src/hooks/useTripWorkspace.ts`
  - 讀取 Supabase Auth `session.user.id`。
  - 回傳 `userId`、`role`、`permission`、`isAssignedTrip`。
  - 允許 synthetic screen `privateChecklist`。
- `src/app/context/AppContext.ts`
  - 全域 context 補 `userId`。
- `src/App.tsx`
  - 接上 `AppContext.Provider`。
  - 接上 `PrivateChecklistPage`。
  - 以 `currentScreenType` 支援 synthetic screen。
  - 登出時清除 `userId`。
- `src/components/layout/AppSidebar.tsx`
  - 登入時在共同檢查清單下方動態插入「私人確認清單」。
  - 未登入不顯示私人確認清單。
- `src/components/ChecklistPage.tsx`
  - 共同檢查清單可見 / 可勾選權限接進 UI。
- `src/components/PrivateChecklistPage.tsx`
  - 新增私人確認清單本機 UI。
- `src/types/checklist.ts`
  - 新增 `PrivateChecklist` / `PrivateChecklistItem`。
- `src/storage/privateChecklistStorage.ts`
  - 新增 `userId + tripId` localStorage storage layer。
- `src/services/privateChecklistService.ts`
  - 新增私人確認清單本機 service。
- `src/hooks/usePrivateChecklistState.ts`
  - 新增私人確認清單 hook。
- `src/components/OtherInfoPage.tsx`
  - 移除 effect 內同步 setState 的 lint 問題，改由 `App.tsx` 以 `key={selectedTripId}` 重掛載。
- `src/hooks/useExpenseBook.ts`
  - 修正 React Hooks lint 問題，將載入函式改為 `useCallback` 並補 dependencies。

文件：

- `docs/sql/001_checklist_cloud_schema.sql`
  - 新增 Supabase checklist cloud schema / RLS 設計。
  - 建立 `checklists`、`checklist_items`。
  - 以既有 `admin_users(email, role, trip_id)` 作為權限來源。
  - 私人清單 RLS 強制 `owner_user_id = auth.uid()`。
  - `super_admin` / `trip_editor` 不可讀取其他使用者私人確認清單。
  - 目前尚未執行到遠端 Supabase。
- `docs/001 V3-1_Handoff.md`
- `docs/002 V3-1_Architecture_Decisions.md`
- `docs/04_資料庫設計.md`
- `docs/09_待辦事項(TODO).md`
  - 已同步更新 checklist 權限、私人確認清單本機版、Supabase schema/RLS 狀態。

### 尚未完成事項

最高優先：

- 尚未在 Supabase SQL Editor 執行 `docs/sql/001_checklist_cloud_schema.sql`。
- 尚未實作共同檢查清單雲端同步。
- 尚未實作私人確認清單雲端同步。
- 尚未設計 / 實作 checklist sync policy：
  - localStorage 與 Supabase 如何合併。
  - offline pending queue。
  - last-write-wins 或其他 conflict resolution。
  - seed `checklistData` 如何搬到 shared checklist cloud rows。

仍待評估：

- 共同檢查清單是否要支援 App 內新增 / 編輯 / 刪除 item。
- 是否要將 `admin_users` 中長期補上 `user_id uuid`。
  - 目前程式與 SQL 仍可沿用 `email + role + trip_id`，新增 `trip_editor` 只需維護 Supabase 表格，不需改程式。
  - 若未來 RLS 想更穩，可再補 `user_id`。
- 其他資訊 / 參考資訊尚未實作權限過濾與雲端同步。
- Vite chunk size warning 尚未處理。

### 重要檔案

Checklist / Permission：

- `src/permissions/roles.ts`
- `src/permissions/roleMapper.ts`
- `src/permissions/permission.ts`
- `src/hooks/useTripWorkspace.ts`
- `src/components/ChecklistPage.tsx`
- `src/components/PrivateChecklistPage.tsx`
- `src/hooks/useChecklistState.ts`
- `src/hooks/usePrivateChecklistState.ts`
- `src/services/checklistService.ts`
- `src/services/privateChecklistService.ts`
- `src/storage/checklistStorage.ts`
- `src/storage/privateChecklistStorage.ts`
- `src/types/checklist.ts`

App / navigation：

- `src/App.tsx`
- `src/app/context/AppContext.ts`
- `src/components/layout/AppSidebar.tsx`

Supabase / docs：

- `docs/sql/001_checklist_cloud_schema.sql`
- `docs/001 V3-1_Handoff.md`
- `docs/002 V3-1_Architecture_Decisions.md`
- `docs/04_資料庫設計.md`
- `docs/09_待辦事項(TODO).md`

Other Info / lint related：

- `src/components/OtherInfoPage.tsx`
- `src/hooks/useExpenseBook.ts`

### 下一步建議

1. 先確認目前 commit 是否要 push：

   ```bash
   git push
   ```

   若 upstream 尚未設定：

   ```bash
   git push -u origin develop
   ```

2. 在 Supabase SQL Editor 執行前，先人工審閱：

   ```text
   docs/sql/001_checklist_cloud_schema.sql
   ```

3. 執行 SQL 後，用 Supabase Table Editor / SQL 驗證：

   - `checklists` / `checklist_items` 是否建立成功。
   - RLS 是否已啟用。
   - guest 是否只能讀 shared。
   - `trip_editor` 是否只能編輯所屬 trip 的 shared checklist。
   - `super_admin` 是否可編輯 shared checklist。
   - private checklist 是否只有 `owner_user_id = auth.uid()` 可讀寫。

4. 再接前端雲端同步：

   - 建立 cloud service/repository。
   - 將 `canSyncPrivateChecklist` 作為雲端同步開關。
   - `user` 保持本機私人清單。
   - `trip_editor` / `super_admin` 同步自己的私人清單。
   - 不要讓任何角色讀取別人的私人清單。

5. 每次交付前執行：

   ```bash
   npm run lint
   npm run build
   ```

## Commit Message Language

- 當使用者要求由 Codex 建立 Git commit 時，commit message 一律使用繁體中文。
- commit message 應簡潔描述實際變更，例如：`新增其他資訊本機管理`、`修正共同檢查清單名稱`。
- 不要使用英文 commit message，除非使用者在該次請求中明確指定。
本文件是給 AI agent / coding assistant 進入本專案時的工作入口。請先讀本文件，再依任務需要查閱 `docs/` 內的詳細文件。

## 專案定位

Travel Companion 是一個以旅程 `Trip` 為核心的旅行輔助工具。目標是讓使用者在旅行前與旅行中，可以用同一個 App 管理行程、清單、共同支出、參考資訊與後續擴充工具。

核心原則：

- **Trip First**：所有資料與功能都應該能回到某一個旅程。
- **Offline First**：本地資料與離線可用性優先，雲端同步是加值能力。
- **Tool / Module First**：每個 Travel Tool 應維持自己的 UI、state、business logic、storage 邊界。
- **Foundation First**：Workspace、Current Trip、Current User、Role、Permission、Sync、Storage 這些能力應作為共用基礎，不要散落在各工具內。
- **Simple First**：優先選擇可讀、可維護、低耦合的實作。

## 技術棧

- Frontend：React + TypeScript + Vite
- Styling：目前以 CSS / Tailwind utility class 混用
- Icons：`lucide-react`
- Local data：`localStorage`、IndexedDB 設計方向
- Cloud：Supabase Database / Storage / Auth
- Export：`xlsx`、`exceljs`
- Deploy：GitHub Pages

常用命令：

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

交付前至少執行：

```bash
npm run build
```

若任務改動較大或涉及 TS/React 規則，也執行：

```bash
npm run lint
```

## 重要文件入口

優先閱讀：

- `docs/000 Development Standard.md`：開發標準、角色分工、Build / Git / 文件規則。
- `docs/001 V3-1_Handoff.md`：V3-1 目前交接狀態。
- `docs/002 V3-1_Architecture_Decisions.md`：V3-1 架構決策。
- `docs/01_Travel Companion V3 架構藍圖.md`：V3 整體架構。
- `docs/02_產品開發路線圖.md`：Roadmap 與功能階段。
- `docs/04_資料庫設計.md`：資料模型方向。
- `docs/05_模組架構說明.md`：模組邊界。
- `docs/06_功能規格.md`：功能規格。
- `docs/08_開發規範.md`：程式與流程規範。
- `docs/09_待辦事項(TODO).md`：待辦與後續工作。
- `docs/11_名詞定義.md`：專案名詞。

注意：部分文件目前可能有編碼顯示問題。若內容在終端顯示亂碼，請交叉參考檔名、程式碼、README 與其他文件，不要直接覆蓋原文件。

## 目前專案狀態摘要

目前主線接近 V3 / V3-1 重構階段：

- 已有基本旅程載入、行程、清單、共同支出、附件同步、Excel 匯出等功能。
- `Expense` 模組已拆出 components / hooks / utils / storage / types。
- V3-1 正在處理 `Other Info` / Reference 類功能的本機資料管理與架構基礎。
- Checklist Module 已完成第一階段拆分，勾選狀態使用 Trip-scoped localStorage persistence。
- V3-1 已定義 `Folder` 應為通用 Tree 結構，不再用 `FolderType` 或 `category` 硬編碼分類。
- `OtherInfoService` 是 UI 取得 Folder / Item 的入口，UI 不應直接依賴 constants 或 storage 細節。
- `OtherInfoPage` 目前已有簡易管理 UI，可新增、編輯、刪除資料；目前只寫入 localStorage，不同步雲端。

## 目前目錄結構重點

```text
src/
  app/context/          App 層 context
  components/           UI components
    expense/            Expense UI
    layout/             App layout
  constants/            靜態資料與 app constants
  hooks/                跨 component 的 state / workflow
  permissions/          role / permission
  services/             UI 與資料來源之間的 service layer
  storage/              local/cloud storage 與 repository
  types/                domain types
  utils/                pure helper / business utilities
public/trips/           trip seed json
docs/                   project docs
```

## 架構規則

### Layering

建議資料流：

```text
UI
  -> hooks / services
  -> utils / repository
  -> storage / constants / cloud
```

請避免：

- UI 直接操作 storage key。
- UI 直接依賴大量 static constants 作為長期資料來源。
- 在 `App.tsx` 繼續堆疊大型功能。
- Travel Tool 之間互相讀寫內部 state。
- 為了短期功能加入會破壞 Trip / Workspace / Permission 邊界的捷徑。

### Travel Tool

每個 Travel Tool 設計前先確認：

- Tool 名稱與用途。
- 資料 ownership：資料屬於 Trip、User、Workspace 還是 Shared resource。
- 權限：誰能看、誰能新增、誰能修改、誰能刪除。
- Storage：local first 還是 cloud first。
- Sync：是否需要 pending queue / retry / conflict handling。
- Lifecycle：預設資料如何建立，何時更新，何時刪除。

## V3-1 Folder / Other Info 決策

`Folder` 是通用 tree node，目前定義於 `src/types/folder.ts`。

保留欄位方向：

- `id`
- `tripId`
- `parentId`
- `title`
- `order`
- `isSystem`
- `createdAt`
- `updatedAt`

決策：

- 不新增 `FolderType`。
- 不新增 `category`。
- 預設系統資料夾使用固定 ID，例如 `other-info-attractions`、`other-info-flights`。
- 預設資料夾與使用者資料夾都應走同一個 Folder tree 模型。
- UI 顯示分類時，應從 Folder tree 推導，不要另建分類 enum。

`Other Info` 目前相關檔案：

- `src/types/otherInfo.ts`
- `src/utils/otherInfoUtils.ts`
- `src/storage/otherInfoStorage.ts`
- `src/services/otherInfoService.ts`
- `src/constants/otherInfoData.ts`
- `src/components/OtherInfoPage.tsx`

工作方向：

- 讓 `OtherInfoPage` 只透過 service 取得資料。
- 將預設 folder、trip seed data、local user data 的合併邏輯放在 service/repository 層。
- Seed data 保留為預設資料；編輯 seed item 時以 localStorage 覆蓋，刪除 seed item 時以 `isDeleted` 標記覆蓋。
- Other Info 內容中的 `http` / `https` URL 應自動轉成可點擊超連結，並以新分頁開啟。
- 後續補上完整 folder tree、navigation、permission、sync / cloud persistence。

## V3-1 Checklist 決策

`Checklist` 目前相關檔案：

- `src/types/checklist.ts`
- `src/storage/checklistStorage.ts`
- `src/services/checklistService.ts`
- `src/hooks/useChecklistState.ts`
- `src/components/ChecklistPage.tsx`

目前狀態：

- Trip JSON 的 `checklistData` 作為共同檢查清單 seed。
- 勾選狀態依 `tripId` 寫入 localStorage，F5 後不會清空。
- 自由行 / 跟團各自保留勾選狀態。
- `App.tsx` 不再直接持有 checklist checked state。
- 資料流為 `ChecklistPage -> useChecklistState -> checklistService -> checklistStorage -> localStorage`。
- 進度計算會忽略已不存在的 checked item id。

後續方向：

- 規劃 Public Checklist / Private Checklist。
- 評估 APP 內新增 / 編輯 / 刪除 checklist item。
- 評估 cloud sync、pending queue 與權限過濾。

## Coding Style

- 使用 TypeScript，型別優先放在 `src/types/`，局部型別可放在檔案內。
- 優先 early return，避免深層巢狀。
- 函式保持單一目的，命名要直覺。
- import 依專案現有風格整理，不引入無關格式化 churn。
- 複雜流程才加註解，註解說明「為什麼」與「邊界」，不要描述語法。
- 修改既有檔案時，先觀察當地風格；不要順手重構不相關區塊。

建議檔案結構順序：

```text
Imports
Constants
Types
Public functions/components
Private helpers/components
```

## Product / AI 分工

Product Owner 決定：

- 產品方向
- UX 取捨
- 功能優先級
- 是否接受 scope change

AI agent 負責：

- 分析需求與現有架構
- 提出保守且可維護的實作
- 實作、Build、基本回歸檢查
- 誠實回報未完成、未測試或風險
- 必要時更新文件

若遇到產品決策不明，先用最小可逆方案前進；若會影響資料模型、權限、同步或 UX 主流程，先向 Product Owner 確認。

## 工作流程

1. 先讀相關文件與現有程式碼。
2. 判斷任務屬於哪個 Travel Tool / Foundation layer。
3. 釐清資料 ownership、permission、storage、sync 影響。
4. 小步實作，避免大範圍重寫。
5. 執行 `npm run build`。
6. 視風險執行 `npm run lint` 或手動回歸。
7. 回報修改內容、驗證結果、剩餘風險。

## Git / Delivery

- 不要自動 commit，除非使用者要求。
- commit 前必須先 build。
- 若工作樹已有使用者改動，不要 revert。
- 不要覆蓋 `.env` 或任何 secrets。
- 不要提交 `dist/`，除非使用者明確要求部署流程。

## Self Checklist

交付前確認：

- 是否符合 Trip First / Offline First / Module First？
- 是否把邏輯放在正確 layer？
- 是否避免讓 `App.tsx` 更膨脹？
- 是否保留既有使用者資料與 local storage 相容性？
- 是否處理空資料、未登入、無權限、loading/error 狀態？
- 是否已執行 build，並回報結果？
- 若未執行測試或 lint，是否明確說明原因？
