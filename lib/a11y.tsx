/**
 * lib/a11y.ts
 * Helpers de accesibilidad WCAG 2.1 AA
 */

export interface AriaButtonProps {
  role: "button";
  tabIndex: number;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function useButtonAria(onClick: () => void): AriaButtonProps {
  return {
    role: "button",
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    },
  };
}

export function srOnly(className = ""): string {
  return `sr-only ${className}`.trim();
}

export function liveRegion(
  content: string,
  type: "polite" | "assertive" = "polite"
): React.ReactElement {
  return (
    <div
      aria-live={type}
      aria-atomic="true"
      className="sr-only"
    >
      {content}
    </div>
  );
}

export function getAriaErrorMessage(id: string | undefined): Record<string, string> {
  return id ? { "aria-describedby": id, "aria-invalid": "true" } : {};
}

export function getAriaRequiredProps(required = false): Record<string, boolean | string> {
  return required ? { "aria-required": true } : {};
}

export function formatAriaLabel(
  label: string,
  context?: string
): string {
  return context ? `${label}, ${context}` : label;
}
