# Square setup — status and next steps

Last updated: 5 August 2026

Where the Square Appointments setup got to, and exactly what is left. Pick
up from "Remaining".

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

### 5. Test before announcing

Book a real appointment as if you were a client:

- Confirm the deposit charges the right amount for each service
- Confirm the confirmation email shows the gym address, not a home address
- Confirm the logo and business name look right
- Cancel and refund it afterwards

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

**No travel radius is set.** Nothing stops someone an hour away booking an
in-person session. Consider naming the suburbs Manav will travel to.

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
