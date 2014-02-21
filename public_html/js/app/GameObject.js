
/*jslint        */
/*global define */

define([], function () {
    "use strict";

    var GameObject = function (name) {

        this.name = name;

        this.extend = function (child) {
            var p;
            for (p in this) {
                if (this.hasOwnProperty(p)) {
                    child[p] = this[p];
                }
            }
        };
    };

    GameObject.prototype.extend = function (child) {
        var Surrogate = function () { return; };
        Surrogate.prototype = GameObject.prototype;
        child.prototype = new Surrogate();
    };

    return GameObject;

});
