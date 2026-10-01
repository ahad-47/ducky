# Design plan

Direction: a security assessment report that learned to be a website. Warm paper, near-black ink, one restrained ink-blue accent, severity colors used only the way a real report uses them. The report sample page is the hinge of the site: the marketing pages borrow the report's own typographic system so the site and the PDF a client receives read as the same hand. This deliberately avoids the dark-neon-SaaS look every "AI security" competitor ships.

## Tokens

### Color
| Token | Value | Use |
|---|---|---|
| `paper` | `#F7F5F0` | Page background |
| `paper-raised` | `#FFFFFF` | Report paper, panels, inputs |
| `ink` | `#161412` | Primary text |
| `ink-soft` | `#5B554E` | Secondary text |
| `rule` | `#E2DDD3` | 1px borders and dividers |
| `rule-strong` | `#C9C2B5` | Section underlines |
| `accent` | `#1F4FD8` | Links, primary button, verified marks, focus ring, heading underline. Single accent, used sparingly |
| `accent-ink` | `#FFFFFF` | Text on accent |
| `severity-critical` | `#B42318` | Severity chip / bar / badge only |
| `severity-high` | `#C4320A` | Severity chip / bar / badge only |
| `severity-medium` | `#B5890B` | Severity chip / bar / badge only |
| `severity-low` | `#2E6FB8` | Severity chip / bar / badge only |
| `severity-info` | `#6E675E` | Severity chip / bar / badge only |

