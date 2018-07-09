// Adapted from https://developers.livechatinc.com/blog/how-to-create-javascript-libraries-in-2018-part-1/

import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const externals = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

export default {
  input: 'src/index.js',
  external: externals,
  plugins: [
    babel({ plugins: ['external-helpers']}),
  ],
  output: [
    { file: pkg.main, format: 'iife', name: 'RateTheDocs' },
    { file: pkg.module, format: 'es' },
  ],
};
