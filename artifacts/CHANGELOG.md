# HLV Asset Library Changelog

All notable changes to the HLV Asset Library artifact are documented here.

Format: Each version includes date, summary, and detailed changes.

---

## v7.0 — 2024-12-04

**Summary:** Added 4 Lesson 5 diagrams (Problem Reframing module)

### Added
- `good-problem-criteria` — 5 Criteria for a Good Problem (900×580)
- `problem-opportunity-flow` — Problem → Opportunity Flow (900×420)
- `symptom-vs-root-cause` — Symptom vs Root Cause iceberg (800×500)
- `good-vs-weak-problems` — Good vs Weak Problems comparison (900×600)

### Changed
- Version string updated to v7.0
- DIAGRAMS registry: 4 entries added
- RENDERERS map: 4 entries added

### Preserved (no changes)
- All 11 existing v6 diagram components
- Design tokens (T)
- Shared styles (S)
- Shared components (Card, TextBlock)

**Total diagrams:** 15

---

## v6.0 — 2024-12-03

**Summary:** Baseline version with 11 core diagrams

### Diagrams
1. `three-boxes` — Three Boxes of Innovation
2. `build-measure-learn` — Build-Measure-Learn Loop
3. `double-diamond` — Double Diamond Process
4. `six-reframing` — Six Reframing Lenses
5. `eight-models` — 8 Business Models
6. `magic-bullet` — The Magic Bullet
7. `cone-predictability` — Cone of Predictability
8. `stakeholder-ecosystem` — Stakeholder Ecosystem
9. `journey-vs-relationship` — Journey vs Relationship
10. `four-behaviors` — Four Entrepreneurial Behaviors
11. `three-levels-listening` — Three Levels of Listening

### Established
- Design token system (T)
- Shared style system (S)
- Shared components: Card, TextBlock
- Gallery view with diagram selector

**Total diagrams:** 11

---

## Version History Summary

| Version | Date | Diagrams | Key Changes |
|---------|------|----------|-------------|
| v7.0 | 2024-12-04 | 15 | +4 Lesson 5 diagrams |
| v6.0 | 2024-12-03 | 11 | Baseline release |

---

## Artifact Locations

| Version | GitHub | Project File |
|---------|--------|--------------|
| v7.0 | `artifacts/hlv-asset-library-v7.jsx` | `/mnt/project/hlv-asset-library-v7.jsx` |
| v6.0 | `artifacts/hlv-asset-library-v6.jsx` | `/mnt/project/hlv-asset-library-v6.jsx` |

---

## Update Protocol

When adding new diagrams:

1. Copy current version from `/mnt/project/`
2. Make surgical edits only (never rewrite)
3. Increment version number
4. Update this changelog
5. Commit to GitHub `artifacts/` folder
6. Deliver to user for project file update

See `/mnt/skills/user/hlv-asset-generator/SKILL.md` for full protocol.
