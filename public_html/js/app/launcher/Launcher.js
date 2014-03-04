
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
    var Launcher = function (scene) {

        new GraphicObject(
            "launcher",
            {
                properties: {
                    //The initial position of the launcher
                    position: {
                        x: 0,
                        y: -900,
                        z: 0
                    },
                    bounds: {
                        left: 0,
                        right: 0
                    },
                    geometry: {
                        w: 150,
                        h: 250,
                        d: 150
                    }
                }
                
            }
        ).extend(this);

        this.desiredScreenPosition  = null;     //Used by the controls helper
        this.desiredWorldPosition   = {x: 0};   //setted by the controls helper
        this.lookAtPosition         = {x: 0, y: 0}; //used by the controls helper
        this.tween                  = null;     //The animation object for the animation engine
        this.angle                  = 0;
        this.gMesh                  = null;
        this.scene                  = scene;
        this.needRazRotation        = false;

    };

    GraphicObject.prototype.extend(Launcher);

    /**
     * Move the launcher (meshes and lights) to the desired position
     * @param {type} position
     * @returns {undefined}
     */
    Launcher.prototype.move = function (position) {
        
        this.properties.position = position;
        
        if (this.renderable/* && this.renderable.length > 0*/) {
            this.renderable.position.x = position.x;
            /*var i;
            for (i = 0; i < this.renderable.length ; i++) {
                //We don't wan't the lightTarget to move
                this.renderable[i].position.x = position.x;/*set(
                    position.x,
                    position.y,
                    position.z
                );
            }*/
            this.gMesh.position = this.renderable.position;
        }
        
    };

    /**
     * Override of the "create" GraphicObject method to create the launcher renderable object
     * @param {type} callback
     * @returns {undefined}
     */
    Launcher.prototype.create = function (callback) {
        
        var that        = this,
            light       = new THREE.SpotLight(0xffffff),
            lightTarget = new THREE.Object3D();
        /*
        light.shadowCameraVisible = false;
        light.shadowDarkness    = 0.70;
        light.intensity         = 1;
        light.castShadow        = true;
        light.position.set(this.properties.position.x, this.properties.position.y + 130, this.properties.position.z);
        */
        /*
        light2.shadowCameraVisible = false;
        light2.shadowDarkness    = 0.70;
        light2.intensity         = 1;
        light2.castShadow        = true;
        light2.position.set(this.properties.position.x, this.properties.position.y - 800, this.properties.position.z + 200);
        */
        
        //lightTarget.position.set(0, 5000, 0);
        
        //light.target = lightTarget;
        //light2.target = lightTarget;
        
        this.loadJSONMesh("assets/launcher/launcher.js", function (mesh) {
            
            var gMap    = THREE.ImageUtils.loadTexture("assets/launcher/lanceur_selfillumination.jpg"),
                gMat    = new THREE.MeshPhongMaterial({map: gMap, ambient: 0xffffff, color: 0x000000});
            
            that.gMesh   = new THREE.Mesh(mesh.geometry, gMat);
            
            that.gMesh.overdraw = true;
            that.gMesh.scale    = mesh.scale;
            console.log("gmesh !!???", mesh);

            that.move(that.properties.position);
            mesh.position.y = that.properties.position.y;
            that.gMesh.position = mesh.position;
            
            console.log(that);
            
            callback(that, mesh, that.gMesh); //that.gMesh);
        });

    };

    /**
     * Set the desired angle of the launcher
     * @param {type} position
     * @returns {undefined}
     */
    Launcher.prototype.lookAt = function (position) {
        
        if (!this.renderable/* || !this.renderable[0]*/) {
            return;
        }
        
        var angle = 0.0;
        
        if (this.scene.ball.idle && !this.isMoving) {

            angle = Math.atan((position.x - this.properties.position.x) / (position.y - this.properties.position.y));

            angle *= 4;

            if (angle > 0) {
                angle = Math.min(angle, 0.75);
            } else {
                angle = Math.max(angle, -0.75);
            }

        
            var qa = new THREE.Quaternion().setFromAxisAngle({x: 0, y: 1, z: 0}, this.renderable.rotation.y);
            var qb = new THREE.Quaternion().setFromAxisAngle({x: 0, y: 0, z: 1}, angle);
            var qm = new THREE.Quaternion().multiplyQuaternions(qb, qa);
            this.angle = angle;
            this.renderable.rotation.setFromQuaternion(qm);// .z = Math.atan((position.y - this.renderable.position.y) / (position.x - this.renderable.position.x));
            this.gMesh.rotation.setFromQuaternion(qm);
            
            this.needRazRotation = true;
            
            //this.gMesh.rotation = this.renderable.rotation;
            //console.log(this.renderable, this.gMesh);
        } else if (this.needRazRotation && !this.isMoving) {
            var that = this;
            this.tween2 = 
                new TWEEN.Tween({x: this.renderable.rotation.x, y: this.renderable.rotation.y, z: this.renderable.rotation.z})
                    .easing(TWEEN.Easing.Circular.InOut)
                    .to({x: 0, y: this.renderable.rotation.y, z: 0}, 200)
                    .onUpdate(function () {
                        that.renderable.rotation.x = this.x;
                        that.renderable.rotation.z = this.z;
                        that.gMesh.rotation.x = this.x;
                        that.gMesh.rotation.z = this.z;
                    })
                    .start();
            
            this.needRazRotation = false;
        }
    };

    /**
     * Set the desired coordinates of the launcher in the world scale
     * @param {type} position
     * @returns {undefined}
     */
    Launcher.prototype.setDesiredWorldPosition = function (position) {
                
        if (!this.renderable/* || !this.renderable[0]*/) {
            return;
        }
        
        position.x = Math.max(position.x, this.properties.bounds.left + this.properties.geometry.w / 2);
        position.x = Math.min(position.x, this.properties.bounds.right - this.properties.geometry.w / 2);
                
        var that        = this,
            distance    = position.x - this.properties.position.x;
               
        
        if (this.tween !== null) {
            this.tween.stop();
            this.tween = 
                new TWEEN.Tween({x: this.properties.position.x, y: this.renderable.rotation.y})
                    .easing(TWEEN.Easing.Circular.Out);
        } else {
            this.tween = new TWEEN.Tween({x: this.properties.position.x, y: this.renderable.rotation.y})
                .easing(TWEEN.Easing.Circular.InOut);
        
                this.renderable.rotation.z = 0;
                this.gMesh.rotation.z = 0;
                this.angle = 0;
        }
        this.isMoving = true;
        this.tween
            .to({x: position.x, y: that.renderable.rotation.y + distance / 75}, Math.max(Math.abs(distance / 8), 150))
            .onComplete(function () {
                that.isMoving = false;
                that.tween = null;
            })
            .onUpdate(function () {
                
                //var q = new THREE.Quaternion().setFromAxisAngle({x: 0, y: 1, z: 0}, this.y);
                that.move({x: this.x, y: that.properties.position.y, z: 0});// renderable[0].position.x = this.x;
                that.renderable.rotation.y = this.y;
                that.gMesh.rotation.y = this.y;
//
//                var q2 = new THREE.Quaternion().setFromAxisAngle({x: 0, y: 0, z: 1}, that.angle);
//                q2.slerp(q, 0.5);
//                
//                that.renderable[1].rotation.setFromQuaternion(q2);

                //that.renderable[1].position.x = this.x;
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
