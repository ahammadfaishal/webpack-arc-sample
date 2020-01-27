
import gulp from 'gulp';
import gutil from 'gulp-util';
import rename from 'gulp-rename';
import nodemon from 'gulp-nodemon';
import docco from 'gulp-docco';
import scsslint from 'gulp-scss-lint';
import path from 'path';
import del from 'del';
import globby from 'globby';

let jsGlob = ['**/*.js', '!{node_modules,node_modules/**}', '!{docs,doc/**}',
  '!{dist,dist/**}', '!{coverage,coverage/**}', '!src/{res,res/**}',
  '!config/env.conf.js'];

let tsGlob = ['**/*.ts', '!{node_modules,node_modules/**}', '!{docs,doc/**}',
  '!{dist,dist/**}', '!{coverage,coverage/**}', '!src/{res,res/**}'];


let scssGlob = ['**/*.scss', '!{node_modules,node_modules/**}',
  '!{dist,dist/**}', '!{docs,doc/**}', '!{coverage,coverage/**}', '!src/{res,res/**}'];


gulp.task('default', ['clean:docs',
  'watch:docs',
  'watch:sass']);


gulp.task('watch:sass', () => {

  gulp.watch(scssGlob, function (event) {
    return gulp.src(event.path)
      .pipe(scsslint());
  });
});

gulp.task('build:docs', () => {

  function generateDocs(fileSrc, ext) {

    console.log(ext);

    if (ext == '') {

      throw new Error('Extension must be passed in for documentation to be generated properly!')
    }
    return gulp.src(fileSrc)
      .pipe(docco())
      .pipe(gulp.dest(`docs/${ext}`));
  }

  generateDocs(jsGlob, '.js');

  generateDocs(tsGlob, '.ts');

  generateDocs(scssGlob, '.scss');

});

gulp.task('watch:docs', () => {

  let options = {
    layout: 'parallel',
    output: 'docs',
    template: null,
    css: null,
    extension: null,
    languages: {},
    marked: null
  }

  function generateUserAlert(ext) {

    switch (ext) {

      case '.js':
        console.log('A JavaScript file has changed; documentation will now be generated...');

        break;

      case '.scss':
        console.log('A Sass file has changed; documentation will now be generated...');

        break;

      case '.ts':
        console.log('A TypeScript file has changed; documentation will now be generated...');

        break;

      default:
        console.log('Generating appropriate folders and styles...');

        break;
    }

    return;
  }

  function generateDocs(fileSrc) {
    gulp.watch(fileSrc, function (event, ext = path.extname(event.path)) {

      generateUserAlert(ext);
      return gulp.src(fileSrc)
        .pipe(docco())
        .pipe(gulp.dest(`docs/${ext}`))
        .on('error', gutil.log);
    });
  }

  generateDocs(jsGlob);
  generateDocs(tsGlob);
  generateDocs(scssGlob);
});

gulp.task('serve', ['serve:watch']);

gulp.task('serve:watch', () => {
  process.env.MODULE = 'public';
  nodemon({
    script: 'server.js',
    ext: 'js',
    ignore: [
      ".git",
      "node_modules",
      "dist-admin",
      "dist-mobile",
      "src",
      "mobile",
      "test",
      "uploads"
    ]
  });
});


gulp.task('clean:docs', (callback) => {
  del(['./docs/**/*']).then(function (paths) {
    callback(); // ok
  }, function (reason) {
    callback('Failed to delete files: ' + reason); // fail
  });
});
