import type { SupabaseClient } from "@supabase/supabase-js";

import type { ExchangeReferenceRate } from "../storage/exchangeReferenceRateStorage";

export const fetchTaiwanBankCashSellRate = async (
  supabase: SupabaseClient,
  currency: string,
): Promise<ExchangeReferenceRate> => {
  if (!navigator.onLine) {
    throw new Error("使用者裝置目前沒有網路連線");
  }

  const { data, error } = await supabase.functions.invoke(
    "taiwan-bank-exchange-rate",
    { body: { currency } },
  );

  if (error) {
    const response =
      "context" in error && error.context instanceof Response
        ? await error.context.json().catch(() => null)
        : null;
    throw new Error(
      response && typeof response.error === "string"
        ? response.error
        : "無法連線至匯率服務，可能是網路連線或臺灣銀行網站暫時異常",
    );
  }

  if (!data || typeof data.rate !== "number" || !Number.isFinite(data.rate)) {
    throw new Error("臺灣銀行網站未提供有效的參考匯率資料");
  }

  return data as ExchangeReferenceRate;
};
