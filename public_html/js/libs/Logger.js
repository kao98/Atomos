
/*jslint                        */
/*global define, console, alert */

define([
    "conf/config"   //Global configuration

], function (config) {
    "use strict";

    var emptyFunction = function () { return null; },
        Logger = {};

    if (!config.log.active) {

        Logger.debug = emptyFunction;
        Logger.info = emptyFunction;

    } else {

        Logger.testLevel = function (level) {

            if (config.log.level === "all") {
                return true;
            }

            switch (config.log.level) {
            case "debug":
                if (level === "debug" || level === "info") {
                    return true;
                }
                break;

            case "info":
                if (level === "info") {
                    return true;
                }
                break;
            }

            return false;
        };

        Logger.log = (function () {
            if (Logger.testLevel("all")) {
                return function () {
                    console.log.apply(console, arguments);
                };
            }
            return emptyFunction;
        }());

        Logger.info = function () {
            if (console.info && typeof console.info === "function") {
                console.info.apply(console, arguments);
            } else {
                console.log.apply(console, arguments);
            }
        };

        Logger.debug = (function () {
            if (Logger.testLevel("debug")) {
                return function () {
                    if (console.debug && typeof console.debug === "function") {
                        console.debug.apply(console, arguments);
                    } else {
                        console.log.apply(console, arguments);
                    }
                };
            }
            return emptyFunction;
        }());

        Logger.alert = function (message, logMessage) {
            alert(message);
            console.debug(logMessage);
        };
    }

    return Logger;
});
