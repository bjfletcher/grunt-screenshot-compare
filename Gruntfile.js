/*
 * grunt-screenshot-compare
 * https://github.com/bjfletcher/grunt-screenshot-compare
 *
 * Copyright (c) 2014 Ben Fletcher
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    grunt.loadTasks('tasks');
    grunt.registerTask('test', ['screenshot-compare', 'screenshot-compare-verify']);
    grunt.registerTask('default', ['test']);
};
