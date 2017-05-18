'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const rename = require('gulp-rename');
const insert = require('gulp-insert');
const uglifyjs = require('gulp-uglifyjs');

const LICENSE_NOTICE = `/*!
 * https://github.com/leonardosnt/java-class-tools
 * 
 * Copyright (C) 2017 leonardosnt
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */
 `;

gulp.task('default', () => {
  return gulp
    .start('build')
    .start('build:browser');
});

gulp.task('build', () => {
  return gulp.src('src/**')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(gulp.dest('lib'));
});

gulp.task('build:browser', () => {
  return gulp.src('src/**')
    .pipe(webpack(require('./webpack.config')))
    .pipe(gulp.dest('./dist'))
    .pipe(rename(path => path.extname = ".min.js"))
    .pipe(uglifyjs())
    .pipe(insert.prepend(LICENSE_NOTICE))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', () => {
  return gulp.watch('src/*.js', e => {
    if (e.type === 'changed') {
      console.log(`${e.path} changed, building...`);
      
      gulp.src(e.path)
        .pipe(babel({ presets: ['es2015'], highlightCode: false }).on('error', err => console.error(err)))
        .pipe(gulp.dest('lib'));
    }
  });
})