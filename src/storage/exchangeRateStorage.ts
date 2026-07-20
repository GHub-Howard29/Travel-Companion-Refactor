import type { TripExchangePurchase } from "../types";

const STORAGE_PREFIX = "travel_companion_exchange_rate";
export type ExchangePurchaseStorageScope = "local" | "cloud";

const getStorageKey = (
  tripId: string,
  scope: ExchangePurchaseStorageScope,
): string => `${STORAGE_PREFIX}_${scope}_${tripId}`;

const getCloudInitializedKey = (tripId: string): string =>
  `${STORAGE_PREFIX}_cloud_initialized_${tripId}`;

const isValidPurchase = (value: unknown): value is TripExchangePurchase => {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<TripExchangePurchase>;
  return typeof item.id === "string" && typeof item.tripId === "string" &&
    typeof item.foreignCurrency === "string" && typeof item.purchaseDate === "string" &&
    typeof item.twdAmount === "number" && Number.isFinite(item.twdAmount) &&
    typeof item.foreignAmount === "number" && Number.isFinite(item.foreignAmount) &&
    typeof item.createdAt === "string" && typeof item.updatedAt === "string";
};

export const readExchangePurchases = (
  tripId: string,
  scope: ExchangePurchaseStorageScope = "local",
): TripExchangePurchase[] => {
  const raw = localStorage.getItem(getStorageKey(tripId, scope));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidPurchase).filter((item) => item.tripId === tripId) : [];
  } catch {
    return [];
  }
};

export const writeExchangePurchases = (
  tripId: string,
  purchases: TripExchangePurchase[],
  scope: ExchangePurchaseStorageScope = "local",
): void => {
  localStorage.setItem(getStorageKey(tripId, scope), JSON.stringify(purchases));
};

export const clearExchangePurchases = (
  tripId: string,
  scope: ExchangePurchaseStorageScope = "local",
): void => {
  localStorage.removeItem(getStorageKey(tripId, scope));
};

export const hasInitializedCloudExchangeHistory = (tripId: string): boolean =>
  localStorage.getItem(getCloudInitializedKey(tripId)) === "true";

export const markCloudExchangeHistoryInitialized = (tripId: string): void => {
  localStorage.setItem(getCloudInitializedKey(tripId), "true");
};
