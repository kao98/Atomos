
/*jslint                                                             */
/*global define, XMLHttpRequest, CANNON, LOGGER, _LI, _LD, _LE, _LC  */

define([
    "GraphicObject",
    "Light",
    "launcher/Launcher",
    "ball/Ball",
    "lib/Logger",
    "lib/cannon"

], function (GraphicObject, Light, Launcher, Ball, LOGGER, CANNON) {
    "use strict";

    /**
     * The Scene represents the graphical AND the physical world
     * @returns {_L14.Scene}
     */
    var Scene = function () {
        
        _LI("==> Initializing the Scene...");
        
        /** Will contain all the objects of the scene, including the launcher, the ball, ... */
        this.gameObjects    = [];
        
        /** The instance of the launcher */
        this.launcher       = null;
        
        /** The instance of the ball */
        this.ball           = null;
        
        /** The limits of the game area */
        this.borders        = [];
        
        /** The instance of our 'physical' world */
        this.world          = null;
        
        /** The world default material of our physics engine */
        this.worldDefaultMaterial = null;
        
        _LI("<== Scene initialized.");
    };

    /**
     * Load the level datas
     * @param {type} levelData
     * @returns {undefined}
     */
    Scene.prototype.loadLevel = function (levelData) {
//TODO: level loading
        var graphic,
            graphicIndex;

        _LD("    >Scene::loadLevel: ", levelData);

        for (graphicIndex = 0; graphicIndex < levelData.graphics.length; graphicIndex++) {
            for (graphic in levelData.graphics[graphicIndex]) { if (levelData.graphics[graphicIndex].hasOwnProperty(graphic)) {
                this.gameObjects.push(new GraphicObject(graphic, levelData.graphics[graphicIndex][graphic]));
            } }
        }

        _LD("    <Scene::loadLevel.");

    };

    /**
     * Move the launcher to the specified x position
     * @param {type} x
     * @returns {undefined}
     */
    Scene.prototype.moveLauncher = function (x) {
        x = (x / window.innerWidth * 2) - 1;
        this.launcher.desiredScreenPosition = {x: x, y: 0, z: 0};
    };

    /**
     * Rotate the launcher regarding the specified x and y coordinates
     * @param {type} x
     * @param {type} y
     * @returns {undefined}
     */
    Scene.prototype.rotateLauncher = function (x, y) {
        x = (x / window.innerWidth * 2) - 1;
        y = (y / window.innerHeight * 2) - 1;
        this.launcher.lookAtPosition = {x: x, y: y};
    };

    /**
     * Return the default world material
     * @returns {undefined}
     */
    Scene.prototype.getWorldDefaultMaterial = function () {
        
        if (this.worldDefaultMaterial === null) {
            this.worldDefaultMaterial = new CANNON.Material();
        }
        
        return this.worldDefaultMaterial;
    };

    /**
     * Initialize the physical world
     * @returns {undefined}
     */
    Scene.prototype.initializeWorld = function () {
        
        _LD("    >Scene::initializeWorld");
        
        this.world = new CANNON.World();
        
        //Yes, this is a huge gravity, but that match with the 3D world scale
        this.world.gravity.set(0, -250, 0);
        
        //Right now there's only that NaiveBroadphase implementation. Once
        //something implementing quad-tree or something, we will use it.
        this.world.broadphase = new CANNON.NaiveBroadphase();
        
        //Maybe we could fine-tune that value
        this.world.solver.iteration = 2;
        
        //Those could maybe be tweaked too
        this.world.defaultContactMaterial.contactEquationStiffness = 1e5;
        this.world.defaultContactMaterial.contactEquationRegularizationTime = 1;
        
        
        _LD("    <Scene::initializeWorld");
    };

    /**
     * Set the statics parts
     * @returns {undefined}
     */
    Scene.prototype.addStatics = function () {
        
        _LD("    >Scene::addStatics");        
        
        //The "top" border
        this.borders[0] = new GraphicObject(
            "border-0", 
            {
                jsonFile:   "assets/mock/mock.js",
                position:   {x: 0, y: 1200, z: 0},
                physic:     true
            }
        );

        this.gameObjects.push(this.borders[0]);

        //The "left" side
        this.borders[1] = new GraphicObject(
            "border-1",
            {
                geometry:   {w: 50, h: 2500, d: 50},
                position:   {x: -650, y: 0, z: 0},
                physic:     true
            }
        );
        
        this.gameObjects.push(this.borders[1]);
        
        //The "right" side
        this.borders[2] = new GraphicObject(
            "border-2",
            {
                geometry:   {w: 50, h: 2500, d: 50},
                position:   {x: 650, y: 0, z: 0},
                physic:     true
            }
        );
        
        this.gameObjects.push(this.borders[2]);
        
        this.background = new GraphicObject(
            "background",
            {
                jsonFile: "assets/board/board.js",
                position: {x: 0, y: 209, z: -2709},
                rotation: {x: -0.174532925, y: 0, z: 0}
            }
        );
        
        this.gameObjects.push(
            this.background
        );
        
        this.gameObjects.push(new GraphicObject(
            "background-2",
            {
                jsonFile: "assets/tiles/tiles.js",
                position:   {x: 0, y: -1250, z: 0},
            }
        ));
        
        //Finished :D
        
        _LD("    <Scene::addStatics.");
        
    };

    Scene.prototype.addStaticsPhysics = function () {
                
        _LD("    >Scene::addStaticsPhysics");
                
        this.world.add(this.borders[0].getBody({
            geometry: {w: 650, h: 100,  d: 25},
            position: {x: 0,   y: 1200, z: 0 },
            material: this.getWorldDefaultMaterial(),
        }));

        this.world.add(this.borders[1].getBody({
            geometry: {w: 125,  h: 1250, d: 25},
            position: {x: -750, y: 0,    z: 0 },
            material: this.getWorldDefaultMaterial()
        }));
        
        this.world.add(this.borders[2].getBody({
            geometry: {w: 125, h: 1250, d: 25},
            position: {x: 750, y: 0,    z: 0 },
            material: this.getWorldDefaultMaterial()
        }));

        _LD("    <Scene::addStaticsPhysics.");
        
    };

    /**
     * Add the static (environment) lights
     * @returns {undefined}
     */
    Scene.prototype.addStaticLights = function () {
        this.gameObjects.push(new Light("mainAmbient", "AmbientLight", 0x666666));
        this.gameObjects.push(new Light("mainDirectional", "DirectionalLight", 0xffffff, {x: 0, y: 0.33, z: 1}, 1));
        
    };

    /**
     * Load the specified level
     * @param {type} levelNumber
     * @returns {undefined}
     */
    Scene.prototype.load = function (levelNumber) {
        
        _LD("  -->Scene::load:", levelNumber);

        //Initialize the physical world first
        this.initializeWorld();
        
        //Set the static parts
        this.addStatics();
        this.addStaticsPhysics();
        
        //The static (environment) lights
        this.addStaticLights();
        

        this.launcher = new Launcher(this);
        this.gameObjects.push(this.launcher);
        
        
        this.ball = new Ball();
        this.gameObjects.push(this.ball);
        this.ball.setScene(this);
        
        this.launcher.properties.bounds.left = this.borders[1].properties.position.x + this.borders[1].properties.geometry.w / 2;
        this.launcher.properties.bounds.right = this.borders[2].properties.position.x - this.borders[2].properties.geometry.w / 2;
        
        
        
        //var ballMaterial = new CANNON.Material();
        
        var sphere = new CANNON.Sphere(140);
        this.sphereBody = new CANNON.RigidBody(0, sphere, this.getWorldDefaultMaterial());
        
        this.sphereBody.position.set(this.launcher.properties.position.x, -900, 0);
        this.sphereBody.mesh = {type: 'launcher', object: this.launcher};
        this.world.add(this.sphereBody);
        /*
        var ballSphere = new CANNON.Sphere(25);
        this.ballBody = new CANNON.RigidBody(0, ballSphere, ballMaterial);
        //this.ballBody.initAngularVelocity = new CANNON.Vec3(0, 10, 0);
        var that = this;
        window.setTimeout(function () {that.ballBody.velocity = new CANNON.Vec3(2500, 1500, 0);}, 1000);
        
        this.ballBody.position.set(this.ball.properties.position.x, this.ball.properties.position.y, this.ball.properties.position.z);
        this.world.add(this.ballBody);
        
        this.ballBody.addEventListener("collide", function (e) {console.log("ICI !!", e);});
        */
        
        
        //this.world.addContactMaterial(new CANNON.ContactMaterial(worldMaterial, ballMaterial, 0, 0.75));
        
        
        /*
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
*/
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

        _LD("  <--Scene::load:");

    };

    /**
     * The frame method of our scene
     * @param {type} tick
     * @param {type} previousTick
     * @returns {undefined}
     */
    Scene.prototype.frame = function (tick, previousTick) {
        
        var i = 0;
        for (i; i < this.gameObjects.length; i++) {
            if (this.gameObjects[i].frame) {
                this.gameObjects[i].frame(tick);
            }
        }

        if (this.world && this.launcher.renderable && !this.ball.idle) {
            //this.sphereBody.position.copy(this.launcher.renderable.position);
            //this.ballBody.position.copy(this.ball.renderable[0].position);
            //this.ballBody.position.copy(this.ball.renderable[1].position);
            this.sphereBody.position.x = this.launcher.properties.position.x;
            
            this.world.step((tick - previousTick) / 1000);
        }
        
    };

    return Scene;

});
