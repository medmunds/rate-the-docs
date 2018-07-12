// Adapted from https://developers.livechatinc.com/blog/how-to-create-javascript-libraries-in-2018-part-1/

import babel from 'rollup-plugin-babel';
import html from 'rollup-plugin-html';
import postcss from 'rollup-plugin-postcss'
import postcssPresetEnv from 'postcss-preset-env';
import pkg from './package.json';

const externals = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

export default {
  input: 'src/index.js',
  external: externals,
  plugins: [
    postcss({
      extract: true,
      plugins: [postcssPresetEnv()],
    }),
    html({
      include: '**/*.html',
      htmlMinifierOptions: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        quoteCharacter: "'",  // avoids excessive escaping in generated JS
        removeComments: true,
      },
    }),
    babel({ plugins: ['external-helpers']}),
  ],
  output: [
    { file: pkg.main, format: 'iife', name: 'RateTheDocs' },
    { file: pkg.module, format: 'es' },
  ],
};
