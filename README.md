# Coaching by Manav

A responsive single-page website for a personal gym training and accountability
coaching service, built with plain HTML, CSS and JavaScript and deployed to
Cloudflare Workers.

**Live preview:** https://coaching-by-manav-preview.khokharzain001.workers.dev

> The site currently carries a `noindex, nofollow` tag while it is in preview.
> This is removed at official launch.

---

## Why no framework

The site is a static marketing page with one interactive element (a booking
link). It has no user accounts, no database and no server-side logic.

Adding React, a bundler or a build step would mean shipping tens of kilobytes
of JavaScript and introducing a dependency tree, to render content that is
fully known at author time. Plain HTML and CSS load faster, cost nothing to
host, and will still build in five years without a `npm install` archaeology
session.

Appointment booking, payments and customer data are handled by
[Square Appointments](https://squareup.com/au/en/appointments) rather than
being rebuilt in-house. Card details are never collected by this site.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Markup | HTML5, semantic sections |
| Styling | Hand-written CSS, custom properties, CSS Grid |
| Scripting | Vanilla JavaScript (~25 lines) |
| Hosting | Cloudflare Workers Static Assets |
| Deploys | Cloudflare Workers Builds, triggered by pushes to `main` |
| Bookings | Square Appointments (pending configuration) |

No build step. No dependencies. No `node_modules`.

---

## Project structure

```text
CoachingByManav/
├── index.html            # Entire page: hero, about, coaching, booking, contact
├── css/
│   └── styles.css        # All styling, including responsive breakpoints
├── js/
│   └── script.js         # Footer year, booking button, video, gallery, scroll UI
├── images/
│   ├── manav-hero.jpg    # Wide hero, 2560x1280
│   ├── manav-hero-small.jpg # Upright hero for phones, 1000x1742
│   ├── favicon.svg       # Site icon
│   ├── social-preview.jpg # 1200x630 Open Graph card
│   ├── manav-intro-poster.jpg # Still frame shown before the video plays
│   └── gallery/          # Six gallery photographs, 920px tall
├── video/
│   └── manav-intro.mp4   # Introduction video, H.264 720p, 15s
├── wrangler.jsonc        # Cloudflare Worker configuration
├── .assetsignore         # Files excluded from the deployed site
└── README.md
```

---

## Design system

Defined as custom properties at the top of `css/styles.css`:

```css
--black:        #080808
--dark-grey:    #111111
--card-grey:    #171717
--border-grey:  #2a2a2a
--red:          #e50914
--dark-red:     #b80710
--white:        #ffffff
--light-grey:   #b8b8b8
```

Layout constraints:

- Maximum content width `1120px`
- Sticky header with `backdrop-filter` blur
- Fluid typography via `clamp()` — no fixed font sizes on headings
- Responsive breakpoints at `800px` (tablet) and `520px` (mobile)
- `scroll-margin-top` on all `section[id]` so the sticky header does not
  cover section headings when navigating by anchor

---

## Running locally

No build step is required. Serve the folder over HTTP:

```bash
cd CoachingByManav
python3 -m http.server 5500
```

Then open <http://localhost:5500>.

### Testing on a phone

Find your Mac's local network address:

```bash
ipconfig getifaddr en0
```

Open `http://<that-ip>:5500/index.html` on the phone, on the same Wi-Fi
network.

> Type the `http://` prefix explicitly. Safari will otherwise try HTTPS,
> which `python3 -m http.server` does not support, and fail with
> *"could not establish a secure connection"*.

---

## Deploying

Deployment is automatic. Pushing to `main` triggers a Cloudflare Workers
Build, which uploads the static assets and promotes the new version.

```bash
git add .
git commit -m "Describe the change"
git push
```

The build takes roughly 30 seconds. Progress is visible under
**Workers & Pages → coaching-by-manav-preview → Deployments**.

### Deploying manually

If you need to push without going through GitHub:

```bash
npx wrangler deploy
```

### What gets deployed

Everything in the repository root *except* the patterns listed in
`.assetsignore` — which excludes `.git`, Markdown documentation, the Wrangler
config and macOS artefacts. The live site therefore only receives
`index.html`, `css/`, `js/` and `images/`.

---

## Current status

**Implemented**

- Responsive single-page layout, tested on desktop and mobile
- Sticky navigation with smooth anchor scrolling
- Hero, about, coaching services, booking and contact sections
- Working email and Instagram links
- Automatic footer copyright year
- Favicon, Open Graph and Twitter card metadata
- Fitness and medical disclaimer
- Introduction video in the About section, click to play
- Auto-gliding photo gallery with a pause control
- Scroll reveal animations and scrollspy navigation
- Scroll progress line beneath the header

### Hero composition

The hero photograph is portrait, and a wide banner crop of it would cut
Manav's head off. Two separate files are produced from the one source:

- **Desktop** (`manav-hero.jpg`, 2560x1280) — a horizontal band is taken
  around his head and torso, then the flat dark wall to his left is sampled
  and extended to shift him into the right half of the frame, leaving clean
  space for the headline. The join is crossfaded over 260px so there is no
  visible seam.
- **Narrow screens** (`manav-hero-small.jpg`, 1000x1742) — an upright crop
  that keeps the original composition. The headline moves to the *bottom*
  of the hero and the gradient darkens downwards, so his face and upper
  body stay clear instead of sitting behind the type.

Both are desaturated to 55% to ease the source's blue cast, so the red
brand accents still read against it.

### Gallery

The strip contains the same six photographs twice inside a flex row that
is animated by exactly `-50%` of its width. The second set therefore
arrives in the first set's starting position and the loop repeats with no
visible jump.

Slides use a fixed height and automatic width, so portrait and landscape
shots sit together without cropping — which is also what keeps the film
border on the gym floor photograph intact. The edges are feathered with a
CSS mask so images enter and leave rather than being cut off.

The animation is pure CSS and runs with scripting disabled. It pauses on
hover and on keyboard focus, and there is an explicit pause button because
continuously moving content needs a stop control and hover does not exist
on touch screens. `prefers-reduced-motion` stops the animation entirely
and makes the strip scrollable by hand instead.

### Scroll progress line

The line under the header is driven by a scroll-driven CSS animation
(`animation-timeline: scroll(root block)`) where the browser supports it,
which runs off the main thread and stays smooth under load. `script.js`
checks for that same feature and only attaches a scroll handler when it is
missing. The fallback batches into `requestAnimationFrame` and writes only
a `transform`, so scrolling never triggers layout.

### Video encoding

The source clip is a 46 MB iPhone recording: 1080p60 at 22.7 Mbps, carrying
a spatial-audio track and several metadata streams alongside the stereo
audio. It is downscaled to 720p30 and re-encoded at CRF 25, mapping only
the stereo track, which brings it to 4.0 MB with no visible loss at the
size it is displayed:

```bash
ffmpeg -i IMG_9346.mov \
  -map 0:v:0 -map 0:a:0 \
  -vf "scale=1280:720:flags=lanczos,fps=30,fade=t=out:st=14.7:d=0.5" \
  -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p \
  -movflags +faststart \
  -af "afade=t=out:st=14.7:d=0.5" -c:a aac -b:a 128k -ac 2 \
  video/manav-intro.mp4
```

The explicit `-map` flags matter: without them ffmpeg picks up the extra
audio and data streams, producing a file some browsers refuse to play.

The `<video>` element uses `preload="none"`, so the file is only fetched
once a visitor presses play and costs nothing on initial page load.

**Pending**

- Square Appointments configuration and the public booking URL
- Service pricing, durations and packages
- Photo gallery — awaiting real training photographs
- Testimonials, with client permission
- FAQ section
- Cancellation and rescheduling policy
- Privacy notice
- Higher-resolution hero image
- Custom domain
- Removal of the `noindex` tag at launch

---

## Booking integration

The booking button is intentionally inert until Square is configured.
`js/script.js` detects a placeholder `href` and disables the link so it
does not jump to the top of the page:

```javascript
if (!bookingUrl || bookingUrl === "#") {
    squareBookingLink.setAttribute("aria-disabled", "true");
    squareBookingLink.addEventListener("click", (event) => {
        event.preventDefault();
    });
}
```

To activate it, replace the placeholder in `index.html`:

```html
<a
    href="https://squareup.com/appointments/book/YOUR-BOOKING-URL"
    class="button button-primary booking-button"
    id="square-booking-link"
    target="_blank"
    rel="noopener noreferrer"
>
    View Available Times
</a>
```

No JavaScript changes are needed — the guard only fires on the placeholder.

---

## Scope

This site advertises general gym training guidance, exercise support and
accountability coaching. It deliberately avoids claiming registered personal
training, physiotherapy, dietetic or medical credentials, and does not
advertise injury rehabilitation, medical nutrition therapy or guaranteed
physical results. The footer carries a disclaimer to this effect.

---

## Licence

All rights reserved. The content, branding and photography belong to
Coaching by Manav.
