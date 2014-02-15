
/*jslint           */
/*global requirejs */

// Main require.js configuration
requirejs.config({

    //By default load any module IDs from js/app
    baseUrl: 'js/app',

    //except, if the module ID starts with "lib",
    //load it from the js/lib directory.
    paths: {
        lib:    '../libs',
        conf:   '../config',
        config: '../config'
    }
});

// Start the main app logic.
requirejs([
    "G1",           //The main game class, as G1
    "conf/config",  //The global configuration, as config
    "lib/Logger"    //The Looger, as Logger.

], function (G1, config, Logger) {
    "use strict";

    Logger.info("Main initialization...");
    Logger.debug("Global configuration: ", config);

    var theGame = new G1();

    Logger.info("...Initialization over. Start looping...");

    theGame.loop();

});
