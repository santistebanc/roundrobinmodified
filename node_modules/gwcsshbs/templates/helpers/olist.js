'use strict';

module.exports = function (items) {
    var result = '<ol class="list">';
    items.forEach(function (ele) {
        result += ('<li>' + ele + '</li>');
    });
    result += '</ol>';
    return result;
};