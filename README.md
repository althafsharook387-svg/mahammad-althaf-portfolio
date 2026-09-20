# Mahammad Althaf — Portfolio

Personal portfolio site for **Mahammad Althaf** — Trade Finance, EXIM Compliance &
Sales Coordination Analyst based in Mangalore, Karnataka.

Static site: plain HTML, CSS and vanilla JavaScript. No build step, no dependencies.

## Structure

```
index.html                       # the whole page
assets/css/style.css             # styles (light + dark themes)
assets/js/main.js                # nav, theme toggle, scroll reveals, count-up
assets/img/althaf-hero.jpg       # hero portrait
assets/img/althaf-about.jpg      # about-section portrait
assets/Mahammad-Althaf-Resume.pdf
.github/workflows/deploy.yml     # auto-deploy to GitHub Pages on push to main
```

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Pushes to `main` publish automatically via GitHub Actions. One-time setup:
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

Live URL: `https://althafsharook387-svg.github.io/mahammad-althaf-portfolio/`

To use a custom domain later, add a `CNAME` file containing the domain and point
the DNS records at GitHub Pages.

## Updating content

All copy lives directly in `index.html`, grouped by section (`#about`,
`#expertise`, `#experience`, `#skills`, `#education`, `#contact`). Replacing the
résumé means dropping a new PDF at the same path.
