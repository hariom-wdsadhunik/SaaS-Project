import { AccessibilityHelper } from "@/platform/a11y/accessibility";

describe("Accessibility Helper Unit Tests", () => {
  test("creates screen reader announcement element", () => {
    document.body.innerHTML = "";
    AccessibilityHelper.announceToScreenReader("Workspace loaded successfully");
    const announcer = document.getElementById("a11y-announcer");
    expect(announcer).not.toBeNull();
    expect(announcer?.textContent).toBe("Workspace loaded successfully");
  });
});
