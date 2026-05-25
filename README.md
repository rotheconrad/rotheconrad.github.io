# Roth E. Conrad Personal Bio Site

A clean, static GitHub Pages profile site for Roth E. Conrad, focused on computational genomics, pangenomics, comparative genomics, scientific AI systems, and open-source bioinformatics infrastructure.

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

The simplest robust deployment is GitHub Pages from the `main` branch.

### Option 1: User Site

Use this if you want the site at:

```text
https://rotheconrad.github.io
```

1. Create a GitHub repository named `rotheconrad.github.io`.
2. Put these files at the repository root.
3. Commit and push to `main`.
4. In GitHub, go to `Settings` -> `Pages`.
5. Under `Build and deployment`, choose `Deploy from a branch`.
6. Select branch `main` and folder `/root`.
7. Save.

### Option 2: Project Site

Use this if you want the site under an existing repository, for example:

```text
https://rotheconrad.github.io/repository-name/
```

1. Put these files at the root of the repository, or in a `docs/` directory.
2. In GitHub, go to `Settings` -> `Pages`.
3. Choose `Deploy from a branch`.
4. Select the branch and folder that contain `index.html`.
5. Save.

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
- The visible GitHub links currently use `https://github.com/rotheconrad`, based on the GitHub account referenced in the prompt. Replace with `https://github.com/newrothe` if that is the intended public-facing profile.
