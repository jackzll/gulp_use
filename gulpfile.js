var gulp = require('gulp');
    // concat = require('gulp-concat'),
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var clean =	require('gulp-clean');
	// babel = require('gulp-babel');//引入gulp-babel模块，用于转换ES6为ES5;
	// var plumber = require('gulp-plumber');//报错管理
	// var browserify = require('browserify');
 //    var source = require('vinyl-source-stream'); //vinyl-source-stream 使用指定的文件名创建了一个 vinyl 文件实例，因此可以不再使用 gulp-rename
 //    var streamify = require('gulp-streamify');//解决插件不支持 stream 的问题
var sass = require('gulp-sass');
var bs=require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var  rev = require('gulp-rev');
var reload = bs.reload;
var path=require('path');
var rename = require('gulp-rename');
gulp.task('clean',function(){
	return gulp.src('./dist')
		.pipe(clean());
})
gulp.task('html',function(){
    return gulp.src('./src/*.html').pipe(gulp.dest('./dist'))
})
//编译sass
// {outputStyle: 'compressed'}
gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    // .pipe(gulp.dest('./dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./src/css'))
    .pipe(reload({stream: true}));
});
// js
gulp.task('js', function () {
  return gulp.src('./src/js/**/*.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./src/js'))
    .pipe(reload({stream: true}));
});

// gulp.task('sass:watch', function () {
//   gulp.watch('./src/sass/**/*.scss', ['sass']);
// });
//压缩js;
gulp.task('compress',function (cb) {
      pump([
            gulp.src('src/**/*.js'),
            uglify(),
            gulp.dest('dist')
        ],
        cb
      );
});
// gulp.task('watch',function(){
//     gulp.watch('./src/*.js',['es6']);
// })


// 开始一个Browsersync静态文件服务器

gulp.task('dev:server',['sass'],function(){
      bs.init({
          server: {
              baseDir: ["./src"]
          },
          files: ["./src/js/**/*.js"],
          port:9999,
          open: "local",
      });
      gulp.watch("./src/**/*.scss", ['sass']);
      gulp.watch("src/js/**/*.js", ['js']);
      gulp.watch("./src/*.html").on('change', reload);
})

gulp.task('build',['html','sass'],function(){

});
// 图片压缩
gulp.task('minimg', () =>
  gulp.src('src/images/*')
    .pipe(imagemin([
          imagemin.jpegtran({progressive: true}),
          imagemin.optipng({optimizationLevel: 5}),
    ]))
    .pipe(gulp.dest('dist/images'))
);
//静态文件添加指纹;
gulp.task('hash',() =>
    gulp.src(['./src/css/*.css', './src/js/*.js'], {base: 'src'})
        .pipe(gulp.dest('dist'))  // copy original assets to build dir
        .pipe(rev())
        .pipe(gulp.dest('dist'))  // write rev'd assets to build dir
        .pipe(rev.manifest())
        .pipe(gulp.dest('src'))  // write manifest to build dir
);
// 开始一个Browsersync代理
// bs.init({
//     proxy: "http://www.bbc.co.uk"
// })