# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

An Angular Clean Architecture and MVVM example that exposes a working store: product discovery, details, authentication, profile and a user cart backed by the public DummyJSON API.

## Capabilities and Constraints

- Preserve existing routes, use cases, State/ViewModel conventions and architecture boundaries.
- Keep dependency registration in data/di grouped by topic.
- Keep core organized by resource and then topic, and existing source/Imp naming.
- Search, categories, sorting, pagination, gallery, login/logout, cart quantity changes and error/loading states remain functional.
- DummyJSON writes are simulated. Cart edits are persisted locally per user; do not invent checkout, shipping, payment or fulfillment capabilities.
- No built-in global error notice component. Presentation of errors is the developer's choice.
- Styling is Tailwind first: utilities in templates, semantic tokens in `src/tailwind.css` `@theme`, shared mobile-first breakpoints, and no parallel component stylesheets. Architecture and State/ViewModel remain unchanged.
- The requested redesign covers existing screens. HTML and CSS/SCSS sections must have explanatory comments.

## Evidence on Hand

Existing product images, product data and user profiles come from DummyJSON. Current name is Store. No testimonials, commercial guarantees, delivery promises or brand partnerships have been supplied.

## Users

The code is an architecture example. The store's primary commercial audience is not specified; the existing browsing and shopping workflows are the basis for this redesign.
