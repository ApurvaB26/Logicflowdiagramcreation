/**
 * Fallback-safe clipboard copy that works inside iframes
 * where the Clipboard API is blocked by permissions policy.
 */
export function copyToClipboard(text: string): Promise<void> {
  // Try modern Clipboard API first
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    return navigator.clipboard.writeText(text).catch(() => {
      // If blocked by permissions policy, fall back
      return execCommandCopy(text);
    });
  }
  // Fallback for older browsers / restricted contexts
  return execCommandCopy(text);
}

function execCommandCopy(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "-9999px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      resolve();
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(ta);
    }
  });
}
