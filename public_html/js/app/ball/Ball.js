
/*jslint                */
/*global define, THREE, CANNON, TWEEN  */

define([
    "GraphicObject",
    "lib/tween.min",
    "lib/three",
    "lib/cannon"

], function (GraphicObject, t, t2, CANNON) {
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

        var ballShader = {
                uniforms: {
                },

                vertexShader: [
                    "varying vec2 pos;",
                    "void main() {",
                        //"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                        "vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
                        "pos = (projectionMatrix * mvPosition).xy;",
                        "gl_PointSize = 50000.0 * (500.0 / length(mvPosition.xyz));",
                        "gl_Position = projectionMatrix * mvPosition;",
                    "}"
                ].join("\n"),

                fragmentShader: [
                    "varying vec2 pos;",
                    "void main() {",
                        
                        "vec2 position = gl_PointCoord - vec2(0.5, 0.5);",
                        "vec3 light_color = vec3(0.5, 0.25, 0.125);",
                        "float c = 0.005/length(position);",
                        "gl_FragColor = vec4(vec3(c) * light_color, 1.5) ;",
                    "}"
                ].join("\n")
            };


        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  
        var light = new THREE.PointLight(0x7f3f1f, 2, 800),
            mesh = new THREE.ParticleSystem(geometry, 
                new THREE.ShaderMaterial({uniforms: ballShader.uniforms, vertexShader: ballShader.vertexShader, fragmentShader: ballShader.fragmentShader, blending: THREE.AdditiveBlending, transparent: true})
            );
        
        //var light = new THREE.PointLight(0xffffff, 1, 400),
        //    mesh  = new THREE.Mesh(
        //        new THREE.SphereGeometry(1, 1, 1),
        //        geometry,
                //new THREE.ShaderMaterial({uniforms: ballShader.uniforms, vertexShader: ballShader.vertexShader, fragmentShader: ballShader.fragmentShader/*, blending: THREE.AdditiveBlending, transparent: true*/})
                
                //new THREE.MeshBasicMaterial({color: 0xffffff})
//            );
        
        callback(this, [light, mesh]);


    };

    /**
     * Set the position of the ball
     * @param {type} position
     * @returns {undefined}
     */
    Ball.prototype.setPosition = function (position) {
        this.properties.position = position;
        /*if (this.renderable) {
            this.renderable.position.set(position.x, position.y, position.z);
        }
        return;*/
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
            //this.body.position.copy(this.renderable.position);
            this.body.position.copy(this.renderable[0].position);
            this.body.position.copy(this.renderable[1].position);
        }
        this.properties.position = this.renderable[1].position;
    };

    Ball.prototype.launch = function () {
        
        if (!this.idle) {
            return;
        }
        
        this.idle = false;
        
        this.body.position.set(this.renderable[1].position.x, this.renderable[1].position.y, 0);
        
        var angle = this.scene.launcher.angle,
            matrix = new THREE.Matrix3(
                Math.cos(angle), -Math.sin(angle), 0,
                Math.sin(angle), Math.cos(angle), 0,
                0, 0, 1),
            vector = new THREE.Vector3(0, 3000, 0).applyMatrix3(matrix);
        
        this.body.velocity = new CANNON.Vec3(vector.x, vector.y, 0);
        
    };

    Ball.prototype.moveToLauncher = function () {
        this.idle = true;
        
        var that = this,
            initialLauncherPosition = this.scene.launcher.properties.position,
            xFactor = Math.random() > 0.5 ? 1 : -1;
    
        if (this.scene.launcher.properties.position.x > 400) {
            xFactor = -1;
        } else if (this.scene.launcher.properties.position.x < -400) {
            xFactor = 1;
        }
        
        new TWEEN.Tween({x: this.properties.position.x, y: this.properties.position.y, z: this.properties.position.z})
            .to({
                x: [
                    this.properties.position.x,
                    this.scene.launcher.properties.position.x,
                    this.scene.launcher.properties.position.x + (200 * xFactor),
                    this.scene.launcher.properties.position.x,
                    this.scene.launcher.properties.position.x
                ], 
                y: [
                    this.properties.position.y,
                    -1000,
                    -1000,
                    -1000,
                    -800
                ], 
                z: [
                    0,
                    200, 
                    0,
                    -200, 
                    0
                ]
            }, 500)
            .onUpdate(function () {
                var launcherPosition = that.scene.launcher.properties.position;
                that.setPosition({x: this.x + launcherPosition.x - initialLauncherPosition.x, y: this.y, z: this.z});
            })
            .onComplete(function () {
                that.setPosition({x: that.scene.launcher.properties.position.x, y: -800, z: 0});
            })
            .interpolation(TWEEN.Interpolation.Bezier)
            .easing(TWEEN.Easing.Circular.Out)
            .start();
        
    };

    return Ball;

});
