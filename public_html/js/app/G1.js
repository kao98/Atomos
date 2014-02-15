
/*jslint                */
/*global define, window, Stats */

define([
    "lib/Logger",       //The global Logger, as Logger
    "engine/Game",      //The game engine, as GameEngine
    "engine/Graphics",  //The graphics engine
    "engine/Audio",     //The audio engine
    "Scene",            //The game Scene
    "lib/threeStats"    //To have the fpsMeter. Set the window.Stats global.

], function (Logger, GameEngine, GraphicsEngine, AudioEngine, Scene) {
    "use strict";

    var G1 = function () {

        Logger.info("Initialization of the Game");
        this.shouldStop     = false;
        this.currentLevel   = 0;

        // ** Initialization of the stats module ** //
        this.stats = new Stats(); //default mode: fps

        // Align top-left
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';

        // Add it to the DOM
        window.document.body.appendChild(this.stats.domElement);

        // ** We prepare our global Scene object. ** //
        this.scene      = new Scene();

        // ** Construction of our engines ** //
        this.game       = new GameEngine();
        this.graphics   = new GraphicsEngine();
        this.audio      = new AudioEngine();

        // ** We can finaly load our first level ** //
        this.loadLevel();

        Logger.info("Game initialized.");
    };

    G1.prototype = {

        loadLevel: function (levelNumber) {
            if (levelNumber !== undefined) {
                this.currentLevel = levelNumber;
            }

            this.scene.load(this.currentLevel);
            this.graphics.loadScene(this.scene);
            this.game.setScene(this.scene);
        },

        loop: function () {

            if (!window.requestAnimationFrame) {
                Logger.alert(
                    "Unable to load the game. Try with a newer firefox version.",
                    "window.requestAnimationFrame unavailable :/"
                );

                return;
            }

            Logger.log("Looping...");

            var that = this,
                frame = function () {
                    that.stats.begin();
                    that.game.frame();
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

        },

        gameOver: function () {
            Logger.info("The game is over...");
        }
    };

    return G1;
});
