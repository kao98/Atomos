
/*jslint        */
/*global define, THREE, Exception */

define([
    "GraphicObject",
    "lib/three"

], function (GraphicObject) {
    "use strict";

    /**
     * Class used to create lights
     * @param {type} name
     * @param {type} type
     * @param {type} color
     * @param {type} position
     * @returns {_L9.Light}
     */
    var Light = function (name, type, color, position, intensity) {

        if (!THREE.hasOwnProperty(type)) {
            throw new Exception("Light type don't exists !");
        }

        new GraphicObject(name).extend(this);
            
        this.type       = type      || "AmbientLight";
        this.color      = color     || 0xffffff;
        this.intensity  = intensity || 1.0;
        this.position   = position;

    };

    GraphicObject.prototype.extend(Light);

    /**
     * Create the light renderable object
     * @param {type} callback
     * @returns {undefined}
     */
    Light.prototype.create = function (callback) {
        
        var light = new THREE[this.type](this.color);
        
        if (this.position) {
            light.position.set(this.position.x, this.position.y, this.position.z);
            if (this.type === "DirectionalLight") {
                light.position.normalize();
            }
            
        }
        
        if (this.intensity) {
            light.intensity = this.intensity;
        }
        
        callback(this, light);
        
    };

    return Light;

});
