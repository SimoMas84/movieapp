"use client";

/* ============================================================
   SHARE BUTTON COMPONENT
   Uses native Web Share API on supported devices.
   Falls back to clipboard copy on supported browsers.
   Silently fails if neither is available.
   ============================================================ */

import { useState, useCallback } from "react";
import { Share, Check } from "lucide-react";

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
}

export default function ShareButton({
  title,
  description,
  url,
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const shareUrl = url ?? window.location.href;
    const shareData = { title, text: description, url: shareUrl };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user cancelled — do nothing */
      }
    } else if (navigator.clipboard?.writeText) {
      /* Fallback — only if clipboard API is available */
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* clipboard not available — silent fail */
      }
    }
  }, [title, description, url]);

  return (
    <button
      onClick={handleShare}
      aria-label="Condividi"
      className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer ${
        copied
          ? "border-accent text-accent"
          : "border-border-subtle text-text-secondary hover:border-accent hover:text-accent"
      } ${className ?? ""}`}
    >
      {copied ? <Check size={18} /> : <Share size={18} />}
    </button>
  );
}
