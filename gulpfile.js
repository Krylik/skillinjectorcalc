var gulp = require('gulp');
var gulpWebpack = require('gulp-webpack');
var webpack = require('webpack');

gulp.task('default', function() {
    return gulp.src('index.jsx')
        .pipe(gulpWebpack({
            watch: true,
            output: {
                filename: '[name].js',
            },
            module: {
                loaders: [
                    {
                        test: /\.js.$/,
                        loader: 'babel',
                        query: {
                            presets: ['react', 'es2015']
                        }
                    },
                ],
            },
            plugins: [new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })]
        }))
		.pipe(gulp.dest('static'));
});