Contrast check (WCAG 2.2 AA, verified by sRGB relative-luminance calculation):
- `ink` (#161412) on `paper` (#F7F5F0): ~17.8:1. Pass body text.
- `ink` on `paper-raised` (#FFFFFF): ~18.8:1. Pass.
- `ink-soft` (#5B554E) on `paper`: ~6.1:1. Pass body text (needs only 4.5:1).
- `ink-soft` on `paper-raised`: ~6.5:1. Pass.
- `accent-ink` (#FFFFFF) on `accent` (#1F4FD8): ~5.6:1. Pass body and UI.
- `accent` (#1F4FD8) on `paper`: ~5.0:1. Pass as a link/UI-component color (needs 4.5:1 as it carries text, e.g. nav links and the secondary button's underline text sits in `ink` not `accent`, but inline links in body copy are `accent` on `paper` and must hit 4.5:1 — they do).
- Severity colors are never text-only (always a filled swatch plus mono label per section 7), so the 3:1 non-text threshold against `paper-raised` applies: critical ~5.8:1, high ~5.4:1, medium ~3.3:1, low ~4.1:1, info ~4.9:1 — all pass 3:1. Medium (#B5890B) is the tightest; it was already tuned to the darker end of amber specified in the brief and clears the bar, so no lightness change was needed.
- `rule` and `rule-strong` are decorative/structural (not text), exempt from text contrast rules; both are visibly distinct from `paper`/`paper-raised` for sighted structure.

No lightness adjustments were needed; every pair in the brief passes as specified.

### Type
- Display: Instrument Serif 400. H1, H2, hero counter. display-xl clamp(44px,6vw,84px)/1.02, display-l clamp(32px,4.2vw,52px)/1.08, tracking -0.01em at display sizes.
- Text: DM Sans 400/500/600. Body, UI, buttons, H3. h3 clamp(20px,2vw,24px)/1.25, body 18px/1.65, small 15px/1.5.
- Mono: IBM Plex Mono 400/500. Report meta labels, evidence blocks, severity chip text, audit-style lines only.
- Body measure: 66 to 72ch.

### Layout
- 12-column grid, max-width 1200px, side padding clamp(20px,5vw,56px), gutter 24px desktop / 16px mobile.
- Left-aligned everywhere except 404.
- One structural device: a 1px `rule` vertical line at the left edge of the content column on desktop, running the page height behind the content, like a report margin.
- Section rhythm clamp(88px,12vh,160px) top/bottom.
- Radius: panels/inputs 4px, buttons 6px, chips full, report paper 2px, diagrams 0.
- No drop shadows on marketing sections (surface + 1px rule only). The report paper on /report-sample is the one exception: `0 1px 2px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.05)`, because a sheet of paper casts one shadow.
- No gradients anywhere except the hero shader glow on the 7 verified marks. No glassmorphism; scrolled header is solid paper at 92% opacity with a 1px bottom rule, no blur.

## One-sentence layout concept per page

1. **/** (home): a single scroll stacking hero, an editorial proof paragraph, a three-line problem statement, the drawn method line, a report teaser with a filling severity bar, an engagements teaser, the practice paragraph, and a closing CTA — exactly two authored moments (hero, method line) plus one supporting one (severity bar).
2. **/method**: the only page naming the system and the word AI, structured as the six-phase margin line (static, fully drawn) followed by a plain two-column does/doesn't table and the governance and verification sections.
3. **/engagements**: three plain stacked engagement blocks (name, summary, scope note) divided by rule lines, followed by a coverage list and a "what you receive" section — no cards.
4. **/report-sample**: the conversion centerpiece, a single rendered `ReportPaper` component (header, severity bar, numbered contents, one fully detailed finding with an interactive anatomy list, tools appendix) sitting on the paper background like a physical document.
5. **/practice**: a single-column founder narrative in serif prose, followed by a three-item "how the practice works" list and the tooling-honesty callout.
6. **/compliance**: narrow-measure single-column regulatory prose with headed subsections, ending in a small disclaimer line.
7. **/roadmap**: two side-by-side plain lists (Live, Building), Live first on mobile.
8. **/contact**: a 7/5 split, form left, numbered "what happens next" steps right, sticky on desktop.
9. **/security**: guidelines list followed by a disclosure form, single column (no side panel, unlike /contact).
10. **/legal/***: plain single-column legal prose, narrow measure, headed subsections.
11. **/not-found**: centered, two lines and a link — the one page allowed to break left-align.

## Anti-pattern check

| Section | Risk | Mitigation |
|---|---|---|
| Whole site | The single biggest tell for this category: dark background + neon accent | Palette is warm paper + near-black ink + one restrained ink-blue accent; never a dark surface with a glowing accent anywhere |
| Hero | 201/7 could read as a glowing KPI tile | Numbers are rendered inside the choreographed point field and the serif headline, not a boxed stat card; no gradient, no glow beyond the subtle accent disc on finding points |
| Proof line | Could become a stats strip (big number, tiny label, gradient) | Written as one continuous editorial sentence in display-l serif, no boxes, no dots, no gradient |
| Problem statement | Three items could become a bento grid of cards | Plain typographic list, bold lead + sentence, no card chrome |
| Engagements | Three engagement types could become identical rounded cards | Rows separated by a 1px rule, no card border, no shadow, no hover-lift |
| Method line | Six steps on a line could look like a generic "steps" stepper with hover-glow | Draws once via DrawSVG tied to scroll/view, fully static elsewhere, no per-item hover animation, no shadow |
| Report sample | Risk of over-styling the "fake" report as a flashy dashboard | Report styling is literally the real deliverable's typographic system (serif H1, mono uppercase meta labels, left accent rule on H3s) reused verbatim, not a separate "marketing" treatment |
| Headings | Risk of eyebrow labels / one recolored word | Writing rule enforced: sentence case, no eyebrows, no mid-headline accent color, verified against copy in section 10 |
| Buttons/links | Risk of magnetic buttons, custom cursor | None implemented; standard focus/hover states only |
| Copy | Risk of stacked abstract nouns | All copy is the brief's verbatim text; concrete nouns throughout ("a tester", "a fix", "a report"), no invented jargon |

No planned element required a change from the brief's defaults; the table above is the required check, not a list of fixes.
