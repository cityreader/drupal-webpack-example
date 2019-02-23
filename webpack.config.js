const path = require('path');
const glob = require('glob');

const rootDir = path.resolve(__dirname);

// ES6 JS in the custom Drupal modules.
const modulePath = path.resolve(__dirname, 'web/modules/custom');
const matchesInModules = glob.sync(`${modulePath}/*/js/*.es6.js`);

// ES6 JS in the custom theme.
const themePath = path.resolve(__dirname, 'web/themes/custom/mytheme');
const themeSrcPath = path.resolve(__dirname, `${themePath}/src/js`);
const themeDistPath = path.resolve(__dirname, `${themePath}/assets/js`);
const matchesInTheme = glob.sync(`${themeSrcPath}/*.js`);

const entry = {};

const allMatches = matchesInModules.concat(matchesInTheme);

allMatches.forEach((match) => {
  entry[match] = match;
});

/**
 * Gets the file path of the compiled JS in the Drupal module.
 *
 * The compiled module JS files stay in the same directory of source js files.
 * The new path will be generated based on /path/to/module/js/*.es6.js, and will
 * be /path/to/module/js/*.js.
 *
 * @param filename
 * @returns {string}
 */
const moduleJsOutputPath = (filePath) => {
  if (filePath.slice(-7) === '.es6.js') {
    const fileName = path.basename(filePath);
    const fileDir = path.dirname(filePath);
    const relativeDir = path.relative(rootDir, fileDir);
    // Remove .es6.js file extension.
    const newFileName = fileName.slice(0, -7);
    const newFilePath = `${relativeDir}/${newFileName}.js`;
    return newFilePath;
  }
};

/**
 * Get the file path of the compiled JS in the Drupal theme.
 *
 * The compiled theme JS files stay in the assets/js directory.
 *
 * @param filePath
 * @returns {string}
 */
const themeJsOutputPath = (filePath) => {
  const fileName = path.basename(filePath);
  const relativeDir = path.relative(rootDir, themeDistPath);
  const newFilePath = `${relativeDir}/${fileName}`;
  return newFilePath;
};

module.exports = {
  entry: entry,
  output: {
    path: rootDir,
    filename(object) {
      const filePath = object.chunk.name;
      let newFilePath;

      if (filePath.indexOf(themePath) !== -1) {
        newFilePath = themeJsOutputPath(filePath);
      }
      else {
        newFilePath = moduleJsOutputPath(filePath);
      }
      return newFilePath;
    },
  },
  devtool: 'hidden-source-map',
  externals: {
    jquery: 'jQuery',
    Drupal: 'Drupal',
    drupalSettings: 'drupalSettings',
  },
  module: {
    rules: [
      {
        test: /\.es6\.js/,
        include: [new RegExp(modulePath)],
        loader: 'babel-loader',
      },
      {
        test: /\.js/,
        include: [new RegExp(themeSrcPath)],
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      _shared: path.resolve(themeSrcPath, 'shared')
    },
  }
};
