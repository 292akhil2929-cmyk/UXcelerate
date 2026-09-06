# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Inferred for this competition build: React, TypeScript, Vite, bundled fonts, and a static Vercel deployment. The interface must remain useful without a backend and should degrade safely under limited connectivity.

## Users

Primary user, inferred from the brief: an incident operations lead coordinating a mixed fleet of rescue robots from a laptop during the first hours after an earthquake. Secondary users are field leads who need a compact mobile view for triage, robot status, and command confirmation.

## Product Purpose

Help an operations team turn uncertain robot discoveries into coordinated rescue action. Success means the user can identify the most urgent survivor signal, understand what is known versus unverified, assign an appropriate robot, and trust that commands are queued when communication drops.

## Positioning

The interface treats uncertainty and communication failure as first-class operational data. It does not imply that an incomplete map, stale robot state, or queued command is current truth.

## Operating Context

Users work under time pressure, intermittent communication, incomplete maps, noisy discoveries, blocked routes, structural hazards, and changing access. The submitted product is a judged interactive prototype using clearly labeled simulated incident data, not a validated emergency-response system.

## Capabilities and Constraints

- Map-first command view with survivor signals, hazards, blocked paths, uncertain areas, and newly discovered routes.
- Fleet overview with role, battery, link quality, current task, and last contact.
- Explicit command lifecycle: proposed, queued, delivered, acknowledged, or failed.
- Low-bandwidth mode and responsive field view.
- Keyboard access, reduced-motion behavior, color-independent map semantics, and readable touch targets.
- No external map, backend, or real telemetry is required for the prototype.

## Evidence on Hand

The official competition brief and starter repository are the only product evidence. No real incident data, robot telemetry, institutional endorsement, user research, or response-time benchmark is available. The interface must not fabricate those claims.

## Product Principles

1. Uncertainty stays visible.
2. Urgency never erases confirmation.
3. Offline actions remain accountable.
4. The map explains decisions, not just locations.
5. Critical information works without animation or color alone.

## Accessibility & Inclusion

The brief explicitly asks for an accessible solution. Target WCAG 2.2 AA interaction and contrast patterns, full keyboard operation, reduced-motion support, non-color status cues, and a responsive layout suitable for field use.
