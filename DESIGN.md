# RIFTLINE Design System

## Direction

RIFTLINE is a modern flight-data recorder translated into earthquake rescue coordination. It feels accountable, precise, and calm under pressure. The interface never hides uncertainty behind visual confidence.

## Surface Mode

Operate. The first viewport shows the complete discovery-to-dispatch decision, not a marketing explanation.

## Palette

- Carbon: #080b0d
- Instrument surface: #11161a
- Raised surface: #171d21
- Primary text: #eef1ec
- Secondary text: #9aa4a9
- Action accent: #ff6b1a
- Map data: #78a6bd
- Semantic danger: #ef4942
- Semantic safe: #74b66a

Orange is reserved for the current decision and its action. Red and green are semantic only and are always paired with shape and text.

## Typography

Archivo Variable carries the interface and condensed headings. JetBrains Mono Variable is limited to timestamps, identifiers, coordinates, and measurements. Numerals use tabular spacing.

## Geometry

Panels and primary controls use an 8px radius. Compact status chips may be pill-shaped. Borders are one pixel. Elevation uses offset charcoal shadows, never glow.

## Composition

Desktop uses an asymmetric 72/28 split: tactical map and recorder on the left, one continuous decision column on the right. Mobile becomes a task-first sequence with a sticky command dock and no horizontal compression of dense desktop panels.

## Signature Interaction

The aftershock drill advances the simulated incident state in one orchestrated transition: the map marks a new hazard, the route redraws around it, one robot link drops, and the command receipt moves to queued. Motion communicates causality and state change, and collapses to instant updates under reduced motion.

## Motion

Motion uses exponential ease-out and spring settling for the route reveal, selection changes, and command receipt. No perpetual decorative motion. Critical content is visible before animation and remains understandable with motion disabled.

## Content Boundary

All incident data is visibly labeled simulation data. The product makes no claims of field validation, institutional approval, or real rescue performance.
