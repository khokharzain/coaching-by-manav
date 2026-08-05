# Cancellation policy — plain text for Square

Paste this into Square's **cancellation policy** field so the terms shown at
the point of booking match the terms on the website. Under Australian
Consumer Law the policy must be disclosed *before* a client commits, so it
needs to appear in both places.

**Square:** Appointments → Settings → Communications → Cancellation Policy

---

## Version to paste

```text
CANCELLATION AND RESCHEDULING

Phone consultations are paid in full when you book. In-person sessions
take a 20% deposit to confirm the time, with the remaining 80% paid at the
session.

More than 24 hours before your session
Reschedule yourself through your booking confirmation email, at no cost.
To cancel outright, message or email Manav and you will be refunded in
full.

Less than 24 hours before your session
The amount paid is retained. Time reserved at short notice usually cannot
be offered to anyone else, and this covers that cost.

If you do not attend
The amount paid is retained, on the same basis as a cancellation inside
24 hours.

If Manav cancels or reschedules
You will be offered a full refund or a new time at no cost, whichever
suits you better.

Arriving late
Sessions finish at their scheduled time so the following client is not
delayed. Arriving late shortens the session rather than extending it.

Illness, injury and emergencies
Please get in touch. Where circumstances are genuinely outside your
control, the 24 hour requirement may be waived.

YOUR RIGHTS
Nothing in this policy limits your rights under the Australian Consumer
Law. You are entitled to a remedy if a service is not delivered with due
care and skill, does not match its description, or is not fit for its
stated purpose. Payment is retained only to cover the reasonable cost of
time set aside and not filled — never as a penalty.
```

---

## Why the "3 days from booking" rule was left out

The original request was for cancellations to be permitted only within the
first three days after booking, and no later than 24 hours before the
session.

The 24 hour requirement is kept, because it is straightforward to defend: a
session cancelled overnight genuinely cannot be filled, so retaining the
deposit reflects a real loss.

The three day window was not included, for three reasons.

**It is an ACCC enforcement priority.** The ACCC's 2026–27 compliance and
enforcement priorities name unfair contract terms with "an emphasis on
harmful cancellation terms, including those associated with automatic
renewals, early termination fees and non-cancellation clauses". A rule
preventing cancellation after three days is a non-cancellation clause.

**It keeps money where there is no loss.** If a client books four weeks
ahead and cancels with three weeks' notice, the three day rule forfeits
their deposit even though the slot can easily be refilled. Under the unfair
contract terms regime, a clause allowing a business to retain a deposit
that substantially exceeds its actual loss is likely to be unfair, and an
unfair term is void and unenforceable.

**The downside is now financial, not just legal.** Since November 2023 it
is a civil penalty offence to include or rely on an unfair contract term in
a standard form consumer contract. The exposure is no longer simply that
the clause fails to hold up.

The practical effect of leaving it out is small. The 24 hour rule already
prevents the behaviour the policy is meant to deter — late cancellations
and no-shows. The three day rule mainly penalises clients who cancel
responsibly and with plenty of notice.

If it is still wanted, it can be added, but it should be reviewed by a
lawyer first.

---

## Payment model

Two different arrangements, set per service in Square.

| Service | Taken at booking |
| --- | --- |
| Phone consultation, $25 | 100% — paid in full |
| In-person sessions | 20% deposit, balance at the session |

Remote services are prepaid because there is no checkout at the end of a
phone call. A 20% deposit on a $25 consultation would leave $20 to be
chased by invoice or bank transfer after every call, which is more
administration than the service is worth and the kind of balance that
quietly goes uncollected.

In-person sessions keep the 20% deposit, because the balance can simply be
taken at the gym.

Because the in-person figure is a percentage, it scales automatically if
session pricing changes and will not need revisiting when rates move.

### Configuring this in Square

Square applies deposits per service, so both models can coexist:

1. Appointments → Settings → Payments & cancellations
2. Click the current policy → **Require a deposit**
3. Choose **Specific services**, not All services
4. Phone consultation → **100%** (if Square will not accept 100 as a
   percentage, set a fixed amount of $25 instead)
5. In-person sessions → **20%**

## Square limitation worth knowing

Square's documentation states that once an appointment is booked with a
deposit, "customers cannot cancel their own appointment. Appointments must
be cancelled directly by the seller."

Clients can still reschedule themselves before the cut-off time, but a
cancellation has to come through Manav. The policy wording reflects this,
so the website does not promise self-service cancellation that Square will
not allow. It also means Manav needs to watch his email and Instagram
messages for cancellation requests, since they will not arrive as an
automated Square notification.

## Before the first deposit is taken

- [ ] Set per-service deposits in Square: 100% on the phone
      consultation, 20% on in-person sessions. Use **Specific services**
      rather than All services.
- [ ] Set the booking cut-off time to 24 hours, which is what actually
      enforces the policy rather than merely describing it.
- [ ] Paste the policy above into Square's cancellation policy field.
- [ ] Confirm the website and Square wording match.
- [ ] Keep a record of what each client agreed to at the time of booking.
      Square retains this automatically.

## Scope

This document explains the reasoning behind the wording on the website. It
is not legal advice. For a service business taking small deposits the risk
is modest, but a lawyer should review the terms before trading at volume —
Sprintlaw and LegalVision both offer fixed-fee reviews for small
Australian businesses.

## References

- ACCC compliance and enforcement priorities 2026–27
- Australian Consumer Law, unfair contract terms regime (amended
  November 2023)
- Australian Consumer Law, consumer guarantees for services
