'use strict';

var path = require('path'),
    fs = require('fs'),
    watch = require('watch'),
    asyncWaterfall = require('async-waterfall'),
    asyncForEach = require('async-foreach').forEach;

var templatesPath = path.normalize(__dirname + '/../templates');

function getName(filepath) {
    return path.basename(filepath, path.extname(filepath)).replace(/\s+/, '_');
}

function dummyHelper () {
    return '';
}

function registerHelperFromFile(hbs, filepath, resultCallback) {
    var name = getName(filepath);
    if(require.cache[require.resolve(filepath)]) {
        delete require.cache[require.resolve(filepath)];
    }
    hbs.registerHelper(name, require(filepath));
    resultCallback(null);
}

function registerHelpers(hbs, resultCallback) {
    var name;
    watch.watchTree(path.normalize(templatesPath + '/helpers'),
        function (f, curr, prev) {
            if (typeof f === "object" && prev === null && curr === null) {
                // Finished walking the tree
                asyncForEach(Object.keys(f),
                    function (item, idx, arr) {
                        var forEachCallback = this.async();
                        if (fs.statSync(item).isDirectory()) {
                            return forEachCallback(null);
                        }
                        registerHelperFromFile(hbs, item,
                            function (err) {
                                forEachCallback(err);
                                if (idx === arr.length - 1) {
                                    hbs.logger.log(hbs.logger.INFO, 'scanned: helpers');
                                    resultCallback(err);
                                }
                            }
                        );
                    }
                );
            } else if (curr.nlink === 0) {
                // f was removed
                name = getName(f);
                hbs.registerHelper(name, dummyHelper);
                hbs.logger.log(hbs.logger.INFO, 'deleted: ' + f);
            } else {
                // f is a new file or f was changed
                registerHelperFromFile(hbs, f,
                    function (err) {
                        if (err) {
                            hbs.logger.log(hbs.logger.ERROR, err);
                        } else {
                            hbs.logger.log(hbs.logger.INFO, 'updated: ' + f);
                        }
                    }
                );
            }
        }
    );
}

function registerPartialFromFile(hbs, filepath, resultCallback) {
    var name = getName(filepath);
    asyncWaterfall(
        [
            function (waterfallCallback) {
                fs.readFile(filepath, 'utf8', waterfallCallback);
            },
            function (string, waterfallCallback) {
                hbs.registerPartial(name, string);
                waterfallCallback(null);
            }
        ],
        resultCallback
    );
}

function registerPartials(hbs, resultCallback) {
    var name;
    watch.watchTree(path.normalize(templatesPath + '/partials'),
        function (f, curr, prev) {
            if (typeof f === "object" && prev === null && curr === null) {
                // Finished walking the tree
                asyncForEach(Object.keys(f),
                    function (item, idx, arr) {
                        var forEachCallback = this.async();
                        if (fs.statSync(item).isDirectory()) {
                            return forEachCallback(null);
                        }
                        registerPartialFromFile(hbs, item,
                            function (err) {
                                forEachCallback(err);
                                if (idx === arr.length - 1) {
                                    hbs.logger.log(hbs.logger.INFO, 'scanned: partials');
                                    resultCallback(err);
                                }
                            }
                        );
                    }
                );
            } else if (curr.nlink === 0) {
                // f was removed
                name = getName(f);
                hbs.registerPartial(name, '');
                hbs.logger.log(hbs.logger.INFO, 'deleted: ' + f);
            } else {
                // f is a new file or f was changed
                registerPartialFromFile(hbs, f,
                    function (err) {
                        if (err) {
                            hbs.logger.log(hbs.logger.ERROR, err);
                        } else {
                            hbs.logger.log(hbs.logger.INFO, 'updated: ' + f);
                        }
                    }
                );
            }
        }
    );
}

function init(handlebars, resultCallback) {
    asyncWaterfall(
        [
            function (waterfallCallback) {
                registerHelpers(handlebars, waterfallCallback);
            },
            function (waterfallCallback) {
                registerPartials(handlebars, waterfallCallback);
            }
        ],
        resultCallback
    );
}

function render(handlebars, filepath, options, resultCallback) {
    asyncWaterfall(
        [
            function (waterfallCallback) {
                fs.readFile(filepath, 'utf8', waterfallCallback);
            },
            function (string, waterfallCallback) {
                waterfallCallback(null, handlebars.compile(string, options));
            },
            function (templFunc, waterfallCallback) {
                waterfallCallback(null, templFunc(options));
            }
        ],
        resultCallback
    );
}

exports.init = init;
exports.render = render;
