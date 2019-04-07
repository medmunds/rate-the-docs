// Adapted from https://developers.livechatinc.com/blog/how-to-create-javascript-libraries-in-2018-part-1/

import babel from 'rollup-plugin-babel';
import html from 'rollup-plugin-html';
import postcss from 'rollup-plugin-postcss'
import postcssHeader from 'postcss-header';
import postcssPresetEnv from 'postcss-preset-env';
import pkg from './package.json';

const externals = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const production = process.env.BUILD === "production";
const banner = `/*! ${pkg.name} ${pkg.version} - ${pkg.repository} */`;

export default {
  input: 'src/index.js',
  external: externals,
  plugins: [
    postcss({
      // extract: true, // uncomment for external css files
      minimize: production, // uses cssnano
      plugins: [
        postcssHeader({ header: banner }),
        postcssPresetEnv(),
      ],
      sourceMap: !production,  // inlined, so don't include in production
    }),
    html({
      include: '**/*.html',
      htmlMinifierOptions: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        quoteCharacter: "'",  // avoids excessive escaping in generated JS
        removeComments: production,
      },
    }),
    babel({
      comments: !production,
      presets: [production && "babel-preset-minify"].filter(Boolean),
    }),
  ],
  output: [
    { file: outputFilename(pkg.main), format: 'umd', name: 'RateTheDocs',
      banner: banner, sourcemap: true },
    { file: outputFilename(pkg.module), format: 'esm',
      banner: banner, sourcemap: true },
  ],
};


function outputFilename(filename) {
  // Ensure ".min" before extension in production, remove ".min" otherwise
  const nonMinFilename = filename.replace(/\.min(\.\w+)$/, "$1");
  return production
    ? nonMinFilename.replace(/(\.\w+)$/, ".min$1")
    : nonMinFilename;
}
