# Design plan

## Tokens

### Color
| Token | Value | Use |
|---|---|---|
| `bg` | `#0A0E13` | Page background |
| `surface-1` | `#10161D` | Header after scroll, inputs, mobile menu |
| `surface-2` | `#17202A` | Raised panels |
| `line` | `#243140` | 1px borders and rules |
| `text` | `#E8EEF4` | Primary text |
| `text-muted` | `#93A1B1` | Secondary text |
| `accent` | `#29E0C4` | Primary buttons, finding nodes, allowed actions, focus rings |
| `accent-ink` | `#04201B` | Text on accent |
| `blocked` | `#FF6B6B` | Blocked actions, governance moment only |
| `severity-critical` | `#FF5470` | Severity chip/bar only |
| `severity-high` | `#FF8C42` | Severity chip/bar only |
| `severity-medium` | `#F5C451` | Severity chip/bar only |
| `severity-low` | `#5AA9FF` | Severity chip/bar only |
| `severity-info` | `#93A1B1` | Severity chip/bar only |

Contrast check (WCAG 2.2 AA):
- `text` (#E8EEF4) on `bg` (#0A0E13): ~16.1:1. Pass (body, large).
- `text-muted` (#93A1B1) on `bg` (#0A0E13): ~7.1:1. Pass (body, large).
- `accent-ink` (#04201B) on `accent` (#29E0C4): ~12.8:1. Pass.
- `text` on `surface-1`/`surface-2`: both pass 4.5:1 (surfaces are darker than bg's siblings but still well under text luminance).
- `accent` (#29E0C4) on `bg` (#0A0E13), used for focus rings/links as a UI component, not body text: ~9.9:1, passes the 3:1 UI-component threshold.
- `blocked` (#FF6B6B) on `bg`: ~5.4:1. Pass for text use in the governance moment.
- Severity colors are never used as text-only indicators (always paired with a dot + text per section 6), so the 3:1 non-text contrast threshold against `surface-2` applies and all five pass (lightest is medium #F5C451 at ~10:1, darkest is low #5AA9FF at ~4.3:1 against surface-2 #17202A).

No lightness adjustments were needed; all pairs pass as specified in the brief.

### Type
- Display: Clash Display 500/600. display-xl clamp(48px,6vw,96px)/0.98, display-l clamp(36px,5vw,60px)/1.02, tracking -0.02em at display sizes, tabular figures on animated numbers.
- Text: General Sans 400/500/600. h3 clamp(22px,2.2vw,26px)/1.2, body 17px/1.6, small 14px/1.5.
- Mono: Geist Mono 400, 14px/1.55. Audit log and evidence-style content only.
- Body measure: max 68ch.

### Layout
- 12-column grid, max-width 1320px, side padding clamp(16px,4vw,48px), gutter 24px desktop / 16px mobile.
- Section padding clamp(96px,14vh,176px) top/bottom.
- Radius: chips full, buttons 10px, inputs 8px, panels 6px, diagrams 0.
- No shadows, no gradients except hero shader glow + one 6%-accent radial vignette, no glassmorphism except the scrolled header blur.

## One-sentence layout concept per page

1. **/** (home): a single long vertical scroll stacking seven authored moments (hero → problem → pipeline → governance → findings → noise → report) that each visually demonstrate one claim, bookended by a plain audience list and a closing CTA.
2. **/platform**: a static, left-aligned technical walkthrough (profiles → pipeline → coverage → log → findings/noise → reports → benchmark) with no scroll-jacking, read top to bottom like documentation.
3. **/governance**: four stacked horizontal layers connected by a single vertical line, descending from Planning to Record, followed by a three-column does/doesn't/next table and the fallback/authorization closers.
4. **/use-cases**: five repeated audience blocks (lead, detail, today-list, roadmap-list), each a plain left-aligned stack, no cards.
5. **/compliance**: a plain prose/list regulatory briefing, single column, narrow measure, ending in a small-text disclaimer.
6. **/roadmap**: two side-by-side columns (Live, Building) of plain checked/bulleted lists, Live first on mobile.
7. **/about**: a single-column founder narrative followed by a three-item "practice vs product" list and the AI-honesty callout.
8. **/contact**: a 7/5 split, form left, numbered "what happens next" steps right, sticky on desktop.
9. **/security**: guidelines list followed by a disclosure form, same shape as /contact but single column with no side panel.
10. **/legal/***: plain single-column legal prose with headed subsections, narrow measure.
11. **/not-found**: centered, minimal, two lines and a link — the one page allowed to break the left-align rule.

## Anti-pattern check

| Section | Risk | Mitigation |
|---|---|---|
| Hero | Could read as a generic stats strip | Numbers are load-bearing to one real claim (121→5), tied to a live choreographed visual, not a decorative gradient stat tile |
| Who it's for | Five-row list could become a bento grid | Built as plain left-aligned rows with rule lines between, not cards |
| Pipeline | Horizontal scroll track risks looking like a generic "steps" carousel | Each panel is plain text + step number, no card chrome, no shadow, no hover-lift |
| Findings anatomy | Six-field schematic could become icon cards | Built as a labeled diagram with text regions + a button list, no icons, no card borders beyond the one diagram outline |
| Governance gate | Chips moving between lanes could look like a generic Kanban demo | Lanes are plain text-labeled zones with a mono audit log underneath, grounding it in the real decision data, not a generic flowchart |
| All headings | Risk of eyebrow labels / accent-one-word | Writing rule enforced: sentence case, no eyebrows, no mid-headline color accents, verified against copy in section 9 |
| All cards/panels | Risk of uniform rounded bento cards | Radius hierarchy (6px panels, 10px buttons, 0 diagrams) and no-shadow rule keep surfaces differentiated by color/line only |

No planned element required a change from the brief's defaults; the table above is the required check, not a list of fixes.
