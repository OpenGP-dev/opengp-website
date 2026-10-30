<img src="assets/img/wordmark.png" height="48" alt="OpenGP">

# OpenGP's website

The site for [OpenGP](https://github.com/OpenGP-dev/OpenGP), the native PC port of Mario Kart
Arcade GP and Mario Kart Arcade GP 2: what it is, the trailer and screenshots, the launcher, how to
get started, and the downloads.

It is a static site with no build step: `index.html`, `assets/css/site.css`, `assets/js/site.js`
and the media in `assets/`. Open `index.html` in a browser to see it, or serve the folder with
anything (`python -m http.server`).

## Publishing

`.github/workflows/pages.yml` publishes the repository's root to GitHub Pages on every push to the
default branch. In the repository's Settings, under Pages, set the source to **GitHub Actions**
once. The social preview's address in `index.html` (`og:image`) assumes the site lives at
`https://opengp-dev.github.io/opengp-website/`; change it if the site gets a domain.

## A new release

The download buttons point at the release's files on GitHub by name:
`OpenGP-<version>-windows-x64.zip`, `OpenGP-<version>-linux-x64.tar.gz` and
`OpenGP-<version>-macos-arm64.tar.gz`. When OpenGP's repository is public, the page reads the
latest release from GitHub's API when it loads and takes the version, file names and sizes from
there, so the buttons stay right by themselves. The fallback that the page carries itself is the
version in `assets/js/site.js` (`RELEASE.version`) and the links in the download section of
`index.html`; update both when a release goes out.

## The media

[DESIGN.md](DESIGN.md) says where every picture and video came from, and what the look is for.
Nothing in `assets/` is from the games' discs: the screenshots and the trailer show OpenGP running.
