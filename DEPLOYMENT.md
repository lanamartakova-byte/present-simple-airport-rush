# GitHub Pages and Genially

In the repository's Settings → Pages, select **GitHub Actions** as the publishing source. The included workflow builds and publishes on pushes to the default branch. No deployment has been performed by this preparation step.

Keep the repository Pages URL unchanged in Genially. Each deployment runs `python3 scripts/prepare_pages.py`, hashes the runtime files, and adds that release hash to CSS, JavaScript, image, GIF and audio requests in `_site`. Dynamic image paths and image-sizing selectors receive matching versions. No service worker is installed. Never publish an old `_site` folder manually.

GitHub Pages controls caching of index.html; this project cannot override those HTTP headers. An already-open iframe needs a reload, and a freshly deployed entry page can take time to propagate through GitHub's cache. Once the updated entry page is served, its new versioned imports and media requests avoid stale assets. The iframe URL does not need changing.

Use an iframe with a 16:9 area and allow scripts and same-origin content if sandboxing it. `allow="autoplay"` is helpful, but the game still waits for interaction inside the game to start sound. Keyboard focus must be inside the iframe. The existing viewport fitting keeps the 1440×810 stage proportional.

The source contains no localStorage completion persistence; no persistence was removed or added. In-memory journey state remains unchanged. A fresh browser or restricted third-party storage does not require saved state.

Images retain their original dimensions. Cutouts use lossless WebP with alpha; photographic airport backgrounds use quality-92 WebP. GIF animations remain unchanged. WAV effects were replaced by 192 kbps MP3, music uses 192 kbps MP3, and final_success.mp3 remains unchanged.
