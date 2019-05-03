var gulp = require("gulp");
var fs =  require("fs"); 
var path = require("path"); 
var replace = require("gulp-replace"); 
var concat = require('gulp-concat');
var rename = require("gulp-rename"); 
var css = function () {
   return gulp.src('src/assets/css/_*.css')
      //.pipe(uglify())
      .pipe(concat('bootstrap-ext.css'))
      .pipe(gulp.dest('src/assets/css/'));
};
gulp.task('css', css);

var templates = function(done){
   //var p
   var basePath = "./src/"; 
   var files= fs.readdirSync(basePath).filter(function(x){
      var ext = path.extname(x); 
      return ((x[0]==='_') && ext.toLowerCase() ===".html") ;
   }); 
   var strm = gulp.src("src/_index.html")
   files.map(function(file){
      var fl = file.substr(1); 
      var reg =`<!--@@${fl} ?-->((.*)(\\r\\n|\\n))*(.*)<!--@@\/${fl} ?-->`; 
      var matcher = new RegExp(reg, "im"); 
      var filepath = path.join(basePath, file).toString(); 
      strm = strm.pipe(replace(matcher,  fs.readFileSync(filepath).toString()))
   })
   strm.pipe(rename("index.html") ).pipe(gulp.dest("src"));
   done(); 
};
gulp.task('templates', templates);

gulp.task("default", function(done){
   (gulp.series('css', 'templates'))(done); 
})