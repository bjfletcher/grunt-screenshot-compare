# grunt-screenshot-compare

Verify screenshots.

### Getting Started

Create a new folder called "screenshots".

```shell
mkdir <project's root folder>/screenshots
```

Place (by the test process) any non-verified screenshots in this folder.  Ensure that the non-verified screenshots end with "v2" (e.g., "accordion-open-v2.png").

For example:

```code
 screenshots /
 -> accordion-open-v2.png
 -> accordion-closed-v2.png
```
    
Run "screenshot-compare" to do the comparison and produce a report (which is screenshots/v1-v2-diff.json and screenshots/v1-v2-diff.html).

```shell
grunt screenshot-compare
```

Run "screenshot-compare-verify" which will check that there are new non-verified files for which there are no corresponding verified files (with which you can then add using "screenshot-compare-new").  This will check also that there are new differences between non-verified and verified versions (with which you can then replace using "screenshot-compare-replace").

```shell
grunt screenshot-verify
```

This will only pass if all non-verified screenshots have corresponding verified screenshots and they also look exactly the same. :-)

The "screenshots/v1-v2-diff.html" has a nice UI for looking at any differences between non-verified and verified screenshots.

### Continuous Integration (CI)

Both "screenshot-compare" and "screenshot-compare-verify" should pass before proceeding with the build chain.

For example:

```js
grunt.registerTask('test', ['mocha']); // mocha takes screenshots as well as unit testing
```

Becomes:

```js
grunt.registerTask('test', ['mocha', 'screenshot-compare', 'screenshot-compare-verify']);
```

### Examples

Try "npm install" then "grunt" in this folder.

Have a look at [Sky Toolkit](https://github.com/skyglobal/web-toolkit) which is using this.
