import gulp from 'gulp';
import gulpif from 'gulp-if';
import livereload from 'gulp-livereload';
import args from './lib/args';

gulp.task('copyvendors', () => {
  return gulp.src('app/scripts/lib/vendors/*.js')
    .pipe(gulp.dest(`dist/${args.vendor}/scripts/lib/vendors`))
    .pipe(gulpif(args.watch, livereload()));
});
