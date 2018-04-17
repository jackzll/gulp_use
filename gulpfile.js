var gulp = require('gulp');
// concat = require('gulp-concat'),
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
// babel = require('gulp-babel');//引入gulp-babel模块，用于转换ES6为ES5;
// var plumber = require('gulp-plumber');//报错管理
// var browserify = require('browserify');
//    var source = require('vinyl-source-stream'); //vinyl-source-stream 使用指定的文件名创建了一个 vinyl 文件实例，因此可以不再使用 gulp-rename
//    var streamify = require('gulp-streamify');//解决插件不支持 stream 的问题
var sass = require('gulp-sass');
var bs = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var reload = bs.reload;
var path = require('path');
var rename = require('gulp-rename');
var pump = require('pump');
var gulpSequence = require('gulp-sequence');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var postPlus = [
  autoprefixer({
    browsers: ['> 0.5%', 'last 2 versions']
  }),
  require('postcss-write-svg')({
    utf8: false
  }) //1px svg;
]

gulp.task('sass', function() {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(postcss(postPlus))
    .pipe(gulp.dest('./src/css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./src/css'))
    .pipe(reload({
      stream: true
    }));
});
// js 压缩更改名
gulp.task('dev:js', (cb) => {
  pump([
      gulp.src(['src/**/*.js', '!src/**/*.min.js']),
      uglify(),
      rename({
        suffix: '.min'
      }),
      gulp.dest('src'),
      reload({
        stream: true
      })
    ],
    cb
  );
})


// 开始一个Browsersync静态文件服务器
gulp.task('dev:server', ['sass'], function() {
  bs.init({
    server: {
      baseDir: ["./src"]
    },
    files: ["./src/js/**/*.js"],
    port: 9999,
    open: "local",
  });
  gulp.watch("./src/**/*.scss", ['sass']);
  gulp.watch("src/js/**/*.js", ['dev:js']).on('change', reload);
  gulp.watch("./src/*.html").on('change', reload);
})


// 打包环境
gulp.task('clean', function() {
  return gulp.src('./dist')
    .pipe(clean());
})
gulp.task('clean:rev', function() {
  return gulp.src('./rev')
    .pipe(clean());
})
gulp.task('copy:html', function() {
  return gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist/'));
})
gulp.task("copy:css", ['sass'], function() {
  return gulp.src('./src/css/*.min.css')
    .pipe(rev())
    .pipe(gulp.dest('./dist/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev/css'));
})
gulp.task("build:js", ['dev:js'], function() {
  return gulp.src('./src/js/*.min.js')
    .pipe(rev())
    .pipe(gulp.dest('./dist/js', {
      cwd: '.'
    }))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev/js'));
})
// gulp.task('compress', function() {
//   return gulp.src('./src/images/*.*')
//     .pipe(imagemin())
//     .pipe(gulp.dest('./src/imgCompress'))
// })
gulp.task('img:hash', function() {
  return gulp.src('./src/images/*.*')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('dist/images'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev/images'))
})
// // 图片压缩
// gulp.task('minimg', function() {
//   return gulp.src('./dist/images/*.*')

//     .pipe(gulp.dest('./dist/images'))
// });
gulp.task('rev', function() {
  return gulp.src(['./rev/**/*.json', './dist/**/*.+(css|html|js)'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(gulp.dest('./dist/'))
})
// 静态资源添加指纹
gulp.task('build', function(cb) {
  gulpSequence(['clean', 'clean:rev'], 'img:hash', 'build:js', 'copy:css', 'copy:html', 'rev')(cb)
})