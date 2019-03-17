const path = require('path');

/**
 * var
 * umd
 * commonjs
 * commonjs2
 * amd
 * amd-require
 * this
 * window
 * global
 * jsonp
 * [字符串] [可选值: "var", "assign", "this", "window", "self", "global",
      "commonjs", "commonjs2", "commonjs-module", "amd", "umd", "umd2", "jsonp"]
  
  npm run buildMod -- --env.type=umd
 */

module.exports = env => {
  const type = env.type || 'var'
  console.log(env)
  return{
    // mode: "development",
    mode: "production",
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: `${type}.bundle.js`,
      library: 'modName',
      libraryTarget: type
    },
    optimization: {
      minimize: false
    }
  }
};