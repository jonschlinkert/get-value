'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var stylish = require('jshint-stylish');
var istanbul = require('gulp-istanbul');
var jshint = require('gulp-jshint');

var lint = ['index.js', 'utils.js'];

gulp.task('coverage', function () {
  return gulp.src(lint)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['coverage'], function () {
  return gulp.src('test.js')
    .pipe(mocha({reporter: 'spec'}))
    .pipe(istanbul.writeReports());
});

gulp.task('lint', function () {
  return gulp.src(lint)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('default', ['test', 'lint']);
