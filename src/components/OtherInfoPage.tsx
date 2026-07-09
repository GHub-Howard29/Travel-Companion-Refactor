/**
 * Other Info Page（其他資訊頁面）
 *
 * 負責顯示「其他資訊」功能的第一層固定分類卡片。
 *
 * 第一層分類由系統固定建立，例如景點、機票、飯店。
 * 本頁目前只做唯讀展示，不提供新增、編輯或刪除。
 */

// ================================
// Import
// ================================

import type { Folder } from "../types";
import { getDefaultFolders } from "../services/otherInfoService";

// ================================
// Types
// ================================

interface OtherInfoPageProps {
  tripId: string;
}

// ================================
// Public Component
// ================================

export const OtherInfoPage = ({ tripId }: OtherInfoPageProps) => {
  const folders = getDefaultFolders(tripId);

  return (
    <section>
      <h2>其他資訊</h2>

      <p style={{ color: "#666", marginBottom: "16px" }}>
        請選擇要查看的資料分類。
      </p>

      <div
        style={{
          display: "grid",
          gap: "12px",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        }}
      >
        {folders.map((folder) => (
          <OtherInfoCategoryCard key={folder.id} folder={folder} />
        ))}
      </div>
    </section>
  );
};

// ================================
// Private Components
// ================================

interface OtherInfoCategoryCardProps {
  folder: Folder;
}

const OtherInfoCategoryCard = ({ folder }: OtherInfoCategoryCardProps) => {
  return (
    <button
      type="button"
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        background: "#fff",
        padding: "16px",
        textAlign: "left",
        cursor: "pointer",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
      }}
    >
      <strong>{folder.title}</strong>
    </button>
  );
};