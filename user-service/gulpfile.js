var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gulpDocker = require('gulp-docker');
var path = require('path');
var del = require('del');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var webpackConfig = require('./webpack.config');

gulp.task('clean', () => {
  return del(['build/*']);
});

gulp.task('compile', ['run-tests'], () => {
  gulp.src('./index.js')
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest('./build'));
});

gulp.task('copy-package', ['compile'], () => {
  gulp.src('./package.json')
    .pipe(gulp.dest('./build'));
});

gulp.task('run-tests', ['clean'], () => {
  return gulp.src(['test/*.spec.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        should: require('should')
      }
    })).on('error', () => {
      process.exit(1);
    });
});

gulp.task('docker-build', ['copy-package'], (callback) => {
  var dockerArgs = ['build', '-t', 'test:v0.0.1', '.'];
  execCommand('docker', dockerArgs, callback)
});

gulp.task('build', ['clean', 'run-tests', 'compile', 'copy-package']);

// Function run command line tools.
/*
function execCommand(command, args, callback) {
  const ctx = spawn(command, args);

  ctx.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  ctx.on('close', (code) => {
    if (callback) { callback(code === 0 ? null : code)}
  });
}
*/