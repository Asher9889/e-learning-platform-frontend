import html2canvas from "html2canvas-pro";
import type { RefObject } from "react";

/**
 * Renders a DOM node to a canvas and triggers a PNG download.
 * Requires: npm install html2canvas-pro
 * (the original html2canvas package can't parse Tailwind v4 / shadcn's
 * oklch() color values, html2canvas-pro is a drop-in fork that can)
 */
export async function cardAsImage(
  ref: RefObject<HTMLElement | null> | null,
  filename = "learner-id-card.png"
) {
  if (!ref) {
    console.warn("cardAsImage: ref is null");
    return;
  }
  if (!ref.current) {
    console.warn("cardAsImage: ref is not attached to a DOM node yet");
    return;
  }

  try {
    const canvas = await html2canvas(ref.current, {
      scale: 3,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("cardAsImage: failed to export card as image", err);
  }
}