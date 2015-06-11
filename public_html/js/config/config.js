
/*jslint        */
/*global define */

define(function () {
    "use strict";

    return {
        devMode         : true,
        insaneDevMode   : false,
        log: {
            active      : true,
            level       : "all"
        },
        options: {
            graphics: {
                renderer: "WebGL",
                glowEffect: true
            }
        }
    };

});
