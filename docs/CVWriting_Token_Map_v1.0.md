# CVWriting – Token Map v1.0

Status: In progress for Fix Plan 212.2 – Canonical Token Naming & Mapping  
Scope: Global CSS token alignment between **Style Guide** and **Implementation**.  
Owner: Hoshi Consult (Global Styles Governance)  

This document is the **single source of truth** for how tokens in the style guide map to tokens in the implementation.

For each token (or group of tokens):

- “Guide token” = name in the **CVWriting Web Style Guide** (the canonical name).
- “Implementation token(s)” = current names in `src/styles/*.css`.
- “Decision”:
  - Default: **Rename implementation to match guide**.
  - Exception: **Add alias token but keep existing internal name** only where strictly necessary (external dependency / staged migration).
- “Notes” = context, migration steps, or reasons for exceptions.

---

## 1. Focus Ring Tokens

Minimum requirement from Fix Plan 212.2.1:  
> Focus ring (`--color-focus-ring` vs `--focus-ring-color`).

**Final decision:** use `--color-focus-ring` as the canonical token. Implementation has been updated in `tokens.css`.

| Category | Guide token (Style Guide) | Implementation token(s) (current) | Decision                                      | Notes |
|----------|----------------------------|-----------------------------------|-----------------------------------------------|-------|
| Focus    | `--color-focus-ring`      | `--color-focus-ring`              | Implementation updated to match guide         | Previously `--focus-ring-color`. Renamed in `src/styles/tokens.css` as part of 212.2.2. All usages in other CSS files must be updated under 212.2.3. |
| Focus    | `--outline-focus-width`   | n/a                               | Not applicable (no token currently defined)   | No outline-width token exists in the implementation. If introduced later, it must use the guide name `--outline-focus-width`. |

> Status: **212.2.2 complete for focus ring** (tokens.css renamed).  
> Next: 212.2.3 to update all usages in global CSS to `var(--color-focus-ring)`.

---

## 2. Overlay / Backdrop Tokens

Minimum requirement from Fix Plan 212.2.1:  
> Overlays/backdrop (`--color-card-hover`, `--color-backdrop` vs `--overlay-card-hover`, `--overlay-modal`).

**Final decision:** treat `--color-card-hover` and `--color-backdrop` as the canonical guide tokens.  
Implementation in `tokens.css` now matches these names.

| Category | Guide token (Style Guide) | Implementation token(s) (current) | Decision                                      | Notes |
|----------|----------------------------|-----------------------------------|-----------------------------------------------|-------|
| Overlay  | `--color-card-hover`      | `--color-card-hover`              | Implementation updated to match guide         | Previously `--overlay-card-hover`. Renamed in `src/styles/tokens.css` under 212.2.2. Use for card hover overlay wash. |
| Overlay  | `--color-backdrop`        | `--color-backdrop`                | Implementation updated to match guide         | Previously `--overlay-modal`. Renamed in `src/styles/tokens.css` under 212.2.2. Use as the single modal/backdrop overlay token. |
| Overlay  | `--overlay-focus-backdrop`| n/a                               | Not applicable (no separate token defined)    | If a distinct focus/active overlay is ever needed, define it explicitly with this guide name and map accordingly. |

If you find any hard-wired RGBA overlays in CSS (e.g. `rgba(15, 23, 42, 0.65)`), add rows here, e.g.:

| Category | Guide token (Style Guide) | Implementation token(s) (current)               | Decision                                      | Notes |
|----------|----------------------------|-------------------------------------------------|-----------------------------------------------|-------|
| Overlay  | `--overlay-surface-soft`  | hard-coded `rgba(...)` in sections.css (TBD)   | Rename & refactor to use guide token          | Replace all raw RGBA overlay usages with `var(--overlay-surface-soft)` when the token is introduced. |

> Status: **212.2.2 complete for overlay/backdrop** (tokens.css renamed).  
> Next: 212.2.3 to replace any remaining references to `--overlay-card-hover` / `--overlay-modal` in other CSS files, if any exist.

