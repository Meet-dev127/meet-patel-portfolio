# Project Rules

## Writing style

- **NEVER use em-dashes (—)** anywhere in user-facing content, copy, microcopy, headlines, or descriptions. Em-dashes are an AI-content tell.
  - Use **commas**, **periods**, **colons**, **parentheses**, or **mid-dots (·)** instead.
  - Examples:
    - ❌ `Meet Patel — a developer` → ✅ `Meet Patel, a developer`
    - ❌ `01 — Case Study` → ✅ `01 · Case Study`
    - ❌ `From Idea to Deployment — I Handle the Full Build` → ✅ `From Idea to Deployment. I Handle the Full Build.`
  - This applies to **every page**, **every component**, and **every future addition** to this project.

- **Avoid other AI-content tells** in copy:
  - "elevate", "leverage", "unleash", "delve", "tapestry", "navigate the landscape"
  - hollow superlatives ("revolutionary", "game-changing", "seamless")
  - opening sentences with "In today's fast-paced world..."
  - meaningless adjective stacks ("robust, scalable, cutting-edge")

## Profile source of truth

- `profile.md` is the single source of truth for facts about Meet Patel (location, certs, education, projects, stack).
- Update `profile.md` first when info changes, then propagate to pages.
- Real email: `patelmeet20112000@gmail.com` (never `hello@meetpatel.dev` or other placeholders).

## Visual / brand consistency

- Palette: **white** background/surfaces, near-black-green ink (`--cloud-ink`), dusk/slate grays for body text, and a single **emerald** accent (`--accent: #0E8A6B`) for actions, links, highlights and data marks. Don't introduce other accent hues.
- Section rhythm: light sections plus dark **feature bands** (`.section.feature` and the contact CTA) in deep emerald-black (`--feature-bg`), with light text and a light mint mark (`--feature-accent`). Drive all color from the CSS variables in `styles.css` — don't hardcode hex values.
- Type: Geist (display + sans) and Geist Mono. No other families.
- Sections use `.section` / `.section.mist` / `.section.tight` / `.section.feature`. Don't invent new section wrappers.
- Reuse existing components: `.btn`, `.skill-card`, `.proj-card`, `.svc-card`, `.blog-card`, `.featured-card`, `.stat-card`, `.tag`, `.arrow-link`.
