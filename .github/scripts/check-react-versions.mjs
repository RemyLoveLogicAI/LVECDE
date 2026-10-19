// react and react-dom must be the exact same version, and react must be the exact
// version React Native's renderer was built against. The renderer hard-checks it
// and throws "Incompatible React versions" on any other version, even a patch
// release (blank page on web, crash on native). Dependency bots that bump one
// package without the others have caused this before.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const declared = { react: pkg.dependencies?.react, 'react-dom': pkg.dependencies?.['react-dom'] };
const installed = {
    react: require('react/package.json').version,
    'react-dom': require('react-dom/package.json').version,
};

const problems = [];
if (declared.react === undefined || declared['react-dom'] === undefined) {
    problems.push('package.json must declare both react and react-dom in dependencies');
} else if (declared.react !== declared['react-dom']) {
    problems.push(`package.json declares react ${declared.react} but react-dom ${declared['react-dom']}`);
}
if (installed.react !== installed['react-dom']) {
    problems.push(`installed react ${installed.react} but react-dom ${installed['react-dom']}`);
}

// React Native's renderer embeds the one React version it accepts. Read it from the
// installed package so a react/react-dom bump without a matching React Native or
// Expo SDK upgrade is caught even though CI only builds the web target.
let required;
try {
    const renderer = join(
        dirname(require.resolve('react-native/package.json')),
        'Libraries/Renderer/implementations/ReactNativeRenderer-prod.js',
    );
    required = /"(\d+\.\d+\.\d+[^"]*)"\s*!==\s*isomorphicReactPackageVersion/.exec(readFileSync(renderer, 'utf8'))?.[1];
} catch {
    // fall through to the warning below
}
if (required === undefined) {
    console.warn('::warning::Could not read the React version required by react-native; verify react matches it manually.');
} else if (required !== installed.react) {
    problems.push(`react-native requires react ${required} but installed react is ${installed.react}`);
}

if (problems.length > 0) {
    console.error(`react / react-dom version mismatch:\n- ${problems.join('\n- ')}`);
    process.exit(1);
}
console.log(`react and react-dom are both ${installed.react}` + (required ? `, as react-native requires` : ''));
