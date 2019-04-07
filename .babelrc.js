// Adapted from https://developers.livechatinc.com/blog/how-to-create-javascript-libraries-in-2018-part-1/

const { BABEL_ENV, NODE_ENV } = process.env;

const cjs = BABEL_ENV === 'cjs' || NODE_ENV === 'test';

module.exports = {
  presets: [
    ['@babel/preset-env', { loose: true, modules: false }],
  ],
  plugins: [
    cjs && 'transform-es2015-modules-commonjs',
  ].filter(Boolean)
};
