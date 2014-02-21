
/*jslint        */
/*global define, XMLHttpRequest, THREE */

define([
    "lib/Logger",
    "GraphicObject",
    "Light",
    "launcher/Launcher",
    "misc/Mock",
    "lib/three"

], function (Logger, GraphicObject, Light, Launcher, Mock) {
    "use strict";

    var Scene = function () {
        this.gameObjects = [];
        this.launcher = null;
        this.ball = null;
        this.borders = null;
        this.moveLauncherTo = null;
    };

    Scene.prototype.loadLevel = function (levelData) {

        var graphic,
            graphicIndex;

        Logger.debug("..level data: ", levelData);

        for (graphicIndex = 0; graphicIndex < levelData.graphics.length; graphicIndex++) {
            for (graphic in levelData.graphics[graphicIndex]) { if (levelData.graphics[graphicIndex].hasOwnProperty(graphic)) {
                this.gameObjects.push(new GraphicObject(graphic, levelData.graphics[graphicIndex][graphic]));
            } }
        }

    };

    Scene.prototype.moveLauncher = function (x) {
        x = (x / window.innerWidth * 2) - 1;
        this.launcher.desiredScreenPosition = {x: x, y: 0, z: 0};
    };

    Scene.prototype.rotateLauncher = function (x, y) {
        x = (x / window.innerWidth * 2) - 1;
        y = (y / window.innerHeight * 2) - 1;
        this.launcher.lookAtPosition = {x: x, y: y};
    };

    Scene.prototype.load = function (levelNumber) {
        Logger.info("Loading level " + levelNumber + "...");

        this.launcher = new Launcher();
        this.gameObjects.push(this.launcher);
        
        this.mock = new Mock();
        this.gameObjects.push(this.mock);
        
        this.gameObjects.push(new Light("mainAmbient", "AmbientLight", 0x555555));
        this.gameObjects.push(new Light("mainDirectional", "DirectionalLight", 0xffffff, {x: -0.1, y: 0.25, z: -1}));
        
        var pMesh = new GraphicObject("pMesh"),
            pLight = new GraphicObject("pLight", [
                new Light("pointLight", "PointLight", 0xffffff, {x: 0, y: 740, z: 0}),
                pMesh
            ]);
                
        pMesh.create = function (callback) {
            var plight = new THREE.SphereGeometry( 5, 16, 8 ),
                plightmat = new THREE.MeshBasicMaterial( { color: 0x0099ff } ),
                mesh = new THREE.Mesh( plight, plightmat );

            callback(this, mesh);
        };
                
        pLight.properties.time = 0;
        pLight.frame = function () {
            
            var i = 0;
            
            this.properties.time += 0.05;
            
            for (i; i < this.components.length; i++) {
                if (this.components[i].renderable) {
                    this.components[i].renderable.position.set(Math.sin(this.properties.time) * 800, 700, Math.cos(this.properties.time) * 800);
                }
            }
            //this.pointLight.position.set(Math.sin(this.properties.time) * 800, 700, Math.cos(this.properties.time) * 800);
            //this.renderable.position = this.pointLight.position;
        };
        
        this.gameObjects.push(pLight);

//        var request = new XMLHttpRequest(),
//            that = this;
//
//        request.open('GET', 'levels/' + levelNumber + '.json', false);
//
//        request.onload = function () {
//            if (request.status >= 200 && request.status < 400) {
//                // Success!
//                var data = JSON.parse(request.responseText);
//                that.loadLevel(data);
//
//            } else {
//                Logger.alert("Unable to load level N° " + levelNumber);
//            }
//        };
//
//        request.onerror = function (e) {
//            Logger.alert("An error occured while trying to load level N° " + levelNumber);
//            Logger.info("Error: ", e);
//        };
//
//        request.send();
//
//        this.gameObjects.push(
//            new Launcher()//{width: 75, height: 5, depth: 10, color: '#cccccc', x: 0, y: 620, desiredX: 0, maximumSpeed: 3000, curentSpeed: 0, accelleration: 100})
//        );
//        Logger.info("Level " + levelNumber + " loaded.");
    };

    Scene.prototype.frame = function (tick) {
        
        var i = 0;
        for (i; i < this.gameObjects.length; i++) {
            if (this.gameObjects[i].frame) {
                this.gameObjects[i].frame(tick);
            }
        }
        
    };

    return Scene;

});
