import * as React from "react";

// This ThemeProvider just passes children through. The actual theme toggling is handled by adding 'dark' or 'light' class to <html> or <body>.
// You can enhance this to add a context for theme toggling if needed.

export function ThemeProvider({ children }) {
  return children;
}
