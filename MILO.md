# MILO — MGL project operating guide

This file is the stable working context for anyone (ChatGPT, Work, or a human) modifying **MGL — My Game Library**.

Read it before making non-trivial changes. Update it only when a durable project rule changes.

## 1. What MGL is

MGL is a **personal game library**, not a generic game wiki and not an emulator-configuration database.

Its job is to help its owner:
- keep a curated library of games he genuinely wants to play or keep;
- track status, story progress, playtime, favorites, notes, ratings, couple-play intent, and collection information;
- quickly see where a game can be played;
- discover and revisit games without turning the site into a technical encyclopedia.

When a feature idea does not strengthen that purpose, do not add it by default.

## 2. Product and visual direction

- Main visual language: **black / charcoal / grey**, with **red accents**.
- The UI should feel premium, clean, gaming-oriented, and personal.
- Avoid visual clutter and unnecessary dashboards.
- Mobile matters, especially iPhone Safari / Home Screen use.
- Existing desktop behavior must not be degraded when improving mobile.

## 3. Data rules

MGL currently mixes repository defaults with browser-local data.

Important localStorage keys include:
- `mgl_live`
- legacy `mgl_v3`
- `mgl_current_game`

Repository data may provide authoritative tracking defaults such as story progress or playtime, but **must not blindly overwrite personal local fields** such as notes, favorites, ratings, status, or other user edits.

When changing persistence logic:
1. inspect the current merge behavior first;
2. preserve backward compatibility unless intentionally migrating;
3. never clear localStorage as a casual fix.

## 4. Current architecture

Core files include:
- `index.html` — page structure and static asset references;
- `app.js` — rendering, filtering, modals, persistence, current-game behavior;
- `data.js` — base game data and tracking values;
- `media.js` — media / artwork metadata;
- `progress.js` — story progress support;
- `premium.css` and `polish.css` — main visual layers;
- `manifest.webmanifest` — install/PWA metadata;
- `assets/` — logos, covers, icons, and other media.

Do not assume this list is exhaustive. Inspect the current branch before modifying anything.

## 5. iPhone / PWA rule learned the hard way

The iOS Home Screen icon must be a **real binary image file** at the exact path referenced by `index.html`.

Current intended icon:
- `assets/icons/apple-touch-icon.png`
- PNG
- 180×180

Never upload a Base64 string as UTF-8 text and call the result `.png`.

For binary files, use a binary-safe upload path. After changing an icon:
1. verify the file exists on the target branch;
2. verify its binary signature / dimensions;
3. verify `index.html` points to the exact same path;
4. verify `manifest.webmanifest` is consistent;
5. when possible, verify the public GitHub Pages URL itself before declaring success.

## 6. Definition of Done

**Do not tell the owner “c’est bon” merely because a commit was created.**

A task is done only after the relevant checks below have passed:

1. **Inspect current state first** — fetch the latest `main` before editing; never work from a stale assumed version.
2. **Make the smallest coherent change** — avoid unrelated rewrites.
3. **Validate syntax / assets** — run `node scripts/validate-project.mjs` when the change can affect the site.
4. **Confirm target branch** — ensure the final commit is actually on `main` (or clearly state when it is only on a branch/PR).
5. **Check deployment-sensitive work** — for icons, manifest, paths, cache busting, or GitHub Pages behavior, verify the deployed resource when tooling allows it.
6. **Report once, with evidence** — summarize what changed, what was checked, and any remaining uncertainty.

A user-side visual check is still welcome, but it should be the final safety net — not the primary debugging method.

## 7. Work style

For substantial changes:
- investigate first;
- implement;
- validate;
- fix discovered issues without repeatedly bouncing intermediate failures back to the owner;
- return when the change is in a genuinely testable / finished state.

If a blocker truly requires owner input, ask once with the exact missing information.

For tiny content updates (playtime, progress, status, etc.), keep the workflow lightweight and do not over-engineer.

## 8. Project-specific guardrails

- MGL stays a **personal library**.
- Emulator details may exist when genuinely useful, but MGL must not drift into a per-game technical compatibility wiki.
- Preserve the owner’s locally edited data.
- Prefer official artwork / clean covers and platform-appropriate presentation.
- Avoid adding features just because they are technically possible.
- Keep changes reversible and easy to understand.

## 9. Before closing a complicated task

Use this mental checklist:

- Does the requested feature actually work in the repository state now?
- Are all referenced files present at the exact paths used by the code?
- Did I validate binary assets as binary assets?
- Did automated checks pass?
- Is `main` the branch that contains the finished change?
- If the feature depends on GitHub Pages, did I verify deployment/public availability when possible?
- Am I about to claim certainty that I did not actually verify?

If the last answer is yes, verify first or state the precise remaining uncertainty.
