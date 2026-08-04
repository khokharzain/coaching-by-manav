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
│   └── script.js         # Footer year, booking button, video play overlay
├── images/
│   ├── manav-hero.jpg    # Hero background
│   ├── favicon.svg       # Site icon
│   ├── social-preview.jpg # 1200x630 Open Graph card
│   └── manav-intro-poster.jpg # Still frame shown before the video plays
├── video/
│   └── manav-intro.mp4   # Introduction video, H.264, 55s
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

### Video encoding

The source clip was 110 MB of 12.9 Mbps HEVC, which exceeds Cloudflare's
25 MiB per-file asset limit and is not reliably playable outside Safari.
It is re-encoded to H.264 at CRF 27 with `+faststart`, bringing it to
5.4 MB while remaining visually identical at this resolution:

```bash
ffmpeg -i source.MP4 -t 55 \
  -vf "fade=t=out:st=54.4:d=0.6" \
  -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p \
  -movflags +faststart \
  -af "afade=t=out:st=54.4:d=0.6" -c:a aac -b:a 96k \
  video/manav-intro.mp4
```

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
