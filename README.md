# Roth E. Conrad Personal Bio Site

A clean, static GitHub Pages profile site for Roth E. Conrad, focused on computational genomics, pangenomics, comparative genomics, scientific AI systems, and open-source bioinformatics infrastructure.

Live site: <https://rotheconrad.github.io/>

## Project Structure

```text
.
├── index.html
├── assets
│   ├── css
│   │   └── styles.css
│   └── js
│       └── main.js
├── .nojekyll
└── README.md
```

## Local Preview

No build step or dependency installation is required.

From this directory:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You can also open `index.html` directly in a browser, but a local server better matches how GitHub Pages serves the site.

## GitHub Pages Deployment

This repository is configured as a GitHub Pages user site:

```text
https://rotheconrad.github.io/
```

GitHub Pages publishes from the `main` branch at the repository root. To update the live site, edit the files, commit the changes, and push to `main`.

## Content Updates

The HTML includes comments marking the main update points:

- Profile links: GitHub, Google Scholar, LinkedIn, and email.
- Project names and repository links when active-development projects become public.
- Selected publication highlights.
- Contact details.

Search for `UPDATE` in `index.html` to find these sections quickly.

## Notes

- The site is plain HTML, CSS, and JavaScript for easy maintenance.
- `.nojekyll` is included so GitHub Pages serves the static files directly without Jekyll processing.
- The visible profile links currently use Roth's GitHub, Google Scholar, LinkedIn, and UGA email.
