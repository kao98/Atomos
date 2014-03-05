
/*jslint                        */
/*global define, document, _LI, _LD  */

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
        this.firstBallCollision = false;
        this.launchStep = 0;

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
                    if (that.scene.ball.idle) {
                        that.launchStep++;
                    }
                }
                if (that.launchStep >= 2) { //event.which && event.which === 3) {
                    that.scene.ball.launch();
                    that.scene.launcher.lookAt();
                    that.launchStep = 0;
                    window.setTimeout(function () {
                        that.scene.moveLauncher(event.clientX);
                    }, 120);
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

        var that = this,
            onBallCollide = function (event) {
                if (event.with.mesh && event.with.mesh.type === 'launcher') {
                    if (that.firstBallCollision) {
                        that.scene.ball.moveToLauncher();
                    } else {
                        that.firstBallCollision = true;
                    }
                }
            };
            
        this.scene.ball.body.addEventListener('collide', onBallCollide);

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
        if (this.launchStep === 1) {
            this.scene.rotateLauncher(event.clientX, event.clientY);
        }
        if (this.launchStep < 1 || this.launchStep > 2 || !this.scene.ball.idle) {// !this.buttonDown || !this.scene.ball.idle) {
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
