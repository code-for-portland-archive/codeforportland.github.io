'use strict';

var path = require('path');

module.exports = function (grunt) {
	var modernizr = 'bower_components/modernizr/modernizr.js';
	var jsFiles = [
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/retina.js/src/retina.js',
		'bower_components/knockout.js/knockout.js',
		'bower_components/foundation/js/foundation/foundation.js',
    'bower_components/foundation/js/foundation/foundation.topbar.js',
    'bower_components/foundation/js/foundation/foundation.orbit.js',
		'assets/js/app.js'
	];

	var cssFiles = [
		'assets/css/app.css'
	];

	grunt.initConfig({
		uglify: {
			deploy: {
				files: {
					'assets/js/modernizr.min.js': modernizr,
					'assets/js/app.min.js': jsFiles
				}
			}
		},
		sass: {
			dev: {
				files: {
					'assets/css/app.css': '_src/app.scss'
				}
			},
			deploy: {
				files: {
					'assets/css/app.min.css': '_src/app.scss'
				},
				options: {
					style: 'compressed'
				}
			}
		},
		copy: {
			dev: {
				files: [
					{expand: true, cwd: '_src/', src: ['*.js'], dest: 'assets/js/', filter: 'isFile'}
				]
			},
		},
		create_directories: {
			build: ['assets/img', 'assets/css', 'assets/js'],
			www: ['assets/img', 'assets/css', 'assets/js']
		},
		clean: {
			build: "build",
			www: "www",
			tmp: [".sass-cache"]
		},
		watch: {
			files: ['_src/*', '_layouts/*', '**/*.html', 'index.html', '**/_posts/*', '!_dev/**',],
			tasks: ['copy:dev', 'sass:dev', 'jekyll:dev'],
			options: {
				livereload: true
			}
		},
		connect: {
			all: {
				options: {
					port: 8002,
					base: [path.join(__dirname, '_dev')],
					livereload: true
				}
			}
		},
    jekyll: {
      dev: {
        options: {
          config: "_config.dev.yml",
          bundleExec: true,
          dest: "_dev"
        }
      },
      deploy: {
        options: {
          config: "_config.yml",
          bundleExec: true
        }
      }
    }
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-jekyll');


	grunt.registerTask('default', ['copy:dev', 'sass:dev']);
	grunt.registerTask('dev', [
		'clean:build',
		'create_directories:build',
		'copy:dev',
		'sass:dev',
    'jekyll:dev',
		'connect',
		'watch'
	]);
	grunt.registerTask('deploy', [
		'clean:www',
		'create_directories:www',
		'sass:deploy',
		'uglify:deploy',
		'copy:deploy',
	]);
	grunt.registerMultiTask('create_directories', 'Created directory hierarchy.', function() {
		console.log('Creating directories for ' + this.target);
		for (var i = 0; i < this.data.length; i++) {
			grunt.file.mkdir(path.join(__dirname, '/', this.data[i]));
		}
	});
};
