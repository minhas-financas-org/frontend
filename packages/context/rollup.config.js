import path from 'path';
import { glob } from 'glob';
import { terser } from 'rollup-plugin-terser';

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import packageJson from './package.json';

export default [
    {
        input: glob.sync('src/**/index.ts'),
        external: [
            ...Object.keys(packageJson.peerDependencies),
            '@greencapital/toolkit',
            '@greencapital/services',
        ],
        output: [
            {
                dir: path.dirname(packageJson.main),
                format: 'esm',
                sourcemap: true,
                preserveModules: true,
                preserveModulesRoot: 'src',
            },
        ],
        plugins: [
            commonjs(),
            typescript({ tsconfig: './tsconfig.json' }),
            resolve(),
            terser(),
        ],
    }
];
