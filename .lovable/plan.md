## Goal

Make `/mnt/documents/upkeep-mm.html` respect the iOS notch / Dynamic Island and Android status/gesture bars so no content hides behind system chrome while scrolling.

The viewport meta already has `viewport-fit=cover` (line 7), so `env(safe-area-inset-*)` will resolve correctly. We just need to consume those insets in the layout.

## Changes (CSS only — single file, no markup changes)

1. **Top inset — sticky top bars and login/role headers**
   - `.topbar` (line 151): change `padding: 48px 16px 12px` → `padding: max(48px, calc(env(safe-area-inset-top) + 12px)) 16px 12px`
   - `.login` (line 734): change `padding: 64px 24px 0` → `padding: max(64px, calc(env(safe-area-inset-top) + 24px)) 24px 0`
   - Role-select header row (inline style at line 1181 `padding:48px 16px 8px`): bump to `max(48px, calc(env(safe-area-inset-top) + 12px))`. Move this inline style to a new class `.role-header` to keep things tidy.

2. **Bottom inset — tab bar, action bar, and scroll padding**
   - `.tabbar` (line 635): add `padding-bottom: env(safe-area-inset-bottom)` so the icons sit above the home indicator.
   - `.action-bar` (line 820): change `padding: 16px 16px 24px` → `padding: 16px 16px max(24px, calc(env(safe-area-inset-bottom) + 12px))`.
   - `.screen` default `padding-bottom: 80px` (line 136): change to `calc(80px + env(safe-area-inset-bottom))` so the last card clears the now-taller tab bar.
   - `.screen.detail` `padding-bottom: 32px` (line 149): change to `calc(32px + env(safe-area-inset-bottom))`.

3. **Side insets — handle landscape notches**
   - `.px` (line 186) and `.topbar` horizontal padding: extend left/right with `max(16px, env(safe-area-inset-left))` / `right`. Apply on `.topbar`, `.tabbar`, `.action-bar`, `.px`.

4. **Toast position**
   - `.toast` (line 662) `top: 64px` → `top: calc(64px + env(safe-area-inset-top))` so it doesn't overlap the notch.

## Out of scope

- No changes to JS, render functions, or component markup beyond the one inline-style extraction in (1).
- No new dependencies; pure CSS using standard `env()`/`max()` which are supported by iOS 11.2+ and all modern Android browsers.

## Verification after build

- Open `upkeep-mm.html` on iPhone (notched device) and confirm: top bar title not under notch; tab bar icons above home indicator; "Mark as Done" sits above home indicator on tech detail.
- Rotate to landscape: content respects left/right insets.
- Scroll each screen to bottom: last card fully visible above tab bar / action bar.
