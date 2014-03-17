
/*jslint                */
/*global define, THREE  */

define([
    "GraphicObject",
    "three"

], function (GraphicObject) {
    "use strict";

    /**
     * The "Mock" object is actually a top border object.
     * @returns {_L9.Mock}
     */
    var Mock = function () {

        new GraphicObject(
            "mock",
            {
                properties: {
                    position: {
                        //The position of the mock
                        x: 0,
                        y: 1200,
                        z: 0
                    }
                }
                
            }
        ).extend(this);

    };

    GraphicObject.prototype.extend(Mock);

    /**
     * Override the create method of the GraphicObject class
     * @param {type} callback
     * @returns {undefined}
     */
    Mock.prototype.create = function (callback) {
        
        var that = this;
        
        this.loadJSONMesh("assets/mock/mock.js", function (mesh) {
            mesh.position.set(that.properties.position.x, that.properties.position.y, that.properties.position.z);
            callback(that, mesh);
        });

    };

    return Mock;

});
