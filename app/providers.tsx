"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps): React.JSX.Element {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}