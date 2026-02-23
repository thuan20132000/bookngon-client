"use client";

import { useEffect, useSyncExternalStore, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function isIOS(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !("MSStream" in window)
  );
}

function isInStandaloneMode(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as unknown as { standalone: boolean }).standalone)
  );
}


const PWA_BUSINESS_ID_KEY = "pwa_business_id";

function saveBusinessIdFromUrl(): void {
  const id = new URLSearchParams(window.location.search).get("business_id");
  if (id) {
    try {
      localStorage.setItem(PWA_BUSINESS_ID_KEY, id);
    } catch {
      // ignore storage errors
    }
  }
}

export function InstallPWAButton() {
  const isClient = useIsClient();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode() || isIOS()) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      saveBusinessIdFromUrl();

      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    saveBusinessIdFromUrl();
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (!isClient) return null;
  if (installed || isInStandaloneMode()) return null;

  if (isIOS()) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-12 w-full cursor-pointer"
          >
            <Download className="h-4 w-4 mr-2" />
            Install App
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 text-sm" side="top">
          <p className="font-medium mb-2">Install on iOS</p>
          <p className="text-zinc-600 dark:text-zinc-400">
            Tap the <Share className="inline h-4 w-4 mx-0.5 align-text-bottom" /> share
            button in Safari, then select{" "}
            <span className="font-medium">&quot;Add to Home Screen&quot;</span>.
          </p>
        </PopoverContent>
      </Popover>
    );
  }

  if (!deferredPrompt) return null;

  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="h-12 w-full cursor-pointer"
    >
      <Download className="h-4 w-4 mr-2" />
      Install App
    </Button>
  );
}
