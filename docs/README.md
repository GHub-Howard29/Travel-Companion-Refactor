# Travel Companion（旅行小幫手）

作者：Howard

---

## 專案目標

Travel Companion 是一套旅行工具。

主要用途：

- 行程管理
- 共用旅費
- 離線記帳
- 照片附件
- Excel 匯出
- GitHub Pages 部署

---

## 開發目標

本專案希望做到：

- 完全前端
- 可離線使用
- 支援多人共同帳本
- 不需要安裝 APP
- 手機與電腦皆可使用

---

## 技術

- React
- TypeScript
- Vite
- Supabase
- IndexedDB
- LocalStorage

---

## 專案架構（重構中）

目前正在將大型 App.tsx 拆分為多個模組。

預計拆分：

```
App.tsx
│
├── components
├── hooks
├── services
├── storage
├── utils
├── types
└── pages
```

---

## 開發原則

1. 功能完成比漂亮重要
2. 不破壞既有功能
3. 每一次修改都可以回復
4. 小步提交
5. 保持可讀性