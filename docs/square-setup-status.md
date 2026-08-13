# Square setup — status and next steps

Last updated: 5 August 2026

Where the Square Appointments setup got to, and exactly what is left. Pick
up from "Remaining".

---

## Deferred — must happen before launch

Two things deliberately left until later. Neither blocks anything now, but
both must be done before the site is promoted anywhere.

### Connect the custom domain

The site is live and indexable. The remaining task is the domain.

Manav's ABN is active, so **coachingbymanav.com.au** is eligible. Buy it
from an Australian registrar — Cloudflare Registrar does not sell .au —
then point the nameservers at Cloudflare and add it as a Custom Domain on
the Worker.

**When the domain is live, seven places carry the old URL.** They must
change together or Google will index two copies of the same page:

1. `index.html` — `rel="canonical"`
2. `index.html` — `og:url`
3. `index.html` — `og:image`
4. `index.html` — `twitter:image`
5. `index.html` — the JSON-LD block: `@id`, `url` and `image`
6. `robots.txt` — the `Sitemap:` line
7. `sitemap.xml` — the `<loc>` value

Also update the website field in Square, and the live preview link at the
top of the README.

A single find and replace of
`https://coaching-by-manav-preview.khokharzain001.workers.dev` across the
repository covers all of it.

Then submit the domain to Google Search Console and request indexing.

### Raise prices on 1 November 2026

The booking section advertises introductory rates that rise on 1 November.

| Service | Introductory | From 1 November |
| --- | --- | --- |
| Fitness Consultation | $25 | $35 |
| Eating Habits Support | $25 | $35 |
| Gym Training Session | $50 | $60 |

**This has to actually happen.** The prices are framed as introductory
with a stated future rate rather than as a discount off a struck-through
former price, because Manav has never charged the higher amount and
presenting it as a past price would be a false reference price under the
Australian Consumer Law. Misleading pricing is a current ACCC enforcement
priority — HSK United paid $79,200 in June 2026, and in the Emma Sleep
case 58 products had never sold at the strikethrough price at all.

The framing is accurate only while the price rise is genuinely intended.
If $25 is still the rate in November it has become the real price, and
the claim goes stale.

On 1 November, update **both** Square and the pricing block in
`index.html`. They must not disagree.

### Add opening hours to the structured data

Hours were deliberately left out of the JSON-LD. They live in Square, and
a second copy in the page markup risks the two disagreeing — wrong hours
in Google search results are worse than no hours.

If they are added later, take them from Square rather than retyping, and
treat Square as the single source of truth.

---

## Decisions locked in

| Decision | Value |
| --- | --- |
| Deposit, in-person sessions | 20% of the session fee, balance paid at the session |
| Payment, phone services | 100% at booking |
| Minimum cancellation notice | 24 hours |
| Cancellation window from booking | None — see `cancellation-policy.md` for why |
| Public email | manavfitness.stop@gmail.com |
| Square login email | manavmunzal05@gmail.com |
| Public phone | 0481 812 324 |
| Location type | Mobile location |
| Time zone | Brisbane — **not** Sydney, Queensland has no daylight saving |

---

## Services created

| Service | Duration | Price | Taken at booking |
| --- | --- | --- | --- |
| One-On-One Fitness Consultation (Through Call) | 30 min | $25 | 100% |
| General Eating Habits Support (Through Call) | 30 min | $25 | 100% |
| One-On-One Gym Training Session | 1 hr | $50 | 20% deposit, $10 |

All three are set to "Bookable by customers online".

---

## Done

- Account verified, bank account linked, payments enabled
- Three services created with descriptions and prices
- Business hours set
- Location moved from the home address to the gym
- Account business name, location business name and nickname all set to
  Coaching By Manav
- Logo uploaded to Branding
- Contact email, phone, website and Instagram filled in

---

## Remaining

### 1. Deposits and cancellation policy

