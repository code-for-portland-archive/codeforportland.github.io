'use strict';

var path = require('path');

module.exports = function (grunt) {
	var modernizr = 'bower_components/modernizr/modernizr.js';
	var jsFiles = [
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/retina.js/src/retina.js',
		'bower_components/knockout.js/knockout.js',
		'bower_components/foundation/js/foundation/foundation.js',
		'assets/js/app.js'
	];

	var cssFiles = [
		'assets/css/app.css'
	];

	grunt.initConfig({
		uglify: {
			deploy: {
				files: {
					'www/assets/js/modernizr.min.js': modernizr,
					'www/assets/js/app.min.js': jsFiles
				}
			}
		},
		sass: {
			dev: {
				files: {
					'build/assets/css/app.css': 'src/app.scss'
				}
			},
			deploy: {
				files: {
					'www/assets/css/app.min.css': 'src/app.scss'
				},
				options: {
					style: 'compressed'
				}
			}
		},
		jade: {
			deploy: {
				options: {
					data: {
						modernizr: 'assets/js/modernizr.min.js',
						js: ['assets/js/app.min.js'],
						css: ['assets/css/app.min.css']
					}
				},
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: ['*.jade'],
						dest: 'www/',
						ext: '.html'
					}
				]
			},
			dev: {
				options: {
					data: {
						modernizr: modernizr,
						js: jsFiles,
						css: ['assets/css/app.css']
					},
					pretty: true
				},
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: ['*.jade'],
						dest: 'build/',
						ext: '.html'
					}
				]
			}
		},
		copy: {
			dev: {
				files: [
					{expand: true, cwd: 'src/', src: ['*.js'], dest: 'build/assets/js/', filter: 'isFile'},
					{expand: true, cwd: 'src/', src: ['img/*'], dest: 'build/assets/img/', filter: 'isFile'}
				]
			},
			deploy: {
				files: [
					{expand: true, cwd: 'src/', src: ['img/*'], dest: 'www/assets/img/', filter: 'isFile'}
				]
			},
		},
		create_directories: {
			build: ['build/assets/img', 'build/assets/css', 'build/assets/js'],
			www: ['www/assets/img', 'www/assets/css', 'www/assets/js']
		},
		clean: {
			build: "build",
			www: "www",
			tmp: [".sass-cache"]
		},
		watch: {
			files: ['src/*'],
			tasks: ['copy:dev', 'sass:dev', 'jade:dev'],
			options: {
				livereload: true
			}
		},
		connect: {
			all: {
				options: {
					port: 8002,
					base: [path.join(__dirname, 'build'), __dirname],
					livereload: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');


	grunt.registerTask('default', ['copy:dev', 'sass:dev', 'jade:dev']);
	grunt.registerTask('dev', [
		'clean:build',
		'create_directories:build',
		'copy:dev',
		'sass:dev',
		'jade:dev',
		'connect',
		'watch'
	]);
	grunt.registerTask('deploy', [
		'clean:www',
		'create_directories:www',
		'sass:deploy',
		'uglify:deploy',
		'jade:deploy',
		'copy:deploy',
	]);
	grunt.registerMultiTask('create_directories', 'Created directory hierarchy.', function() {
		console.log('Creating directories for ' + this.target);
		for (var i = 0; i < this.data.length; i++) {
			grunt.file.mkdir(path.join(__dirname, '/', this.data[i]));
		}
	});
};
