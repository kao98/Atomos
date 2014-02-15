
/*jslint        */
/*global define */

define([
    "lib/Logger"

], function (Logger) {
    "use strict";

    var GameObject = function (name) {

        this.name = name;
        
        this.extend = function (child) {
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    child[p] = this[p];
                }
            }
        };
    };

    GameObject.prototype.extend = function (child) {
        var Surrogate = function () { Logger.log(" -- Extending GameObject -- "); };
        Surrogate.prototype = GameObject.prototype;
        child.prototype = new Surrogate();
    };

    return GameObject;

});
