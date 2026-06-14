# Classical Language Arts

Curricular support materials for reading classic literature with children.

The first Quarto book is in `classical-literature-companion/`.

To preview it, run:

```powershell
cd classical-literature-companion
quarto preview
```

To render all configured formats:

```powershell
quarto render
```

## GitHub Pages

This repo includes a GitHub Actions workflow at `.github/workflows/pages.yml`.
When changes are pushed to `main` or `master`, the workflow renders the Quarto
literature companion as HTML and EPUB, then publishes both to GitHub Pages.

After pushing to GitHub, open the repository settings and set **Pages** to deploy
from **GitHub Actions**.

Published outputs:

- Literature companion HTML: `/`
- Literature companion EPUB: `/classical-language-arts.epub`
