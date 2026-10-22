# Smallgame V2

- This is a static, dependency-free browser game. Keep GitHub Pages subpath compatibility; use relative assets and native ESM.
- `src/puzzles/` contains pure state transitions and win predicates, without DOM, storage, audio, or random state.
- `src/core/` owns progression, validation, inventory and persistence. UI must dispatch actions instead of modifying state directly.
- `src/data/` owns scene coordinates, content and asset metadata. Personal memories must remain limited to confirmed facts; fictional mechanisms are clearly game fiction.
- `src/ui/` renders state. Keep each puzzle family in its own view module. Do not add an eighteen-way click-handler switch.
- Use raster illustrations for environments, characters and props. SVG lines are allowed for interactive connections, arrows and accessible interface icons.
- All puzzle controls support keyboard and undo/reset. Hints are opt-in. Standalone puzzles do not gate the ending.
- Do not add private correspondence, local personal-file paths, credentials or analytics.
- Validate puzzle solvability, complete progression and save recovery. Run `node tools/check.mjs` and `node --test tests/*.test.mjs`; inspect the real browser before publishing.
- Preserve V1 with a Git ref. Do not copy obsolete runtime code into the V2 runtime.
