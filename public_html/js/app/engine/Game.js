
/*jslint                        */
/*global define, document, _LI  */

define([
    "lib/Logger"

], function () {
    "use strict";

    /**
     * The GameEngine constructor
     * @returns {_L8.GameEngine}
     */
    var GameEngine = function () {
        
        _LI("==> Initializing the game engine");
        
        this.scene      = null;
        this.buttonDown = false;
        this.tick       = new Date().getTime();

        this.listenEvents();
  
        _LI("<== Game engine initialized.");
  
    };

    /**
     * Set the appropriate event listeners
     * @returns {undefined}
     */
    GameEngine.prototype.listenEvents = function () {
        
        var that = this,
            onMouseMove = function (event) {
                that.onMouseMove(event);
            },
        
            onMouseDown = function (event) {
                if (event.which && event.which === 1) {
                    //The left mouse button is pressed
                    that.buttonDown = true;
                    onMouseMove.apply(that, [event]);
                }
            },
            
            onMouseUp = function (event) {
                if (event.which && event.which === 1) {
                    that.buttonDown = false;
                }
            };
      
        document.addEventListener('mousedown',  onMouseDown);
        document.addEventListener('mouseup',    onMouseUp);
        document.addEventListener('mousemove',  onMouseMove);      
        
    };

    /**
     * Set the curent scene
     * @param {type} scene
     * @returns {undefined}
     */
    GameEngine.prototype.setScene = function (scene) {

        this.scene = scene;

    };

    /**
     * The mouseMove event handler
     * @param {type} event
     * @returns {undefined}
     */
    GameEngine.prototype.onMouseMove = function (event) {
        
        event.preventDefault();
        
        if (this.scene === null) {
            return;
        }
        
        if (this.buttonDown) {
            this.scene.moveLauncher(event.clientX);     
        }
        this.scene.rotateLauncher(event.clientX, event.clientY);
    };

    /**
     * The frame method! :p
     * @returns {undefined}
     */
    GameEngine.prototype.frame = function () {
        
        if (this.scene === null) {
            return;
        }
        
        var curTick = new Date().getTime();
        
        this.scene.frame(this.tick);

        this.tick = curTick;
    };

    return GameEngine;

});
