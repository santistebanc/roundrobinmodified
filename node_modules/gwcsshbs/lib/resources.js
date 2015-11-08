'use strict';

var path = require('path');

var gwcssPath = path.normalize(__dirname + '/../node_modules/GroundworkCSS');

module.exports = function (express) {
    var app = express();
    'js css fonts docs images'.split(/\s+/).forEach(
        function (dir) {
            var mount = '/' + dir;
            app.use(mount, express.static(path.normalize(gwcssPath + mount)));
        }
    );
    return app;
};
