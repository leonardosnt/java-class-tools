'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const webpack = require('gulp-webpack');
const rename = require('gulp-rename');
const uglifyjs = require('gulp-uglifyjs');

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
    .pipe(gulp.dest('./dist'));
});
