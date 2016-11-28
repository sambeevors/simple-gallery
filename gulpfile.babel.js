// Load dependencies
import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import uglifycss from 'gulp-uglifycss';
import imagemin from 'gulp-imagemin';

const projectName = 'simpleGallery';

// Task constructor
function Task () {
	this.taskName;
	this.watchDir;
	this.srcDir;
	this.destDir;
}

const css = new Task();
css.taskName = 'sass';
css.watchDir = 'src/scss/**/*.scss';
css.srcDir = 'src/scss/main.scss';
css.destDir = 'dist/css';

const js = new Task();
js.taskName = 'js';
js.watchDir = 'src/js/**/*.js';
js.srcDir = js.watchDir;
js.destDir = 'dist/js';

const img = new Task();
img.taskName = 'img';
img.watchDir = 'src/img/**/*';
img.srcDir = img.watchDir;
img.destDir = 'dist/img';

gulp.task('default', () => {
	// Initially run all tasks.
	gulp.start(css.taskName, js.taskName, img.taskName);

	// Watch for changes
	gulp.watch(css.watchDir, [css.taskName]);
	gulp.watch(js.watchDir, [js.taskName]);
	gulp.watch(img.watchDir, [img.taskName]);
});

gulp.task(js.taskName, () => {
	return gulp.src(js.srcDir)
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat(`${projectName}.js`))
		.pipe(gulp.dest('dist/js'))
		.pipe(uglify())
		.pipe(rename(`${projectName}.min.js`))
		.pipe(gulp.dest(js.destDir));
});

gulp.task(css.taskName, () => {
	return gulp.src(css.srcDir)
		.pipe(sass().on('error', sass.logError))
		.pipe(rename(`${projectName}.css`))
		.pipe(gulp.dest('dist/css'))
		.pipe(uglifycss())
		.pipe(rename(`${projectName}.min.css`))
		.pipe(gulp.dest(css.destDir));
});

gulp.task(img.taskName, () => {
	return gulp.src(img.srcDir)
		.pipe(imagemin())
		.pipe(gulp.dest(img.destDir));
});
