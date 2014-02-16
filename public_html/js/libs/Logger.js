
/*jslint                                */
/*global define, console, alert, window */

define([
    "conf/config"   //Global configuration

], function (config) {
    "use strict";

    var emptyFunction = function () { return null; },

        testLevel = function (level) {

            if (config.log.level === "crazy") {
                return true;
            }

            if (level !== "crazy" && (config.log.level === "all" || config.devMode)) {
                return true;
            }

            switch (config.log.level) {
                
            case "debug":
                return level === "debug"
                    || level === "info"
                    || level === "error";

            case "info":
                return level === "info"
                    || level === "error";

            case "error":
                return level === "error";

            }

            return false;
        },

        getLogFunction = function (level, method) {

            if (method === undefined) {
                method = level;
            }

            if (testLevel(level)) {
                if (console.hasOwnProperty(method) && typeof console[method] === "function") {
                    return function () {
                        console[method].apply(console, arguments);
                    };
                }
                return function () {
                    console.log.apply(console, arguments);
                };
            }
            return emptyFunction;
        },

        Logger = {};

    if (!config.log.active) {

        Logger.log = emptyFunction;
        Logger.debug = emptyFunction;
        Logger.info = emptyFunction;
        Logger.error = emptyFunction;
        Logger.crazy = emptyFunction;
        Logger.alert = function (message) {
            alert(message);
        };

    } else {

        Logger.testLevel = function (level) {
            return testLevel(level);
        };

        Logger.crazy = getLogFunction("crazy", "log");
        Logger.log = getLogFunction("all", "log");
        Logger.info = getLogFunction("info");
        Logger.debug = getLogFunction("debug");
        Logger.error = getLogFunction("error");

        Logger.alert = function (message, logMessage) {
            alert(message);
            this.debug(logMessage);
        };
    }

    window.LOGGER = Logger;
    window._L = Logger;
    window._LD = Logger.debug;
    window._LL = Logger.log;
    window._LI = Logger.info;
    window._LE = Logger.error;
    window._LA = Logger.alert;
    window._LC = Logger.crazy;

    return Logger;
});
