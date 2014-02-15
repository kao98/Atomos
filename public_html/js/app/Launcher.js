
/*jslint        */
/*global define */

define([
    "GraphicObject"

], function (GraphicObject) {
    "use strict";

    var Launcher = function () {

//{width: 75, height: 5, depth: 10, color: '#cccccc', x: 0, y: 620, desiredX: 0, maximumSpeed: 3000, curentSpeed: 0, accelleration: 100}

        new GraphicObject(
            "launcher",
            {
                'width':    75,
                'height':   5,
                'depth':    10,
                'color':    "#cccccc",
                'x':        0,
                'y':        620
            }
        ).extend(this);

        this.desiredX = 0;
        this.maximumSpeed = 3000;
        this.curentSpeed = 0;
        this.accelleration = 80;

    };

    GraphicObject.prototype.extend(Launcher);

    Launcher.prototype.frame = function (tick) {
        
        
        var curTick = new Date().getTime();
        
        var duration = curTick - tick;
        var dist = this.desiredX - this.renderable.position.x;
        
        if (Math.abs(dist) > 2) {

            var sens = dist > 0 ? 1 : -1;
            
            var speed = this.curentSpeed,// / 1000,
                maxSpeed = this.maximumSpeed,// / 1000,
                accell = this.accelleration;// / 1000;
            

            var decelTime = speed / accell;
            var decelDist = speed * decelTime - accell / 2 * Math.pow(speed / accell, 2);

//            console.log(decelTime);

            if (speed > 0 && decelDist >= Math.abs(dist)) {
                
//                console.log('deceleration', speed);
                
                //deceleration
                speed -= (accell * duration / 1000);
                dist = Math.min(speed * duration / 1000, Math.abs(dist));
                
//                console.log(speed);

            } else {
                //acceleration
                
                if (speed >= maxSpeed)
                    dist = Math.min(maxSpeed / 1000 * duration, Math.abs(dist));

                else {
                    speed += (accell * duration / 1000);
                    speed = Math.min(speed * 1000, maxSpeed);
                    dist = Math.min(speed * duration / 1000, Math.abs(dist));
                }
                
            }
            this.renderable.position.x += dist * sens;
            this.curentSpeed = speed;//Math.min(speed * 1000, this.maximumSpeed);
            
//            console.log(this.curentSpeed);
            
        
        } else {
            this.curentSpeed = 0;
        }
        
        return;
        
        if (Math.abs(dist) > 2) {

            var duration = curTick - tick;
            var sens = dist > 0 ? 1 : -1;
            var accell = this.accelleration / 1000;

            var curentSpeed = this.curentSpeed / 1000;
            var maximumSpeed = this.maximumSpeed / 1000;

            var speed;
            if (Math.abs(dist) > 75) {
                speed = Math.min((curentSpeed + (accell * duration)), maximumSpeed);
                dist = Math.min(speed * duration, Math.abs(dist));
            } else {
                speed = Math.min((curentSpeed + (-accell * duration)), maximumSpeed);
                dist = Math.min(Math.abs(speed * duration), Math.abs(dist));
            }
            
            this.curentSpeed = speed * 1000;
            
            this.renderable.position.x += dist * sens;
            //this.scene.gameObjects[0].properties.curentSpeed = (this.scene.gameObjects[0].properties.curentSpeed + (accell * duration)) * 1000;
            //speed = Math.min(this.scene.gameObjects[0].properties.curentSpeed, this.scene.gameObjects[0].properties.maximumSpeed) / 1000;
            

    //        console.log(dist, duration);
        } else {
            this.curentSpeed = 0;
        }
        
    };

    return Launcher;

});
