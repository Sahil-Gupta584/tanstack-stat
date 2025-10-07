"use client";

import type { ThemeProviderProps } from "next-themes";

import { ToastProvider } from "@heroui/react";
import { HeroUIProvider } from "@heroui/system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";
import { type ReactNode, useState } from "react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ReactQueryProvider>
        <ToastProvider placement="top-center" />
        <NextThemesProvider
          attribute={"class"}
          defaultTheme={"system"}
          enableSystem={true}
        >
          {children}
        </NextThemesProvider>
      </ReactQueryProvider>
    </HeroUIProvider>
  );
}

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
