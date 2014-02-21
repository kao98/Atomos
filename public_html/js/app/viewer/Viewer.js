
/*jslint                                            */
/*global define, window, Stats, LOGGER, _LI, _LD    */

define([
    "engine/Graphics",  //The graphics engine
    "engine/Audio",     //The audio engine
    "Scene",            //The game Scene
    "viewer/config",
    "lib/threeStats",   //To have the fpsMeter. Set the window.Stats global.
    "lib/Logger"        //The global Logger, as Logger

], function (GraphicsEngine, AudioEngine, Scene, config) {
    "use strict";

    /**
     * Atomos constructor.
     * Atomos is the main game class.
     * @returns {_L14.Atomos}
     */
    var Atomos = function () {

        _LI("==> Initializing the Atomos game");
        _LD("    Atomos configuration: ", config);
        this.shouldStop     = false;    //Tells when we should stop the game
        this.currentLevel   = 0;        //The curent level
        this.stats          = {begin: function () { return null; }, end: function () { return null; }};

        if (config.devMode) {
            // ** Initialization of the stats module ** //
            this.stats = new Stats(); //default mode: fps

            // Align top-left
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';

            // Add it to the DOM
            window.document.body.appendChild(this.stats.domElement);

        }

        // ** We prepare our global Scene object. ** //
        this.scene      = new Scene();

        // ** Construction of our engines ** //
        config.options.graphics.trackball = true;
        this.graphics   = new GraphicsEngine(config.options.graphics);
        this.audio      = new AudioEngine();

        // ** We can finaly load our first level ** //
        this.loadLevel();

        _LI("<== Atomos initialized.");
    };

    Atomos.prototype = {

        /**
         * Load the given level
         * @param {type} levelNumber
         * @returns {undefined}
         */
        loadLevel: function (levelNumber) {
            
            _LI("    >Atomos::loadLevel: " + levelNumber !== undefined ? levelNumber : this.levelNumber);
            
            if (levelNumber !== undefined) {
                this.currentLevel = levelNumber;
            }

            this.scene.load(this.currentLevel);
            this.graphics.loadScene(this.scene);
            
            _LI("    <Atomos::loadLevel");
        },

        /**
         * The main game loop!
         * @returns {undefined}
         */
        loop: function () {

            _LI(" == Atomos::loop: initialization == ");

            if (!window.requestAnimationFrame) {
                LOGGER.alert(
                    "Unable to load the game. Try with a newer firefox version.",
                    "window.requestAnimationFrame unavailable :/"
                );

                return;
            }

            var that = this,
                frame = function () {
                    that.stats.begin();
                    that.graphics.frame();
                    //that.audio.frame();

                    if (!that.shouldStop) {
                        window.requestAnimationFrame(frame);
                    } else {
                        that.gameOver();
                    }
                    that.stats.end();
                };

            frame();

            _LI(" == Atomos::loop initialized == ");

        },

        /**
         * The method to cleanly over the game
         * @returns {undefined}
         */
        gameOver: function () {
            _LI("    >Atomos::gameOver<");
        }
    };

    return Atomos;
});
