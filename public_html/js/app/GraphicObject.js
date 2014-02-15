
/*jslint        */
/*global define */

define([
    "GameObject"

], function (GameObject) {
    "use strict";

    var GraphicObject = function (name, properties) {

        new GameObject(name).extend(this);
        this.components = [];
        this.properties = {};
        this.renderable = null;

        if (Object.prototype.toString.call(properties) === '[object Array]') {
            var i = 0;
            for (i; i < properties.length; i++) {
                this.components.push(new GraphicObject(this.name + "-" + i.toString(), properties[i]));
            }
        } else {
            this.properties = properties;
        }
    };

    GameObject.prototype.extend(GraphicObject);

    return GraphicObject;

});
