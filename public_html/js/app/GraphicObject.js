
/*jslint                        */
/*global define, THREE, CANNON  */

define([
    "GameObject",
    "three",
    "lib/cannon"

], function (GameObject, t, CANNON) {
    "use strict";

    /**
     * Base class for all renderable objects
     * @param {type} name
     * @param {type} properties
     * @returns {_L9.GraphicObject}
     */
    var GraphicObject = function (name, properties) {

        new GameObject(name).extend(this);
        
        this.components = null;
        this.properties = {};
        this.renderable = null;

        if (Object.prototype.toString.call(properties) === '[object Array]') {
            var i = 0;
            this.components = [];
            for (i; i < properties.length; i++) {
                this.components.push(properties[i]);
            }
        } else {
            this.properties = properties ? properties.properties || properties : {};
        }
    };

    GameObject.prototype.extend(GraphicObject);
    
    GraphicObject.prototype.extend = function (child) {
        var Surrogate = function () { return; };
        Surrogate.prototype = GraphicObject.prototype;
        child.prototype = new Surrogate();
    };

    /**
     * Create the renderable object (mesh).
     * This method is intented to be overriden by instances / child classes.
     * @returns {THREE.Mesh}
     */
    GraphicObject.prototype.create = function (callback) {
        
        var that        = this,
            geometry    = null,
            material    = null,
            mesh        = null,
            callbackFn  = function (pMesh) {
                console.log(that);
                if (that.properties.position) {
                    pMesh.position.set(that.properties.position.x, that.properties.position.y, that.properties.position.z);
                }
                if (that.properties.rotation) {
                    pMesh.rotation.set(that.properties.rotation.x, that.properties.rotation.y, that.properties.rotation.z);
                }
                if (callback) {
                    callback(that, pMesh);
                }
            };
        
        if (this.properties.jsonFile) {
            this.loadJSONMesh(this.properties.jsonFile, callbackFn);
            
        } else {

            if (!this.properties.geometry) {
                this.properties.geometry = {w: 10, h: 10, d: 10};
            }
            geometry = new THREE.CubeGeometry(this.properties.geometry.w, this.properties.geometry.h, this.properties.geometry.d);
            material = new THREE.MeshLambertMaterial({color: 0xCCCCCC, opacity: 1});
            mesh     = new THREE.Mesh(geometry, material);

            callbackFn(mesh);

        }
            
        
    };

    /**
     * Base method to load a JSON mesh
     * @param {type} src
     * @param {type} callback
     * @returns {undefined}
     */
    GraphicObject.prototype.loadJSONMesh = function (src, callback) {
        
        var loader = new THREE.JSONLoader();
        
        loader.load(src, function (geometry, materials) {

            var material = new THREE.MeshFaceMaterial(materials),
                mesh = new THREE.Mesh(geometry, material);

            callback(mesh, geometry, materials);
        });
        
    };

    /**
     * Return the physic "body"
     * @returns {undefined}
     */
    GraphicObject.prototype.getBody = function (options) {
        
        if (!this.body) {
            
            options = options || {};
            
            options.mass = options.mass || 0;
            
            options.geometry = options.geometry || {
                w: this.properties.geometry.w / 2,
                h: this.properties.geometry.h / 2,
                d: this.properties.geometry.d / 2
            };
            
            var box = new CANNON.Box(
                new CANNON.Vec3(
                    options.geometry.w,
                    options.geometry.h,
                    options.geometry.d
                )
            );
            
            if (options.material) {
                this.body = new CANNON.RigidBody(options.mass, box, options.material);
            } else {
                this.body = new CANNON.RigidBody(options.mass, box);
            }
        }

        if (options.position) {
            this.body.position.set(
                options.position.x,
                options.position.y,
                options.position.z
            );
        }

        return this.body;
        
    };

    return GraphicObject;

});
