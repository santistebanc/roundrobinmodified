'use strict';

var indent = '\n                ';

function menubarHelper(array, menu) {
    var idx;
    for(idx=0; idx<array.length; idx++) {
        if(array[idx].submenu) {
            menu += ('<li role="menu">' + indent + '<button');
            if(array[idx].title) {
                menu += (' title="' + array[idx].title + '"');
            }
            menu += ('>' + array[idx].name + '</button>' + indent);
            menu += ('<ul>\n' + menubarHelper(array[idx].submenu, indent) + indent + '</ul>' + indent);
        } else {
            menu += ('<li><a href="' + array[idx].href + '"');
            if(array[idx].title) {
                menu += (' title="' + array[idx].title + '"');
            }
            menu += '>';
            if(array[idx].icon) {
                menu += ('<i class="' + array[idx].icon + '"></i>');
            }
            menu += (array[idx].name + '</a></li>' + indent);
        }
    }
    return menu;
}

function menubar (array) {
    return menubarHelper(array, indent);
}

module.exports = menubar;