---

## 3. Semantic Colour Tokens (Success, Warning, Error, Info)

Minimum requirement from Fix Plan 212.2.1:  
> All semantic colours (success, warning, error, info).

You want semantic tokens that can be swapped without rewriting components.

### 3.1 Success Tokens

| Category | Guide token (Style Guide) | Implementation token(s) (current) | Decision                                      | Notes |
|----------|----------------------------|-----------------------------------|-----------------------------------------------|-------|
| Success  | `--color-success`         | `--color-success`                 | Already aligned; no change needed             | Implementation in `tokens.css` matches guide name. |
| Success  | `--color-success-soft`    | n/a                               | To be added in later 212.x step (if required) | Soft background variant not yet defined; introduce only if needed by components. |

### 3.2 Warning Tokens

| Category | Guide token (Style Guide) | Implementation token(s) (current) | Decision                                      | Notes |
|----------|----------------------------|-----------------------------------|-----------------------------------------------|-------|
| Warning  | `--color-warning`         | `--color-warning`                 | Already aligned; no change needed             | Implementation in `tokens.css` matches guide name. |
| Warning  | `--color-warning-soft`    | n/a                               | To be added in later 212.x step (if required) | Background variant not yet defined. |

### 3.3 Error Tokens

| Category | Guide token (Style Guide) | Implementation token(s) (current) | Decision                                      | Notes |
|----------|----------------------------|-----------------------------------|-----------------------------------------------|-------|
| Error    | `--color-error`           | `--color-error`                   | Already aligned; no change needed             | Implementation in `tokens.css` matches guide name. |
| Error    | `--color-error-soft`      | n/a                               | To be added in later 212.x step (if required) | Background variant not yet defined. |

### 3.4 Info Tokens

| Category | Guide token (Style Guide) | Implementation token(s) (current) | Decision                                      | Notes |
|----------|----------------------------|-----------------------------------|-----------------------------------------------|-------|
| Info     | `--color-info`            | `--color-info`                    | Already aligned; no change needed             | Implementation in `tokens.css` matches guide name. |
| Info     | `--color-info-soft`       | n/a                               | To be added in later 212.x step (if required) | Background variant not yet defined. |

> Status: semantic base tokens are already using the canonical guide names in `tokens.css`.  
> Any “soft” background variants will be introduced only when required by concrete components and governed under a later 212.x step.

---

## 4. Typography Tokens (Mapping to `--fs-*`)

Minimum requirement from Fix Plan 212.2.1:  
> Key type tokens (body, h1, h2, h3, labels) mapping to `--fs-…`.

You want clean typography tokens that map from style guide → implementation.

At present, `tokens.css` defines a technical scale:

- `--fs-xs`, `--fs-sm`, `--fs-base`, `--fs-lg`, `--fs-xl`, `--fs-2xl`, `--fs-3xl`, `--fs-4xl`.

We have **not yet renamed** these or added semantic aliases like `--fs-body`, `--fs-h1`, etc. This mapping is therefore **documented but not yet applied** (kept for the next 212.x typography step).

### 4.1 Core Type Scale (Proposed Mapping – Not Yet Applied)

| Category | Guide token (Style Guide) | Implementation token(s) (current) | Decision (current phase)                     | Notes |
|----------|----------------------------|-----------------------------------|----------------------------------------------|-------|
| Type     | `--fs-body`               | `--fs-base`                       | Pending – to be decided in typography step   | Intention: map body style to `--fs-base`. Rename vs alias to be resolved in a dedicated typography pass. |
| Type     | `--fs-h1`                 | `--fs-4xl`                        | Pending – to be decided in typography step   | Intention: use `--fs-4xl` for hero/page titles. |
| Type     | `--fs-h2`                 | `--fs-3xl`                        | Pending – to be decided in typography step   | Intention: use `--fs-3xl` for section headings. |
| Type     | `--fs-h3`                 | `--fs-2xl`                        | Pending – to be decided in typography step   | Intention: use `--fs-2xl` for sub-section headings. |
| Type     | `--fs-label`              | `--fs-xs` / `--fs-sm`             | Pending – to be decided in typography step   | Intention: use smaller sizes for labels/microcopy. |

