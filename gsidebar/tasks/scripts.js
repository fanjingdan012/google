import gulp from 'gulp';
import gulpif from 'gulp-if';
import named from 'vinyl-named';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import livereload from 'gulp-livereload';
import args from './lib/args';
import path from 'path';
import plumber from 'gulp-plumber';

gulp.task('scripts', (cb) => {
  var source_map = args.es5 ? 'inline' : 'eval';

  return gulp.src('app/scripts/*.js')
    .pipe(gulpif(args.watch, plumber()))
    .pipe(named())
    .pipe(gulpWebpack({
      devtool: args.production ? null : source_map + '-source-map',
      watch: args.watch,
      entry: {
        // common: ['jquery', 'underscore'],
        lib: ["jquery", "underscore", 'react', 'reflux', 'material-ui', 'moment', 'reflux-promise'],
        contentscript: [path.join(__dirname, '..' ,'app/scripts/contentscript')],
        background: [path.join(__dirname, '..' ,'app/scripts/background')],
        calendar: [path.join(__dirname, '..' ,'app/scripts/calendar')],
        gmail: [path.join(__dirname, '..' ,'app/scripts/page_scripts/gmail_script')],
        'calendar-page': [path.join(__dirname, '..' ,'app/scripts/page_scripts/calendar')]
      },
      output: {
        filename: "[name].js",
        path: __dirname
      },
      plugins: [
        new webpack.DefinePlugin({
          '__ENV__': JSON.stringify(args.production ? 'production' : 'development'),
          '__VENDOR__': JSON.stringify(args.vendor),
          'process.env': {
            'NODE_ENV': JSON.stringify(args.production ? 'production' : 'development')
          }
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            _: "underscore",
            moment: "moment"
        }),
        new webpack.optimize.CommonsChunkPlugin("vendor.js", ["lib", "contentscript"])
      ].concat(args.production ? [
        new webpack.optimize.UglifyJsPlugin()
      ] : []),
      resolve: {
        alias: {
          core: path.join(__dirname, '..' ,'app/scripts/core'),
          sap: path.join(__dirname, '..' ,'app/scripts/sap'),
          lib: path.join(__dirname, '..' ,'app/scripts/lib'),
          calendar: path.join(__dirname, '..' ,'app/scripts/calendar')
        },
        extensions: ['', '.json', '.jsx', '.js']
      },
      module: {
        preLoaders: [{
          test: /\.js?$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        }],
        loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        }, {include: /\.json$/, loaders: ["json-loader"]}]
      },
      eslint: {
        configFile: '.eslintrc'
      }
    }))
    .pipe(gulp.dest(`dist/${args.vendor}/scripts`))
    .pipe(gulpif(args.watch, livereload()));
});

