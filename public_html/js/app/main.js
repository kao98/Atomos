
/*jslint                     */
/*global requirejs, _LI, _LD */

// Main require.js configuration
requirejs.config({

    //By default load any module IDs from js/app
    baseUrl: 'js/app',

    shim: {
        'three': {
            exports: 'THREE'
        },
        'threeStats': {
            deps: ['three'],
            exports: 'Stats'
        },
        'TrackballControls': {
            deps: ['three'],
            exports: 'THREE.TrackballControls'
        },
        'ShaderExtras': {
            deps: ['three']
        },
        'BloomPass': {
            deps: ['three']
        },
        'EffectComposer': {
            deps: ['three']
        },
        'MaskPass': {
            deps: ['three']
        },
        'RenderPass': {
            deps: ['three']
        },
        'SavePass': {
            deps: ['three']
        },
        'ShaderPass': {
            deps: ['three']
        }
    },

    //except, if the module ID starts with "lib",
    //load it from the js/lib directory.
    paths: {
        lib:                '../libs',
        conf:               '../config',
        config:             '../config',
        assets:             '../../assets',
        three:              '../libs/three',
        threeStats:         '../libs/threeStats',
        TrackballControls:  '../libs/TrackballControls',
        ShaderExtras:       '../libs/ShaderExtras',
        BloomPass:          '../libs/postprocessing/BloomPass',
        EffectComposer:     '../libs/postprocessing/EffectComposer',
        MaskPass:           '../libs/postprocessing/MaskPass',
        RenderPass:         '../libs/postprocessing/RenderPass',
        SavePass:           '../libs/postprocessing/SavePass',
        ShaderPass:         '../libs/postprocessing/ShaderPass'
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
