import gulp         from 'gulp';
import babel        from 'gulp-babel';
import concat       from 'gulp-concat';
import uglify       from 'gulp-uglify';
import rename       from 'gulp-rename';
import sass         from 'gulp-sass';
import uglifycss    from 'gulp-uglifycss';

gulp.task('default', () => {
	gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('js', () => {
	return gulp.src('src/js/**/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat('simpleGallery.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(uglify())
		.pipe(rename('simpleGallery.min.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('sass', () => {
    return gulp.src('src/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('simpleGallery.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(uglifycss())
		.pipe(rename('simpleGallery.min.css'))
        .pipe(gulp.dest('dist/css'));
});