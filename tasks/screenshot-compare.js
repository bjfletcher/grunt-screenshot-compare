/*
 * grunt-screenshot-compare
 * https://github.com/bjfletcher/grunt-screenshot-compare
 *
 * Copyright (c) 2014 Ben Fletcher
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    grunt.registerTask('screenshot-compare', 'Compare screenshots.', compare);
    grunt.registerTask('screenshot-compare-verify', 'Verify screenshots.', function () {
        return verifyNew() && verifyDiff();
    });
    grunt.registerTask('screenshot-compare-add', 'Add new screenshots.', add);
    grunt.registerTask('screenshot-compare-replace', 'Replace screenshots.', replace);

    function compare() {
        var done = this.async(); // we're kicking off a process with callback
        // results in JSON format
        compareOutput('json', function(success) {
            if (!success) {
                done(false);
            } else {
                // results in HTML format
                compareOutput('html', function(success) {
                    done(success);
                });
            }
        });
    }

    function compareOutput(outputType, done) {
        grunt.util.spawn({
            cmd:__dirname + '/../node_modules/.bin/automated-screenshot-diff',
            args:['compare', '-p', 'v1', '-c', 'v2', '-s', 'screenshots/', '-o', outputType]
        }, function (error, result, code) {
            if (code !== 0) {
                grunt.log.error('Could not run automated-screenshot-diff');
                done(false);
            } else if (result.stdout) {
                grunt.log.ok(result.stdout);
                done(true);
            } else if (result.stderr) {
                grunt.log.error(result.stderr);
                done(false);
            }
        });
    }


    function verifyNew() { // 'Verify that there are no new screenshots.'
        var verified = true;
        var files = grunt.file.expand('screenshots/*-v2.*');
        if (!grunt.file.exists('screenshots/v2-v1-diff.json')) {
            files.forEach(function (file) {
                grunt.log.error('Test screenshot ' + file + ' is new');
                verified = false;
            });
        } else {
            var diffs = grunt.file.readJSON('screenshots/v2-v1-diff.json');
            files.forEach(function (file) {
                var found = false;
                diffs.forEach(function (diff) {
                    if ('screenshots/' + diff.file_b === file.toString()) {
                        found = true;
                    }
                });
                if (!found) {
                    grunt.log.error('Test screenshot ' + file + ' is new');
                    verified = false;
                }
            });
        }
        if (!verified) {
            grunt.log.error('Please verify the new screenshots and then \'grunt screenshot-compare-add\'');
        }
        return verified;
    }

    function verifyDiff() { // 'Verify that the screenshots have no changes.'
        var verified = true;
        if (grunt.file.exists('screenshots/v2-v1-diff.json')) {
            var diffs = grunt.file.readJSON('screenshots/v2-v1-diff.json');
            diffs.forEach(function (diff) {
                if (!diff.equal) {
                    grunt.log.warn('Test screenshot ' + diff.file_a + ' is different to verified screenshot ' + diff.file_b);
                    verified = false;
                }
            });
        }
        if (!verified) {
            grunt.log.error('Please verify the screenshot differences and then \'grunt screenshot-compare-replace\', or fix that new bug :-)');
        }
        return verified;
    }

    function add() {
        var added = false;
        var files = grunt.file.expand('screenshots/*-v2.*');
        if (!grunt.file.exists('screenshots/v2-v1-diff.json')) {
            files.forEach(function (file) {
                var filename = file.toString().replace(/-v2/, '-v1');
                grunt.file.copy(file, filename);
                grunt.log.ok('Test screenshot ' + file + ' is now the verified screenshot ' + filename);
                added = true;
            });
        } else {
            var diffs = grunt.file.readJSON('screenshots/v2-v1-diff.json');
            files.forEach(function (file) {
                var found = false;
                diffs.forEach(function (diff) {
                    if ('screenshots/' + diff.file_b === file.toString()) {
                        found = true;
                    }
                });
                if (!found) {
                    var filename = file.toString().replace(/-v2/, '-v1');
                    grunt.file.copy(file, filename);
                    grunt.log.ok('Test screenshot ' + file + ' is now the verified screenshot ' + filename);
                    added = true;
                }
            });
        }
        if (added) {
            grunt.log.ok('New screenshots added.');
        }
    }

    function replace() {
        var replaced = false;
        var diffs = grunt.file.readJSON('screenshots/v2-v1-diff.json');
        diffs.forEach(function (diff) {
            if (!diff.equal) {
                grunt.file.copy('screenshots/' + diff.file_b, 'screenshots/' + diff.file_a);
                replaced = true;
                grunt.log.ok('Test screenshot ' + diff.file_b + ' is now the verified screenshot ' + diff.file_a);
            }
        });
        if (replaced) {
            grunt.log.ok('Old screenshots replaced.');
        }
    }

};
