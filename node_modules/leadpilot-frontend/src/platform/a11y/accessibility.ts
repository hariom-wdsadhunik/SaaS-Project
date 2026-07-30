export class AccessibilityHelper {
  public static announceToScreenReader(message: string): void {
    const announcer = document.getElementById("a11y-announcer");
    if (announcer) {
      announcer.textContent = message;
    } else {
      const el = document.createElement("div");
      el.id = "a11y-announcer";
      el.setAttribute("aria-live", "polite");
      el.setAttribute("aria-atomic", "true");
      el.className = "sr-only";
      el.textContent = message;
      document.body.appendChild(el);
    }
  }

  public static trapFocus(containerElement: HTMLElement): () => void {
    const focusables = containerElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first?.focus();
          e.preventDefault();
        }
      }
    };

    containerElement.addEventListener("keydown", handleKeyDown);
    return () => containerElement.removeEventListener("keydown", handleKeyDown);
  }
}
