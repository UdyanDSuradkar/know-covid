# Standalone build

`index.html` is the entire observatory in one self-contained file — no build step, no
dependencies, no node_modules. Open it directly in a browser, or drop it on any static
host (GitHub Pages, Netlify drop, S3).

It uses the bundled data snapshot only. The React project in the parent folder is the one
that fetches live figures from disease.sh.
