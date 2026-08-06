# Brief per Claude Design

Prompt autoportante da incollare in un progetto Claude Design. Non presuppone
accesso a questo repo: token, copy e struttura sono ripetuti per esteso.

Se la baseline cambia (nuovi token, nuove pagine), aggiorna la sezione
"Current baseline" prima di riusarlo.

---

You are designing the component library for **IN SY TO srl**, an Italian
engineering firm. A working baseline already exists and is described below in
full. Your job is to pressure-test it and push it further — not to restart it.

## The company, and the one thing that matters

IN SY TO designs, integrates, installs, tests and certifies electronic and
electromechanical systems for Space, Defence, Industrial and Civil programmes.

The distinctive claim, and the spine of the whole design:

> **They build the machines that put other machines to the test.**

Commercially: *modular electrical, RF and functional test infrastructure that
shortens integration time, automates verification and extends the life of
existing AIT (Assembly, Integration & Test) facilities instead of replacing
them.*

A trap worth naming: their launcher heritage is **evidence of competence, not
the product**. Rockets and launch pads as hero imagery position them as a
launcher supplier, which is precisely the misreading to avoid. The right
subjects are test benches, integration halls and instrumentation.

## Who this is for

The primary market is **Singapore and South-East Asia**. The audience is prime
contractors (ST Engineering and similar), research centres (NTU, NUS), national
space agencies, and subsystem manufacturers. They are engineers and technical
buyers, and the decision they are making is *vendor qualification* — can this
supplier be trusted with a programme.

Secondary audience: recruiting, and Italian industrial clients.

**All copy is English-first.** Italian is the translation.

## Non-negotiable constraints

1. **No unverifiable claims.** No "20+ years of excellence", no invented
   project counts, no market-size figures. Only demonstrable facts: operating
   since 2008, incorporated 2012, four sectors, DM 37/08 conformity, CE
   marking. This is a rule the company set itself; design around it rather
   than asking for placeholder statistics.
2. **Export control.** The public site shows capability and heritage only.
   Technical detail is released after NDA. Any pattern that invites publishing
   specifications, drawings or test data in the open is wrong.
3. **No commissioned photography exists, and none is budgeted before
   September.** The only imagery available is ~640px material from 2012:
   manual pages, shop-floor record shots, and CAD renders on a default blue
   viewport background. Designs that depend on beautiful photography will not
   ship. Solve the image problem, do not assume it away.
4. **Deadline.** The commercial package, website included, is due end of
   September 2026.

## Current baseline

Two visual worlds, deliberately kept apart. The effect depends on each surface
belonging to exactly one of them. Header and footer stay `instrument` even
above `sheet` pages: the drawing is a document inside the application.

### World A — `instrument` (test bench)

Used for the home page and anything that stages verification.

| Token | Hex | Role |
|---|---|---|
| `ground` | `#090E12` | page background |
| `panel` | `#0F161B` | raised panel |
| `rule` | `#1D2930` | hairlines and dividers |
| `text` | `#B7C6CD` | body |
| `dim` | `#6B7F89` | secondary, labels |
| `bright` | `#F1F6F8` | headings |
| `signal` | `#FFB03A` | the single accent — amber |
| `ok` | `#59C08A` | status only, not decoration |

Type: **Geist Mono** for headings, labels, data and navigation (uppercase,
letterspaced); **Geist** for body copy. Monospace is load-bearing, not styling:
it aligns figures in columns.

A faint oscilloscope graticule (44px grid, `rgba(126,168,186,.075)`) sits under
the page.

Home structure, top to bottom:
1. Sticky instrument bar: wordmark, nav, language toggle.
2. Hero: kicker `DESIGN · INTEGRATION · VERIFICATION`; headline in uppercase
   mono — *"Nothing flies until something on the ground **proves it**"*, with
   "proves it" in amber; a 52-character subtitle; two bordered buttons; then a
   live animated amber waveform on a graticule.
3. A right-hand channel rail listing five capabilities (Design, Integration,
   Installation, Test & certification, Maintenance). Selecting or hovering a
   channel redraws the waveform with that channel's profile and swaps a short
   description below.
