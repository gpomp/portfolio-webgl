// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license
/*declare module THREE {
    class MouseControls {
      public enabled;
      public orientation;
      update()

    }
    class BloomPass {}
}*/
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        { 
            window.requestAnimationFrame = function(callback) { 
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// addEventListener polyfill IE6+
!window.addEventListener && (function (window, document) {
    function Event(e, element) {
        var instance = this;
 
        for (var property in e) {
            instance[property] = e[property];
        }
 
        instance.currentTarget =  element;
        instance.target = e.srcElement || element;
        instance.timeStamp = +new Date;
 
        instance.preventDefault = function () {
            e.returnValue = false;
        };
        instance.stopPropagation = function () {
            e.cancelBubble = true;
        };
    }
 
    function addEventListener(type, listener) {
        var
        element = this,
        listeners = element.listeners = element.listeners || [],
        index = listeners.push([listener, function (e) {
            listener.call(element, new Event(e, element));
        }]) - 1;
 
        element.attachEvent('on' + type, listeners[index][1]);
    }
 
    function removeEventListener(type, listener) {
        for (var element = this, listeners = element.listeners || [], length = listeners.length, index = 0; index < length; ++index) {
            if (listeners[index][0] === listener) {
                element.detachEvent('on' + type, listeners[index][1]);
            }
        }
    }
 
    window.addEventListener = document.addEventListener = addEventListener;
    window.removeEventListener = document.removeEventListener = removeEventListener;
 
    if ('Element' in window) {
        Element.prototype.addEventListener    = addEventListener;
        Element.prototype.removeEventListener = removeEventListener;
    } else {
        var
        head = document.getElementsByTagName('head')[0],
        style = document.createElement('style');
 
        head.insertBefore(style, head.firstChild);
 
        style.styleSheet.cssText = '*{-ms-event-prototype:expression(!this.addEventListener&&(this.addEventListener=addEventListener)&&(this.removeEventListener=removeEventListener))}';
    }
})(window, document) && scrollBy(0, 0);


/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

Detector = {

    canvas: !! window["CanvasRenderingContext2D"],
    webgl: ( function () { try { var canvas = document.createElement( 'canvas' ); return !! ( window["WebGLRenderingContext"] && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) ); } catch( e ) { return false; } } )(),
    workers: !! window["Worker"],
    fileapi: window["File"] && window["FileReader"] && window["FileList"] && window["Blob"],

    getWebGLErrorMessage: function () {

        var element = document.createElement( 'div' );
        element.id = 'webgl-error-message';
        element.style.fontFamily = 'monospace';
        element.style.fontSize = '13px';
        element.style.fontWeight = 'normal';
        element.style.textAlign = 'center';
        element.style.background = '#fff';
        element.style.color = '#000';
        element.style.padding = '1.5em';
        element.style.width = '400px';
        element.style.margin = '5em auto 0';

        if ( ! this.webgl ) {

            element.innerHTML = window["WebGLRenderingContext"] ? [
                'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
                'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
            ].join( '\n' ) : [
                'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
                'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
            ].join( '\n' );

        }

        return element;

    },

    addGetWebGLMessage: function ( parameters ) {

        var parent, id, element;

        parameters = parameters || {};

        parent = parameters.parent !== undefined ? parameters.parent : document.body;
        id = parameters.id !== undefined ? parameters.id : 'oldie';

        element = Detector.getWebGLErrorMessage();
        element.id = id;

        parent.appendChild( element );

    }

};

module utils {
    export class Prefix {

        constructor() {

        }

        static transformPrefix():string {
            return utils.Prefix.GetVendorPrefix(["transform", "msTransform", "MozTransform", "WebkitTransform", "OTransform"]);
        }

        static GetVendorPrefix(arrayOfPrefixes):string {

           var tmp = document.createElement("div");
           var result:string = "";

            for (var i = 0; i < arrayOfPrefixes.length; ++i) {
                if (typeof tmp.style[arrayOfPrefixes[i]] !== 'undefined') {
                    result = arrayOfPrefixes[i];
                    break;
                } else {
                    result = null;
                }
            }

           return result;
        }
    }
}