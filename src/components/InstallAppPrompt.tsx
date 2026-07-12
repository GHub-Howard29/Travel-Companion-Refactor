import { useEffect, useMemo, useState } from "react";
import { Download, Smartphone, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const INSTALL_DISMISSED_STORAGE_KEY = "travel_companion_install_prompt_dismissed";

const isInstalledApp = () => {
  const navigatorWithStandalone = navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    navigatorWithStandalone.standalone === true ||
    document.referrer.startsWith("android-app://")
  );
};

const isMobileBrowser = () => {
  return (
    window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  );
};

const isIosBrowser = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);

const shouldShowInstallPrompt = () => {
  return (
    !isInstalledApp() &&
    isMobileBrowser() &&
    localStorage.getItem(INSTALL_DISMISSED_STORAGE_KEY) !== "true"
  );
};

export function InstallAppPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(shouldShowInstallPrompt);
  const [isExpanded, setIsExpanded] = useState(shouldShowInstallPrompt);
  const [showIosHint, setShowIosHint] = useState(false);
  const isIos = useMemo(() => isIosBrowser(), []);

  useEffect(() => {
    if (!isVisible) return;

    const collapseTimer = window.setTimeout(() => {
      setIsExpanded(false);
    }, 3000);

    return () => window.clearTimeout(collapseTimer);
  }, [isVisible]);

  useEffect(() => {
    if (!isMobileBrowser()) return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleInstalled = () => {
      setIsVisible(false);
      localStorage.setItem(INSTALL_DISMISSED_STORAGE_KEY, "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (!isVisible) return null;

  const closePrompt = () => {
    localStorage.setItem(INSTALL_DISMISSED_STORAGE_KEY, "true");
    setIsVisible(false);
  };

  const installApp = async () => {
    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }

    if (!installEvent) {
      setShowIosHint(true);
      return;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;

    if (choice.outcome === "accepted") {
      localStorage.setItem(INSTALL_DISMISSED_STORAGE_KEY, "true");
      setIsVisible(false);
    } else {
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 right-4 z-[70] inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl shadow-slate-900/20"
        aria-label="安裝旅行助手"
        title="安裝旅行助手"
      >
        <Smartphone size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-md rounded-xl border border-emerald-100 bg-white p-3 shadow-2xl shadow-slate-900/20">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <Smartphone size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">安裝旅行助手</p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
            安裝後可像 App 一樣從主畫面開啟，旅行中比較方便查看行程與記帳。
          </p>
          {showIosHint && (
            <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
              {isIos
                ? "iOS 請點 Safari 分享按鈕，再選「加入主畫面」。"
                : "若瀏覽器沒有跳出安裝視窗，請從瀏覽器選單選擇「安裝應用程式」或「加入主畫面」。"}
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => void installApp()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-800"
            >
              <Download size={14} />
              {installEvent ? "立即安裝" : "查看安裝方式"}
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              稍後
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={closePrompt}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="不再提示安裝"
          title="不再提示"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
