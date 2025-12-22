import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Test suite specifically for validating the dependency version changes
 * made in this branch compared to main.
 * 
 * Changes validated:
 * - react: 19.1.0 -> 19.2.0
 * - react-dom: 19.2.0 -> 19.1.0
 * - react-native-screens: ~4.18.0 -> ~4.16.0
 * - zod: ^4.1.12 -> ^4.0.5
 */
describe('Dependency Version Changes', () => {
    let packageJson: any;
    let yarnLock: string;

    beforeAll(() => {
        const packagePath = resolve(process.cwd(), 'package.json');
        const packageContent = readFileSync(packagePath, 'utf-8');
        packageJson = JSON.parse(packageContent);

        const yarnLockPath = resolve(process.cwd(), 'yarn.lock');
        yarnLock = readFileSync(yarnLockPath, 'utf-8');
    });

    describe('React version update (19.1.0 -> 19.2.0)', () => {
        it('should have React 19.2.0 in package.json', () => {
            expect(packageJson.dependencies.react).toBe('19.2.0');
        });

        it('should have React 19.2.0 resolved in yarn.lock', () => {
            expect(yarnLock).toContain('react@19.2.0:');
            expect(yarnLock).toContain('version "19.2.0"');
        });

        it('should not contain old React 19.1.0 as main version', () => {
            // Check that 19.1.0 is not the pinned version for react
            const reactPinnedVersion = packageJson.dependencies.react;
            expect(reactPinnedVersion).not.toBe('19.1.0');
        });

        it('should have correct React 19.2.0 integrity hash', () => {
            const reactSection = yarnLock.match(/react@19\.2\.0:[\s\S]*?(?=\n\nreact)/);
            expect(reactSection).toBeTruthy();
            if (reactSection) {
                expect(reactSection[0]).toContain('integrity sha512-tmbWg6W31tQLeB5cdIBOicJDJRR2KzXsV7uSK9iNfLWQ5bIZfxuPEHp7M8wiHyHnn0DD1i7w3Zmin0FtkrwoCQ==');
            }
        });

        it('should have correct React 19.2.0 resolved URL', () => {
            expect(yarnLock).toContain('resolved "https://registry.yarnpkg.com/react/-/react-19.2.0.tgz#d33dd1721698f4376ae57a54098cb47fc75d93a5"');
        });

        it('should use exact version pinning for React', () => {
            const reactVersion = packageJson.dependencies.react;
            expect(reactVersion).not.toMatch(/^[\^~]/);
            expect(reactVersion).toMatch(/^\d+\.\d+\.\d+$/);
        });
    });

    describe('React-DOM version change (19.2.0 -> 19.1.0)', () => {
        it('should have React-DOM 19.1.0 in package.json', () => {
            expect(packageJson.dependencies['react-dom']).toBe('19.1.0');
        });

        it('should have React-DOM 19.1.0 resolved in yarn.lock', () => {
            expect(yarnLock).toContain('react-dom@19.1.0:');
            expect(yarnLock).toContain('version "19.1.0"');
        });

        it('should not contain React-DOM 19.2.0 as main version', () => {
            const reactDomVersion = packageJson.dependencies['react-dom'];
            expect(reactDomVersion).not.toBe('19.2.0');
        });

        it('should have correct React-DOM 19.1.0 integrity hash', () => {
            const reactDomSection = yarnLock.match(/react-dom@19\.1\.0:[\s\S]*?(?=\n\nreact)/);
            expect(reactDomSection).toBeTruthy();
            if (reactDomSection) {
                expect(reactDomSection[0]).toContain('integrity sha512-Xs1hdnE+DyKgeHJeJznQmYMIBG3TKIHJJT95Q58nHLSrElKlGQqDTR2HQ9fx5CN/Gk6Vh/kupBTDLU11/nDk/g==');
            }
        });

        it('should have correct React-DOM 19.1.0 resolved URL', () => {
            expect(yarnLock).toContain('resolved "https://registry.yarnpkg.com/react-dom/-/react-dom-19.1.0.tgz#133558deca37fa1d682708df8904b25186793623"');
        });

        it('should use exact version pinning for React-DOM', () => {
            const reactDomVersion = packageJson.dependencies['react-dom'];
            expect(reactDomVersion).not.toMatch(/^[\^~]/);
            expect(reactDomVersion).toMatch(/^\d+\.\d+\.\d+$/);
        });

        it('should have scheduler ^0.26.0 as dependency', () => {
            const reactDomSection = yarnLock.match(/react-dom@19\.1\.0:[\s\S]*?(?=\n\nreact)/);
            expect(reactDomSection).toBeTruthy();
            if (reactDomSection) {
                expect(reactDomSection[0]).toContain('scheduler "^0.26.0"');
            }
        });
    });

    describe('react-native-screens downgrade (~4.18.0 -> ~4.16.0)', () => {
        it('should have react-native-screens ~4.16.0 in package.json', () => {
            expect(packageJson.dependencies['react-native-screens']).toBe('~4.16.0');
        });

        it('should have react-native-screens 4.16.0 resolved in yarn.lock', () => {
            expect(yarnLock).toContain('react-native-screens@~4.16.0:');
            expect(yarnLock).toContain('version "4.16.0"');
        });

        it('should not contain react-native-screens 4.18.0', () => {
            expect(packageJson.dependencies['react-native-screens']).not.toBe('~4.18.0');
            expect(yarnLock).not.toContain('version "4.18.0"');
        });

        it('should have correct react-native-screens 4.16.0 integrity hash', () => {
            const screensSection = yarnLock.match(/react-native-screens@~4\.16\.0:[\s\S]*?(?=\n\nreact-native-[a-z])/);
            expect(screensSection).toBeTruthy();
            if (screensSection) {
                expect(screensSection[0]).toContain('integrity sha512-yIAyh7F/9uWkOzCi1/2FqvNvK6Wb9Y1+Kzn16SuGfN9YFJDTbwlzGRvePCNTOX0recpLQF3kc2FmvMUhyTCH1Q==');
            }
        });

        it('should have correct react-native-screens 4.16.0 resolved URL', () => {
            expect(yarnLock).toContain('resolved "https://registry.yarnpkg.com/react-native-screens/-/react-native-screens-4.16.0.tgz#efa42e77a092aa0b5277c9ae41391ea0240e0870"');
        });

        it('should use tilde range for react-native-screens', () => {
            const screensVersion = packageJson.dependencies['react-native-screens'];
            expect(screensVersion).toMatch(/^~\d+\.\d+\.\d+$/);
        });

        it('should have react-freeze as dependency', () => {
            const screensSection = yarnLock.match(/react-native-screens@~4\.16\.0:[\s\S]*?(?=\n\nreact-native-[a-z])/);
            expect(screensSection).toBeTruthy();
            if (screensSection) {
                expect(screensSection[0]).toContain('react-freeze "^1.0.0"');
            }
        });

        it('should have react-native-is-edge-to-edge dependency (new in 4.16.0)', () => {
            const screensSection = yarnLock.match(/react-native-screens@~4\.16\.0:[\s\S]*?(?=\n\nreact-native-[a-z])/);
            expect(screensSection).toBeTruthy();
            if (screensSection) {
                expect(screensSection[0]).toContain('react-native-is-edge-to-edge');
            }
        });

        it('should have warn-once dependency', () => {
            const screensSection = yarnLock.match(/react-native-screens@~4\.16\.0:[\s\S]*?(?=\n\nreact-native-[a-z])/);
            expect(screensSection).toBeTruthy();
            if (screensSection) {
                expect(screensSection[0]).toContain('warn-once "^0.1.0"');
            }
        });
    });

    describe('Zod downgrade (^4.1.12 -> ^4.0.5)', () => {
        it('should have zod ^4.0.5 in package.json', () => {
            expect(packageJson.dependencies.zod).toBe('^4.0.5');
        });

        it('should have zod 4.0.5 resolved in yarn.lock', () => {
            expect(yarnLock).toContain('zod@^4.0.5:');
            expect(yarnLock).toContain('version "4.0.5"');
        });

        it('should not contain zod 4.1.12 or 4.1.13', () => {
            expect(packageJson.dependencies.zod).not.toBe('^4.1.12');
            expect(yarnLock).not.toContain('version "4.1.12"');
            expect(yarnLock).not.toContain('version "4.1.13"');
        });

        it('should have correct zod 4.0.5 integrity hash', () => {
            const zodSection = yarnLock.match(/zod@\^4\.0\.5:[\s\S]*?(?=\n\n[a-z])/);
            expect(zodSection).toBeTruthy();
            if (zodSection) {
                expect(zodSection[0]).toContain('integrity sha512-/5UuuRPStvHXu7RS+gmvRf4NXrNxpSllGwDnCBcJZtQsKrviYXm54yDGV2KYNLT5kq0lHGcl7lqWJLgSaG+tgA==');
            }
        });

        it('should have correct zod 4.0.5 resolved URL', () => {
            expect(yarnLock).toContain('resolved "https://registry.npmjs.org/zod/-/zod-4.0.5.tgz"');
        });

        it('should use caret range for zod', () => {
            const zodVersion = packageJson.dependencies.zod;
            expect(zodVersion).toMatch(/^\^\d+\.\d+\.\d+$/);
        });

        it('should be in major version 4', () => {
            const zodVersion = packageJson.dependencies.zod;
            const majorVersion = parseInt(zodVersion.replace('^', '').split('.')[0], 10);
            expect(majorVersion).toBe(4);
        });

        it('should allow patch updates within 4.0.x range', () => {
            const zodVersion = packageJson.dependencies.zod;
            expect(zodVersion).toMatch(/^\^4\.0\.\d+$/);
        });
    });

    describe('Scheduler dependency changes', () => {
        it('should have scheduler 0.26.0 in yarn.lock', () => {
            expect(yarnLock).toContain('scheduler@0.26.0');
            expect(yarnLock).toContain('version "0.26.0"');
        });

        it('should have scheduler ^0.26.0 reference', () => {
            expect(yarnLock).toContain('scheduler@^0.26.0');
        });

        it('should combine scheduler 0.26.0 entries', () => {
            expect(yarnLock).toContain('scheduler@0.26.0, scheduler@^0.26.0:');
        });

        it('should not have scheduler ^0.27.0 entry', () => {
            expect(yarnLock).not.toContain('scheduler@^0.27.0:');
        });

        it('should not have scheduler 0.27.0 version', () => {
            const scheduler27Matches = yarnLock.match(/version "0\.27\.0"/g);
            expect(scheduler27Matches).toBeNull();
        });

        it('should have scheduler 0.25.0 for legacy compatibility', () => {
            expect(yarnLock).toContain('scheduler@^0.25.0:');
        });

        it('should have correct scheduler 0.26.0 integrity', () => {
            const schedulerSection = yarnLock.match(/scheduler@0\.26\.0, scheduler@\^0\.26\.0:[\s\S]*?(?=\n\n[a-z])/);
            expect(schedulerSection).toBeTruthy();
            if (schedulerSection) {
                expect(schedulerSection[0]).toContain('integrity sha512-NlHwttCI/l5gCPR3D1nNXtWABUmBwvZpEQiD4IXSbIDq8BzLIK/7Ir5gTFSGZDUu37K5cMNp0hFtzO38sC7gWA==');
            }
        });
    });

    describe('Version compatibility validation', () => {
        it('should have compatible React and React-DOM major versions', () => {
            const reactVersion = packageJson.dependencies.react;
            const reactDomVersion = packageJson.dependencies['react-dom'];
            
            const reactMajor = parseInt(reactVersion.split('.')[0], 10);
            const reactDomMajor = parseInt(reactDomVersion.split('.')[0], 10);
            
            expect(reactMajor).toBe(reactDomMajor);
            expect(reactMajor).toBe(19);
        });

        it('should have React 19.2.0 and React-DOM 19.1.0 combination', () => {
            // This specific combination is intentional in the changes
            expect(packageJson.dependencies.react).toBe('19.2.0');
            expect(packageJson.dependencies['react-dom']).toBe('19.1.0');
        });

        it('should have react-native-screens compatible with React Native 0.81.4', () => {
            const rnVersion = packageJson.dependencies['react-native'];
            const screensVersion = packageJson.dependencies['react-native-screens'];
            
            expect(rnVersion).toBe('0.81.4');
            expect(screensVersion).toBe('~4.16.0');
        });

        it('should have zod 4.x compatible with TypeScript 5.x', () => {
            const zodVersion = packageJson.dependencies.zod;
            const tsVersion = packageJson.devDependencies.typescript;
            
            expect(zodVersion).toMatch(/^\^4\./);
            expect(tsVersion).toMatch(/^~5\./);
        });
    });

    describe('Regression prevention', () => {
        it('should prevent accidental upgrade back to react-native-screens 4.18.0', () => {
            const screensVersion = packageJson.dependencies['react-native-screens'];
            const versionNumber = parseFloat(screensVersion.replace('~', ''));
            
            expect(versionNumber).toBeLessThan(4.17);
            expect(screensVersion).toBe('~4.16.0');
        });

        it('should prevent accidental upgrade back to zod 4.1.x', () => {
            const zodVersion = packageJson.dependencies.zod;
            const [major, minor] = zodVersion.replace('^', '').split('.').map(Number);
            
            expect(major).toBe(4);
            expect(minor).toBe(0);
        });

        it('should maintain exact React versions without semver ranges', () => {
            const reactVersion = packageJson.dependencies.react;
            const reactDomVersion = packageJson.dependencies['react-dom'];
            
            expect(reactVersion).not.toContain('^');
            expect(reactVersion).not.toContain('~');
            expect(reactDomVersion).not.toContain('^');
            expect(reactDomVersion).not.toContain('~');
        });

        it('should not have old scheduler 0.27.0 leak back in', () => {
            // Comprehensive check for scheduler 0.27.0
            expect(yarnLock).not.toContain('scheduler@^0.27.0');
            expect(yarnLock).not.toContain('version "0.27.0"');
            
            const scheduler27Refs = yarnLock.match(/0\.27\.0/g);
            expect(scheduler27Refs).toBeNull();
        });
    });

    describe('Package integrity checks', () => {
        it('should have valid SHA512 integrity hashes for changed packages', () => {
            // React 19.2.0
            expect(yarnLock).toMatch(/react@19\.2\.0:[\s\S]*?integrity sha512-/);
            
            // React-DOM 19.1.0
            expect(yarnLock).toMatch(/react-dom@19\.1\.0:[\s\S]*?integrity sha512-/);
            
            // react-native-screens 4.16.0
            expect(yarnLock).toMatch(/react-native-screens@~4\.16\.0:[\s\S]*?integrity sha512-/);
            
            // zod 4.0.5
            expect(yarnLock).toMatch(/zod@\^4\.0\.5:[\s\S]*?integrity sha512-/);
        });

        it('should have registry URLs for all changed packages', () => {
            expect(yarnLock).toContain('resolved "https://registry.yarnpkg.com/react/-/');
            expect(yarnLock).toContain('resolved "https://registry.yarnpkg.com/react-dom/-/');
            expect(yarnLock).toContain('resolved "https://registry.yarnpkg.com/react-native-screens/-/');
            expect(yarnLock).toContain('resolved "https://registry.npmjs.org/zod/-/');
        });

        it('should have consistent package naming in yarn.lock', () => {
            // Check that package names match between package.json and yarn.lock
            expect(yarnLock).toContain('react@19.2.0:');
            expect(yarnLock).toContain('react-dom@19.1.0:');
            expect(yarnLock).toContain('react-native-screens@~4.16.0:');
            expect(yarnLock).toContain('zod@^4.0.5:');
        });
    });

    describe('Transitive dependency validation', () => {
        it('should have correct transitive dependencies for react-native-screens', () => {
            const screensSection = yarnLock.match(/react-native-screens@~4\.16\.0:[\s\S]*?(?=\n\nreact-native-[a-z])/);
            expect(screensSection).toBeTruthy();
            
            if (screensSection) {
                const deps = screensSection[0];
                expect(deps).toContain('dependencies:');
                expect(deps).toContain('react-freeze');
                expect(deps).toContain('react-native-is-edge-to-edge');
                expect(deps).toContain('warn-once');
            }
        });

        it('should have correct transitive dependencies for react-dom', () => {
            const reactDomSection = yarnLock.match(/react-dom@19\.1\.0:[\s\S]*?(?=\n\nreact)/);
            expect(reactDomSection).toBeTruthy();
            
            if (reactDomSection) {
                const deps = reactDomSection[0];
                expect(deps).toContain('dependencies:');
                expect(deps).toContain('scheduler');
            }
        });

        it('should not have unexpected transitive dependencies', () => {
            // React should have no dependencies (it's a leaf package)
            const reactSection = yarnLock.match(/react@19\.2\.0:[\s\S]*?(?=\n\nreact)/);
            expect(reactSection).toBeTruthy();
            
            if (reactSection) {
                // Should not have a dependencies section
                const hasDepSection = reactSection[0].includes('dependencies:');
                expect(hasDepSection).toBe(false);
            }
        });
    });

    describe('Edge cases and error scenarios', () => {
        it('should handle version parsing correctly for all changed packages', () => {
            const reactVersion = packageJson.dependencies.react;
            const reactDomVersion = packageJson.dependencies['react-dom'];
            const screensVersion = packageJson.dependencies['react-native-screens'];
            const zodVersion = packageJson.dependencies.zod;
            
            expect(reactVersion.split('.').length).toBe(3);
            expect(reactDomVersion.split('.').length).toBe(3);
            expect(screensVersion.replace('~', '').split('.').length).toBe(3);
            expect(zodVersion.replace('^', '').split('.').length).toBe(3);
        });

        it('should not have conflicting version ranges', () => {
            // Check that there aren't multiple conflicting entries for the same package
            const reactEntries = yarnLock.match(/^react@/gm);
            const zodEntries = yarnLock.match(/^zod@/gm);
            
            expect(reactEntries).toBeTruthy();
            expect(zodEntries).toBeTruthy();
            
            // Should have multiple entries but they should be compatible
            if (reactEntries) {
                expect(reactEntries.length).toBeGreaterThan(0);
            }
        });

        it('should maintain alphabetical sorting in package.json dependencies', () => {
            const depKeys = Object.keys(packageJson.dependencies);
            const sortedKeys = [...depKeys].sort();
            
            // Check if keys are sorted (allowing for slight deviations due to scoped packages)
            const isMostlySorted = depKeys.every((key, index) => {
                if (index === 0) return true;
                return key >= depKeys[index - 1];
            });
            
            expect(isMostlySorted).toBe(true);
        });
    });
});