### 4.2 Line-Height & Weight Tokens (If Introduced)

Currently, line-height and weight are mostly specified directly (not as tokens). If and when explicit tokens are introduced, they should follow the guide naming:

| Category | Guide token (Style Guide) | Implementation token(s) (current) | Decision                                      | Notes |
|----------|----------------------------|-----------------------------------|-----------------------------------------------|-------|
| Type     | `--lh-body`               | n/a                               | To be added only if we move to LH tokens      | Body text readability baseline. |
| Type     | `--lh-heading`            | n/a                               | To be added only if we move to LH tokens      | Heading line-height baseline. |
| Type     | `--fw-regular`            | n/a                               | Not in scope yet                              | At present we rely on numeric weights 400, 500 etc. |
| Type     | `--fw-medium`             | n/a                               | Not in scope yet                              | Same as above. |

> Status: typography mapping is **not yet applied** in `tokens.css`.  
> All rows in this section should be treated as **proposed mapping** to be implemented in a dedicated typography step (later in Fix Plan 212).

---

## 5. Alias Tokens (Exception Cases Only)

Use this section only when you **intentionally keep an alias** instead of renaming the implementation.

**Rule:** only use aliases when:
- There is an external/third-party dependency, or  
- You are in a staged migration where immediate rename is risky.

At this point in 212.2.2, **no aliases are in use**. All changes have been handled by direct renames.

| Category | Guide token (Style Guide) | Implementation token(s) (current) | Alias token (bridge) | Decision | Notes |
|----------|----------------------------|-----------------------------------|----------------------|----------|-------|
| –        | –                          | –                                 | –                    | –        | No alias tokens currently defined. |

If we ever introduce an alias, for example:

| Category | Guide token (Style Guide) | Implementation token(s) (current) | Alias token (bridge)                        | Decision                                     | Notes |
|----------|----------------------------|-----------------------------------|---------------------------------------------|----------------------------------------------|-------|
| Example  | `--color-focus-ring`      | `--legacy-focus`                  | `--color-focus-ring: var(--legacy-focus)`   | Add alias token but keep internal name (temp)| Use only during staged migration; remove once all usage is updated. |

---

## 6. Next Actions (Link to Fix Plan 212)

- **212.2.1 – Token Map document**  
  - Structure created.  
  - Focus ring and overlay/backdrop sections populated.  
  - Semantic colour tokens documented.  
  - Typography mapping drafted (marked as pending).

- **212.2.2 – Apply naming decisions in `tokens.css`**  
  - **Done for:**  
    - `--focus-ring-color` → `--color-focus-ring`  
    - `--overlay-card-hover` → `--color-card-hover`  
    - `--overlay-modal` → `--color-backdrop`  
  - Semantic tokens already match guide (`--color-success`, `--color-warning`, `--color-error`, `--color-info`) – no change required in this step.  
  - No alias tokens introduced.

- **212.2.3 – Update usages across global CSS**  
  - Replace all references in non-token CSS files to use canonical names:  
    - `var(--color-focus-ring)`  
    - `var(--color-card-hover)`  
    - `var(--color-backdrop)`  
  - Confirm no remaining references to old names: `--focus-ring-color`, `--overlay-card-hover`, `--overlay-modal`.

- **Later 212.x (Typography pass)**  
  - Decide final approach for `--fs-body`, `--fs-h1`, etc.  
  - Either:  
    - Rename `--fs-*` implementation tokens to match guide, **or**  
    - Introduce semantic aliases with a documented migration plan.  
  - Update this Token Map with final typography decisions once applied.
