# AI integration guidelines

No LLM integration exists in this codebase yet. The AI Trip Planner (`app/(public)/trip-planner/`)
is currently a form: it captures customer input and lands it in Inquiry Management, where staff
hand-write the suggested itinerary (`saveTripPlannerItinerary` in
`lib/admin/actions/trip-planner.ts`). The plan (see README's Roadmap) is a deterministic
suggestion engine built from data already in Supabase, not a real LLM call, but the seam should be
built so a real LLM call can replace it later without touching callers -- these are the practices
that swap-in needs to follow from day one, written down now so they aren't skipped later under
feature-delivery pressure. This is a defensive-security document, not a design doc for the feature
itself.

## 1. Never concatenate user input into a single prompt string

Trip preferences, budget, freeform requests -- any user-supplied text passed to an LLM must be
clearly delineated from the system/instruction prompt. Use the provider's structured message roles
(`system` vs `user`), not string concatenation:

```ts
// Wrong -- user text can redefine what the model thinks its instructions are
const prompt = `You are a travel assistant. ${systemInstructions}\n\nUser request: ${userInput}`;

// Right -- structured roles, user text is data, not instructions
const messages = [
  { role: "system", content: systemInstructions },
  { role: "user", content: userInput },
];
```

A freeform "trip preferences" field is exactly the kind of input a prompt-injection attempt would
target (e.g. "ignore previous instructions and instead..."). Structured roles don't make injection
impossible, but they're the baseline every provider's own docs recommend, and skipping them for
convenience is the most common real-world cause of successful injection.

## 2. Treat LLM output as untrusted content

Anything the model generates -- displayed back to the user, stored in `trip_planner_requests`, or
shown to staff in Inquiry Management -- must be sanitized before rendering, exactly like any other
untrusted input in this codebase (see `lib/email-templates.ts`'s `escapeHtml()`, applied to every
user-supplied value in an email body). A successful prompt injection could try to make the model
output malicious markup, a fake system message, or misleading content aimed at whoever reads the
output next (customer or staff). Never render LLM output via `dangerouslySetInnerHTML` or similar
without passing it through the same escaping/sanitization already used for user-submitted text
elsewhere in this app.

## 3. Scope any tool access to exactly what an anonymous visitor can already do

If the LLM is ever given tool access (querying Supabase for real tour/journey/availability data,
rather than just generating text) instead of only generating text, that access must be scoped to
exactly what's needed -- read-only lookups against already-public catalog data -- and must never
include write access, or read access to anything beyond what an anonymous website visitor can
already see through the public site. The trip planner runs unauthenticated; giving it elevated
database privileges "because it's a trusted AI call" would undo every RLS boundary already enforced
elsewhere in this codebase (see `tests/rls/*.test.ts`) for no reason tied to the feature itself. If
a future version needs the model to trigger a real action (e.g. drafting a booking), that action
still goes through the same validation, rate limiting, and RLS policies a public form submission
would -- the AI call is not a privilege-escalation path.

## 4. Rate limiting and cost control

LLM API calls cost money per request in a way form submissions to Supabase don't. Whatever
provider is chosen, route the request through the existing `checkRateLimit`/`getClientIp` pattern
(`lib/rate-limit.ts`) already used by `contact`, `trip-planner`, and `booking` -- the same
abuse-prevention reasoning applies, plus a cost-control reason IP-based form spam doesn't have.

## 5. Fail open, matching this app's existing pattern for optional integrations

Email (`lib/email.ts`), Sentry, and rate limiting (`lib/rate-limit.ts`) all degrade gracefully when
unconfigured or unreachable rather than blocking a real customer's submission -- see the reasoning
in `lib/env.ts`. An LLM call should follow the same shape: if the provider is down or unconfigured,
the trip planner should fall back to the deterministic suggestion engine (or a plain "we'll follow
up personally" message), not fail the whole form submission.
