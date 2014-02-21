
/*jslint                     */
/*global requirejs, _LI, _LD */

// Main require.js configuration
requirejs.config({

    //By default load any module IDs from js/app
    baseUrl: 'js/app',

    //except, if the module ID starts with "lib",
    //load it from the js/lib directory.
    paths: {
        lib:    '../libs',
        conf:   '../config',
        config: '../config',
        assets: '../../assets'
    }
});

// Start the main app logic.
requirejs([
    "viewer/Viewer",           //The main game class, as G1
    "viewer/config",  //The global configuration, as config
    "lib/Logger"    //The Looger, as Logger.

], function (Viewer, config) {
    "use strict";

    _LI("==> WELCOME to Atomos! <==");
    _LD("    Atomos configuration: ", config);
    
    if (config.devMode) {
        _LD("    /!\\ DEVMODE Activated /!\\");
    }

    var viewer = new Viewer();

    _LI("==> Atomos is ready. Enjoy! ;) <==");

    viewer.loop();

});
