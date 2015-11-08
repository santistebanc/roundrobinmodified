'use strict';

var handlebars = require('handlebars'),
    handlebars = require('handlebars-layouts')(handlebars),
    asyncWaterfall = require('async-waterfall'),
    resources = require('./resources'),
    hbs = require('./hbs'),
    refresh = require('./refresh');

function enableLogging() {
    handlebars.logger.level = 0;
}

function init(resultCallback) {
    asyncWaterfall(
        [
            function (waterfallCallback) {
                hbs.init(handlebars, waterfallCallback);
            },
            function (waterfallCallback) {
                refresh.watchTemplates(waterfallCallback);
            },
            function (emitter, waterfallCallback) {
                handlebars.logger.log(handlebars.logger.INFO, 'scanned: templates');
                waterfallCallback(null, emitter);
            }
        ],
        resultCallback
    );
}

function renderFile(filepath, options, resultCallback) {
    hbs.render(handlebars, filepath, options, resultCallback);
}

// exports
exports.handlebars = handlebars;
exports.resources = resources;
exports.init = init;
exports.renderFile = renderFile;
exports.enableLogging = enableLogging;
