
/*jslint                */
/*global define, THREE  */

define([
    "GameObject",
    "lib/three"

], function (GameObject) {
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
    GraphicObject.prototype.create = function () {
        
        var geometry = new THREE.CubeGeometry(10, 10, 10),
            material = new THREE.MeshBasicMaterial({color: 0xCCCCCC, opacity: 1});
    
        return new THREE.Mesh(geometry, material);
            
        
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

//TODO: Anisotropy
//            for (var i = materials.length; i < materials.length; i++) {
//                if (materials[i].map && materials[i].map.anisotropy) {
//                    materials[i].map.anisotropy = 8;
//                }
//            }

            var material = new THREE.MeshFaceMaterial(materials),
                mesh = new THREE.Mesh(geometry, material);

            callback(mesh);
        });
        
    };

    return GraphicObject;

});
