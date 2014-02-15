
/*jslint        */
/*global define, document */

define([
    "lib/Logger"

], function (Logger) {
    "use strict";

    var GameEngine = function () {
        this.scene = null;
        this.buttonDown = false;
        this.tick = new Date().getTime();

        var that = this;

        document.addEventListener('mousedown', function (e) {if (e.which && e.which == 1) {that.buttonDown = true; that.onMouseMove.apply(that, [e]);}});
        document.addEventListener('mouseup', function (e) {if (e.which && e.which == 1) that.buttonDown = false;that.scene.gameObjects[0].curentSpeed = 0;})
        document.addEventListener('mousemove', function (e) {that.onMouseMove.apply(that, [e]);})
    };

    GameEngine.prototype.setScene = function (scene) {

        this.scene = scene;

    };

    GameEngine.prototype.onMouseMove = function (e) {
        
        if (this.scene === null) return;
        
        if (this.buttonDown) {
            if (e.clientX > (window.innerWidth / 2) - 240 && e.clientX < (window.innerWidth / 2) + 240) {
                if (e.clientY > 620) {
                    this.scene.gameObjects[0].desiredX = e.clientX - (window.innerWidth / 2);
                }
            }                
        } 
    };

    GameEngine.prototype.frame = function () {
        if (this.scene === null) return;
        
        var curTick = new Date().getTime();
        
        this.scene.gameObjects[0].frame(this.tick);
//        
//        var dist = this.scene.gameObjects[0].properties.desiredX - this.scene.gameObjects[0].renderable.position.x;
//        
//        if (Math.abs(dist) > 2) {
//
//            var duration = curTick - this.tick;
//            var sens = dist > 0 ? 1 : -1;
//            var accell = this.scene.gameObjects[0].properties.accelleration / 1000;
//
//            var curentSpeed = this.scene.gameObjects[0].properties.curentSpeed / 1000;
//            var maximumSpeed = this.scene.gameObjects[0].properties.maximumSpeed / 1000;
//
//            var speed;
//            if (Math.abs(dist) > 75) {
//                speed = Math.min((curentSpeed + (accell * duration)), maximumSpeed);
//                dist = Math.min(speed * duration, Math.abs(dist));
//            } else {
//                speed = Math.min((curentSpeed + (-accell * duration)), maximumSpeed);
//                dist = Math.min(Math.abs(speed * duration), Math.abs(dist));
//            }
//            
//            this.scene.gameObjects[0].properties.curentSpeed = speed * 1000;
//            //this.scene.gameObjects[0].properties.curentSpeed = (this.scene.gameObjects[0].properties.curentSpeed + (accell * duration)) * 1000;
//            //speed = Math.min(this.scene.gameObjects[0].properties.curentSpeed, this.scene.gameObjects[0].properties.maximumSpeed) / 1000;
//            
//
//    //        console.log(dist, duration);
//
//            this.scene.gameObjects[0].renderable.position.x += (dist * sens);
//        } else {
//            this.scene.gameObjects[0].properties.curentSpeed = 0;
//        }
        this.tick = curTick;
    };

    return GameEngine;

});
