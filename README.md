# Mahammad Althaf — Portfolio

Personal portfolio for **Mahammad Althaf** — Procurement & Trade Finance Analyst,
Mangalore, India. Procurement, import operations, trade finance, EXIM compliance
and business analytics.

Static site: HTML, CSS and vanilla JavaScript. No build step, no dependencies.
Total page weight under 300 KB.

## Structure

```
index.html                  # all 16 sections
assets/css/style.css        # design system, light + dark
assets/js/main.js           # nav, theme, reveals, counters, charts, map, tooltips
assets/img/                 # portraits
assets/*.pdf                # résumé and MBA research report
.github/workflows/deploy.yml
```

## Sections

01 Hero · 02 Impact · 03 About · 04 What I do · 05 How I work ·
06 Working across borders · 07 Experience · 08 Selected projects ·
09 MBA research · 10 AI-enabled workflows · 11 Analytics · 12 Skills ·
13 Education & journey · 14 Where I can add value · 15 Beyond the spreadsheet ·
16 Contact

## Design system

Deep navy, off-white and warm gold. Two data-series colours (`--ser-a` #2f6fe0,
`--ser-b` #bf8a1f) chosen for colour-vision separation and validated against both
the light and dark chart surfaces. All body text clears WCAG AA in both themes.

Every animation is disabled under `prefers-reduced-motion`.

## Run locally

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Deploy

Pushes to `main` publish automatically via GitHub Actions
(Settings → Pages → Source: GitHub Actions).

Live: https://althafsharook387-svg.github.io/mahammad-althaf-portfolio/

## Editing content

All copy lives in `index.html`, grouped by the section comments. The demo
dashboard in the Analytics section is explicitly labelled as sample structure —
it holds no company data and should stay that way.
