
/*jslint                */
/*global define, THREE, CANNON  */

define([
    "GraphicObject",
    "lib/three",
    "lib/cannon"

], function (GraphicObject) {
    "use strict";

    /**
     * The "Mock" object is actually a top border object.
     * @returns {_L9.Mock}
     */
    var Ball = function () {

        new GraphicObject(
            "ball",
            {
                properties: {
                    position: {
                        //The position of the mock
                        x: 0,
                        y: -800,
                        z: 0
                    }
                }
                
            }
        ).extend(this);

        this.idle           = true;
        this.scene          = null;
        this.idlePosition   = {x: 0, y: -800, z: 0};
        
        this.ballMaterial = new CANNON.Material();
        this.body = new CANNON.RigidBody(50, new CANNON.Sphere(25), this.ballMaterial);
        
        /*var that = this;
        window.setTimeout(function () {that.ballBody.velocity = new CANNON.Vec3(2500, 1500, 0);}, 1000);
        */
       
        this.body.position.copy(this.properties.position);//.x, this.ball.properties.position.y, this.ball.properties.position.z);
        

    };

    GraphicObject.prototype.extend(Ball);

    Ball.prototype.setScene = function (scene) {
        this.scene = scene;
        
        this.scene.world.add(this.body);
        
        this.scene.world.addContactMaterial(new CANNON.ContactMaterial(this.scene.getWorldDefaultMaterial(), this.ballMaterial, 0, 0.75));
    };

    /**
     * Override the create method of the GraphicObject class
     * @param {type} callback
     * @returns {undefined}
     */
    Ball.prototype.create = function (callback) {
        
        var light = new THREE.PointLight(0xffffff, 1, 400),
            mesh  = new THREE.Mesh(
                new THREE.SphereGeometry(25, 8, 8),
                new THREE.MeshBasicMaterial({color: 0xffffff})
            );
        
        callback(this, mesh);


    };

    /**
     * Set the position of the ball
     * @param {type} position
     * @returns {undefined}
     */
    Ball.prototype.setPosition = function (position) {
        this.properties.position = position;
        if (this.renderable) {
            this.renderable.position.set(position.x, position.y, position.z);
        }
        return;
        if (this.renderable && this.renderable.length > 0) {
            var i = 0;
            for (i; i < this.renderable.length; i++) {
                this.renderable[i].position.set(position.x, position.y, position.z);
            }
        }
    };

    Ball.prototype.frame = function () {
        if (this.idle && this.scene && this.scene.launcher) {
            
            var angle = this.scene.launcher.angle,
                delta = this.idlePosition.y - this.scene.launcher.properties.position.y,
                matrix = new THREE.Matrix3(
                    Math.cos(angle), -Math.sin(angle), 0,
                    Math.sin(angle), Math.cos(angle), 0,
                    0, 0, 1),
                position = new THREE.Vector3(0, delta, 0).applyMatrix3(matrix);

            position.add({
                x: this.scene.launcher.properties.position.x,
                y: this.idlePosition.y - delta,
                z: 0
            });
            
            this.setPosition(position);
        } else {
            this.body.position.copy(this.renderable.position);
            //this.body.position.copy(this.renderable[1].position);
        }
    };

    Ball.prototype.launch = function () {
        
        if (!this.idle) {
            return;
        }
        
        this.idle = false;
        
        this.body.position.set(this.renderable.position.x, this.renderable.position.y, 0);
        
        var angle = this.scene.launcher.angle,
            matrix = new THREE.Matrix3(
                Math.cos(angle), -Math.sin(angle), 0,
                Math.sin(angle), Math.cos(angle), 0,
                0, 0, 1),
            vector = new THREE.Vector3(0, 4000, 0).applyMatrix3(matrix);
        
        this.body.velocity = new CANNON.Vec3(vector.x, vector.y, 0);
        
    };

    return Ball;

});
