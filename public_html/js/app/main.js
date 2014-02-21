
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
    "Atomos",           //The main game class, as G1
    "conf/config",  //The global configuration, as config
    "lib/Logger"    //The Looger, as Logger.

], function (Atomos, config) {
    "use strict";

    _LI("==> WELCOME to Atomos! <==");
    _LD("    Atomos configuration: ", config);
    
    if (config.devMode) {
        _LD("    /!\\ DEVMODE Activated /!\\");
    }

    var theGame = new Atomos();

    _LI("==> Atomos is ready. Enjoy! ;) <==");

    theGame.loop();

});
