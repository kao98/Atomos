
/*jslint                                    */
/*global define, window, document, THREE    */

define([
//    "lib/Logger",
//    "GraphicObject",
    "lib/three"  //the 3d library

], function (/*Logger, GraphicObject*/) {
    "use strict";

    var GraphicsEngine = function () {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.gameScene = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this
            .initRenderer()
            .initScene()
            .initCamera();

        document.body.appendChild(this.renderer.domElement);

    };

    GraphicsEngine.prototype.initScene = function () {

        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AxisHelper(25));

        var ambientLight        = new THREE.AmbientLight(0x555555),
            directionalLight    = new THREE.DirectionalLight(0xff0000);

        directionalLight.position.set(-.1, .25, -1).normalize();

        this.scene.add(ambientLight);
        this.scene.add(directionalLight);

        this.scene.add(new THREE.DirectionalLightHelper(directionalLight, 2));

        this.scene.add(plane);

        return this;

    };

    GraphicsEngine.prototype.initCamera = function () {

        this.camera = new THREE.PerspectiveCamera(25, this.width / this.height, 1, 1000);

        this.camera.position.set(0, 25, 200);
        this.camera.lookAt(this.scene.position);
        this.scene.add(this.camera);

        return this;

    };

    GraphicsEngine.prototype.initRenderer = function () {

        this.renderer = new THREE.CanvasRenderer();
        this.renderer.setSize(this.width, this.height);

        return this;
    };

    GraphicsEngine.prototype.initGlobalLights = function () {

        var ambientLight        = new THREE.AmbientLight(0x555555),
            directionalLight    = new THREE.DirectionalLight(0xffffff);

        directionalLight.position.set(-0.5, 0.5, -1.5).normalize();

        this.globalLights.push(ambientLight);
        this.globalLights.push(directionalLight);

        return this;
    };

    GraphicsEngine.prototype.initGlobalObjects = function () {

        var plane,
            areaTop,
            areaLeft,
            areaRight,
            areaBottom;

        plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 50),
            new THREE.MeshLambertMaterial({color: 0x020d30, overdraw: true})
        );
//        plane.position.z = 100;
        plane.position.y = -15;
        //plane.rotation.x = Math.PI;

        this.globalObjects.push(plane);
//
this.globalObjects.push(new THREE.AxisHelper(25));


//
//        areaTop = new THREE.Mesh(
//            new THREE.CubeGeometry(480, 5, 10),
//            new THREE.MeshLambertMaterial({color: '#02300d', opacity: 1, transparent: false})
//        );
//        areaTop.position.z = 50;
//        areaTop.position.y = 10;
//
//        areaLeft = new THREE.Mesh(
//            new THREE.CubeGeometry(5, this.height - 20, 10),
//            new THREE.MeshLambertMaterial({color: '#02300d', opacity: 1, transparent: false})
//        );
//        areaLeft.position.z = 50;
//        areaLeft.position.x = -245;
//        areaLeft.position.y = this.height / 2 + 5;
//
//        areaRight = new THREE.Mesh(
//            new THREE.CubeGeometry(5, this.height - 20, 10),
//            new THREE.MeshLambertMaterial({color: '#02300d', opacity: 1, transparent: false})
//        );
//        areaRight.position.z = 50;
//        areaRight.position.x = 245;
//        areaRight.position.y = this.height / 2 + 5;
//
//        areaBottom = new THREE.Mesh(
//            new THREE.CubeGeometry(485, 5, 10),
//            new THREE.MeshLambertMaterial({color: '#300202', opacity: 1, transparent: false, emissive: '#330000'})
//        );
//        areaBottom.position.z = 50;
//        areaBottom.position.y = 640;
//
//        this.globalObjects.push(areaTop);
//        this.globalObjects.push(areaLeft);
//        this.globalObjects.push(areaRight);
//        this.globalObjects.push(areaBottom);

        return this;
    };

    GraphicsEngine.prototype.loadScene = function (scene) {
        this.gameScene = scene;
        this.loadComponents(this.gameScene.gameObjects);
    };

    GraphicsEngine.prototype.loadComponents = function (components) {

        var i = 0;
        for (i; i < components.length; i++) {
            if (components[i].components && components[i].components.length > 0) {
                this.loadComponents(components[i].components);
            } else {
                this.loadObject(components[i]);
            }
        }
    };

    GraphicsEngine.prototype.loadObject = function (object) {

        var renderable = new THREE.Mesh(
            new THREE.CubeGeometry(object.properties.width, object.properties.height, object.properties.depth),
            new THREE.MeshLambertMaterial({color: object.properties.color, opacity: 1, transparent: false })
        );
        renderable.position.x = object.properties.x;
        renderable.position.y = object.properties.y;
        renderable.position.z = 50;

        //this.scene.add(renderable);
        object.renderable = renderable;

//        switch (object.properties.type) {
//        case "plane":
//            var plane = new THREE.Mesh(
//                new THREE.PlaneGeometry(this.width, this.height, 1, 1),
//                new THREE.MeshLambertMaterial({color: object.properties.color, opacity: object.properties.opacity, transparent: true})
//            );
//            plane.position.z = object.properties.position.z;
//            plane.rotation.x = 180 * (Math.PI / 180);
//            this.scene.add(plane);
//
//            break;
//
//        case "mesh":
//            break;
//        }
    };

    GraphicsEngine.prototype.frame = function () {
//        if (this.gameScene === null) return;

        //this.globalObjects[0].rotation.x += 0.05;
        //this.plane.rotation.y += 0.2;

    //    this.plane.position.z += 0.5;
  //      this.camera.lookAt(this.plane.position);

//        console.log(this.plane.position);
        /*this.camera.position.x += 0.1;
        this.camera.position.y += 0.1;
        this.camera.position.z += 0.1;
        
        this.camera.lookAt(this.scene.position);*/
//
//        for (var i = 0; i < this.gameScene.gameObjects.length; i++) {
//            if (this.gameScene.gameObjects[i].renderable) {
//
//                this.gameScene.gameObjects[i].renderable.position.x = this.gameScene.gameObjects[i].properties.desiredX;
//            }
//        }

        this.renderer.render(this.scene, this.camera);
    };

    return GraphicsEngine;

});
