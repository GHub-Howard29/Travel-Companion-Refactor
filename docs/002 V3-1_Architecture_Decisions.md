# V3-1 已定案內容

本文件記錄 V3-1 開發期間正式定案之架構。

未來除非發現邏輯錯誤，否則不得重新設計。

---

# 一、Folder 架構

Folder 採用純 Tree 架構。

保留：

- id
- tripId
- parentId
- title
- order
- isSystem
- createdAt
- updatedAt

移除：

- FolderType
- category

分類由第一層固定 Folder 代表。

---

# 二、其他資訊 UI

左上角功能：

- 行程選擇
- 團體清單
- 記帳本
- 其他資訊
- 私人確認清單

點擊後：

自動收起左側功能列。

切換主畫面。

---

# 三、其他資訊呈現方式

V3-1 第一階段：

採 Reference 簡易本機管理工具。

已落地：

- 左側工具列顯示「其他資訊」
- 主畫面顯示 Reference / 旅行資訊
- 第一層固定分類以 folder chips 呈現
- Chips 自動換行
- 顯示資料筆數、空狀態與 item card
- 可新增、編輯、刪除 Other Info item
- 內容中的 `http` / `https` URL 自動轉為可點擊超連結
- 超連結以新分頁開啟
- `text` 類型維持原本文字頁
- 僅 `otherInfo` 類型進入 OtherInfoPage

V3-1 第一階段尚不提供：

- 雲端同步
- 多人協作
- 權限過濾
- 完整 folder tree navigation

後續完整模式：

第一層：

固定分類卡片。

例如：

- 景點
- 機票
- 飯店
- 交通
- 保險
- ...

第二層：

旅程資料卡片。

例如：

景點

↓

淺草

↓

晴空塔

↓

新宿

第三層：

資料分類。

例如：

注意事項

必看

必玩

最後才顯示真正內容。

不採 Tree 展開方式。

採：

一層一頁。

---

# 四、固定分類

第一層：

系統固定。

不可由 APP 編輯。

使用固定 ID。

例如：

other-info-attractions

other-info-flights

...

避免重新 Build 後 Folder ID 改變。

---

# 五、資料維護方式

其他資訊：

定位為：

seed data 預設資料 + localStorage 本機覆寫資料。

seed data 維護流程：

修改資料

↓

Build

↓

Deploy

↓

使用者查看

APP 內簡易管理流程：

新增 item

↓

寫入 localStorage

編輯 seed item

↓

以 localStorage item 覆蓋相同 id 的 seed item

刪除 seed item

↓

寫入 `isDeleted` 標記

目前不提供：

- 雲端同步
- Pending Queue
- Conflict Resolution

---

# 六、Role

目前：

保留 Role 擴充能力。

OtherInfoItem：

保留：

allowedRoles

但：

V3-1

不實作：

Role 判斷。

不實作：

權限過濾。

待其他資訊功能完成後，再實作。

---

# 七、UI 原則

第一層：

固定分類。

第二層：

旅程資料。

第三層：

資料分類。

第四層：

內容。

手機操作：

一次只呈現一層。

避免 Tree 過長。

---

# 八、維護原則

本專案主要供：

自己及固定旅行團使用。

不是面向大眾。

因此：

避免過度開發。

優先：

降低維護成本。

新增旅程時：

主要修改：

otherInfoData

及必要資料檔。

程式架構保持不變。

重新 Build 後發布即可。

---

# 九、文件更新提醒（V3-1 完成後）

完成 V3-1 時，需同步更新：

- README
- 06 功能規格
- 04 資料庫設計（如有影響）
- 系統架構文件
- Development Roadmap

新增本次正式定案內容。
