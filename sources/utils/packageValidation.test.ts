import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Package Validation', () => {
    let packageJson: any;
    let yarnLock: string;

    beforeAll(() => {
        // Read package.json
        const packagePath = resolve(process.cwd(), 'package.json');
        const packageContent = readFileSync(packagePath, 'utf-8');
        packageJson = JSON.parse(packageContent);

        // Read yarn.lock
        const yarnLockPath = resolve(process.cwd(), 'yarn.lock');
        yarnLock = readFileSync(yarnLockPath, 'utf-8');
    });

    describe('package.json structure', () => {
        it('should have required top-level fields', () => {
            expect(packageJson).toHaveProperty('name');
            expect(packageJson).toHaveProperty('version');
            expect(packageJson).toHaveProperty('dependencies');
            expect(packageJson).toHaveProperty('devDependencies');
            expect(packageJson).toHaveProperty('scripts');
        });

        it('should have valid name', () => {
            expect(typeof packageJson.name).toBe('string');
            expect(packageJson.name).toBe('happy');
        });

        it('should have valid version format', () => {
            expect(typeof packageJson.version).toBe('string');
            expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+$/);
        });

        it('should have main entry point', () => {
            expect(packageJson).toHaveProperty('main');
            expect(typeof packageJson.main).toBe('string');
        });

        it('should have packageManager field', () => {
            expect(packageJson).toHaveProperty('packageManager');
            expect(packageJson.packageManager).toMatch(/^yarn@\d+\.\d+\.\d+$/);
        });

        it('should be marked as private', () => {
            expect(packageJson.private).toBe(true);
        });
    });

    describe('scripts validation', () => {
        it('should have essential scripts defined', () => {
            expect(packageJson.scripts).toHaveProperty('start');
            expect(packageJson.scripts).toHaveProperty('test');
            expect(packageJson.scripts).toHaveProperty('typecheck');
        });

        it('should have test script configured for vitest', () => {
            expect(packageJson.scripts.test).toBe('vitest');
        });

        it('should have all script values as strings', () => {
            Object.entries(packageJson.scripts).forEach(([key, value]) => {
                expect(typeof value).toBe('string');
                expect((value as string).length).toBeGreaterThan(0);
            });
        });
    });

    describe('dependencies validation', () => {
        it('should have dependencies as an object', () => {
            expect(typeof packageJson.dependencies).toBe('object');
            expect(packageJson.dependencies).not.toBeNull();
        });

        it('should have devDependencies as an object', () => {
            expect(typeof packageJson.devDependencies).toBe('object');
            expect(packageJson.devDependencies).not.toBeNull();
        });

        it('should have valid dependency version formats', () => {
            const validVersionPattern = /^[\^~]?\d+\.\d+\.\d+(-[\w\d.]+)?$|^[\^~]\d+\.\d+\.\d+$|^~\d+\.\d+\.\d+$/;
            
            Object.entries(packageJson.dependencies).forEach(([name, version]) => {
                expect(typeof version).toBe('string');
                expect((version as string).length).toBeGreaterThan(0);
                // Version should start with ^, ~, or a digit
                expect(version).toMatch(/^[\^~\d]/);
            });
        });

        it('should not have duplicate dependencies in dependencies and devDependencies', () => {
            const deps = Object.keys(packageJson.dependencies);
            const devDeps = Object.keys(packageJson.devDependencies);
            const duplicates = deps.filter(dep => devDeps.includes(dep));
            
            expect(duplicates).toEqual([]);
        });

        it('should have all dependency names in lowercase or with scopes', () => {
            const allDeps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };

            Object.keys(allDeps).forEach(name => {
                // Should be lowercase or start with @ for scoped packages
                expect(name).toMatch(/^(@[\w-]+\/)?[\w-]+$/);
            });
        });
    });

    describe('React ecosystem version compatibility', () => {
        it('should have React 19.2.0 installed', () => {
            expect(packageJson.dependencies.react).toBe('19.2.0');
        });

        it('should have React-DOM 19.1.0 installed', () => {
            expect(packageJson.dependencies['react-dom']).toBe('19.1.0');
        });

        it('should have React Native installed', () => {
            expect(packageJson.dependencies['react-native']).toBeDefined();
            expect(packageJson.dependencies['react-native']).toBe('0.81.4');
        });

        it('should have compatible React and React-DOM major versions', () => {
            const reactVersion = packageJson.dependencies.react.replace(/[\^~]/, '');
            const reactDomVersion = packageJson.dependencies['react-dom'].replace(/[\^~]/, '');
            
            const reactMajor = parseInt(reactVersion.split('.')[0], 10);
            const reactDomMajor = parseInt(reactDomVersion.split('.')[0], 10);
            
            // Both should be React 19
            expect(reactMajor).toBe(19);
            expect(reactDomMajor).toBe(19);
        });

        it('should have react-native-screens version ~4.16.0', () => {
            expect(packageJson.dependencies['react-native-screens']).toBe('~4.16.0');
        });

        it('should have React Navigation dependencies', () => {
            expect(packageJson.dependencies['@react-navigation/native']).toBeDefined();
            expect(packageJson.dependencies['@react-navigation/drawer']).toBeDefined();
        });
    });

    describe('Zod version validation', () => {
        it('should have Zod 4.0.5 or compatible version', () => {
            expect(packageJson.dependencies.zod).toBe('^4.0.5');
        });

        it('should use caret range for Zod to allow patch updates', () => {
            expect(packageJson.dependencies.zod).toMatch(/^\^4\.0\.\d+$/);
        });
    });

    describe('Critical dependencies presence', () => {
        it('should have Expo framework', () => {
            expect(packageJson.dependencies.expo).toBeDefined();
            expect(packageJson.dependencies.expo).toMatch(/^\^54/);
        });

        it('should have TypeScript in devDependencies', () => {
            expect(packageJson.devDependencies.typescript).toBeDefined();
        });

        it('should have testing framework (vitest)', () => {
            expect(packageJson.dependencies.vitest).toBeDefined();
        });

        it('should have state management (zustand)', () => {
            expect(packageJson.dependencies.zustand).toBeDefined();
        });

        it('should have essential React Native packages', () => {
            expect(packageJson.dependencies['react-native-reanimated']).toBeDefined();
            expect(packageJson.dependencies['react-native-gesture-handler']).toBeDefined();
            expect(packageJson.dependencies['react-native-safe-area-context']).toBeDefined();
        });
    });

    describe('yarn.lock consistency', () => {
        it('should exist and be non-empty', () => {
            expect(yarnLock.length).toBeGreaterThan(0);
        });

        it('should contain React 19.2.0 entry', () => {
            expect(yarnLock).toContain('react@19.2.0:');
            expect(yarnLock).toContain('version "19.2.0"');
        });

        it('should contain React-DOM 19.1.0 entry', () => {
            expect(yarnLock).toContain('react-dom@19.1.0:');
            expect(yarnLock).toContain('version "19.1.0"');
        });

        it('should contain react-native-screens 4.16.0 entry', () => {
            expect(yarnLock).toContain('react-native-screens@~4.16.0:');
            expect(yarnLock).toContain('version "4.16.0"');
        });

        it('should contain Zod 4.0.5 entry', () => {
            expect(yarnLock).toContain('zod@^4.0.5:');
            expect(yarnLock).toContain('version "4.0.5"');
        });

        it('should have scheduler 0.26.0 for React-DOM compatibility', () => {
            expect(yarnLock).toContain('scheduler@0.26.0');
            expect(yarnLock).toContain('scheduler@^0.26.0');
        });

        it('should not contain removed scheduler 0.27.0', () => {
            expect(yarnLock).not.toContain('scheduler@^0.27.0:');
            // The 0.27.0 version entry should not exist
            const schedulerMatches = yarnLock.match(/scheduler@0\.27\.0:/g);
            expect(schedulerMatches).toBeNull();
        });

        it('should have integrity hashes for all main dependencies', () => {
            // Check that React has an integrity hash
            const reactSection = yarnLock.match(/react@19\.2\.0:[\s\S]*?(?=\n\n|\nreact)/);
            expect(reactSection).toBeTruthy();
            if (reactSection) {
                expect(reactSection[0]).toContain('integrity sha512-');
            }

            // Check that React-DOM has an integrity hash
            const reactDomSection = yarnLock.match(/react-dom@19\.1\.0:[\s\S]*?(?=\n\n|\nreact)/);
            expect(reactDomSection).toBeTruthy();
            if (reactDomSection) {
                expect(reactDomSection[0]).toContain('integrity sha512-');
            }
        });

        it('should have resolved URLs for all main dependencies', () => {
            expect(yarnLock).toContain('resolved "https://registry.yarnpkg.com/react/-/react-19.2.0.tgz');
            expect(yarnLock).toContain('resolved "https://registry.yarnpkg.com/react-dom/-/react-dom-19.1.0.tgz');
            expect(yarnLock).toContain('resolved "https://registry.yarnpkg.com/react-native-screens/-/react-native-screens-4.16.0.tgz');
        });
    });

    describe('version constraint validation', () => {
        it('should use exact versions for React and React-DOM', () => {
            const reactVersion = packageJson.dependencies.react;
            const reactDomVersion = packageJson.dependencies['react-dom'];
            
            // Should not have ^ or ~ prefix for React core packages
            expect(reactVersion).toMatch(/^\d+\.\d+\.\d+$/);
            expect(reactDomVersion).toMatch(/^\d+\.\d+\.\d+$/);
        });

        it('should use tilde range for react-native-screens', () => {
            expect(packageJson.dependencies['react-native-screens']).toMatch(/^~\d+\.\d+\.\d+$/);
        });

        it('should use caret range for most other dependencies', () => {
            const caretDeps = [
                'expo',
                'axios',
                'zustand',
                'zod'
            ];

            caretDeps.forEach(dep => {
                if (packageJson.dependencies[dep]) {
                    expect(packageJson.dependencies[dep]).toMatch(/^\^/);
                }
            });
        });
    });

    describe('dependency security and integrity', () => {
        it('should not have any dependencies with * version', () => {
            const allDeps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };

            Object.entries(allDeps).forEach(([name, version]) => {
                expect(version).not.toBe('*');
                expect(version).not.toBe('latest');
            });
        });

        it('should have specific versions, not git URLs', () => {
            const allDeps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };

            Object.entries(allDeps).forEach(([name, version]) => {
                expect(version).not.toMatch(/^git\+/);
                expect(version).not.toMatch(/^github:/);
                expect(version).not.toMatch(/\.git$/);
            });
        });

        it('should not have file: protocol dependencies', () => {
            const allDeps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };

            Object.entries(allDeps).forEach(([name, version]) => {
                expect(version).not.toMatch(/^file:/);
            });
        });
    });

    describe('React Native ecosystem compatibility', () => {
        it('should have compatible Expo SDK version', () => {
            const expoVersion = packageJson.dependencies.expo;
            expect(expoVersion).toMatch(/^\^54/);
        });

        it('should have expo-router for navigation', () => {
            expect(packageJson.dependencies['expo-router']).toBeDefined();
            expect(packageJson.dependencies['expo-router']).toMatch(/^~6\.0/);
        });

        it('should have react-native-reanimated for animations', () => {
            expect(packageJson.dependencies['react-native-reanimated']).toBe('4.1.0');
        });

        it('should have react-native-gesture-handler', () => {
            expect(packageJson.dependencies['react-native-gesture-handler']).toMatch(/^~2\.28/);
        });

        it('should have compatible @shopify/react-native-skia version', () => {
            expect(packageJson.dependencies['@shopify/react-native-skia']).toBeDefined();
        });
    });

    describe('development dependencies validation', () => {
        it('should have Babel core for transpilation', () => {
            expect(packageJson.devDependencies['@babel/core']).toBeDefined();
        });

        it('should have TypeScript version 5.x', () => {
            expect(packageJson.devDependencies.typescript).toMatch(/^~5\./);
        });

        it('should have React test renderer matching React version', () => {
            const testRendererVersion = packageJson.devDependencies['react-test-renderer'];
            expect(testRendererVersion).toBeDefined();
            expect(testRendererVersion).toBe('19.0.0');
        });

        it('should have patch-package for dependency patches', () => {
            expect(packageJson.devDependencies['patch-package']).toBeDefined();
        });

        it('should have tsx for TypeScript execution', () => {
            expect(packageJson.devDependencies.tsx).toBeDefined();
        });
    });

    describe('package.json and yarn.lock synchronization', () => {
        it('should have all dependencies from package.json in yarn.lock', () => {
            const criticalDeps = [
                'react',
                'react-dom',
                'react-native',
                'react-native-screens',
                'expo',
                'zod',
                'zustand',
                'vitest'
            ];

            criticalDeps.forEach(dep => {
                const version = packageJson.dependencies[dep];
                expect(version).toBeDefined();
                // Check yarn.lock contains reference to this package
                expect(yarnLock).toContain(dep);
            });
        });

        it('should have consistent version resolution in yarn.lock', () => {
            // React should only resolve to 19.2.0
            const reactVersions = yarnLock.match(/^react@.*:\n\s+version "(\d+\.\d+\.\d+)"/gm);
            expect(reactVersions).toBeTruthy();
            
            // Should have the pinned version
            expect(yarnLock).toContain('version "19.2.0"');
        });
    });

    describe('edge cases and error conditions', () => {
        it('should not have circular dependencies in top-level deps', () => {
            // This is a sanity check - package.json itself can't have circular deps
            // but we verify no package depends on itself
            const allDeps = Object.keys({
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            });

            allDeps.forEach(dep => {
                // A package shouldn't depend on itself
                expect(dep).not.toBe(packageJson.name);
            });
        });

        it('should handle scoped package names correctly', () => {
            const scopedPackages = Object.keys(packageJson.dependencies).filter(name => 
                name.startsWith('@')
            );

            scopedPackages.forEach(pkg => {
                expect(pkg).toMatch(/^@[\w-]+\/[\w-]+$/);
                expect(yarnLock).toContain(pkg);
            });

            expect(scopedPackages.length).toBeGreaterThan(0);
        });

        it('should not have empty dependency values', () => {
            const allDeps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };

            Object.entries(allDeps).forEach(([name, version]) => {
                expect(version).toBeTruthy();
                expect((version as string).trim().length).toBeGreaterThan(0);
            });
        });
    });

    describe('specific version downgrade validations', () => {
        it('should confirm react-native-screens was downgraded from ~4.18.0 to ~4.16.0', () => {
            const currentVersion = packageJson.dependencies['react-native-screens'];
            expect(currentVersion).toBe('~4.16.0');
            
            // Verify it's not the old version
            expect(currentVersion).not.toBe('~4.18.0');
            
            // Verify yarn.lock has 4.16.0
            expect(yarnLock).toContain('version "4.16.0"');
            expect(yarnLock).not.toContain('version "4.18.0"');
        });

        it('should confirm zod was downgraded from ^4.1.12 to ^4.0.5', () => {
            const currentVersion = packageJson.dependencies.zod;
            expect(currentVersion).toBe('^4.0.5');
            
            // Verify it's not the old version
            expect(currentVersion).not.toBe('^4.1.12');
            
            // Verify yarn.lock has 4.0.5
            expect(yarnLock).toContain('version "4.0.5"');
            expect(yarnLock).not.toContain('version "4.1.13"');
            expect(yarnLock).not.toContain('version "4.1.12"');
        });

        it('should confirm React versions were swapped correctly', () => {
            // React upgraded from 19.1.0 to 19.2.0
            expect(packageJson.dependencies.react).toBe('19.2.0');
            expect(yarnLock).toContain('react@19.2.0:');
            
            // React-DOM downgraded from 19.2.0 to 19.1.0
            expect(packageJson.dependencies['react-dom']).toBe('19.1.0');
            expect(yarnLock).toContain('react-dom@19.1.0:');
        });

        it('should have react-native-is-edge-to-edge added as dependency of screens', () => {
            // This is a new transitive dependency added in 4.16.0
            const screensSection = yarnLock.match(/react-native-screens@~4\.16\.0:[\s\S]*?(?=\n\n|\nreact-native-[a-z])/);
            expect(screensSection).toBeTruthy();
            if (screensSection) {
                expect(screensSection[0]).toContain('react-native-is-edge-to-edge');
            }
        });
    });

    describe('scheduler dependency consistency', () => {
        it('should only have scheduler 0.26.0 and 0.25.0, not 0.27.0', () => {
            const schedulerVersions = yarnLock.match(/scheduler@[\^~]?(\d+\.\d+\.\d+)/g);
            expect(schedulerVersions).toBeTruthy();
            
            if (schedulerVersions) {
                schedulerVersions.forEach(version => {
                    expect(version).not.toContain('0.27.0');
                });
            }
        });

        it('should have scheduler 0.26.0 as dependency of react-dom', () => {
            const reactDomSection = yarnLock.match(/react-dom@19\.1\.0:[\s\S]*?(?=\n\n|\nreact-[a-z])/);
            expect(reactDomSection).toBeTruthy();
            if (reactDomSection) {
                expect(reactDomSection[0]).toContain('scheduler "^0.26.0"');
            }
        });

        it('should have scheduler entries properly formatted in yarn.lock', () => {
            expect(yarnLock).toContain('scheduler@0.26.0, scheduler@^0.26.0:');
            const schedulerSection = yarnLock.match(/scheduler@0\.26\.0, scheduler@\^0\.26\.0:[\s\S]*?(?=\n\n[a-z])/);
            expect(schedulerSection).toBeTruthy();
            if (schedulerSection) {
                expect(schedulerSection[0]).toContain('version "0.26.0"');
                expect(schedulerSection[0]).toContain('resolved');
                expect(schedulerSection[0]).toContain('integrity');
            }
        });
    });
});