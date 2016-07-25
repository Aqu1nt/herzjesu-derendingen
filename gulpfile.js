var elixir = require('laravel-elixir');
require('laravel-elixir-livereload');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

var config = elixir.config.js.browserify.transformers
    .find(transformer => transformer.name === 'babelify');

config.options.plugins = [
    "babel-plugin-transform-decorators-legacy"
];

config.options.presets = ["es2015", "stage-0"];

elixir(function(mix) {
    mix.sass('app.scss', undefined, {
        includePaths: [ './node_modules' ]
    });
    mix.browserify('./angular/App.js', 'public/js/App.js', '.', {
        debug : true
    }).livereload();
    mix.copy('angular/views', 'public/views', '.');
    mix.copy('node_modules/font-awesome/fonts', 'public/fonts', '.');
});
