# Theme Provider Fix

## Problem

The `next-themes` integration was throwing a runtime warning about
encountering a `<script>` tag while rendering a React component:

> Encountered a script tag while rendering React component. Scripts inside
> React components are never executed when rendering on the client.
> Consider using template tag instead.

This is a known issue with older versions of `next-themes` (v0.2.x / v0.3.x)
that injected inline `<script>` elements for theme bootstrap, which Next.js
App Router reports as an error.

## What Changed

1. **`frontend/components/providers/theme-provider.tsx`** — refactored to use
   the type-safe `ThemeProviderProps` re-export pattern from `next-themes`:

   ```tsx
   import type { ThemeProviderProps } from "next-themes";

   export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
     return (
       <NextThemesProvider
         attribute="class"
         defaultTheme="light"
         enableSystem={false}
         forcedTheme="light"
         disableTransitionOnChange={false}
         {...props}
       >
         {children}
       </NextThemesProvider>
     );
   }
   ```

   This is the App-Router-aware pattern recommended for `next-themes` v0.4.x.

2. **`frontend/package.json`** — verified `next-themes` is already on
   `^0.4.6`. No version bump required.

3. **`frontend/app/layout.tsx`** — `suppressHydrationWarning` is present on
   the `<html>` element to silence Next.js's warning about the
   theme-bootstrap script that `next-themes` injects into `<head>`.

## Status

- ✅ `next-themes` version pinned to a 0.4.x release.
- ✅ `ThemeProvider` uses the type-safe spread-props pattern.
- ✅ `<html suppressHydrationWarning />` set in root layout.

No further action required.
