
/*jslint                                                             */
/*global define, window, document, THREE, LOGGER, _LI, _LD, _LE, _LC */

define([
    "conf/config",
    "lib/Logger",
    "lib/three",
    "lib/TrackballControls",
    "lib/ShaderExtras",
    "lib/postprocessing/BloomPass",
    "lib/postprocessing/EffectComposer",
    "lib/postprocessing/MaskPass",
    "lib/postprocessing/RenderPass",
    "lib/postprocessing/SavePass",
    "lib/postprocessing/ShaderPass"

], function (config) {
    "use strict";

    /**
     * Graphics engine constructor
     * @param options
     * @returns {_L10.GraphicsEngine}
     */
    var GraphicsEngine = function (options) {

        this.devMode    = config.devMode || false;
        this.insane     = this.devMode && config.insaneDevMode;
        this.options    = options || config.options.graphics || {};

        _LI("==> Initializing the graphics engine.");
        if (this.devMode) {
            if (this.insane) {
                _LD("    == ** devMode activated ** INSANE ** == ");
            } else {
                _LD("    == devMode activated == ");
            }
        }

//TODO: check the WebGL availability
        this.options.renderer = 
            this.options.renderer === "Canvas" || this.options.renderer === "WebGL"
            ? this.options.renderer
            : "Canvas";

        _LI("    GraphicsEngine() Graphics options: ", this.options);

        this.width  = window.innerWidth;
        this.height = window.innerHeight;

        _LD("    GraphicsEngine() Width: " + this.width + " - height: " + this.height);

        this.gameScene          = null;
        this.scene              = null;
        this.glowScene          = null;
        this.camera             = null;
        this.renderer           = null;
        this.controlsHelper     = null;
        this.glowComposer       = null;
        this.finalComposer      = null;
        
        this.renderTargetParameters = {
                minFilter: THREE.LinearFilter, 
                magFilger: THREE.LinearFilter,
                format: THREE.RGBFormat,
                stencilBuffer: false
            };
        
        this.initRenderer()
            .initScene()
            .initCamera()
            .initControlsHelper()
            .initGlowComposer()
            .initFinalComposer();

        //Trackball is used by viewers. Not compatible with the game neither the controlsHelper.
        if (this.options.trackball) {

            this.trackball = new THREE.TrackballControls( this.camera );

            this.trackball.rotateSpeed = 1.0;
            this.trackball.zoomSpeed = 1.2;
            this.trackball.panSpeed = 0.8;

            this.trackball.noZoom = false;
            this.trackball.noPan = false;

            this.trackball.staticMoving = true;
            this.trackball.dynamicDampingFactor = 0.3;

            this.trackball.keys = [ 65, 83, 68 ];
        }

        document.body.appendChild(this.renderer.domElement);

        _LI("<== Graphics engine shoud be initialized now.");
        
    };

    /**
     * Initialize the THREE scene
     * @returns {_L10.GraphicsEngine.prototype}
     */
    GraphicsEngine.prototype.initScene = function () {

        _LD("    >Initializing the scene...");

        this.scene = new THREE.Scene();
        
        if (this.devMode) {
            this.scene.add(new THREE.AxisHelper(100));
        }
        
        if (this.trackball) {
            this.trackball.addEventListener('change', this.frame);
        }

        this.glowScene = new THREE.Scene();
        this.glowScene.add(new THREE.AmbientLight(0xffffff));
        //this.glowScene.add(new THREE.AxisHelper(100));

        _LD("    <Scene initialized");

        return this;

    };

    /**
     * Initialize the THREE main camera
     * @returns {_L10.GraphicsEngine.prototype}
     */
    GraphicsEngine.prototype.initCamera = function () {

        _LD("    >Initializing the camera...");

        this.camera = new THREE.PerspectiveCamera(18, this.width / this.height, 1, 15000);
//TODO: the camera should be set from the scene or not?
        this.camera.position.set(0, 65, 7500);
        this.camera.lookAt({x: 0, y: 65, z: 0});
        this.scene.add(this.camera);

        this.glowScene.add(this.camera);

        _LD("    <Camera initialized.");

        return this;

    };

    /**
     * Initialize the THREE renderer
     * @returns {_L10.GraphicsEngine.prototype}
     */
    GraphicsEngine.prototype.initRenderer = function () {

        _LD("    >Initializing the renderer...");

        var that = this;
        
        if (this.options.renderer === "WebGL") {
            this.renderer = new THREE.WebGLRenderer({/*antialias: false*/});
            this.renderer.shadowMapEnabled = true;
            this.renderer.shadowMapSoft = true;
            this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
            this.renderer.physicallyBasedShading = true;
        } else {
            this.renderer = new THREE.CanvasRenderer();
        }
        
        this.renderer.setSize(this.width, this.height);
        
//TODO: set the clear color in the scene, depending levels
        //this.renderer.setClearColor(0x020d30);

        window.addEventListener('resize', function () {
            
            _LD("    .. Window resized ..");
            
            that.width =    window.innerWidth;
            that.height =   window.innerHeight;
            
            that.renderer.setSize(that.width, that.height);
            
            if (that.camera !== null) {
                that.camera.aspect = that.width / that.height;
                that.camera.updateProjectionMatrix();
            }
            
            _LD("    .. renderer resized ..");
            
        });

        _LD("    <Renderer initialized.");

        return this;
    };

    GraphicsEngine.prototype.addGlow = function (mesh) {
        //return;
        var hblur       = THREE.ShaderExtras["horizontalBlur"],
            vblur       = THREE.ShaderExtras["verticalBlur"],
            bluriness   = 2;
    
        hblur.uniforms["h"].value = bluriness / this.width;
        vblur.uniforms["v"].value = bluriness / this.height;
        
        hblur.uniforms["tDiffuse"] = {type: "t", value: mesh.material.map};//THREE.ImageUtils.loadTexture('assets/launcher/lanceur_selfillumination.jpg')};
        vblur.uniforms["tDiffuse"] = {type: "t", value: mesh.material.map};//THREE.ImageUtils.loadTexture('assets/launcher/lanceur_selfillumination.jpg')};
        //vblur.uniforms["tDiffuse"] = {type: "t", value: THREE.ImageUtils.loadTexture(mesh.material.map.sourceFile)};
        /*hblur.uniforms["tDiffuse"].texture = THREE.ImageUtils.loadTexture(mesh.material.map.sourceFile);
        vblur.uniforms["tDiffuse"].value = THREE.ImageUtils.loadTexture(mesh.material.map.sourceFile);
        vblur.uniforms["tDiffuse"].texture = THREE.ImageUtils.loadTexture(mesh.material.map.sourceFile);*/
        //vblur.uniforms["tDiffuse"].texture = mesh.material.map.__webglTexture;
        
        //if (!mesh.material.materials) {
            var materials = new THREE.MeshFaceMaterial();//[mesh.material]);
            mesh.material = materials;
        //}
        
        mesh.material.materials.push(
            new THREE.ShaderMaterial({
                uniforms: hblur.uniforms,
                vertexShader: hblur.vertexShader,
                fragmentShader: hblur.fragmentShader
            })
        );

        mesh.material.materials.push(
            new THREE.ShaderMaterial({
                uniforms: vblur.uniforms,
                vertexShader: vblur.vertexShader,
                fragmentShader: vblur.fragmentShader
            })
        );

        console.log("glowed mesh: ", mesh);
/*
        return new THREE.Mesh(mesh.geometry, 
            new THREE.MeshFaceMaterial(
            [
            new THREE.ShaderMaterial({
                uniforms: hblur.uniforms,
                vertexShader: hblur.vertexShader,
                fragmentShader: hblur.fragmentShader
            }),
            new THREE.ShaderMaterial({
                uniforms: vblur.uniforms,
                vertexShader: vblur.vertexShader,
                fragmentShader: vblur.fragmentShader
            })
        ]));*/
        //mesh.material.materials.push(vblur);
        
    };

    GraphicsEngine.prototype.initGlowComposer = function () {
        
        var renderTargetGlow = new THREE.WebGLRenderTarget(this.width, this.height, this.renderTargetParameters),
            hblur           = new THREE.ShaderPass(THREE.ShaderExtras["horizontalBlur"]),
            vblur           = new THREE.ShaderPass(THREE.ShaderExtras["verticalBlur"]),
            bluriness       = 2,
            renderModelGlow = null;
    
        hblur.uniforms["h"].value = bluriness / this.width;
        vblur.uniforms["v"].value = bluriness / this.height;
        
        renderModelGlow = new THREE.RenderPass(this.glowScene, this.camera);
        this.glowComposer = new THREE.EffectComposer(this.renderer, renderTargetGlow);
        
        this.glowComposer.addPass(renderModelGlow);
        this.glowComposer.addPass(hblur);
        this.glowComposer.addPass(vblur);
        this.glowComposer.addPass(hblur);
        this.glowComposer.addPass(vblur);
        
        return this;
    };
    
    GraphicsEngine.prototype.initFinalComposer = function () {
        
        var finalShader = {
                uniforms: {
                    tDiffuse: { type: "t", value: null },
                    tGlow: { type: "t", value: 1 }
                },

                vertexShader: [
                    "varying vec2 vUv;",
                    "void main() {",
                        "vUv = vec2( uv.x, uv.y);",
                        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                    "}"
                ].join("\n"),

                fragmentShader: [
                    "uniform sampler2D tDiffuse;",
                    "uniform sampler2D tGlow;",
                    "varying vec2 vUv;",
                    "void main() {",
                        "vec4 texel = texture2D(tDiffuse, vUv);",
                        "vec4 glow = texture2D(tGlow, vUv);",
                        "gl_FragColor = texel + vec4(0.5, 0.75, 1.0, 1.0) * glow * 2.0;",
                    "}"
                ].join("\n")
            };
        
        finalShader.uniforms["tGlow"].value = this.glowComposer.renderTarget2;
        
        var renderModel = new THREE.RenderPass(this.scene, this.camera),
            finalPass = new THREE.ShaderPass(finalShader),
            renderTarget = new THREE.WebGLRenderTarget(this.width, this.height, this.renderTargetParameters),
            effectFXAA = new THREE.ShaderPass(THREE.ShaderExtras["fxaa"]);
    
        finalPass.needsSwap = true;
        finalPass.renderToScreen = true;
        
        effectFXAA.uniforms['resolution'].value.set(1 / this.width, 1 / this.height);
        
        this.finalComposer = new THREE.EffectComposer(this.renderer, renderTarget);
        this.finalComposer.addPass(renderModel);
        this.finalComposer.addPass(effectFXAA);
        this.finalComposer.addPass(finalPass);
        
        return this;
    };

    /**
     * Initialize the controlsHelper 
     * that helps to handle object translation from the mouse
     * @returns {undefined}
     */
    GraphicsEngine.prototype.initControlsHelper = function () {
        
        _LD("    >Initializing the controls helper...");

        var engine = this;
        
        //The controlsHelper is implemented in a static way
        
        this.controlsHelper = {


            projector           : new THREE.Projector(),            
            directions          : new THREE.Vector3(1, 1, 1),
            previousLookPosition: {x: 0, y: 0, z: 0},
            object              : null,
        
            plane: new THREE.Mesh(
                    
                new THREE.PlaneGeometry(3000, 3000, 30, 30),
                new THREE.MeshBasicMaterial({
                    color       : 0x000000,
                    opacity     : 0.25,
                    transparent : true,
                    wireframe   : true
                })
                        
            ),
    
            /**
             * Attach an object to the controls helper, with the movable directions
             * @param {type} object
             * @param {type} directions
             * @returns {undefined}
             */
            attach      : function (object, directions) {
                
                _LD("    >ControlsHelper: attaching an object to the controls helper...");
                
                if (object.desiredScreenPosition === undefined || object.setDesiredWorldPosition === undefined) {
                    this.object = null;
                    _LE("    /!\\ Improper object attached to the controls helper !");
                } else {

                    this.object = object;

                    if (directions) {
                        this.directions = new THREE.Vector3(
                            directions.x !== 0 ? 1 : 0,
                            directions.y !== 0 ? 1 : 0,
                            directions.z !== 0 ? 1 : 0
                        );
                    }
                    
                    _LD("      Object '" + object.name + "' attached to the controls helper");
                    _LD("      Directions: ", this.directions);
                }
                _LD("    <ControlsHelper: attaching an object to the controls helper done.");
            },
            
            /**
             * Check if we wan't to move the attached object, then calculate
             * the position.
             * @returns {undefined}
             */
            frame: function () {
                
                var raycaster,
                    intersects,
                    vector;
                
                if (this.object && this.object.desiredScreenPosition !== null) {

                    _LC("    >ControlsHelper: new position desired: ", this.object.desiredScreenPosition);

                    vector = new THREE.Vector3(
                            this.object.desiredScreenPosition.x * this.directions.x,
                            this.object.desiredScreenPosition.y * this.directions.y,
                            this.object.desiredScreenPosition.z * this.directions.z
                        );
                                                
                    this.projector.unprojectVector(vector, engine.camera);
                    
                    raycaster = new THREE.Raycaster(
                        engine.camera.position,
                        vector.sub(engine.camera.position).normalize()
                    );

                    intersects = raycaster.intersectObject(this.plane);
                    
                    if (intersects && intersects.length > 0) {
                    
                        this.object.desiredScreenPosition = null;
                        this.object.setDesiredWorldPosition(intersects[0].point);
                        
                        _LC("    <ControlsHelper: new disired position calculated: ", this.object.desiredWorldPosition);
                        
                    } else {
                        
                        _LC("    <ControlsHelper: no new disired position (out of bounds).");
                        
                    }

                }
                
                if (this.object && this.object.lookAtPosition !== this.previousLookPosition) {

                    _LC("    >ControlsHelper: new rotation desired: ", this.object.lookAtPosition);

                    vector = new THREE.Vector3(
                            this.object.lookAtPosition.x,
                            this.object.lookAtPosition.y,
                            0
                        );
                                                
                    this.projector.unprojectVector(vector, engine.camera);
                    
                    raycaster = new THREE.Raycaster(
                        engine.camera.position,
                        vector.sub(engine.camera.position).normalize()
                    );

                    intersects = raycaster.intersectObject(this.plane);
                    
                    if (intersects && intersects.length > 0) {
                    
                        this.object.lookAt(intersects[0].point);
                        
                        _LC("    <ControlsHelper: new disired rotation calculated");
                        
                    } else {
                        
                        _LC("    <ControlsHelper: no new disired position (out of bounds).");
                        
                    }

                    this.previousLookPosition = this.object.lookAtPosition;
                }
            }
        };
        
        
        if (this.insane) {
            this.controlsHelper.plane.visible = true;
        } else {
            this.controlsHelper.plane.visible = false;
        }

        this.scene.add(this.controlsHelper.plane);
        
        _LD("    <Controls helper initialized.");
        
        return this;
        
    };


    /**
     * Load the given scene
     * @param {type} scene
     * @returns {undefined}
     */
    GraphicsEngine.prototype.loadScene = function (scene) {
        
        _LD("    >GraphicsEngine::loadScene: load the scene: ", scene);
        
        this.gameScene = scene;
        this.loadComponents(this.gameScene.gameObjects);
        
        _LD("    <GraphicsEngine::loadScene: scene loaded.");
        
    };

    /**
     * Load the given components
     * @param {type} components
     * @returns {undefined}
     */
    GraphicsEngine.prototype.loadComponents = function (components) {

        _LD("    >GraphicsEngine::loadComponents: ", components);

        var i = 0;
        for (i; i < components.length; i++) {
            
            if (components[i].components && components[i].components.length > 0) {
                //The component is not the object itself, but is composed of many components
                this.loadComponents(components[i].components);
                
            } else {
                //The compoenent is a loadable object
                this.loadObject(components[i]);
            }
            
        }
        
        _LD("    <GraphicsEngine::loadComponents.");
        
    };

    /**
     * Load scene objects
     * @param {type} object
     * @returns {undefined}
     */
    GraphicsEngine.prototype.loadObject = function (object) {

        _LD("    >GraphicsEngine::loadObject: ", object);

//TODO: implement the proper way to load objects

        var that = this;
        
        object.create(
                
            function (object, renderable, glow) {
                
                var i, j;

                if (Object.prototype.toString.call(renderable) !== '[object Array]') {
                                        
                    if (that.options.renderer === "Canvas" && renderable.material) {
                    
                        if (renderable.material.materials) {
                            for (i = 0; i < renderable.material.materials.length; i++) {
                                renderable.material.materials[i].overdraw = true;
                            }
                        } else {
                            renderable.material.overdraw = true;
                        }

                    } else {
                        if (renderable.material && renderable.material.materials) {
                            for (i = 0; i < renderable.material.materials.length; i++) {
                                if (renderable.material.materials[i].map) {
                                    renderable.material.materials[i].map.anisotropy = that.renderer.getMaxAnisotropy();
                                }
                                if (renderable.material.materials[i].bumpMap) {
                                    renderable.material.materials[i].bumpMap.anisotropy = that.renderer.getMaxAnisotropy();
                                }
                                if (renderable.material.materials[i].specularMap) {
                                    renderable.material.materials[i].specularMap.anisotropy = that.renderer.getMaxAnisotropy();
                                }
                            }
                        } else {
                            if (renderable.material && renderable.material.map) {
                                renderable.material.map.anisotropy = that.renderer.getMaxAnisotropy();
                            }
                            if (renderable.material && renderable.material.bumpMap) {
                                renderable.material.bumpMap.anisotropy = that.renderer.getMaxAnisotropy();
                            }
                            if (renderable.material && renderable.material.specularMap) {
                                renderable.material.specularMap.anisotropy = that.renderer.getMaxAnisotropy();
                            }
                        }

                    }

                    that.scene.add(renderable);
                    
                    if (that.insane && renderable.geometry) {
                        that.scene.add(new THREE.FaceNormalsHelper(renderable, 10));
                        that.scene.add(new THREE.VertexNormalsHelper(renderable, 10));
                        
                        var helper = new THREE.WireframeHelper( renderable );
                        helper.material.depthTest = false;
                        helper.material.opacity = 0.25;
                        helper.material.transparent = true;
                        that.scene.add( helper );
                    }
                    
                } else {
                    for (i = 0; i < renderable.length; i++) {
                        
                        if (that.options.renderer === "Canvas" && renderable[i].material) {

                            if (renderable[i].material.materials) {
                                for (j = 0; j < renderable[i].material.materials.length; j++) {
                                    renderable[i].material.materials[j].overdraw = true;
                                }
                            } else {
                                renderable[i].material.overdraw = true;
                            }

                        } else {
                            if (renderable[i].material && renderable[i].material.materials) {
                                for (j = 0; j < renderable[i].material.materials.length; j++) {
                                    if (renderable[i].material && renderable[i].material.materials[j].map) {
                                        renderable[i].material.materials[j].map.anisotropy = that.renderer.getMaxAnisotropy();
                                    }
                                    if (renderable[i].material && renderable[i].material.materials[j].bumpMap) {
                                        renderable[i].material.materials[j].bumpMap.anisotropy = that.renderer.getMaxAnisotropy();
                                    }
                                    if (renderable[i].material && renderable[i].material.materials[j].specularMap) {
                                        renderable[i].material.materials[j].specularMap.anisotropy = that.renderer.getMaxAnisotropy();
                                    }
                                }
                            } else {
                                if (renderable[i].material && renderable[i].material.map) {
                                    renderable[i].material.map.anisotropy = that.renderer.getMaxAnisotropy();
                                }
                                if (renderable[i].material && renderable[i].material.bumpMap) {
                                    renderable[i].material.bumpMap.anisotropy = that.renderer.getMaxAnisotropy();
                                }
                                if (renderable[i].material && renderable[i].material.specularMap) {
                                    renderable[i].material.specularMap.anisotropy = that.renderer.getMaxAnisotropy();
                                }
                            }

                        }
                        
                        that.scene.add(renderable[i]);
                        
                        if (that.insane && renderable[i].geometry) {
                            that.scene.add(new THREE.FaceNormalsHelper(renderable[i], 10));
                            that.scene.add(new THREE.VertexNormalsHelper(renderable[i], 10));
                            
                            var helper = new THREE.WireframeHelper( renderable[i] );
                            helper.material.depthTest = false;
                            helper.material.opacity = 0.25;
                            helper.material.transparent = true;
                            that.scene.add( helper );
                        }
                        
                    }

                }                

                console.log("glow !!!???", glow);
                if (glow) {
                    console.log("adding glow to the scene !!!");
                    //that.addGlow(glow);
                    console.log(glow);
                    that.glowScene.add(glow);
                    //that.glowScene.add(that.addGlow(glow));
                }

                object.renderable = renderable;

                _LD("    ..<GraphicsEngine::loadObject: '" + object.name + "' loaded.");

            }
                
        );

        _LD("    <GraphicsEngine::loadObject.");

    };

    /**
     * The frame method :o
     * @returns {undefined}
     */
    GraphicsEngine.prototype.frame = function () {
        
        if (this.gameScene === null) {
            return;
        }

        if (this.trackball) {
            this.trackball.update();
        }

        if (this.controlsHelper) {
            this.controlsHelper.frame();
        }
        
        this.glowComposer.render();
        this.finalComposer.render();
        
        //this.renderer.render(this.glowScene, this.camera);
        //this.renderer.render(this.scene, this.camera);
    };

    return GraphicsEngine;

});