Appointments → Settings → [Payments & cancellations](https://app.squareup.com/dashboard/appointments/business/cancellation_policy)

- Click the current policy → **Require a deposit**
- Choose **Specific services**, not All services. Picking All services
  charges the gym session in full at booking instead of taking the $10
  deposit.
- Fitness Consultation → 100%
- Eating Habits Support → 100%
- Gym Training Session → 20%
- If Square rejects 100 as a percentage, set a fixed $25 on the two call
  services instead.
- Mark deposits **refundable**, which is what the website states.
- Booking cut-off: **24 hours**. This is what actually enforces the
  cancellation policy; without it the 24 hour rule is only words.
- Booking window: 30–60 days ahead.
- Paste the cancellation policy from `cancellation-policy.md`.

### 2. Publish the booking site

Appointments → Online Booking → Channels

- Toggle **Enable online booking**
- Under Booking channels → **Preview & edit** the Square Online site
- Customise, then **Publish**
- Choose the URL slug carefully; it is awkward to change once links are out

### 3. Get the booking flow URL

Same page, under **"Add your booking flow to an existing site"** →
**Get Started** → **Get URL**.

Two different links exist here. The **booking flow URL** drops clients
straight into choosing a service. The site URL from step 2 lands them on a
generic page. The booking flow URL is the one the website needs.

### 4. Wire it into the website

Send the booking flow URL over. The button in `index.html` already carries
`id="square-booking-link"` and is disabled by `js/script.js` while the href
is a placeholder. Replacing the href activates it — no JavaScript change
needed.

### 5. Verify with a real test booking

Square's setup progress bar is not a completeness check. It counts
optional items — create a class, import a customer list, explore hardware
— that will never be done here, so it will never reach 100%. Ignore it.

The only reliable test is booking an appointment as a client would.

**Do it in a private or incognito window**, otherwise you are logged in as
the seller and will see a different flow to the one clients get.

#### On the booking page

- [ ] Business name reads Coaching By Manav, not Manav's fitness
- [ ] Logo appears and is not stretched or cropped
- [ ] All three services are listed with the right durations and prices
- [ ] The address shown is the gym, not the home address
- [ ] No slots are offered inside the next 24 hours — if they are, the
      booking cut-off did not save
- [ ] The cancellation policy is visible **before** the payment step, not
      after. Australian Consumer Law requires disclosure before the client
      commits.

#### At payment

Book the **$50 gym session** first, because it is the one that will show a
misconfiguration:

- [ ] The amount charged is **$10**, not $50. If it charges $50, the
      deposit was set to All services instead of Specific services.

Then book a **$25 call service**:

- [ ] The amount charged is the full **$25**

#### After booking

- [ ] Confirmation email arrives
- [ ] It shows the gym address, correct business name and the logo
- [ ] It contains a reschedule link
- [ ] The appointment appears on the Square calendar
- [ ] The payment appears under Transactions

#### Who does what

Book with **Zain's card**, and have **Manav process the refund**.

Using Manav's own card on his own Square account is self-processing, which
payment providers monitor. One small test is unlikely to matter, but a
genuine third-party card is cleaner and actually exercises the real flow,
including the confirmation email reaching a different inbox.

Manav doing the refund matters more than it sounds. Because every service
carries a deposit, clients cannot cancel their own appointments — every
cancellation and refund will go through him. Better he does the first one
as a test than as an apology.

#### Clean up

- [ ] Cancel both test appointments and refund them
- [ ] Confirm the refunds appear in Transactions

**How to refund.** Either route works:

- **From the appointment** — Appointments → Calendar → the booking →
  Cancel, or mark as no-show. Square offers the refund as part of that
  action. This is the route Square's own deposit documentation describes.
- **From Transactions** — Transactions → the payment → ••• → Issue Refund
  → full amount → select a reason → confirm.

**What to expect:**

- **Processing fees are not returned.** Square states that when a payment
  is refunded, the processing fees are not refunded to the seller. The
  test therefore costs roughly 40–50c permanently.
- **Refunds are slow.** Square takes 2–7 business days, then the card
  issuer takes another 2–7. Up to 14 business days in total.
- **Refunds cannot be cancelled.** Square is explicit about this. Check
  the amount before confirming.
- **Where the money comes from:** if the Square balance covers the refund
  it is deducted there; if the funds have already been transferred out,
  the linked bank account is debited instead.

#### A few days later

- [ ] Check the money actually reached the bank account. Square holds the
      first transfer from a new account longer than usual, so do not be
      alarmed if it is not immediate — but do confirm it lands before
      relying on it.

---

## Configuration verified against the live booking data

The booking flow URL returns the full widget configuration, so the setup
can be checked without making a test booking. Verified 5 August 2026.

| Setting | Value | Status |
| --- | --- | --- |
| Business name | Coaching by Manav | ok |
| Timezone | Australia/Brisbane | ok |
| Public email | manavfitness.stop@gmail.com | ok |
| GST | `fees: []` | removed |
| Deposits enabled | true, percentage | ok |
| Consultation deposit | 100% | ok |
| Eating Habits deposit | 100% | ok |
| Gym Session deposit | 20% | ok |
| Minimum booking notice | `cutoff_time: 86400` = 24h | ok |
| Cancellation cut-off | `no_show_cutoff_time: 86400` = 24h | ok |
| Booking window | `future_booking_limit_time: 5184000` = 60 days | ok |
| Confirmation email | true | ok |
| Confirmation SMS | true | ok |
| Cancellation policy | present, `display_cancellation_policy: true` | ok |
| Refund policy | present | ok |
| Brand colour | `30d443`, Square default green | outstanding |
| Logo | `logos: null` | outstanding |

### How GST was removed

The Edit tax panel has no disable control. The tax was neutralised by
opening Settings → Account & Settings → Payment → Sales taxes → GST and
setting **Locations** to **No locations**. A tax attached to no location
applies to nothing.

This is reversible: re-tick the location if Manav ever registers for GST.

`is_taxable: true` remains on each service, which is expected. It marks
the service as taxable in principle; with no tax rule attached to the
location, `fee_ids` is empty and nothing is charged.

### Outstanding — cosmetic only

The brand colour is Square's default green rather than the site's red, and
the uploaded logo did not persist. This affects the appearance of receipts,
invoices and the booking flow, not their function.

To fix: Locations → the location → Branding → pencil. Square asks for two
images and a colour.

| Field | File | Size |
| --- | --- | --- |
| Full logo | `brand/square-full-logo.png` | 1600x400 |
| Small logo | `brand/square-small-logo.png` | 1024x1024 |
| Colour | `e50914` | — |

Both are transparent PNGs with dark text and a red accent, because Square
renders these on receipts and invoices, which are white. A logo with a
black background would appear as a dark slab on the page.

The consequence is that the full wordmark is close to invisible on a dark
surface. That is the correct trade for Square, whose customer-facing
surfaces are light. `brand/logo-wordmark.png` and `brand/logo-square-*.png`
remain in the repo as the dark-background versions if a dark surface ever
needs one.

---

## Still open

**Workout Guidance & Accountability** is advertised on the website but has
no Square service behind it. Someone can read about it, click Book and find
nothing matching. Either create a service for it or take the card off the
site.

Worth deciding what it actually is first. Square Appointments only handles
things that occupy a time slot. If it is a written programme or ongoing
check-ins over weeks, it is not an appointment and belongs as a Square
payment link or subscription instead.

**Travel area — update the Square service description.**

Manav travels Brisbane's northern suburbs: Caboolture in the north down to
Brisbane City, and not out to the far western suburbs. His base is North
Lakes, so this is roughly the northern corridor either side of the Bruce
Highway.

This is now on the website, in the coaching card and in the price card
meta. It still needs adding to the Square service description, so the
limit appears at the point of booking as well.

Replace the description on **One-On-One Gym Training Session** with:

```text
A one hour one-on-one training session, built around what you're
working towards.

Sessions focus on technique, steady and safe progression, and building a
routine you can hold to on the days you train alone. Suitable whether
you're new to the gym, coming back after time away, or training
regularly without seeing the progress you expect.

WHERE MANAV TRAVELS
Brisbane's northern suburbs, from Caboolture in the north down to
Brisbane City. Not further north than Caboolture, and not out to the far
western suburbs. If you are unsure whether you are in range, message
Manav before booking.

WHERE YOU TRAIN
If you'd like Manav to train you at your own gym, please arrange a guest
day pass for him with your gym before the session. Most gyms offer
these, and the cost of the pass is covered by you.

A 20% deposit confirms your booking. The remaining balance is paid at
the session.

This is general fitness guidance and accountability coaching. It is not
medical, physiotherapy, injury rehabilitation or dietetic advice.
```

**Square's cancellation limitation.** Once an appointment carries a
deposit, clients cannot cancel it themselves — Square requires the seller
to do it. Cancellation requests will arrive as emails or Instagram
messages, not Square notifications. If they are missed, a client who
cancelled properly gets marked as a no-show.

---

## Before launch, unrelated to Square

- Remove `noindex, nofollow` from `index.html`
- Update the Open Graph URLs if a custom domain is connected
- Add prices to the coaching cards once the service list is final
