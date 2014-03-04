
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
                event.preventDefault();
                event.stopPropagation();
                that.onMouseMove(event);
            },
        
            onMouseDown = function (event) {
                event.preventDefault();
                event.stopPropagation();
                if (event.which && event.which === 1) {
                    //The left mouse button is pressed
                    that.buttonDown = true;
                    onMouseMove.apply(that, [event]);
                }
            },
            
            onMouseUp = function (event) {
                event.preventDefault();
                event.stopPropagation();
                if (event.which && event.which === 1) {
                    that.buttonDown = false;
                //}
                //if (event.which && event.which === 3) {
                    that.scene.ball.launch();
                    that.scene.launcher.lookAt();
                    window.setTimeout(function () {
                        that.scene.moveLauncher(event.clientX);
                    }, 200);
                }
            };
      
        document.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
      
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
        
        if (this.scene === null) {
            return;
        }
        
        //if (this.buttonDown) {
        
        //}
        if (this.buttonDown) {
            this.scene.rotateLauncher(event.clientX, event.clientY);
        }
        if (!this.buttonDown || !this.scene.ball.idle) {
            this.scene.moveLauncher(event.clientX);     
        }
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
        
        this.scene.frame(curTick, this.tick);

        this.tick = curTick;
    };

    return GameEngine;

});
