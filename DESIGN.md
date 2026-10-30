# The site's design

Notes for whoever changes the site next (a person or an agent): what the look is, why, and what
was tried and turned down.

## The brief

OpenGP is a native PC port of two arcade racers, Mario Kart Arcade GP (2005) and GP 2 (2007),
built by static recompilation. The site's one job is to get the right installer package into a
visitor's hands and to make clear what they are getting: no emulator, no game files, their own
disc built into a PC game. The audience is arcade enthusiasts and emulation people, many with a
wheel on the desk.

## The look: the launcher's, on the web

The site reuses the launcher's own tokens (`src/qml/Theme.qml` in opengp-launcher), so the site,
the launcher and the trailer read as one thing:

| Token | Value | Used for |
|---|---|---|
| asphalt | `#1D2331` | the page |
| asphalt deep | `#151A25` | the top bar, the download "play bar" |
| panel / line | `#272F41` / `#3A4459` | raised surfaces, hairlines |
| marquee | `#FFC629` | the one thing to press: Download, Play |
| blue | `#3B9BEF` | links |
| red | `#E5243B` | the wordmark's GP badge only (the trailer's) |
| chalk / dim / faint | `#F2F4F8` / `#98A3B6` / `#6B768A` | text |

Type: M PLUS Rounded 1c, Regular and ExtraBold, the launcher's typeface (OFL, in `assets/fonts`).
One family, two weights; scale 16 px at ratio 1.25; lines under 64 characters.

Layout: left-aligned throughout, one column of content at 1160 px, sections separated by
hairlines (the launcher's), no cards except the three download options.

## What is deliberate

- **The hero is the cabinet's attract mode**: a muted race loop from the release trailer under a
  dark gradient, with the trailer's own line, "The arcade is open." It is the page's one moving
  thing. Reduced-motion and data-saver visitors get the poster frame.
- **Features are a spec sheet** (a definition list), not a grid of identical cards: what the
  cabinet had and what the port adds, read like the back of a box.
- **The download section is the launcher's play bar**: deep asphalt with its checkered strip on
  top, the visitor's own system first and in marquee yellow, the others quiet.
- **Numbers only where there is a sequence**: the recompilation pipeline and the four set-up
  steps. Nothing else is numbered.
- **Copy in the project's voice**: plain, active, the README's and the launcher's wording. Buttons
  say what happens ("Download for Windows", "Watch the trailer").

## What was turned down, and why

- Near-black with one neon accent, and cream-with-terracotta: the default looks of generated
  pages. The launcher already has a palette; the site borrows it rather than inventing one.
- A drawn or AI-looking logo. The maintainer rejected drawn icons for the project (2026-09-29) and
  wants only original game art or plain type. The wordmark is type: "Open" and "GP" on a red
  parallelogram, as in the trailer. The favicon is the same badge.
- The game's own art (character portraits, course icons) as site chrome. Gameplay screenshots
  and the trailer show the port running; ripped art would be distributing the game's assets.
- An in-game menu screenshot: the menu is being redesigned (October 2026), so the site shows the
  launcher's settings instead.
- Scroll-reveal animations and hover lifts on every card.
- All-caps eyebrow labels, middle-dot meta strings, arrows after links.

## Media

- `assets/video/hero-loop.mp4`: 14 s of race footage from the release trailer (107.5 s to 121.5 s),
  1280x720, 30 fps, muted.
- `assets/video/opengp-trailer-720p.mp4`: the release trailer at 1280x720 60 fps. Its "OCTOBER 17"
  card (the original release date) is painted over; the rest is untouched.
- `assets/img/shots/*.webp`: frames from the 1440p trailer master, 1920x1080 and 960x540.
- `assets/img/launcher/*.webp`: `OpenGP.exe --screenshot-ui` against a source tree with both games
  built; the play bar's corner (which showed the dev build's version) is painted over.
- `assets/img/og.jpg`: the social preview, made by `brand.py` (not in the repo) from the fonts.
