'use strict';

module.exports = function (items) {
    var result = '<ul class="list">';
    items.forEach(function (ele) {
        result += ('<li>' + ele + '</li>');
    });
    result += '</ul>';
    return result;
};