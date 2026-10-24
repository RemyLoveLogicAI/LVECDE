## Summary

<!-- What changed and why. Link the issue if there is one. -->

## Changes

-

## Verification

<!-- CI runs typecheck, tests, the web build and the Docker build. -->

- [ ] `yarn typecheck` is clean
- [ ] `yarn vitest run` passes
- [ ] User-visible strings use `t(...)` and exist in all 7 language files
- [ ] Added a `CHANGELOG.md` entry if this changes behavior users see, then ran `npx tsx sources/scripts/parseChangelog.ts` to regenerate `sources/changelog/changelog.json`
- [ ] Dependency changes keep `react` and `react-dom` on the same version
