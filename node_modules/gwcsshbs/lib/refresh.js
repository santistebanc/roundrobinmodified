'use strict';

var path = require('path'),
    EventEmitter = require('events').EventEmitter,
    watch = require('watch');

var emitter, templatesPath = path.normalize(__dirname + '/../templates');

function watchTemplates(resultCallback) {
    watch.watchTree(templatesPath,
        function (f, curr, prev) {
            if (typeof f === "object" && prev === null && curr === null) {
                emitter = new EventEmitter();
                resultCallback(null, emitter);
            } else {
                setTimeout(
                    function () {
                        emitter.emit('refresh');
                    },
                    1000
                );
            }
        }
    );
}

exports.watchTemplates = watchTemplates;
