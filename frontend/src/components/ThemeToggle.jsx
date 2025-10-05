import { Moon, Sun } from "lucide-react";
import * as React from "react";

// Utility to get and set theme class on <html>
function setTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}

export function ThemeToggle() {
  const [theme, setThemeState] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  React.useEffect(() => {
    setTheme(theme);
  }, [theme]);

  return (
    <button
      className="px-3 py-2 rounded-md border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label="Toggle theme"
      onClick={() => setThemeState(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all" />
      ) : (
        <Moon className="h-6 w-6 text-blue-500 rotate-0 transition-all" />
      )}
    </button>
  );
}
