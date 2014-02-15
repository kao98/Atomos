
/*jslint        */
/*global define, XMLHttpRequest */

define([
    "lib/Logger",
    "GraphicObject",
    "Launcher"

], function (Logger, GraphicObject, Launcher) {
    "use strict";

    var Scene = function () {
        this.gameObjects = [];
    };

    Scene.prototype.loadLevel = function (levelData) {

        var graphic,
            graphicIndex;

        Logger.debug("..level data: ", levelData);

        for (graphicIndex = 0; graphicIndex < levelData.graphics.length; graphicIndex++) {
            for (graphic in levelData.graphics[graphicIndex]) { if (levelData.graphics[graphicIndex].hasOwnProperty(graphic)) {
                this.gameObjects.push(new GraphicObject(graphic, levelData.graphics[graphicIndex][graphic]));
            } }
        }

    };

    Scene.prototype.load = function (levelNumber) {
        Logger.info("Loading level " + levelNumber + "...");

//        var request = new XMLHttpRequest(),
//            that = this;
//
//        request.open('GET', 'levels/' + levelNumber + '.json', false);
//
//        request.onload = function () {
//            if (request.status >= 200 && request.status < 400) {
//                // Success!
//                var data = JSON.parse(request.responseText);
//                that.loadLevel(data);
//
//            } else {
//                Logger.alert("Unable to load level N° " + levelNumber);
//            }
//        };
//
//        request.onerror = function (e) {
//            Logger.alert("An error occured while trying to load level N° " + levelNumber);
//            Logger.info("Error: ", e);
//        };
//
//        request.send();

        this.gameObjects.push(
            new Launcher()//{width: 75, height: 5, depth: 10, color: '#cccccc', x: 0, y: 620, desiredX: 0, maximumSpeed: 3000, curentSpeed: 0, accelleration: 100})
        );
        Logger.info("Level " + levelNumber + " loaded.");
    };

    return Scene;

});
