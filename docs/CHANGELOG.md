# Changelog

## Node Library Cleanup (2025-11-14)
- Removed legacy nodes: `textBlock`, `attribute`, mis-mapped logic entries.
- Standardized core executor entries and edge-group items (Switch/Case, Fan-In, Fan-Out).
- Simplified drag/drop and insert-on-edge to executors and edge groups only.

Breaking changes:
- Projects referencing removed node IDs must migrate to executor equivalents.
- Logic actions previously mapped to non-executor nodes should use edge groups.

Actions required:
- Update saved workflows to use executor nodes.
- Re-run verification: `pnpm verify`.

Security and dependencies:
- Dependencies audited and pinned; no known vulnerabilities introduced.
- Verified unused dependency report; retained Tailwind and type-only packages that are in use.