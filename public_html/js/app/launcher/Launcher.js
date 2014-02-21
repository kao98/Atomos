
/*jslint                        */
/*global define, THREE, TWEEN   */

define([
    "GraphicObject",
    "lib/tween.min",
    "lib/three"

], function (GraphicObject) {
    "use strict";

    /**
     * The launcher game object
     * @returns {_L10.Launcher}
     */
    var Launcher = function () {

        new GraphicObject(
            "launcher",
            {
                properties: {
                    //The initial position of the launcher
                    position: {
                        x: 0,
                        y: -900,
                        z: 0
                    }
                }
                
            }
        ).extend(this);

        this.desiredScreenPosition  = null;     //Used by the controls helper
        this.desiredWorldPosition   = {x: 0};   //setted by the controls helper
        this.lookAtPosition         = {x: 0, y: 0}; //used by the controls helper
        this.tween                  = null;     //The animation object for the animation engine

    };

    GraphicObject.prototype.extend(Launcher);

    /**
     * Override of the "create" GraphicObject method to create the launcher renderable object
     * @param {type} callback
     * @returns {undefined}
     */
    Launcher.prototype.create = function (callback) {
        
        var that = this;
        
        this.loadJSONMesh("assets/launcher/launcher.js", function (mesh) {
            mesh.position.set(that.properties.position.x, that.properties.position.y, that.properties.position.z);
            callback(that, mesh);
        });

    };

    /**
     * Set the desired angle of the launcher
     * @param {type} position
     * @returns {undefined}
     */
    Launcher.prototype.lookAt = function (position) {
//        
//        if (!this.renderable) return;
//        
//        var q = new THREE.Quaternion().setFromAxisAngle({x: 0, y: 0, z: 1}, -Math.atan((position.x - this.renderable.position.x) / (position.y - this.renderable.position.y)));
//        
//        this.renderable.rotation.setFromQuaternion(q);// .z = Math.atan((position.y - this.renderable.position.y) / (position.x - this.renderable.position.x));
        //console.log(Math.PI / 4, Math.atan((position.y - this.renderable.position.y) / (position.x - this.renderable.position.x)));
    };

    /**
     * Set the desired coordinates of the launcher in the world scale
     * @param {type} position
     * @returns {undefined}
     */
    Launcher.prototype.setDesiredWorldPosition = function (position) {
        
        if (!this.renderable) {
            return;
        }
        
        var that        = this,
            distance    = position.x - this.renderable.position.x;
        
        
        if (this.tween !== null) {
            this.tween.stop();
            this.tween = new TWEEN.Tween({x: this.renderable.position.x, y: this.renderable.rotation.y})
                .easing(TWEEN.Easing.Circular.Out);
        } else {
            this.tween = new TWEEN.Tween({x: this.renderable.position.x, y: this.renderable.rotation.y})
                .easing(TWEEN.Easing.Circular.InOut);
        }
        
        this.tween
            .to({x: position.x, y: that.renderable.rotation.y + distance / 75}, Math.max(Math.abs(distance / 8), 75))
            .onUpdate(function () {
                
//                var q = new THREE.Quaternion().setFromAxisAngle({x: 0, y: 1, z: 0}, this.y);
                
                that.renderable.position.x = this.x;
                that.renderable.rotation.y = this.y;
            })
            .start();
        
    };

    /**
     * The "frame" method of the launcher
     * Refresh the position of the launcher
     * @returns {undefined}
     */
    Launcher.prototype.frame = function () {
        
        TWEEN.update();
        
    };

    return Launcher;

});
