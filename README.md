# Elliana

A single-page web app (KPI / sales dashboard). No build step, no backend, no dependencies. All styling now lives in a separate `styles.css` file linked from `index.html`, so you can tweak the look without touching the markup/logic.

## Run locally

Just open `index.html` in any modern browser. That's it.

Optionally serve it over HTTP:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy on GitHub Pages

1. Create a new repository on GitHub (e.g. `elliana`).
2. Upload the contents of this folder (`index.html`, `styles.css`, `logo.png`, `.nojekyll`, `README.md`) to the repo.
   - Web UI: on the repo page click **Add file → Upload files**, drag these files in, then **Commit changes**.
   - Or with Git:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/<your-username>/elliana.git
     git push -u origin main
     ```
3. In the repo go to **Settings → Pages**.
4. Under **Build and deployment → Source** choose **Deploy from a branch**.
5. Pick branch **main** and folder **/ (root)**, then **Save**.
6. Wait ~1 minute. Your app will be live at:
   `https://<your-username>.github.io/elliana/`

## Branding / logo

`logo.png` is the Elliana logo. It's used as the browser tab icon (favicon / Apple touch icon) and as the logo shown on the login and password-reset screens (referenced by the `LOGO_FULL` variable in `index.html`). Replace `logo.png` with a new file of the same name to swap the brand image. Keep it in the same folder as `index.html`.

## Customizing the look

All visual styling is in `styles.css`. The top of the file defines a set of CSS variables (colors, radius, shadows) under `:root` (light theme) and `html[data-theme="dark"]` (dark theme) — change those to re-theme the whole app at once. Keep `index.html` and `styles.css` in the same folder so the `<link rel="stylesheet" href="styles.css">` resolves.

## Notes

- The `.nojekyll` file tells GitHub Pages to serve files as-is (skips Jekyll processing). Safe to keep.
- Because the page is named `index.html`, it loads automatically as the site's home page.
