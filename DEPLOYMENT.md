# GitHub Pages and Genially

In the repository's Settings → Pages, select **GitHub Actions** as the publishing source. The included workflow builds and publishes on pushes to the default branch. No deployment has been performed by this preparation step.

The permanent customer URL is **https://svetlish.ru/present-simple-airport-rush/**. Customers never add or update a version query. Keep the existing custom-domain and repository-path configuration.

Each deployment runs `python3 scripts/prepare_pages.py`. Its SHA-256-derived release version automatically covers all runtime files plus the build script and entry-shell template. No manual version edit is needed.

The build publishes a stable `index.html` shell, a small `release.json` manifest, and versioned `game.html`. Even a cached shell fetches the manifest with `cache: no-store` and a unique internal query, then loads `game.html?v=RELEASE`. It validates the HTML release marker before starting the game. The customer's address never changes, and debug query parameters are retained. HTML, CSS, JS, dynamic image/GIF/audio paths, preload URLs and image-sizing selectors use matching release versions; normal asset caching is retained.

GitHub Pages controls HTTP cache headers; this project cannot override them. The stable shell avoids depending on fresh index.html headers. Publishing/CDN propagation and network outages can still delay availability; retries do not guarantee instant global delivery. A browser still holding the old pre-shell index must receive this initial deployment once before the new strategy can protect subsequent updates.

A restored page, returning visible page, or refocused iframe checks for a newer release. If gameplay is active, refresh waits until HOME so the current mini-game is not interrupted. A permanently visible uninterrupted session is not forcibly reloaded. No service worker is added, and no gameplay storage is modified.

Recommended permanent embed:

```html
<iframe
  src="https://svetlish.ru/present-simple-airport-rush/"
  width="100%"
  height="100%"
  style="border:0; width:100%; height:100%;"
  allow="autoplay; fullscreen"
  allowfullscreen>
</iframe>
```

Use an iframe with a 16:9 area and allow scripts and same-origin content if sandboxing it. `allow="autoplay"` is helpful, but the game still waits for interaction inside the game to start sound. Keyboard focus must be inside the iframe. The existing viewport fitting keeps the 1440×810 stage proportional.

The source contains no localStorage completion persistence; no persistence was removed or added. In-memory journey state remains unchanged. A fresh browser or restricted third-party storage does not require saved state.

Images retain their original dimensions. Cutouts use lossless WebP with alpha; photographic airport backgrounds use quality-92 WebP. GIF animations remain unchanged. WAV effects were replaced by 192 kbps MP3, music uses 192 kbps MP3, and final_success.mp3 remains unchanged.