4. Telemetry strip: four readings — 2008 / 2012 / 04 / DM 37/08 · CE.
5. Sector grid: Space, Defence, Industrial, Civil, as numbered panel entries.
6. Closing panel: "Tell us what you need to verify", a request button, and a
   note that technical detail follows NDA and export-control assessment.

### World B — `sheet` (engineering drawing)

Used for capability pages, where the argument is documentary rigour.

| Token | Hex | Role |
|---|---|---|
| `paper` | `#E6E9E4` | outer ground |
| `surface` | `#F1F3EF` | the sheet itself |
| `ink` | `#12181B` | text and outer frame |
| `soft` | `#48544F` | body copy |
| `hair` | `#9DA9A4` | dimension lines, labels |
| `hairline` | `#C4CDC8` | inner rule, cell dividers |
| `revision` | `#B33A28` | revision marks **only** |

Type: **Source Code Pro** (400/600) for headings and annotations, as on a real
drawing; **Geist** for running text.

The page is composed as a drawing sheet: outer frame with a 7px inner rule,
dimension rules above and below the headline that measure the actual text
column, a revision triangle with note, and a title block along the bottom with
six fields — Client, Subject, Scale, Date, Rev., Sheet (01 / 08).

Headline: *"What we build, and what we hand over with it."* Body: every
delivery ships with its own file — test procedures, acceptance results,
declaration of conformity. That file is what makes a supplier qualifiable.

### Shared rules

- **No rounded corners anywhere.** Neither an instrument panel nor a drawing
  sheet has them.
- **One accent per world.** Amber in `instrument`, revision red in `sheet`, and
  the red is reserved strictly for revision marks.
- **Dimension lines must measure something real on the page.** If a rule is not
  spanning an actual element, delete it.
- Motion is currently limited to the waveform. Everything else is static.

## What to work on

Do not restyle for its own sake. These are the open problems.

1. **The two worlds meet with a jolt.** Going from the dark bench to the light
   sheet is currently an abrupt cut. Decide whether that cut should be sharpened
   into a deliberate device (a threshold, a transition band, a shared motif that
   rhymes across both) or softened. Argue the choice.
2. **The image problem is unsolved.** Design a *figure plate* component that
   makes 640px 2012 material — a manual page with callouts, a record shot of a
   press, a CAD render on a blue background — read as archival evidence rather
   than as low-quality photography. Constrained size, figure numbering,
   caption, frame. This is the highest-value component in the brief, because it
   is what lets the site ship without a photo shoot.
3. **The wordmark fights the system.** The existing logo is teal and clashes
   with the amber signal on the dark ground. Propose a monochrome treatment,
   and specify how the wordmark behaves in both worlds.
4. **The sheet has dead space.** The capability sheet leaves a large empty
   region to the right of the intro. On a real drawing that space carries
   something — a notes block, a legend, a revision history, a parts list.
   Design what belongs there.
5. **Component coverage is thin.** The system needs, at minimum: buttons in
   both worlds; a specification table with aligned figures; a data readout;
   a channel/list selector; a status pill; form inputs (there is a contact and
   a job-application form); an editorial text block for CMS content with
   headings, lists and links; breadcrumbs; and the figure plate from point 2.
6. **Contrast and accessibility.** Verify amber `#FFB03A` and dim `#6B7F89` on
   `#090E12`, and `soft` on `sheet-surface`, against WCAG AA. Adjust tokens if
   they fail and say which you changed.
7. **Small screens.** The instrument world was designed wide. The channel rail,
   the waveform and the telemetry strip all need a considered narrow layout,
   not just a stacked one.
8. **Motion budget.** Only the trace moves today. Decide whether that restraint
   is right, or whether one more orchestrated moment earns its place. Respect
   `prefers-reduced-motion`; the waveform must still convey channel changes
   when animation is off.

## What must not change

- The two-world split, and the rule that they never mix within one section.
- The amber-only accent in `instrument`, and revision-red-only in `sheet`.
- Monospace as the voice of the instrument world.
- Square corners.
- The positioning: test infrastructure, not launchers; verification, not
  assembly.

## Deliverable

A component library with, for each component: the states, the tokens used,
the type scale, spacing, and a note on *why* it belongs to its world. Where you
change a baseline decision, say what you changed and the reason. Prefer a
smaller set executed precisely over broad coverage.
