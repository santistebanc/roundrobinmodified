'use strict';

module.exports = function (collection, separator) {
    var result = '';
    separator = (typeof separator === 'string') ? separator : ' ';
    if (collection.join) {
        return collection.join(separator);
    }
    for (var property in collection) {
        if (collection.hasOwnProperty(property)) {
            result += collection[property] + separator;
        }
    }
    return result.slice(0, -separator.length);
};