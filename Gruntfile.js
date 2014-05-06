module.exports = function (grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		concat: {
			stripBanners: {
				options: {
					stripBanners: true
				},
				files: [{
					expand: true,
					cwd: 'src',
					src: '**/*.js',
					dest: 'dist'
				}]
			},
			createBannerlessFiles: {
				options: {
					process: function (src, filepath) {
						return '/* ' + filepath.replace(/.+\/(.+?).js/,'$1') + ' */\n' + src;
					}
				},
				files: [{
					expand: true,
					cwd: 'dist',
					src: '**/*.js',
					dest: 'dist'
				}]
			},
			afterUglify: {
				options: {
					process: function (src, filepath) {
						return '/*! ' + filepath.replace(/.+\/(.+?).min.js/,'$1') + ' */\n' + src;
					}
				},
				files: [{
					expand: true,
					cwd: 'dist',
					src: '**/*.min.js',
					dest: 'dist'
				}]
			}
		},

		uglify: {
			createMinifiedFiles: {
				files: [{
					expand: true,
					cwd: 'src',
					src: '**/*.js',
					dest: 'dist',
					ext: '.min.js'
				}]
			}
		},

		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: ['pkg'],
				commit: true,
				commitMessage: 'Release %VERSION%',
				commitFiles: ['-a'],
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false
			}
		},

		jscs: {
			main: {
				options: {
					config: '.jscsrc'
				},
				files: {
					src: [
						'src/**/*.js',
						'!src/**/gmapsLoader.js'
					]
				}
			}
		},

		jshint: {
			main: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: [
					'src/**/*.js'
				]
			}
		}

	});

	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-jscs-checker' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-bump' );

	grunt.registerTask( 'stylecheck', ['jshint:main', 'jscs:main'] );
	grunt.registerTask( 'default', ['concat:stripBanners', 'concat:createBannerlessFiles', 'uglify:createMinifiedFiles', 'concat:afterUglify'] );
	grunt.registerTask( 'releasePatch', ['bump-only:patch', 'default', 'bump-commit'] );
	grunt.registerTask( 'releaseMinor', ['bump-only:minor', 'default', 'bump-commit'] );
	grunt.registerTask( 'releaseMajor', ['bump-only:major', 'default', 'bump-commit'] );

};
