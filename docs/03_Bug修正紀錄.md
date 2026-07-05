# Bug 修正紀錄

## 2026-06-30

### BUG002

目前只剩下：
Pending（待同步）數量沒有在「離線新增當下」立即更新。

例如：
P1 → 顯示 1（正常）
P2（離線新增）→ 應該顯示 2，但仍顯示 1。
一旦恢復連線、重新載入或 F5，就變成正確。

原因:資料正確、同步正確，只是 UI Badge 沒有立即刷新。
這已經不是資料遺失或同步失敗，而是 UI 更新時機的問題。

狀態:已修正。

### BUG003

行前清單或是跟團準備事項，裡面的勾選會影響其他行程的勾選紀錄，而且重整網頁後，已勾選的進度會被清空

原因:未知

狀態:待修正。

---

### BUG004
問題:Checklist跟團清單確認頁面，F5後原本已經勾選的會被清除

目前 App.tsx 我有看到：
const [checkedItems, setCheckedItems] = useState<string[]>([]);

以及：toggleChecklistItem(...)
但是沒有任何 localStorage.setItem() 或初始化讀取。
從你的 App.tsx 來看，它目前就是純 React state，重新整理後一定會回到空陣列。
所以：這不是 Regression（重構造成）
而比較像是：功能本來就沒有做持久化（Persistence）。

狀態:待修正。

