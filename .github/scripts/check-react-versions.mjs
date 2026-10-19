// react and react-dom must be the exact same version: React Native pins its
// renderer to one React version, and a mismatch makes the web app throw
// "Incompatible React versions" on mount (blank page). Dependency bots that
// bump one package without the other have caused this before.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const declared = { react: pkg.dependencies?.react, 'react-dom': pkg.dependencies?.['react-dom'] };
const installed = {
    react: require('react/package.json').version,
    'react-dom': require('react-dom/package.json').version,
};

const problems = [];
if (declared.react !== declared['react-dom']) {
    problems.push(`package.json declares react ${declared.react} but react-dom ${declared['react-dom']}`);
}
if (installed.react !== installed['react-dom']) {
    problems.push(`installed react ${installed.react} but react-dom ${installed['react-dom']}`);
}

if (problems.length > 0) {
    console.error(`react / react-dom version mismatch:\n- ${problems.join('\n- ')}`);
    process.exit(1);
}
console.log(`react and react-dom are both ${installed.react}`);
