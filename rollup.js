const commonjs = require('@rollup/plugin-commonjs')
const resolve = require('@rollup/plugin-node-resolve')
const terser = require('@rollup/plugin-terser')

module.exports = {
  input: './index.js',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [
    commonjs({
      strictRequires: true,
    }),
    resolve(),
    terser(),
  ],
}
