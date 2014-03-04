
/*jslint        */
/*global define */

define(function () {
    "use strict";

    return {
        devMode         : true,
        insaneDevMode   : true,
        log: {
            active      : true,
            level       : "all"
        },
        options: {
            graphics: {
                renderer: "WebGL"
            }
        }
    };

});
