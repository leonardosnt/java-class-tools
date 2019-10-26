const { src, dest, parallel, series, watch } = require('gulp');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const rename = require('gulp-rename');
const { prepend } = require('gulp-insert');
const uglifyjs = require('gulp-uglify');
const webpackConfig = require('./webpack.config');

const LICENSE_NOTICE = `/*!
 * https://github.com/leonardosnt/java-class-tools
 * 
 * Copyright (C) 2017-2019 leonardosnt
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */
 `;

function build() {
  return src('src/**')
    .pipe(babel())
    .pipe(dest('lib/'));
}

function buildBrowser() {
  return src('src/index.js')
    .pipe(webpack(webpackConfig))
    .pipe(dest('dist/'))
    .pipe(rename(path => path.extname = '.min.js'))
    .pipe(uglifyjs())
    .pipe(prepend(LICENSE_NOTICE))
    .pipe(dest('./dist'));
}

function watchChanges() {
  return watch('src/*.js', series('build'));
}

exports.watch = watchChanges;
exports.build = build;
exports.browser = buildBrowser;
exports.default = parallel(build, buildBrowser);