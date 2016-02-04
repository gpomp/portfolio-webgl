(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var select = require('dom-select');
var classes = require('dom-classes');
var Tween = require('gsap/src/uncompressed/TweenLite');
var ScrollToPlugin = require('gsap/src/uncompressed/plugins/ScrollToPlugin');
var EasePack = require('gsap/src/uncompressed/easing/EasePack');

var Intro = require('./intro/');

class GlobalPage {
    constructor() {
        this.init();
    }

    init() {
        _gaq.push(['_trackPageview', '/nowebgl']);

        var intro = new Intro();

        classes(select('html')).add('no-threejs');
        select('.overlay-nowebgl').style.display = 'none';

        /*Buttons*/
        classes(select('#projects-buttons')).add("show");
        select('#projects-buttons').addEventListener('click', this.clickToggleMenu);
        var buttons = select.all('#projects-buttons a');

        for (let i = 0; i < buttons.length; ++i) {
            let button = buttons[i];
            classes(button).add('show');
            button.setAttribute("href", "#" + button.getAttribute("href"));
            var self = this;
            button.addEventListener("click", function (event) {
                self.clickProject(event, this);
            });
        }

        /*Projects*/
        classes(select('#projects')).add('show');
        var projects = select.all('#projects .project');

        for (let i = 0; i < projects.length; ++i) {
            let project = projects[i];
            classes(project).add('show');
            classes(select('.text', project)).add('show');

            var images = select.all('img', project);
            for (let j = 0; j < images.length; ++j) {
                let img = images[j];
                img.setAttribute("src", img.getAttribute("data-src"));
            }
        }

        window.addEventListener('scroll', this.scroll.bind(this));

        window.setTimeout((function () {
            this.checkScroll();
        }).bind(this), 1000);
    }

    scroll(event) {
        this.checkScroll();
    }

    checkScrollAnim() {
        this.checkScroll();
    }

    checkScroll() {
        let h = window.innerHeight;
        let projects = select.all('#projects .project');
        let cProject = null;
        let biggest = -1;
        let big = 0;

        for (let i = 0; i < projects.length; ++i) {
            let node = projects[i];
            let br = node.getBoundingClientRect();
            let t = br.top;
            let b = br.bottom;
            let perc = Math.max(0, t);
            if (t - h < 0 && b - h > 0) {
                if (!classes.has(node, 'anim')) {
                    classes.add(node, 'anim');
                }

                biggest = i;
            }
        }
        if (biggest !== -1) {
            let btn = select.all('#projects-buttons a')[biggest];
            if (!classes.has(btn, 'active')) {
                let btnList = select.all('#projects-buttons a');
                for (let i = 0; i < btnList.length; ++i) {
                    classes.remove(btnList[i], 'active');
                }
                classes.add(btn, 'active');
            }
        }
    }

    clickProject(event, link) {
        event.preventDefault();
        this.toggleMenu();

        let name = link.getAttribute('name');

        let project = select('#projects .project.' + name);
        let ctnTop = select('#projects').offsetTop;
        Tween.to(window, 1, { scrollTo: { y: ctnTop + project.offsetTop }, ease: Expo.easeInOut, onComplete: this.checkScrollAnim.bind(this) });
    }
}

module.exports = GlobalPage;

},{"./intro/":3,"dom-classes":"dom-classes","dom-select":"dom-select","gsap/src/uncompressed/TweenLite":4,"gsap/src/uncompressed/easing/EasePack":5,"gsap/src/uncompressed/plugins/ScrollToPlugin":6}],2:[function(require,module,exports){
'use strict';

var GlobalPage = require('./GlobalPage');
var domready = require('detect-dom-ready');

domready(function () {
  let globPage = new GlobalPage();
});

},{"./GlobalPage":1,"detect-dom-ready":"detect-dom-ready"}],3:[function(require,module,exports){
var THREE = require('three');

class Intro {
    constructor() {
        this.init();
    }

    init() {
        console.log('init intro');
    }
}

module.exports = Intro;

},{"three":"three"}],4:[function(require,module,exports){
(function (global){
/*!
 * VERSION: 1.18.2
 * DATE: 2015-12-22
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(function(window, moduleName) {

		"use strict";
		var _globals = window.GreenSockGlobals = window.GreenSockGlobals || window;
		if (_globals.TweenLite) {
			return; //in case the core set of classes is already loaded, don't instantiate twice.
		}
		var _namespace = function(ns) {
				var a = ns.split("."),
					p = _globals, i;
				for (i = 0; i < a.length; i++) {
					p[a[i]] = p = p[a[i]] || {};
				}
				return p;
			},
			gs = _namespace("com.greensock"),
			_tinyNum = 0.0000000001,
			_slice = function(a) { //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
				var b = [],
					l = a.length,
					i;
				for (i = 0; i !== l; b.push(a[i++])) {}
				return b;
			},
			_emptyFunc = function() {},
			_isArray = (function() { //works around issues in iframe environments where the Array global isn't shared, thus if the object originates in a different window/iframe, "(obj instanceof Array)" will evaluate false. We added some speed optimizations to avoid Object.prototype.toString.call() unless it's absolutely necessary because it's VERY slow (like 20x slower)
				var toString = Object.prototype.toString,
					array = toString.call([]);
				return function(obj) {
					return obj != null && (obj instanceof Array || (typeof(obj) === "object" && !!obj.push && toString.call(obj) === array));
				};
			}()),
			a, i, p, _ticker, _tickerActive,
			_defLookup = {},

			/**
			 * @constructor
			 * Defines a GreenSock class, optionally with an array of dependencies that must be instantiated first and passed into the definition.
			 * This allows users to load GreenSock JS files in any order even if they have interdependencies (like CSSPlugin extends TweenPlugin which is
			 * inside TweenLite.js, but if CSSPlugin is loaded first, it should wait to run its code until TweenLite.js loads and instantiates TweenPlugin
			 * and then pass TweenPlugin to CSSPlugin's definition). This is all done automatically and internally.
			 *
			 * Every definition will be added to a "com.greensock" global object (typically window, but if a window.GreenSockGlobals object is found,
			 * it will go there as of v1.7). For example, TweenLite will be found at window.com.greensock.TweenLite and since it's a global class that should be available anywhere,
			 * it is ALSO referenced at window.TweenLite. However some classes aren't considered global, like the base com.greensock.core.Animation class, so
			 * those will only be at the package like window.com.greensock.core.Animation. Again, if you define a GreenSockGlobals object on the window, everything
			 * gets tucked neatly inside there instead of on the window directly. This allows you to do advanced things like load multiple versions of GreenSock
			 * files and put them into distinct objects (imagine a banner ad uses a newer version but the main site uses an older one). In that case, you could
			 * sandbox the banner one like:
			 *
			 * <script>
			 *     var gs = window.GreenSockGlobals = {}; //the newer version we're about to load could now be referenced in a "gs" object, like gs.TweenLite.to(...). Use whatever alias you want as long as it's unique, "gs" or "banner" or whatever.
			 * </script>
			 * <script src="js/greensock/v1.7/TweenMax.js"></script>
			 * <script>
			 *     window.GreenSockGlobals = window._gsQueue = window._gsDefine = null; //reset it back to null (along with the special _gsQueue variable) so that the next load of TweenMax affects the window and we can reference things directly like TweenLite.to(...)
			 * </script>
			 * <script src="js/greensock/v1.6/TweenMax.js"></script>
			 * <script>
			 *     gs.TweenLite.to(...); //would use v1.7
			 *     TweenLite.to(...); //would use v1.6
			 * </script>
			 *
			 * @param {!string} ns The namespace of the class definition, leaving off "com.greensock." as that's assumed. For example, "TweenLite" or "plugins.CSSPlugin" or "easing.Back".
			 * @param {!Array.<string>} dependencies An array of dependencies (described as their namespaces minus "com.greensock." prefix). For example ["TweenLite","plugins.TweenPlugin","core.Animation"]
			 * @param {!function():Object} func The function that should be called and passed the resolved dependencies which will return the actual class for this definition.
			 * @param {boolean=} global If true, the class will be added to the global scope (typically window unless you define a window.GreenSockGlobals object)
			 */
			Definition = function(ns, dependencies, func, global) {
				this.sc = (_defLookup[ns]) ? _defLookup[ns].sc : []; //subclasses
				_defLookup[ns] = this;
				this.gsClass = null;
				this.func = func;
				var _classes = [];
				this.check = function(init) {
					var i = dependencies.length,
						missing = i,
						cur, a, n, cl, hasModule;
					while (--i > -1) {
						if ((cur = _defLookup[dependencies[i]] || new Definition(dependencies[i], [])).gsClass) {
							_classes[i] = cur.gsClass;
							missing--;
						} else if (init) {
							cur.sc.push(this);
						}
					}
					if (missing === 0 && func) {
						a = ("com.greensock." + ns).split(".");
						n = a.pop();
						cl = _namespace(a.join("."))[n] = this.gsClass = func.apply(func, _classes);

						//exports to multiple environments
						if (global) {
							_globals[n] = cl; //provides a way to avoid global namespace pollution. By default, the main classes like TweenLite, Power1, Strong, etc. are added to window unless a GreenSockGlobals is defined. So if you want to have things added to a custom object instead, just do something like window.GreenSockGlobals = {} before loading any GreenSock files. You can even set up an alias like window.GreenSockGlobals = windows.gs = {} so that you can access everything like gs.TweenLite. Also remember that ALL classes are added to the window.com.greensock object (in their respective packages, like com.greensock.easing.Power1, com.greensock.TweenLite, etc.)
							hasModule = (typeof(module) !== "undefined" && module.exports);
							if (!hasModule && typeof(define) === "function" && define.amd){ //AMD
								define((window.GreenSockAMDPath ? window.GreenSockAMDPath + "/" : "") + ns.split(".").pop(), [], function() { return cl; });
							} else if (ns === moduleName && hasModule){ //node
								module.exports = cl;
							}
						}
						for (i = 0; i < this.sc.length; i++) {
							this.sc[i].check();
						}
					}
				};
				this.check(true);
			},

			//used to create Definition instances (which basically registers a class that has dependencies).
			_gsDefine = window._gsDefine = function(ns, dependencies, func, global) {
				return new Definition(ns, dependencies, func, global);
			},

			//a quick way to create a class that doesn't have any dependencies. Returns the class, but first registers it in the GreenSock namespace so that other classes can grab it (other classes might be dependent on the class).
			_class = gs._class = function(ns, func, global) {
				func = func || function() {};
				_gsDefine(ns, [], function(){ return func; }, global);
				return func;
			};

		_gsDefine.globals = _globals;



/*
 * ----------------------------------------------------------------
 * Ease
 * ----------------------------------------------------------------
 */
		var _baseParams = [0, 0, 1, 1],
			_blankArray = [],
			Ease = _class("easing.Ease", function(func, extraParams, type, power) {
				this._func = func;
				this._type = type || 0;
				this._power = power || 0;
				this._params = extraParams ? _baseParams.concat(extraParams) : _baseParams;
			}, true),
			_easeMap = Ease.map = {},
			_easeReg = Ease.register = function(ease, names, types, create) {
				var na = names.split(","),
					i = na.length,
					ta = (types || "easeIn,easeOut,easeInOut").split(","),
					e, name, j, type;
				while (--i > -1) {
					name = na[i];
					e = create ? _class("easing."+name, null, true) : gs.easing[name] || {};
					j = ta.length;
					while (--j > -1) {
						type = ta[j];
						_easeMap[name + "." + type] = _easeMap[type + name] = e[type] = ease.getRatio ? ease : ease[type] || new ease();
					}
				}
			};

		p = Ease.prototype;
		p._calcEnd = false;
		p.getRatio = function(p) {
			if (this._func) {
				this._params[0] = p;
				return this._func.apply(null, this._params);
			}
			var t = this._type,
				pw = this._power,
				r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;
			if (pw === 1) {
				r *= r;
			} else if (pw === 2) {
				r *= r * r;
			} else if (pw === 3) {
				r *= r * r * r;
			} else if (pw === 4) {
				r *= r * r * r * r;
			}
			return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
		};

		//create all the standard eases like Linear, Quad, Cubic, Quart, Quint, Strong, Power0, Power1, Power2, Power3, and Power4 (each with easeIn, easeOut, and easeInOut)
		a = ["Linear","Quad","Cubic","Quart","Quint,Strong"];
		i = a.length;
		while (--i > -1) {
			p = a[i]+",Power"+i;
			_easeReg(new Ease(null,null,1,i), p, "easeOut", true);
			_easeReg(new Ease(null,null,2,i), p, "easeIn" + ((i === 0) ? ",easeNone" : ""));
			_easeReg(new Ease(null,null,3,i), p, "easeInOut");
		}
		_easeMap.linear = gs.easing.Linear.easeIn;
		_easeMap.swing = gs.easing.Quad.easeInOut; //for jQuery folks


/*
 * ----------------------------------------------------------------
 * EventDispatcher
 * ----------------------------------------------------------------
 */
		var EventDispatcher = _class("events.EventDispatcher", function(target) {
			this._listeners = {};
			this._eventTarget = target || this;
		});
		p = EventDispatcher.prototype;

		p.addEventListener = function(type, callback, scope, useParam, priority) {
			priority = priority || 0;
			var list = this._listeners[type],
				index = 0,
				listener, i;
			if (list == null) {
				this._listeners[type] = list = [];
			}
			i = list.length;
			while (--i > -1) {
				listener = list[i];
				if (listener.c === callback && listener.s === scope) {
					list.splice(i, 1);
				} else if (index === 0 && listener.pr < priority) {
					index = i + 1;
				}
			}
			list.splice(index, 0, {c:callback, s:scope, up:useParam, pr:priority});
			if (this === _ticker && !_tickerActive) {
				_ticker.wake();
			}
		};

		p.removeEventListener = function(type, callback) {
			var list = this._listeners[type], i;
			if (list) {
				i = list.length;
				while (--i > -1) {
					if (list[i].c === callback) {
						list.splice(i, 1);
						return;
					}
				}
			}
		};

		p.dispatchEvent = function(type) {
			var list = this._listeners[type],
				i, t, listener;
			if (list) {
				i = list.length;
				t = this._eventTarget;
				while (--i > -1) {
					listener = list[i];
					if (listener) {
						if (listener.up) {
							listener.c.call(listener.s || t, {type:type, target:t});
						} else {
							listener.c.call(listener.s || t);
						}
					}
				}
			}
		};


/*
 * ----------------------------------------------------------------
 * Ticker
 * ----------------------------------------------------------------
 */
 		var _reqAnimFrame = window.requestAnimationFrame,
			_cancelAnimFrame = window.cancelAnimationFrame,
			_getTime = Date.now || function() {return new Date().getTime();},
			_lastUpdate = _getTime();

		//now try to determine the requestAnimationFrame and cancelAnimationFrame functions and if none are found, we'll use a setTimeout()/clearTimeout() polyfill.
		a = ["ms","moz","webkit","o"];
		i = a.length;
		while (--i > -1 && !_reqAnimFrame) {
			_reqAnimFrame = window[a[i] + "RequestAnimationFrame"];
			_cancelAnimFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"];
		}

		_class("Ticker", function(fps, useRAF) {
			var _self = this,
				_startTime = _getTime(),
				_useRAF = (useRAF !== false && _reqAnimFrame) ? "auto" : false,
				_lagThreshold = 500,
				_adjustedLag = 33,
				_tickWord = "tick", //helps reduce gc burden
				_fps, _req, _id, _gap, _nextTime,
				_tick = function(manual) {
					var elapsed = _getTime() - _lastUpdate,
						overlap, dispatch;
					if (elapsed > _lagThreshold) {
						_startTime += elapsed - _adjustedLag;
					}
					_lastUpdate += elapsed;
					_self.time = (_lastUpdate - _startTime) / 1000;
					overlap = _self.time - _nextTime;
					if (!_fps || overlap > 0 || manual === true) {
						_self.frame++;
						_nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
						dispatch = true;
					}
					if (manual !== true) { //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.
						_id = _req(_tick);
					}
					if (dispatch) {
						_self.dispatchEvent(_tickWord);
					}
				};

			EventDispatcher.call(_self);
			_self.time = _self.frame = 0;
			_self.tick = function() {
				_tick(true);
			};

			_self.lagSmoothing = function(threshold, adjustedLag) {
				_lagThreshold = threshold || (1 / _tinyNum); //zero should be interpreted as basically unlimited
				_adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
			};

			_self.sleep = function() {
				if (_id == null) {
					return;
				}
				if (!_useRAF || !_cancelAnimFrame) {
					clearTimeout(_id);
				} else {
					_cancelAnimFrame(_id);
				}
				_req = _emptyFunc;
				_id = null;
				if (_self === _ticker) {
					_tickerActive = false;
				}
			};

			_self.wake = function(seamless) {
				if (_id !== null) {
					_self.sleep();
				} else if (seamless) {
					_startTime += -_lastUpdate + (_lastUpdate = _getTime());
				} else if (_self.frame > 10) { //don't trigger lagSmoothing if we're just waking up, and make sure that at least 10 frames have elapsed because of the iOS bug that we work around below with the 1.5-second setTimout().
					_lastUpdate = _getTime() - _lagThreshold + 5;
				}
				_req = (_fps === 0) ? _emptyFunc : (!_useRAF || !_reqAnimFrame) ? function(f) { return setTimeout(f, ((_nextTime - _self.time) * 1000 + 1) | 0); } : _reqAnimFrame;
				if (_self === _ticker) {
					_tickerActive = true;
				}
				_tick(2);
			};

			_self.fps = function(value) {
				if (!arguments.length) {
					return _fps;
				}
				_fps = value;
				_gap = 1 / (_fps || 60);
				_nextTime = this.time + _gap;
				_self.wake();
			};

			_self.useRAF = function(value) {
				if (!arguments.length) {
					return _useRAF;
				}
				_self.sleep();
				_useRAF = value;
				_self.fps(_fps);
			};
			_self.fps(fps);

			//a bug in iOS 6 Safari occasionally prevents the requestAnimationFrame from working initially, so we use a 1.5-second timeout that automatically falls back to setTimeout() if it senses this condition.
			setTimeout(function() {
				if (_useRAF === "auto" && _self.frame < 5 && document.visibilityState !== "hidden") {
					_self.useRAF(false);
				}
			}, 1500);
		});

		p = gs.Ticker.prototype = new gs.events.EventDispatcher();
		p.constructor = gs.Ticker;


/*
 * ----------------------------------------------------------------
 * Animation
 * ----------------------------------------------------------------
 */
		var Animation = _class("core.Animation", function(duration, vars) {
				this.vars = vars = vars || {};
				this._duration = this._totalDuration = duration || 0;
				this._delay = Number(vars.delay) || 0;
				this._timeScale = 1;
				this._active = (vars.immediateRender === true);
				this.data = vars.data;
				this._reversed = (vars.reversed === true);

				if (!_rootTimeline) {
					return;
				}
				if (!_tickerActive) { //some browsers (like iOS 6 Safari) shut down JavaScript execution when the tab is disabled and they [occasionally] neglect to start up requestAnimationFrame again when returning - this code ensures that the engine starts up again properly.
					_ticker.wake();
				}

				var tl = this.vars.useFrames ? _rootFramesTimeline : _rootTimeline;
				tl.add(this, tl._time);

				if (this.vars.paused) {
					this.paused(true);
				}
			});

		_ticker = Animation.ticker = new gs.Ticker();
		p = Animation.prototype;
		p._dirty = p._gc = p._initted = p._paused = false;
		p._totalTime = p._time = 0;
		p._rawPrevTime = -1;
		p._next = p._last = p._onUpdate = p._timeline = p.timeline = null;
		p._paused = false;


		//some browsers (like iOS) occasionally drop the requestAnimationFrame event when the user switches to a different tab and then comes back again, so we use a 2-second setTimeout() to sense if/when that condition occurs and then wake() the ticker.
		var _checkTimeout = function() {
				if (_tickerActive && _getTime() - _lastUpdate > 2000) {
					_ticker.wake();
				}
				setTimeout(_checkTimeout, 2000);
			};
		_checkTimeout();


		p.play = function(from, suppressEvents) {
			if (from != null) {
				this.seek(from, suppressEvents);
			}
			return this.reversed(false).paused(false);
		};

		p.pause = function(atTime, suppressEvents) {
			if (atTime != null) {
				this.seek(atTime, suppressEvents);
			}
			return this.paused(true);
		};

		p.resume = function(from, suppressEvents) {
			if (from != null) {
				this.seek(from, suppressEvents);
			}
			return this.paused(false);
		};

		p.seek = function(time, suppressEvents) {
			return this.totalTime(Number(time), suppressEvents !== false);
		};

		p.restart = function(includeDelay, suppressEvents) {
			return this.reversed(false).paused(false).totalTime(includeDelay ? -this._delay : 0, (suppressEvents !== false), true);
		};

		p.reverse = function(from, suppressEvents) {
			if (from != null) {
				this.seek((from || this.totalDuration()), suppressEvents);
			}
			return this.reversed(true).paused(false);
		};

		p.render = function(time, suppressEvents, force) {
			//stub - we override this method in subclasses.
		};

		p.invalidate = function() {
			this._time = this._totalTime = 0;
			this._initted = this._gc = false;
			this._rawPrevTime = -1;
			if (this._gc || !this.timeline) {
				this._enabled(true);
			}
			return this;
		};

		p.isActive = function() {
			var tl = this._timeline, //the 2 root timelines won't have a _timeline; they're always active.
				startTime = this._startTime,
				rawTime;
			return (!tl || (!this._gc && !this._paused && tl.isActive() && (rawTime = tl.rawTime()) >= startTime && rawTime < startTime + this.totalDuration() / this._timeScale));
		};

		p._enabled = function (enabled, ignoreTimeline) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			this._gc = !enabled;
			this._active = this.isActive();
			if (ignoreTimeline !== true) {
				if (enabled && !this.timeline) {
					this._timeline.add(this, this._startTime - this._delay);
				} else if (!enabled && this.timeline) {
					this._timeline._remove(this, true);
				}
			}
			return false;
		};


		p._kill = function(vars, target) {
			return this._enabled(false, false);
		};

		p.kill = function(vars, target) {
			this._kill(vars, target);
			return this;
		};

		p._uncache = function(includeSelf) {
			var tween = includeSelf ? this : this.timeline;
			while (tween) {
				tween._dirty = true;
				tween = tween.timeline;
			}
			return this;
		};

		p._swapSelfInParams = function(params) {
			var i = params.length,
				copy = params.concat();
			while (--i > -1) {
				if (params[i] === "{self}") {
					copy[i] = this;
				}
			}
			return copy;
		};

		p._callback = function(type) {
			var v = this.vars;
			v[type].apply(v[type + "Scope"] || v.callbackScope || this, v[type + "Params"] || _blankArray);
		};

//----Animation getters/setters --------------------------------------------------------

		p.eventCallback = function(type, callback, params, scope) {
			if ((type || "").substr(0,2) === "on") {
				var v = this.vars;
				if (arguments.length === 1) {
					return v[type];
				}
				if (callback == null) {
					delete v[type];
				} else {
					v[type] = callback;
					v[type + "Params"] = (_isArray(params) && params.join("").indexOf("{self}") !== -1) ? this._swapSelfInParams(params) : params;
					v[type + "Scope"] = scope;
				}
				if (type === "onUpdate") {
					this._onUpdate = callback;
				}
			}
			return this;
		};

		p.delay = function(value) {
			if (!arguments.length) {
				return this._delay;
			}
			if (this._timeline.smoothChildTiming) {
				this.startTime( this._startTime + value - this._delay );
			}
			this._delay = value;
			return this;
		};

		p.duration = function(value) {
			if (!arguments.length) {
				this._dirty = false;
				return this._duration;
			}
			this._duration = this._totalDuration = value;
			this._uncache(true); //true in case it's a TweenMax or TimelineMax that has a repeat - we'll need to refresh the totalDuration.
			if (this._timeline.smoothChildTiming) if (this._time > 0) if (this._time < this._duration) if (value !== 0) {
				this.totalTime(this._totalTime * (value / this._duration), true);
			}
			return this;
		};

		p.totalDuration = function(value) {
			this._dirty = false;
			return (!arguments.length) ? this._totalDuration : this.duration(value);
		};

		p.time = function(value, suppressEvents) {
			if (!arguments.length) {
				return this._time;
			}
			if (this._dirty) {
				this.totalDuration();
			}
			return this.totalTime((value > this._duration) ? this._duration : value, suppressEvents);
		};

		p.totalTime = function(time, suppressEvents, uncapped) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			if (!arguments.length) {
				return this._totalTime;
			}
			if (this._timeline) {
				if (time < 0 && !uncapped) {
					time += this.totalDuration();
				}
				if (this._timeline.smoothChildTiming) {
					if (this._dirty) {
						this.totalDuration();
					}
					var totalDuration = this._totalDuration,
						tl = this._timeline;
					if (time > totalDuration && !uncapped) {
						time = totalDuration;
					}
					this._startTime = (this._paused ? this._pauseTime : tl._time) - ((!this._reversed ? time : totalDuration - time) / this._timeScale);
					if (!tl._dirty) { //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
						this._uncache(false);
					}
					//in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The startTime of that child would get pushed out, but one of the ancestors may have completed.
					if (tl._timeline) {
						while (tl._timeline) {
							if (tl._timeline._time !== (tl._startTime + tl._totalTime) / tl._timeScale) {
								tl.totalTime(tl._totalTime, true);
							}
							tl = tl._timeline;
						}
					}
				}
				if (this._gc) {
					this._enabled(true, false);
				}
				if (this._totalTime !== time || this._duration === 0) {
					if (_lazyTweens.length) {
						_lazyRender();
					}
					this.render(time, suppressEvents, false);
					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
						_lazyRender();
					}
				}
			}
			return this;
		};

		p.progress = p.totalProgress = function(value, suppressEvents) {
			var duration = this.duration();
			return (!arguments.length) ? (duration ? this._time / duration : this.ratio) : this.totalTime(duration * value, suppressEvents);
		};

		p.startTime = function(value) {
			if (!arguments.length) {
				return this._startTime;
			}
			if (value !== this._startTime) {
				this._startTime = value;
				if (this.timeline) if (this.timeline._sortChildren) {
					this.timeline.add(this, value - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
				}
			}
			return this;
		};

		p.endTime = function(includeRepeats) {
			return this._startTime + ((includeRepeats != false) ? this.totalDuration() : this.duration()) / this._timeScale;
		};

		p.timeScale = function(value) {
			if (!arguments.length) {
				return this._timeScale;
			}
			value = value || _tinyNum; //can't allow zero because it'll throw the math off
			if (this._timeline && this._timeline.smoothChildTiming) {
				var pauseTime = this._pauseTime,
					t = (pauseTime || pauseTime === 0) ? pauseTime : this._timeline.totalTime();
				this._startTime = t - ((t - this._startTime) * this._timeScale / value);
			}
			this._timeScale = value;
			return this._uncache(false);
		};

		p.reversed = function(value) {
			if (!arguments.length) {
				return this._reversed;
			}
			if (value != this._reversed) {
				this._reversed = value;
				this.totalTime(((this._timeline && !this._timeline.smoothChildTiming) ? this.totalDuration() - this._totalTime : this._totalTime), true);
			}
			return this;
		};

		p.paused = function(value) {
			if (!arguments.length) {
				return this._paused;
			}
			var tl = this._timeline,
				raw, elapsed;
			if (value != this._paused) if (tl) {
				if (!_tickerActive && !value) {
					_ticker.wake();
				}
				raw = tl.rawTime();
				elapsed = raw - this._pauseTime;
				if (!value && tl.smoothChildTiming) {
					this._startTime += elapsed;
					this._uncache(false);
				}
				this._pauseTime = value ? raw : null;
				this._paused = value;
				this._active = this.isActive();
				if (!value && elapsed !== 0 && this._initted && this.duration()) {
					raw = tl.smoothChildTiming ? this._totalTime : (raw - this._startTime) / this._timeScale;
					this.render(raw, (raw === this._totalTime), true); //in case the target's properties changed via some other tween or manual update by the user, we should force a render.
				}
			}
			if (this._gc && !value) {
				this._enabled(true, false);
			}
			return this;
		};


/*
 * ----------------------------------------------------------------
 * SimpleTimeline
 * ----------------------------------------------------------------
 */
		var SimpleTimeline = _class("core.SimpleTimeline", function(vars) {
			Animation.call(this, 0, vars);
			this.autoRemoveChildren = this.smoothChildTiming = true;
		});

		p = SimpleTimeline.prototype = new Animation();
		p.constructor = SimpleTimeline;
		p.kill()._gc = false;
		p._first = p._last = p._recent = null;
		p._sortChildren = false;

		p.add = p.insert = function(child, position, align, stagger) {
			var prevTween, st;
			child._startTime = Number(position || 0) + child._delay;
			if (child._paused) if (this !== child._timeline) { //we only adjust the _pauseTime if it wasn't in this timeline already. Remember, sometimes a tween will be inserted again into the same timeline when its startTime is changed so that the tweens in the TimelineLite/Max are re-ordered properly in the linked list (so everything renders in the proper order).
				child._pauseTime = child._startTime + ((this.rawTime() - child._startTime) / child._timeScale);
			}
			if (child.timeline) {
				child.timeline._remove(child, true); //removes from existing timeline so that it can be properly added to this one.
			}
			child.timeline = child._timeline = this;
			if (child._gc) {
				child._enabled(true, true);
			}
			prevTween = this._last;
			if (this._sortChildren) {
				st = child._startTime;
				while (prevTween && prevTween._startTime > st) {
					prevTween = prevTween._prev;
				}
			}
			if (prevTween) {
				child._next = prevTween._next;
				prevTween._next = child;
			} else {
				child._next = this._first;
				this._first = child;
			}
			if (child._next) {
				child._next._prev = child;
			} else {
				this._last = child;
			}
			child._prev = prevTween;
			this._recent = child;
			if (this._timeline) {
				this._uncache(true);
			}
			return this;
		};

		p._remove = function(tween, skipDisable) {
			if (tween.timeline === this) {
				if (!skipDisable) {
					tween._enabled(false, true);
				}

				if (tween._prev) {
					tween._prev._next = tween._next;
				} else if (this._first === tween) {
					this._first = tween._next;
				}
				if (tween._next) {
					tween._next._prev = tween._prev;
				} else if (this._last === tween) {
					this._last = tween._prev;
				}
				tween._next = tween._prev = tween.timeline = null;
				if (tween === this._recent) {
					this._recent = this._last;
				}

				if (this._timeline) {
					this._uncache(true);
				}
			}
			return this;
		};

		p.render = function(time, suppressEvents, force) {
			var tween = this._first,
				next;
			this._totalTime = this._time = this._rawPrevTime = time;
			while (tween) {
				next = tween._next; //record it here because the value could change after rendering...
				if (tween._active || (time >= tween._startTime && !tween._paused)) {
					if (!tween._reversed) {
						tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
					} else {
						tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
					}
				}
				tween = next;
			}
		};

		p.rawTime = function() {
			if (!_tickerActive) {
				_ticker.wake();
			}
			return this._totalTime;
		};

/*
 * ----------------------------------------------------------------
 * TweenLite
 * ----------------------------------------------------------------
 */
		var TweenLite = _class("TweenLite", function(target, duration, vars) {
				Animation.call(this, duration, vars);
				this.render = TweenLite.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)

				if (target == null) {
					throw "Cannot tween a null target.";
				}

				this.target = target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;

				var isSelector = (target.jquery || (target.length && target !== window && target[0] && (target[0] === window || (target[0].nodeType && target[0].style && !target.nodeType)))),
					overwrite = this.vars.overwrite,
					i, targ, targets;

				this._overwrite = overwrite = (overwrite == null) ? _overwriteLookup[TweenLite.defaultOverwrite] : (typeof(overwrite) === "number") ? overwrite >> 0 : _overwriteLookup[overwrite];

				if ((isSelector || target instanceof Array || (target.push && _isArray(target))) && typeof(target[0]) !== "number") {
					this._targets = targets = _slice(target);  //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
					this._propLookup = [];
					this._siblings = [];
					for (i = 0; i < targets.length; i++) {
						targ = targets[i];
						if (!targ) {
							targets.splice(i--, 1);
							continue;
						} else if (typeof(targ) === "string") {
							targ = targets[i--] = TweenLite.selector(targ); //in case it's an array of strings
							if (typeof(targ) === "string") {
								targets.splice(i+1, 1); //to avoid an endless loop (can't imagine why the selector would return a string, but just in case)
							}
							continue;
						} else if (targ.length && targ !== window && targ[0] && (targ[0] === window || (targ[0].nodeType && targ[0].style && !targ.nodeType))) { //in case the user is passing in an array of selector objects (like jQuery objects), we need to check one more level and pull things out if necessary. Also note that <select> elements pass all the criteria regarding length and the first child having style, so we must also check to ensure the target isn't an HTML node itself.
							targets.splice(i--, 1);
							this._targets = targets = targets.concat(_slice(targ));
							continue;
						}
						this._siblings[i] = _register(targ, this, false);
						if (overwrite === 1) if (this._siblings[i].length > 1) {
							_applyOverwrite(targ, this, null, 1, this._siblings[i]);
						}
					}

				} else {
					this._propLookup = {};
					this._siblings = _register(target, this, false);
					if (overwrite === 1) if (this._siblings.length > 1) {
						_applyOverwrite(target, this, null, 1, this._siblings);
					}
				}
				if (this.vars.immediateRender || (duration === 0 && this._delay === 0 && this.vars.immediateRender !== false)) {
					this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
					this.render(-this._delay);
				}
			}, true),
			_isSelector = function(v) {
				return (v && v.length && v !== window && v[0] && (v[0] === window || (v[0].nodeType && v[0].style && !v.nodeType))); //we cannot check "nodeType" if the target is window from within an iframe, otherwise it will trigger a security error in some browsers like Firefox.
			},
			_autoCSS = function(vars, target) {
				var css = {},
					p;
				for (p in vars) {
					if (!_reservedProps[p] && (!(p in target) || p === "transform" || p === "x" || p === "y" || p === "width" || p === "height" || p === "className" || p === "border") && (!_plugins[p] || (_plugins[p] && _plugins[p]._autoCSS))) { //note: <img> elements contain read-only "x" and "y" properties. We should also prioritize editing css width/height rather than the element's properties.
						css[p] = vars[p];
						delete vars[p];
					}
				}
				vars.css = css;
			};

		p = TweenLite.prototype = new Animation();
		p.constructor = TweenLite;
		p.kill()._gc = false;

//----TweenLite defaults, overwrite management, and root updates ----------------------------------------------------

		p.ratio = 0;
		p._firstPT = p._targets = p._overwrittenProps = p._startAt = null;
		p._notifyPluginsOfEnabled = p._lazy = false;

		TweenLite.version = "1.18.2";
		TweenLite.defaultEase = p._ease = new Ease(null, null, 1, 1);
		TweenLite.defaultOverwrite = "auto";
		TweenLite.ticker = _ticker;
		TweenLite.autoSleep = 120;
		TweenLite.lagSmoothing = function(threshold, adjustedLag) {
			_ticker.lagSmoothing(threshold, adjustedLag);
		};

		TweenLite.selector = window.$ || window.jQuery || function(e) {
			var selector = window.$ || window.jQuery;
			if (selector) {
				TweenLite.selector = selector;
				return selector(e);
			}
			return (typeof(document) === "undefined") ? e : (document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById((e.charAt(0) === "#") ? e.substr(1) : e));
		};

		var _lazyTweens = [],
			_lazyLookup = {},
			_numbersExp = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
			//_nonNumbersExp = /(?:([\-+](?!(\d|=)))|[^\d\-+=e]|(e(?![\-+][\d])))+/ig,
			_setRatio = function(v) {
				var pt = this._firstPT,
					min = 0.000001,
					val;
				while (pt) {
					val = !pt.blob ? pt.c * v + pt.s : v ? this.join("") : this.start;
					if (pt.r) {
						val = Math.round(val);
					} else if (val < min) if (val > -min) { //prevents issues with converting very small numbers to strings in the browser
						val = 0;
					}
					if (!pt.f) {
						pt.t[pt.p] = val;
					} else if (pt.fp) {
						pt.t[pt.p](pt.fp, val);
					} else {
						pt.t[pt.p](val);
					}
					pt = pt._next;
				}
			},
			//compares two strings (start/end), finds the numbers that are different and spits back an array representing the whole value but with the changing values isolated as elements. For example, "rgb(0,0,0)" and "rgb(100,50,0)" would become ["rgb(", 0, ",", 50, ",0)"]. Notice it merges the parts that are identical (performance optimization). The array also has a linked list of PropTweens attached starting with _firstPT that contain the tweening data (t, p, s, c, f, etc.). It also stores the starting value as a "start" property so that we can revert to it if/when necessary, like when a tween rewinds fully. If the quantity of numbers differs between the start and end, it will always prioritize the end value(s). The pt parameter is optional - it's for a PropTween that will be appended to the end of the linked list and is typically for actually setting the value after all of the elements have been updated (with array.join("")).
			_blobDif = function(start, end, filter, pt) {
				var a = [start, end],
					charIndex = 0,
					s = "",
					color = 0,
					startNums, endNums, num, i, l, nonNumbers, currentNum;
				a.start = start;
				if (filter) {
					filter(a); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.
					start = a[0];
					end = a[1];
				}
				a.length = 0;
				startNums = start.match(_numbersExp) || [];
				endNums = end.match(_numbersExp) || [];
				if (pt) {
					pt._next = null;
					pt.blob = 1;
					a._firstPT = pt; //apply last in the linked list (which means inserting it first)
				}
				l = endNums.length;
				for (i = 0; i < l; i++) {
					currentNum = endNums[i];
					nonNumbers = end.substr(charIndex, end.indexOf(currentNum, charIndex)-charIndex);
					s += (nonNumbers || !i) ? nonNumbers : ","; //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
					charIndex += nonNumbers.length;
					if (color) { //sense rgba() values and round them.
						color = (color + 1) % 5;
					} else if (nonNumbers.substr(-5) === "rgba(") {
						color = 1;
					}
					if (currentNum === startNums[i] || startNums.length <= i) {
						s += currentNum;
					} else {
						if (s) {
							a.push(s);
							s = "";
						}
						num = parseFloat(startNums[i]);
						a.push(num);
						a._firstPT = {_next: a._firstPT, t:a, p: a.length-1, s:num, c:((currentNum.charAt(1) === "=") ? parseInt(currentNum.charAt(0) + "1", 10) * parseFloat(currentNum.substr(2)) : (parseFloat(currentNum) - num)) || 0, f:0, r:(color && color < 4)};
						//note: we don't set _prev because we'll never need to remove individual PropTweens from this list.
					}
					charIndex += currentNum.length;
				}
				s += end.substr(charIndex);
				if (s) {
					a.push(s);
				}
				a.setRatio = _setRatio;
				return a;
			},
			//note: "funcParam" is only necessary for function-based getters/setters that require an extra parameter like getAttribute("width") and setAttribute("width", value). In this example, funcParam would be "width". Used by AttrPlugin for example.
			_addPropTween = function(target, prop, start, end, overwriteProp, round, funcParam, stringFilter) {
				var s = (start === "get") ? target[prop] : start,
					type = typeof(target[prop]),
					isRelative = (typeof(end) === "string" && end.charAt(1) === "="),
					pt = {t:target, p:prop, s:s, f:(type === "function"), pg:0, n:overwriteProp || prop, r:round, pr:0, c:isRelative ? parseInt(end.charAt(0) + "1", 10) * parseFloat(end.substr(2)) : (parseFloat(end) - s) || 0},
					blob, getterName;
				if (type !== "number") {
					if (type === "function" && start === "get") {
						getterName = ((prop.indexOf("set") || typeof(target["get" + prop.substr(3)]) !== "function") ? prop : "get" + prop.substr(3));
						pt.s = s = funcParam ? target[getterName](funcParam) : target[getterName]();
					}
					if (typeof(s) === "string" && (funcParam || isNaN(s))) {
						//a blob (string that has multiple numbers in it)
						pt.fp = funcParam;
						blob = _blobDif(s, end, stringFilter || TweenLite.defaultStringFilter, pt);
						pt = {t:blob, p:"setRatio", s:0, c:1, f:2, pg:0, n:overwriteProp || prop, pr:0}; //"2" indicates it's a Blob property tween. Needed for RoundPropsPlugin for example.
					} else if (!isRelative) {
						pt.s = parseFloat(s);
						pt.c = (parseFloat(end) - pt.s) || 0;
					}
				}
				if (pt.c) { //only add it to the linked list if there's a change.
					if ((pt._next = this._firstPT)) {
						pt._next._prev = pt;
					}
					this._firstPT = pt;
					return pt;
				}
			},
			_internals = TweenLite._internals = {isArray:_isArray, isSelector:_isSelector, lazyTweens:_lazyTweens, blobDif:_blobDif}, //gives us a way to expose certain private values to other GreenSock classes without contaminating tha main TweenLite object.
			_plugins = TweenLite._plugins = {},
			_tweenLookup = _internals.tweenLookup = {},
			_tweenLookupNum = 0,
			_reservedProps = _internals.reservedProps = {ease:1, delay:1, overwrite:1, onComplete:1, onCompleteParams:1, onCompleteScope:1, useFrames:1, runBackwards:1, startAt:1, onUpdate:1, onUpdateParams:1, onUpdateScope:1, onStart:1, onStartParams:1, onStartScope:1, onReverseComplete:1, onReverseCompleteParams:1, onReverseCompleteScope:1, onRepeat:1, onRepeatParams:1, onRepeatScope:1, easeParams:1, yoyo:1, immediateRender:1, repeat:1, repeatDelay:1, data:1, paused:1, reversed:1, autoCSS:1, lazy:1, onOverwrite:1, callbackScope:1, stringFilter:1},
			_overwriteLookup = {none:0, all:1, auto:2, concurrent:3, allOnStart:4, preexisting:5, "true":1, "false":0},
			_rootFramesTimeline = Animation._rootFramesTimeline = new SimpleTimeline(),
			_rootTimeline = Animation._rootTimeline = new SimpleTimeline(),
			_nextGCFrame = 30,
			_lazyRender = _internals.lazyRender = function() {
				var i = _lazyTweens.length,
					tween;
				_lazyLookup = {};
				while (--i > -1) {
					tween = _lazyTweens[i];
					if (tween && tween._lazy !== false) {
						tween.render(tween._lazy[0], tween._lazy[1], true);
						tween._lazy = false;
					}
				}
				_lazyTweens.length = 0;
			};

		_rootTimeline._startTime = _ticker.time;
		_rootFramesTimeline._startTime = _ticker.frame;
		_rootTimeline._active = _rootFramesTimeline._active = true;
		setTimeout(_lazyRender, 1); //on some mobile devices, there isn't a "tick" before code runs which means any lazy renders wouldn't run before the next official "tick".

		Animation._updateRoot = TweenLite.render = function() {
				var i, a, p;
				if (_lazyTweens.length) { //if code is run outside of the requestAnimationFrame loop, there may be tweens queued AFTER the engine refreshed, so we need to ensure any pending renders occur before we refresh again.
					_lazyRender();
				}
				_rootTimeline.render((_ticker.time - _rootTimeline._startTime) * _rootTimeline._timeScale, false, false);
				_rootFramesTimeline.render((_ticker.frame - _rootFramesTimeline._startTime) * _rootFramesTimeline._timeScale, false, false);
				if (_lazyTweens.length) {
					_lazyRender();
				}
				if (_ticker.frame >= _nextGCFrame) { //dump garbage every 120 frames or whatever the user sets TweenLite.autoSleep to
					_nextGCFrame = _ticker.frame + (parseInt(TweenLite.autoSleep, 10) || 120);
					for (p in _tweenLookup) {
						a = _tweenLookup[p].tweens;
						i = a.length;
						while (--i > -1) {
							if (a[i]._gc) {
								a.splice(i, 1);
							}
						}
						if (a.length === 0) {
							delete _tweenLookup[p];
						}
					}
					//if there are no more tweens in the root timelines, or if they're all paused, make the _timer sleep to reduce load on the CPU slightly
					p = _rootTimeline._first;
					if (!p || p._paused) if (TweenLite.autoSleep && !_rootFramesTimeline._first && _ticker._listeners.tick.length === 1) {
						while (p && p._paused) {
							p = p._next;
						}
						if (!p) {
							_ticker.sleep();
						}
					}
				}
			};

		_ticker.addEventListener("tick", Animation._updateRoot);

		var _register = function(target, tween, scrub) {
				var id = target._gsTweenID, a, i;
				if (!_tweenLookup[id || (target._gsTweenID = id = "t" + (_tweenLookupNum++))]) {
					_tweenLookup[id] = {target:target, tweens:[]};
				}
				if (tween) {
					a = _tweenLookup[id].tweens;
					a[(i = a.length)] = tween;
					if (scrub) {
						while (--i > -1) {
							if (a[i] === tween) {
								a.splice(i, 1);
							}
						}
					}
				}
				return _tweenLookup[id].tweens;
			},
			_onOverwrite = function(overwrittenTween, overwritingTween, target, killedProps) {
				var func = overwrittenTween.vars.onOverwrite, r1, r2;
				if (func) {
					r1 = func(overwrittenTween, overwritingTween, target, killedProps);
				}
				func = TweenLite.onOverwrite;
				if (func) {
					r2 = func(overwrittenTween, overwritingTween, target, killedProps);
				}
				return (r1 !== false && r2 !== false);
			},
			_applyOverwrite = function(target, tween, props, mode, siblings) {
				var i, changed, curTween, l;
				if (mode === 1 || mode >= 4) {
					l = siblings.length;
					for (i = 0; i < l; i++) {
						if ((curTween = siblings[i]) !== tween) {
							if (!curTween._gc) {
								if (curTween._kill(null, target, tween)) {
									changed = true;
								}
							}
						} else if (mode === 5) {
							break;
						}
					}
					return changed;
				}
				//NOTE: Add 0.0000000001 to overcome floating point errors that can cause the startTime to be VERY slightly off (when a tween's time() is set for example)
				var startTime = tween._startTime + _tinyNum,
					overlaps = [],
					oCount = 0,
					zeroDur = (tween._duration === 0),
					globalStart;
				i = siblings.length;
				while (--i > -1) {
					if ((curTween = siblings[i]) === tween || curTween._gc || curTween._paused) {
						//ignore
					} else if (curTween._timeline !== tween._timeline) {
						globalStart = globalStart || _checkOverlap(tween, 0, zeroDur);
						if (_checkOverlap(curTween, globalStart, zeroDur) === 0) {
							overlaps[oCount++] = curTween;
						}
					} else if (curTween._startTime <= startTime) if (curTween._startTime + curTween.totalDuration() / curTween._timeScale > startTime) if (!((zeroDur || !curTween._initted) && startTime - curTween._startTime <= 0.0000000002)) {
						overlaps[oCount++] = curTween;
					}
				}

				i = oCount;
				while (--i > -1) {
					curTween = overlaps[i];
					if (mode === 2) if (curTween._kill(props, target, tween)) {
						changed = true;
					}
					if (mode !== 2 || (!curTween._firstPT && curTween._initted)) {
						if (mode !== 2 && !_onOverwrite(curTween, tween)) {
							continue;
						}
						if (curTween._enabled(false, false)) { //if all property tweens have been overwritten, kill the tween.
							changed = true;
						}
					}
				}
				return changed;
			},
			_checkOverlap = function(tween, reference, zeroDur) {
				var tl = tween._timeline,
					ts = tl._timeScale,
					t = tween._startTime;
				while (tl._timeline) {
					t += tl._startTime;
					ts *= tl._timeScale;
					if (tl._paused) {
						return -100;
					}
					tl = tl._timeline;
				}
				t /= ts;
				return (t > reference) ? t - reference : ((zeroDur && t === reference) || (!tween._initted && t - reference < 2 * _tinyNum)) ? _tinyNum : ((t += tween.totalDuration() / tween._timeScale / ts) > reference + _tinyNum) ? 0 : t - reference - _tinyNum;
			};


//---- TweenLite instance methods -----------------------------------------------------------------------------

		p._init = function() {
			var v = this.vars,
				op = this._overwrittenProps,
				dur = this._duration,
				immediate = !!v.immediateRender,
				ease = v.ease,
				i, initPlugins, pt, p, startVars;
			if (v.startAt) {
				if (this._startAt) {
					this._startAt.render(-1, true); //if we've run a startAt previously (when the tween instantiated), we should revert it so that the values re-instantiate correctly particularly for relative tweens. Without this, a TweenLite.fromTo(obj, 1, {x:"+=100"}, {x:"-=100"}), for example, would actually jump to +=200 because the startAt would run twice, doubling the relative change.
					this._startAt.kill();
				}
				startVars = {};
				for (p in v.startAt) { //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, 1, from, to).fromTo(e, 1, to, from);
					startVars[p] = v.startAt[p];
				}
				startVars.overwrite = false;
				startVars.immediateRender = true;
				startVars.lazy = (immediate && v.lazy !== false);
				startVars.startAt = startVars.delay = null; //no nesting of startAt objects allowed (otherwise it could cause an infinite loop).
				this._startAt = TweenLite.to(this.target, 0, startVars);
				if (immediate) {
					if (this._time > 0) {
						this._startAt = null; //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in TimelineLite/Max instances where immediateRender was false (which is the default in the convenience methods like from()).
					} else if (dur !== 0) {
						return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a TimelineLite or TimelineMax, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
					}
				}
			} else if (v.runBackwards && dur !== 0) {
				//from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
				if (this._startAt) {
					this._startAt.render(-1, true);
					this._startAt.kill();
					this._startAt = null;
				} else {
					if (this._time !== 0) { //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0
						immediate = false;
					}
					pt = {};
					for (p in v) { //copy props into a new object and skip any reserved props, otherwise onComplete or onUpdate or onStart could fire. We should, however, permit autoCSS to go through.
						if (!_reservedProps[p] || p === "autoCSS") {
							pt[p] = v[p];
						}
					}
					pt.overwrite = 0;
					pt.data = "isFromStart"; //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
					pt.lazy = (immediate && v.lazy !== false);
					pt.immediateRender = immediate; //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
					this._startAt = TweenLite.to(this.target, 0, pt);
					if (!immediate) {
						this._startAt._init(); //ensures that the initial values are recorded
						this._startAt._enabled(false); //no need to have the tween render on the next cycle. Disable it because we'll always manually control the renders of the _startAt tween.
						if (this.vars.immediateRender) {
							this._startAt = null;
						}
					} else if (this._time === 0) {
						return;
					}
				}
			}
			this._ease = ease = (!ease) ? TweenLite.defaultEase : (ease instanceof Ease) ? ease : (typeof(ease) === "function") ? new Ease(ease, v.easeParams) : _easeMap[ease] || TweenLite.defaultEase;
			if (v.easeParams instanceof Array && ease.config) {
				this._ease = ease.config.apply(ease, v.easeParams);
			}
			this._easeType = this._ease._type;
			this._easePower = this._ease._power;
			this._firstPT = null;

			if (this._targets) {
				i = this._targets.length;
				while (--i > -1) {
					if ( this._initProps( this._targets[i], (this._propLookup[i] = {}), this._siblings[i], (op ? op[i] : null)) ) {
						initPlugins = true;
					}
				}
			} else {
				initPlugins = this._initProps(this.target, this._propLookup, this._siblings, op);
			}

			if (initPlugins) {
				TweenLite._onPluginEvent("_onInitAllProps", this); //reorders the array in order of priority. Uses a static TweenPlugin method in order to minimize file size in TweenLite
			}
			if (op) if (!this._firstPT) if (typeof(this.target) !== "function") { //if all tweening properties have been overwritten, kill the tween. If the target is a function, it's probably a delayedCall so let it live.
				this._enabled(false, false);
			}
			if (v.runBackwards) {
				pt = this._firstPT;
				while (pt) {
					pt.s += pt.c;
					pt.c = -pt.c;
					pt = pt._next;
				}
			}
			this._onUpdate = v.onUpdate;
			this._initted = true;
		};

		p._initProps = function(target, propLookup, siblings, overwrittenProps) {
			var p, i, initPlugins, plugin, pt, v;
			if (target == null) {
				return false;
			}

			if (_lazyLookup[target._gsTweenID]) {
				_lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)
			}

			if (!this.vars.css) if (target.style) if (target !== window && target.nodeType) if (_plugins.css) if (this.vars.autoCSS !== false) { //it's so common to use TweenLite/Max to animate the css of DOM elements, we assume that if the target is a DOM element, that's what is intended (a convenience so that users don't have to wrap things in css:{}, although we still recommend it for a slight performance boost and better specificity). Note: we cannot check "nodeType" on the window inside an iframe.
				_autoCSS(this.vars, target);
			}
			for (p in this.vars) {
				v = this.vars[p];
				if (_reservedProps[p]) {
					if (v) if ((v instanceof Array) || (v.push && _isArray(v))) if (v.join("").indexOf("{self}") !== -1) {
						this.vars[p] = v = this._swapSelfInParams(v, this);
					}

				} else if (_plugins[p] && (plugin = new _plugins[p]())._onInitTween(target, this.vars[p], this)) {

					//t - target 		[object]
					//p - property 		[string]
					//s - start			[number]
					//c - change		[number]
					//f - isFunction	[boolean]
					//n - name			[string]
					//pg - isPlugin 	[boolean]
					//pr - priority		[number]
					this._firstPT = pt = {_next:this._firstPT, t:plugin, p:"setRatio", s:0, c:1, f:1, n:p, pg:1, pr:plugin._priority};
					i = plugin._overwriteProps.length;
					while (--i > -1) {
						propLookup[plugin._overwriteProps[i]] = this._firstPT;
					}
					if (plugin._priority || plugin._onInitAllProps) {
						initPlugins = true;
					}
					if (plugin._onDisable || plugin._onEnable) {
						this._notifyPluginsOfEnabled = true;
					}
					if (pt._next) {
						pt._next._prev = pt;
					}

				} else {
					propLookup[p] = _addPropTween.call(this, target, p, "get", v, p, 0, null, this.vars.stringFilter);
				}
			}

			if (overwrittenProps) if (this._kill(overwrittenProps, target)) { //another tween may have tried to overwrite properties of this tween before init() was called (like if two tweens start at the same time, the one created second will run first)
				return this._initProps(target, propLookup, siblings, overwrittenProps);
			}
			if (this._overwrite > 1) if (this._firstPT) if (siblings.length > 1) if (_applyOverwrite(target, this, propLookup, this._overwrite, siblings)) {
				this._kill(propLookup, target);
				return this._initProps(target, propLookup, siblings, overwrittenProps);
			}
			if (this._firstPT) if ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration)) { //zero duration tweens don't lazy render by default; everything else does.
				_lazyLookup[target._gsTweenID] = true;
			}
			return initPlugins;
		};

		p.render = function(time, suppressEvents, force) {
			var prevTime = this._time,
				duration = this._duration,
				prevRawPrevTime = this._rawPrevTime,
				isComplete, callback, pt, rawPrevTime;
			if (time >= duration - 0.0000001) { //to work around occasional floating point math artifacts.
				this._totalTime = this._time = duration;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
				if (!this._reversed ) {
					isComplete = true;
					callback = "onComplete";
					force = (force || this._timeline.autoRemoveChildren); //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
				}
				if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
					if (this._startTime === this._timeline._duration) { //if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
						time = 0;
					}
					if (prevRawPrevTime < 0 || (time <= 0 && time >= -0.0000001) || (prevRawPrevTime === _tinyNum && this.data !== "isPause")) if (prevRawPrevTime !== time) { //note: when this.data is "isPause", it's a callback added by addPause() on a timeline that we should not be triggered when LEAVING its exact start time. In other words, tl.addPause(1).play(1) shouldn't pause.
						force = true;
						if (prevRawPrevTime > _tinyNum) {
							callback = "onReverseComplete";
						}
					}
					this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				}

			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				this._totalTime = this._time = 0;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
				if (prevTime !== 0 || (duration === 0 && prevRawPrevTime > 0)) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						if (prevRawPrevTime >= 0 && !(prevRawPrevTime === _tinyNum && this.data === "isPause")) {
							force = true;
						}
						this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					}
				}
				if (!this._initted) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
					force = true;
				}
			} else {
				this._totalTime = this._time = time;

				if (this._easeType) {
					var r = time / duration, type = this._easeType, pow = this._easePower;
					if (type === 1 || (type === 3 && r >= 0.5)) {
						r = 1 - r;
					}
					if (type === 3) {
						r *= 2;
					}
					if (pow === 1) {
						r *= r;
					} else if (pow === 2) {
						r *= r * r;
					} else if (pow === 3) {
						r *= r * r * r;
					} else if (pow === 4) {
						r *= r * r * r * r;
					}

					if (type === 1) {
						this.ratio = 1 - r;
					} else if (type === 2) {
						this.ratio = r;
					} else if (time / duration < 0.5) {
						this.ratio = r / 2;
					} else {
						this.ratio = 1 - (r / 2);
					}

				} else {
					this.ratio = this._ease.getRatio(time / duration);
				}
			}

			if (this._time === prevTime && !force) {
				return;
			} else if (!this._initted) {
				this._init();
				if (!this._initted || this._gc) { //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
					return;
				} else if (!force && this._firstPT && ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration))) {
					this._time = this._totalTime = prevTime;
					this._rawPrevTime = prevRawPrevTime;
					_lazyTweens.push(this);
					this._lazy = [time, suppressEvents];
					return;
				}
				//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
				if (this._time && !isComplete) {
					this.ratio = this._ease.getRatio(this._time / duration);
				} else if (isComplete && this._ease._calcEnd) {
					this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
				}
			}
			if (this._lazy !== false) { //in case a lazy render is pending, we should flush it because the new render is occurring now (imagine a lazy tween instantiating and then immediately the user calls tween.seek(tween.duration()), skipping to the end - the end render would be forced, and then if we didn't flush the lazy render, it'd fire AFTER the seek(), rendering it at the wrong time.
				this._lazy = false;
			}
			if (!this._active) if (!this._paused && this._time !== prevTime && time >= 0) {
				this._active = true;  //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
			}
			if (prevTime === 0) {
				if (this._startAt) {
					if (time >= 0) {
						this._startAt.render(time, suppressEvents, force);
					} else if (!callback) {
						callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
					}
				}
				if (this.vars.onStart) if (this._time !== 0 || duration === 0) if (!suppressEvents) {
					this._callback("onStart");
				}
			}
			pt = this._firstPT;
			while (pt) {
				if (pt.f) {
					pt.t[pt.p](pt.c * this.ratio + pt.s);
				} else {
					pt.t[pt.p] = pt.c * this.ratio + pt.s;
				}
				pt = pt._next;
			}

			if (this._onUpdate) {
				if (time < 0) if (this._startAt && time !== -0.0001) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
					this._startAt.render(time, suppressEvents, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
				}
				if (!suppressEvents) if (this._time !== prevTime || isComplete) {
					this._callback("onUpdate");
				}
			}
			if (callback) if (!this._gc || force) { //check _gc because there's a chance that kill() could be called in an onUpdate
				if (time < 0 && this._startAt && !this._onUpdate && time !== -0.0001) { //-0.0001 is a special value that we use when looping back to the beginning of a repeated TimelineMax, in which case we shouldn't render the _startAt values.
					this._startAt.render(time, suppressEvents, force);
				}
				if (isComplete) {
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this._callback(callback);
				}
				if (duration === 0 && this._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) { //the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
					this._rawPrevTime = 0;
				}
			}
		};

		p._kill = function(vars, target, overwritingTween) {
			if (vars === "all") {
				vars = null;
			}
			if (vars == null) if (target == null || target === this.target) {
				this._lazy = false;
				return this._enabled(false, false);
			}
			target = (typeof(target) !== "string") ? (target || this._targets || this.target) : TweenLite.selector(target) || target;
			var simultaneousOverwrite = (overwritingTween && this._time && overwritingTween._startTime === this._startTime && this._timeline === overwritingTween._timeline),
				i, overwrittenProps, p, pt, propLookup, changed, killProps, record, killed;
			if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
				i = target.length;
				while (--i > -1) {
					if (this._kill(vars, target[i], overwritingTween)) {
						changed = true;
					}
				}
			} else {
				if (this._targets) {
					i = this._targets.length;
					while (--i > -1) {
						if (target === this._targets[i]) {
							propLookup = this._propLookup[i] || {};
							this._overwrittenProps = this._overwrittenProps || [];
							overwrittenProps = this._overwrittenProps[i] = vars ? this._overwrittenProps[i] || {} : "all";
							break;
						}
					}
				} else if (target !== this.target) {
					return false;
				} else {
					propLookup = this._propLookup;
					overwrittenProps = this._overwrittenProps = vars ? this._overwrittenProps || {} : "all";
				}

				if (propLookup) {
					killProps = vars || propLookup;
					record = (vars !== overwrittenProps && overwrittenProps !== "all" && vars !== propLookup && (typeof(vars) !== "object" || !vars._tempKill)); //_tempKill is a super-secret way to delete a particular tweening property but NOT have it remembered as an official overwritten property (like in BezierPlugin)
					if (overwritingTween && (TweenLite.onOverwrite || this.vars.onOverwrite)) {
						for (p in killProps) {
							if (propLookup[p]) {
								if (!killed) {
									killed = [];
								}
								killed.push(p);
							}
						}
						if ((killed || !vars) && !_onOverwrite(this, overwritingTween, target, killed)) { //if the onOverwrite returned false, that means the user wants to override the overwriting (cancel it).
							return false;
						}
					}

					for (p in killProps) {
						if ((pt = propLookup[p])) {
							if (simultaneousOverwrite) { //if another tween overwrites this one and they both start at exactly the same time, yet this tween has already rendered once (for example, at 0.001) because it's first in the queue, we should revert the values to where they were at 0 so that the starting values aren't contaminated on the overwriting tween.
								if (pt.f) {
									pt.t[pt.p](pt.s);
								} else {
									pt.t[pt.p] = pt.s;
								}
								changed = true;
							}
							if (pt.pg && pt.t._kill(killProps)) {
								changed = true; //some plugins need to be notified so they can perform cleanup tasks first
							}
							if (!pt.pg || pt.t._overwriteProps.length === 0) {
								if (pt._prev) {
									pt._prev._next = pt._next;
								} else if (pt === this._firstPT) {
									this._firstPT = pt._next;
								}
								if (pt._next) {
									pt._next._prev = pt._prev;
								}
								pt._next = pt._prev = null;
							}
							delete propLookup[p];
						}
						if (record) {
							overwrittenProps[p] = 1;
						}
					}
					if (!this._firstPT && this._initted) { //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.
						this._enabled(false, false);
					}
				}
			}
			return changed;
		};

		p.invalidate = function() {
			if (this._notifyPluginsOfEnabled) {
				TweenLite._onPluginEvent("_onDisable", this);
			}
			this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null;
			this._notifyPluginsOfEnabled = this._active = this._lazy = false;
			this._propLookup = (this._targets) ? {} : [];
			Animation.prototype.invalidate.call(this);
			if (this.vars.immediateRender) {
				this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
				this.render(-this._delay);
			}
			return this;
		};

		p._enabled = function(enabled, ignoreTimeline) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			if (enabled && this._gc) {
				var targets = this._targets,
					i;
				if (targets) {
					i = targets.length;
					while (--i > -1) {
						this._siblings[i] = _register(targets[i], this, true);
					}
				} else {
					this._siblings = _register(this.target, this, true);
				}
			}
			Animation.prototype._enabled.call(this, enabled, ignoreTimeline);
			if (this._notifyPluginsOfEnabled) if (this._firstPT) {
				return TweenLite._onPluginEvent((enabled ? "_onEnable" : "_onDisable"), this);
			}
			return false;
		};


//----TweenLite static methods -----------------------------------------------------

		TweenLite.to = function(target, duration, vars) {
			return new TweenLite(target, duration, vars);
		};

		TweenLite.from = function(target, duration, vars) {
			vars.runBackwards = true;
			vars.immediateRender = (vars.immediateRender != false);
			return new TweenLite(target, duration, vars);
		};

		TweenLite.fromTo = function(target, duration, fromVars, toVars) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return new TweenLite(target, duration, toVars);
		};

		TweenLite.delayedCall = function(delay, callback, params, scope, useFrames) {
			return new TweenLite(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, callbackScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, immediateRender:false, lazy:false, useFrames:useFrames, overwrite:0});
		};

		TweenLite.set = function(target, vars) {
			return new TweenLite(target, 0, vars);
		};

		TweenLite.getTweensOf = function(target, onlyActive) {
			if (target == null) { return []; }
			target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;
			var i, a, j, t;
			if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
				i = target.length;
				a = [];
				while (--i > -1) {
					a = a.concat(TweenLite.getTweensOf(target[i], onlyActive));
				}
				i = a.length;
				//now get rid of any duplicates (tweens of arrays of objects could cause duplicates)
				while (--i > -1) {
					t = a[i];
					j = i;
					while (--j > -1) {
						if (t === a[j]) {
							a.splice(i, 1);
						}
					}
				}
			} else {
				a = _register(target).concat();
				i = a.length;
				while (--i > -1) {
					if (a[i]._gc || (onlyActive && !a[i].isActive())) {
						a.splice(i, 1);
					}
				}
			}
			return a;
		};

		TweenLite.killTweensOf = TweenLite.killDelayedCallsTo = function(target, onlyActive, vars) {
			if (typeof(onlyActive) === "object") {
				vars = onlyActive; //for backwards compatibility (before "onlyActive" parameter was inserted)
				onlyActive = false;
			}
			var a = TweenLite.getTweensOf(target, onlyActive),
				i = a.length;
			while (--i > -1) {
				a[i]._kill(vars, target);
			}
		};



/*
 * ----------------------------------------------------------------
 * TweenPlugin   (could easily be split out as a separate file/class, but included for ease of use (so that people don't need to include another script call before loading plugins which is easy to forget)
 * ----------------------------------------------------------------
 */
		var TweenPlugin = _class("plugins.TweenPlugin", function(props, priority) {
					this._overwriteProps = (props || "").split(",");
					this._propName = this._overwriteProps[0];
					this._priority = priority || 0;
					this._super = TweenPlugin.prototype;
				}, true);

		p = TweenPlugin.prototype;
		TweenPlugin.version = "1.18.0";
		TweenPlugin.API = 2;
		p._firstPT = null;
		p._addTween = _addPropTween;
		p.setRatio = _setRatio;

		p._kill = function(lookup) {
			var a = this._overwriteProps,
				pt = this._firstPT,
				i;
			if (lookup[this._propName] != null) {
				this._overwriteProps = [];
			} else {
				i = a.length;
				while (--i > -1) {
					if (lookup[a[i]] != null) {
						a.splice(i, 1);
					}
				}
			}
			while (pt) {
				if (lookup[pt.n] != null) {
					if (pt._next) {
						pt._next._prev = pt._prev;
					}
					if (pt._prev) {
						pt._prev._next = pt._next;
						pt._prev = null;
					} else if (this._firstPT === pt) {
						this._firstPT = pt._next;
					}
				}
				pt = pt._next;
			}
			return false;
		};

		p._roundProps = function(lookup, value) {
			var pt = this._firstPT;
			while (pt) {
				if (lookup[this._propName] || (pt.n != null && lookup[ pt.n.split(this._propName + "_").join("") ])) { //some properties that are very plugin-specific add a prefix named after the _propName plus an underscore, so we need to ignore that extra stuff here.
					pt.r = value;
				}
				pt = pt._next;
			}
		};

		TweenLite._onPluginEvent = function(type, tween) {
			var pt = tween._firstPT,
				changed, pt2, first, last, next;
			if (type === "_onInitAllProps") {
				//sorts the PropTween linked list in order of priority because some plugins need to render earlier/later than others, like MotionBlurPlugin applies its effects after all x/y/alpha tweens have rendered on each frame.
				while (pt) {
					next = pt._next;
					pt2 = first;
					while (pt2 && pt2.pr > pt.pr) {
						pt2 = pt2._next;
					}
					if ((pt._prev = pt2 ? pt2._prev : last)) {
						pt._prev._next = pt;
					} else {
						first = pt;
					}
					if ((pt._next = pt2)) {
						pt2._prev = pt;
					} else {
						last = pt;
					}
					pt = next;
				}
				pt = tween._firstPT = first;
			}
			while (pt) {
				if (pt.pg) if (typeof(pt.t[type]) === "function") if (pt.t[type]()) {
					changed = true;
				}
				pt = pt._next;
			}
			return changed;
		};

		TweenPlugin.activate = function(plugins) {
			var i = plugins.length;
			while (--i > -1) {
				if (plugins[i].API === TweenPlugin.API) {
					_plugins[(new plugins[i]())._propName] = plugins[i];
				}
			}
			return true;
		};

		//provides a more concise way to define plugins that have no dependencies besides TweenPlugin and TweenLite, wrapping common boilerplate stuff into one function (added in 1.9.0). You don't NEED to use this to define a plugin - the old way still works and can be useful in certain (rare) situations.
		_gsDefine.plugin = function(config) {
			if (!config || !config.propName || !config.init || !config.API) { throw "illegal plugin definition."; }
			var propName = config.propName,
				priority = config.priority || 0,
				overwriteProps = config.overwriteProps,
				map = {init:"_onInitTween", set:"setRatio", kill:"_kill", round:"_roundProps", initAll:"_onInitAllProps"},
				Plugin = _class("plugins." + propName.charAt(0).toUpperCase() + propName.substr(1) + "Plugin",
					function() {
						TweenPlugin.call(this, propName, priority);
						this._overwriteProps = overwriteProps || [];
					}, (config.global === true)),
				p = Plugin.prototype = new TweenPlugin(propName),
				prop;
			p.constructor = Plugin;
			Plugin.API = config.API;
			for (prop in map) {
				if (typeof(config[prop]) === "function") {
					p[map[prop]] = config[prop];
				}
			}
			Plugin.version = config.version;
			TweenPlugin.activate([Plugin]);
			return Plugin;
		};


		//now run through all the dependencies discovered and if any are missing, log that to the console as a warning. This is why it's best to have TweenLite load last - it can check all the dependencies for you.
		a = window._gsQueue;
		if (a) {
			for (i = 0; i < a.length; i++) {
				a[i]();
			}
			for (p in _defLookup) {
				if (!_defLookup[p].func) {
					window.console.log("GSAP encountered missing dependency: com.greensock." + p);
				}
			}
		}

		_tickerActive = false; //ensures that the first official animation forces a ticker.tick() to update the time when it is instantiated

})((typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window, "TweenLite");
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
(function (global){
/*!
 * VERSION: 1.15.3
 * DATE: 2015-12-22
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {

	"use strict";

	_gsScope._gsDefine("easing.Back", ["easing.Ease"], function(Ease) {
		
		var w = (_gsScope.GreenSockGlobals || _gsScope),
			gs = w.com.greensock,
			_2PI = Math.PI * 2,
			_HALF_PI = Math.PI / 2,
			_class = gs._class,
			_create = function(n, f) {
				var C = _class("easing." + n, function(){}, true),
					p = C.prototype = new Ease();
				p.constructor = C;
				p.getRatio = f;
				return C;
			},
			_easeReg = Ease.register || function(){}, //put an empty function in place just as a safety measure in case someone loads an OLD version of TweenLite.js where Ease.register doesn't exist.
			_wrap = function(name, EaseOut, EaseIn, EaseInOut, aliases) {
				var C = _class("easing."+name, {
					easeOut:new EaseOut(),
					easeIn:new EaseIn(),
					easeInOut:new EaseInOut()
				}, true);
				_easeReg(C, name);
				return C;
			},
			EasePoint = function(time, value, next) {
				this.t = time;
				this.v = value;
				if (next) {
					this.next = next;
					next.prev = this;
					this.c = next.v - value;
					this.gap = next.t - time;
				}
			},

			//Back
			_createBack = function(n, f) {
				var C = _class("easing." + n, function(overshoot) {
						this._p1 = (overshoot || overshoot === 0) ? overshoot : 1.70158;
						this._p2 = this._p1 * 1.525;
					}, true), 
					p = C.prototype = new Ease();
				p.constructor = C;
				p.getRatio = f;
				p.config = function(overshoot) {
					return new C(overshoot);
				};
				return C;
			},

			Back = _wrap("Back",
				_createBack("BackOut", function(p) {
					return ((p = p - 1) * p * ((this._p1 + 1) * p + this._p1) + 1);
				}),
				_createBack("BackIn", function(p) {
					return p * p * ((this._p1 + 1) * p - this._p1);
				}),
				_createBack("BackInOut", function(p) {
					return ((p *= 2) < 1) ? 0.5 * p * p * ((this._p2 + 1) * p - this._p2) : 0.5 * ((p -= 2) * p * ((this._p2 + 1) * p + this._p2) + 2);
				})
			),


			//SlowMo
			SlowMo = _class("easing.SlowMo", function(linearRatio, power, yoyoMode) {
				power = (power || power === 0) ? power : 0.7;
				if (linearRatio == null) {
					linearRatio = 0.7;
				} else if (linearRatio > 1) {
					linearRatio = 1;
				}
				this._p = (linearRatio !== 1) ? power : 0;
				this._p1 = (1 - linearRatio) / 2;
				this._p2 = linearRatio;
				this._p3 = this._p1 + this._p2;
				this._calcEnd = (yoyoMode === true);
			}, true),
			p = SlowMo.prototype = new Ease(),
			SteppedEase, RoughEase, _createElastic;
			
		p.constructor = SlowMo;
		p.getRatio = function(p) {
			var r = p + (0.5 - p) * this._p;
			if (p < this._p1) {
				return this._calcEnd ? 1 - ((p = 1 - (p / this._p1)) * p) : r - ((p = 1 - (p / this._p1)) * p * p * p * r);
			} else if (p > this._p3) {
				return this._calcEnd ? 1 - (p = (p - this._p3) / this._p1) * p : r + ((p - r) * (p = (p - this._p3) / this._p1) * p * p * p);
			}
			return this._calcEnd ? 1 : r;
		};
		SlowMo.ease = new SlowMo(0.7, 0.7);
		
		p.config = SlowMo.config = function(linearRatio, power, yoyoMode) {
			return new SlowMo(linearRatio, power, yoyoMode);
		};


		//SteppedEase
		SteppedEase = _class("easing.SteppedEase", function(steps) {
				steps = steps || 1;
				this._p1 = 1 / steps;
				this._p2 = steps + 1;
			}, true);
		p = SteppedEase.prototype = new Ease();	
		p.constructor = SteppedEase;
		p.getRatio = function(p) {
			if (p < 0) {
				p = 0;
			} else if (p >= 1) {
				p = 0.999999999;
			}
			return ((this._p2 * p) >> 0) * this._p1;
		};
		p.config = SteppedEase.config = function(steps) {
			return new SteppedEase(steps);
		};


		//RoughEase
		RoughEase = _class("easing.RoughEase", function(vars) {
			vars = vars || {};
			var taper = vars.taper || "none",
				a = [],
				cnt = 0,
				points = (vars.points || 20) | 0,
				i = points,
				randomize = (vars.randomize !== false),
				clamp = (vars.clamp === true),
				template = (vars.template instanceof Ease) ? vars.template : null,
				strength = (typeof(vars.strength) === "number") ? vars.strength * 0.4 : 0.4,
				x, y, bump, invX, obj, pnt;
			while (--i > -1) {
				x = randomize ? Math.random() : (1 / points) * i;
				y = template ? template.getRatio(x) : x;
				if (taper === "none") {
					bump = strength;
				} else if (taper === "out") {
					invX = 1 - x;
					bump = invX * invX * strength;
				} else if (taper === "in") {
					bump = x * x * strength;
				} else if (x < 0.5) {  //"both" (start)
					invX = x * 2;
					bump = invX * invX * 0.5 * strength;
				} else {				//"both" (end)
					invX = (1 - x) * 2;
					bump = invX * invX * 0.5 * strength;
				}
				if (randomize) {
					y += (Math.random() * bump) - (bump * 0.5);
				} else if (i % 2) {
					y += bump * 0.5;
				} else {
					y -= bump * 0.5;
				}
				if (clamp) {
					if (y > 1) {
						y = 1;
					} else if (y < 0) {
						y = 0;
					}
				}
				a[cnt++] = {x:x, y:y};
			}
			a.sort(function(a, b) {
				return a.x - b.x;
			});

			pnt = new EasePoint(1, 1, null);
			i = points;
			while (--i > -1) {
				obj = a[i];
				pnt = new EasePoint(obj.x, obj.y, pnt);
			}

			this._prev = new EasePoint(0, 0, (pnt.t !== 0) ? pnt : pnt.next);
		}, true);
		p = RoughEase.prototype = new Ease();
		p.constructor = RoughEase;
		p.getRatio = function(p) {
			var pnt = this._prev;
			if (p > pnt.t) {
				while (pnt.next && p >= pnt.t) {
					pnt = pnt.next;
				}
				pnt = pnt.prev;
			} else {
				while (pnt.prev && p <= pnt.t) {
					pnt = pnt.prev;
				}
			}
			this._prev = pnt;
			return (pnt.v + ((p - pnt.t) / pnt.gap) * pnt.c);
		};
		p.config = function(vars) {
			return new RoughEase(vars);
		};
		RoughEase.ease = new RoughEase();


		//Bounce
		_wrap("Bounce",
			_create("BounceOut", function(p) {
				if (p < 1 / 2.75) {
					return 7.5625 * p * p;
				} else if (p < 2 / 2.75) {
					return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
				} else if (p < 2.5 / 2.75) {
					return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
				}
				return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
			}),
			_create("BounceIn", function(p) {
				if ((p = 1 - p) < 1 / 2.75) {
					return 1 - (7.5625 * p * p);
				} else if (p < 2 / 2.75) {
					return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + 0.75);
				} else if (p < 2.5 / 2.75) {
					return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + 0.9375);
				}
				return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + 0.984375);
			}),
			_create("BounceInOut", function(p) {
				var invert = (p < 0.5);
				if (invert) {
					p = 1 - (p * 2);
				} else {
					p = (p * 2) - 1;
				}
				if (p < 1 / 2.75) {
					p = 7.5625 * p * p;
				} else if (p < 2 / 2.75) {
					p = 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
				} else if (p < 2.5 / 2.75) {
					p = 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
				} else {
					p = 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
				}
				return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5;
			})
		);


		//CIRC
		_wrap("Circ",
			_create("CircOut", function(p) {
				return Math.sqrt(1 - (p = p - 1) * p);
			}),
			_create("CircIn", function(p) {
				return -(Math.sqrt(1 - (p * p)) - 1);
			}),
			_create("CircInOut", function(p) {
				return ((p*=2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
			})
		);


		//Elastic
		_createElastic = function(n, f, def) {
			var C = _class("easing." + n, function(amplitude, period) {
					this._p1 = (amplitude >= 1) ? amplitude : 1; //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
					this._p2 = (period || def) / (amplitude < 1 ? amplitude : 1);
					this._p3 = this._p2 / _2PI * (Math.asin(1 / this._p1) || 0);
					this._p2 = _2PI / this._p2; //precalculate to optimize
				}, true),
				p = C.prototype = new Ease();
			p.constructor = C;
			p.getRatio = f;
			p.config = function(amplitude, period) {
				return new C(amplitude, period);
			};
			return C;
		};
		_wrap("Elastic",
			_createElastic("ElasticOut", function(p) {
				return this._p1 * Math.pow(2, -10 * p) * Math.sin( (p - this._p3) * this._p2 ) + 1;
			}, 0.3),
			_createElastic("ElasticIn", function(p) {
				return -(this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * this._p2 ));
			}, 0.3),
			_createElastic("ElasticInOut", function(p) {
				return ((p *= 2) < 1) ? -0.5 * (this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * this._p2)) : this._p1 * Math.pow(2, -10 *(p -= 1)) * Math.sin( (p - this._p3) * this._p2 ) * 0.5 + 1;
			}, 0.45)
		);


		//Expo
		_wrap("Expo",
			_create("ExpoOut", function(p) {
				return 1 - Math.pow(2, -10 * p);
			}),
			_create("ExpoIn", function(p) {
				return Math.pow(2, 10 * (p - 1)) - 0.001;
			}),
			_create("ExpoInOut", function(p) {
				return ((p *= 2) < 1) ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
			})
		);


		//Sine
		_wrap("Sine",
			_create("SineOut", function(p) {
				return Math.sin(p * _HALF_PI);
			}),
			_create("SineIn", function(p) {
				return -Math.cos(p * _HALF_PI) + 1;
			}),
			_create("SineInOut", function(p) {
				return -0.5 * (Math.cos(Math.PI * p) - 1);
			})
		);

		_class("easing.EaseLookup", {
				find:function(s) {
					return Ease.map[s];
				}
			}, true);

		//register the non-standard eases
		_easeReg(w.SlowMo, "SlowMo", "ease,");
		_easeReg(RoughEase, "RoughEase", "ease,");
		_easeReg(SteppedEase, "SteppedEase", "ease,");
		
		return Back;
		
	}, true);

}); if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); }

//export to AMD/RequireJS and CommonJS/Node (precursor to full modular build system coming at a later date)
(function() {
	"use strict";
	var getGlobal = function() {
		return (_gsScope.GreenSockGlobals || _gsScope);
	};
	if (typeof(define) === "function" && define.amd) { //AMD
		define(["TweenLite"], getGlobal);
	} else if (typeof(module) !== "undefined" && module.exports) { //node
		require("../TweenLite.js");
		module.exports = getGlobal();
	}
}());
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../TweenLite.js":4}],6:[function(require,module,exports){
(function (global){
/*!
 * VERSION: 1.7.6
 * DATE: 2015-12-10
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {

	"use strict";

	var _doc = document.documentElement,
		_window = window,
		_max = function(element, axis) {
			var dim = (axis === "x") ? "Width" : "Height",
				scroll = "scroll" + dim,
				client = "client" + dim,
				body = document.body;
			return (element === _window || element === _doc || element === body) ? Math.max(_doc[scroll], body[scroll]) - (_window["inner" + dim] || _doc[client] || body[client]) : element[scroll] - element["offset" + dim];
		},

		ScrollToPlugin = _gsScope._gsDefine.plugin({
			propName: "scrollTo",
			API: 2,
			version:"1.7.6",

			//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
			init: function(target, value, tween) {
				this._wdw = (target === _window);
				this._target = target;
				this._tween = tween;
				if (typeof(value) !== "object") {
					value = {y:value}; //if we don't receive an object as the parameter, assume the user intends "y".
				}
				this.vars = value;
				this._autoKill = (value.autoKill !== false);
				this.x = this.xPrev = this.getX();
				this.y = this.yPrev = this.getY();
				if (value.x != null) {
					this._addTween(this, "x", this.x, (value.x === "max") ? _max(target, "x") : value.x, "scrollTo_x", true);
					this._overwriteProps.push("scrollTo_x");
				} else {
					this.skipX = true;
				}
				if (value.y != null) {
					this._addTween(this, "y", this.y, (value.y === "max") ? _max(target, "y") : value.y, "scrollTo_y", true);
					this._overwriteProps.push("scrollTo_y");
				} else {
					this.skipY = true;
				}
				return true;
			},

			//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
			set: function(v) {
				this._super.setRatio.call(this, v);

				var x = (this._wdw || !this.skipX) ? this.getX() : this.xPrev,
					y = (this._wdw || !this.skipY) ? this.getY() : this.yPrev,
					yDif = y - this.yPrev,
					xDif = x - this.xPrev;

				if (this.x < 0) { //can't scroll to a position less than 0! Might happen if someone uses a Back.easeOut or Elastic.easeOut when scrolling back to the top of the page (for example)
					this.x = 0;
				}
				if (this.y < 0) {
					this.y = 0;
				}
				if (this._autoKill) {
					//note: iOS has a bug that throws off the scroll by several pixels, so we need to check if it's within 7 pixels of the previous one that we set instead of just looking for an exact match.
					if (!this.skipX && (xDif > 7 || xDif < -7) && x < _max(this._target, "x")) {
						this.skipX = true; //if the user scrolls separately, we should stop tweening!
					}
					if (!this.skipY && (yDif > 7 || yDif < -7) && y < _max(this._target, "y")) {
						this.skipY = true; //if the user scrolls separately, we should stop tweening!
					}
					if (this.skipX && this.skipY) {
						this._tween.kill();
						if (this.vars.onAutoKill) {
							this.vars.onAutoKill.apply(this.vars.onAutoKillScope || this._tween, this.vars.onAutoKillParams || []);
						}
					}
				}
				if (this._wdw) {
					_window.scrollTo((!this.skipX) ? this.x : x, (!this.skipY) ? this.y : y);
				} else {
					if (!this.skipY) {
						this._target.scrollTop = this.y;
					}
					if (!this.skipX) {
						this._target.scrollLeft = this.x;
					}
				}
				this.xPrev = this.x;
				this.yPrev = this.y;
			}

		}),
		p = ScrollToPlugin.prototype;

	ScrollToPlugin.max = _max;

	p.getX = function() {
		return (!this._wdw) ? this._target.scrollLeft : (_window.pageXOffset != null) ? _window.pageXOffset : (_doc.scrollLeft != null) ? _doc.scrollLeft : document.body.scrollLeft;
	};

	p.getY = function() {
		return (!this._wdw) ? this._target.scrollTop : (_window.pageYOffset != null) ? _window.pageYOffset : (_doc.scrollTop != null) ? _doc.scrollTop : document.body.scrollTop;
	};

	p._kill = function(lookup) {
		if (lookup.scrollTo_x) {
			this.skipX = true;
		}
		if (lookup.scrollTo_y) {
			this.skipY = true;
		}
		return this._super._kill.call(this, lookup);
	};

}); if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); }
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcR2xvYmFsUGFnZS5qcyIsImpzXFxpbmRleC5qcyIsImpzXFxpbnRyb1xcaW5kZXguanMiLCJub2RlX21vZHVsZXMvZ3NhcC9zcmMvdW5jb21wcmVzc2VkL1R3ZWVuTGl0ZS5qcyIsIm5vZGVfbW9kdWxlcy9nc2FwL3NyYy91bmNvbXByZXNzZWQvZWFzaW5nL0Vhc2VQYWNrLmpzIiwibm9kZV9tb2R1bGVzL2dzYXAvc3JjL3VuY29tcHJlc3NlZC9wbHVnaW5zL1Njcm9sbFRvUGx1Z2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDOztBQUViLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNuQyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDckMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdkQsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7QUFDN0UsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7O0FBRWhFLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFaEMsTUFBTSxVQUFVLENBQUMsQUFDYjtlQUFXLEdBQUcsQUFDVjtZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDZixBQUVEOztRQUFJLEdBQUcsQUFDSDtZQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxBQUUxQzs7WUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQyxBQUV4Qjs7ZUFBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxBQUMxQztjQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU07OztBQUFDLEFBR2xELGVBQU8sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxBQUNqRDtjQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEFBQzVFO1lBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQyxBQUVoRDs7YUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQUFDckM7Z0JBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxBQUN4QjttQkFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxBQUM1QjtrQkFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxBQUMvRDtnQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEFBQ2hCO2tCQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLEFBQzdDO29CQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNsQyxDQUFDLENBQUM7Ozs7QUFDTixBQUdELGVBQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQUFDekM7WUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEFBRWhEOzthQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxBQUN0QztnQkFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQzFCO21CQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEFBQzdCO21CQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxBQUU5Qzs7Z0JBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEFBQ3hDO2lCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxBQUNwQztvQkFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQ3BCO21CQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7YUFDekQ7U0FDSixBQUVEOztjQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQUFFMUQ7O2NBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQSxZQUFXLEFBQUU7Z0JBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUFFLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzFFLEFBRUQ7O1VBQU0sQ0FBQyxLQUFLLEVBQUUsQUFDVjtZQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDdEIsQUFFRDs7bUJBQWUsR0FBRyxBQUNkO1lBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUN0QixBQUVEOztlQUFXLEdBQUcsQUFDVjtZQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLEFBQzNCO1lBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxBQUNoRDtZQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsQUFDcEI7WUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQUFDakI7WUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEFBRVo7O2FBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEFBQ3RDO2dCQUFJLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQUFDdkI7Z0JBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEFBQ3RDO2dCQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEFBQ2Y7Z0JBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQUFDbEI7Z0JBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEFBQzFCO2dCQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEFBQ3ZCO29CQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsQUFDM0I7MkJBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2lCQUM3QixBQUVEOzt1QkFBTyxHQUFHLENBQUMsQ0FBQzthQUVmO1NBRUosQUFDRDtZQUFHLE9BQU8sS0FBSyxDQUFDLENBQUMsRUFBRSxBQUNmO2dCQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQUFDckQ7Z0JBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxBQUM1QjtvQkFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEFBQ2hEO3FCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxBQUNyQzsyQkFBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7aUJBQ3hDLEFBQ0Q7dUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQzlCO1NBRUo7S0FDSixBQUVEOztnQkFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQUFDdEI7YUFBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLEFBQ3ZCO1lBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxBQUVsQjs7WUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxBQUVyQzs7WUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxDQUFDLEFBQ25EO1lBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsQUFDM0M7YUFBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUMsUUFBUSxFQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUN2STtDQUNKOztBQUdELE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDOzs7QUNwSDVCLFlBQVksQ0FBQzs7QUFFYixJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDekMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRzNDLFFBQVEsQ0FBQyxZQUFZLEFBQ25CO01BQUksUUFBUSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7Q0FDakMsQ0FBQyxDQUFDOzs7QUNSSCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRzdCLE1BQU0sS0FBSyxDQUFDLEFBQ1I7ZUFBVyxHQUFHLEFBQ1Y7WUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2YsQUFFRDs7UUFBSSxHQUFHLEFBQ0g7ZUFBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUM3QjtDQUNKOztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDOzs7O0FDYnZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQy8xREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN0V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBzZWxlY3QgPSByZXF1aXJlKCdkb20tc2VsZWN0Jyk7XHJcbnZhciBjbGFzc2VzID0gcmVxdWlyZSgnZG9tLWNsYXNzZXMnKTtcclxudmFyIFR3ZWVuID0gcmVxdWlyZSgnZ3NhcC9zcmMvdW5jb21wcmVzc2VkL1R3ZWVuTGl0ZScpO1xyXG52YXIgU2Nyb2xsVG9QbHVnaW4gPSByZXF1aXJlKCdnc2FwL3NyYy91bmNvbXByZXNzZWQvcGx1Z2lucy9TY3JvbGxUb1BsdWdpbicpO1xyXG52YXIgRWFzZVBhY2sgPSByZXF1aXJlKCdnc2FwL3NyYy91bmNvbXByZXNzZWQvZWFzaW5nL0Vhc2VQYWNrJyk7XHJcblxyXG52YXIgSW50cm8gPSByZXF1aXJlKCcuL2ludHJvLycpO1xyXG4gXHJcbmNsYXNzIEdsb2JhbFBhZ2Uge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBfZ2FxLnB1c2goWydfdHJhY2tQYWdldmlldycsICcvbm93ZWJnbCddKTtcclxuXHJcbiAgICAgICAgdmFyIGludHJvID0gbmV3IEludHJvKCk7IFxyXG5cclxuICAgICAgICBjbGFzc2VzKHNlbGVjdCgnaHRtbCcpKS5hZGQoJ25vLXRocmVlanMnKTtcclxuICAgICAgICBzZWxlY3QoJy5vdmVybGF5LW5vd2ViZ2wnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAvKkJ1dHRvbnMqL1xyXG4gICAgICAgIGNsYXNzZXMoc2VsZWN0KCcjcHJvamVjdHMtYnV0dG9ucycpKS5hZGQoXCJzaG93XCIpO1xyXG4gICAgICAgIHNlbGVjdCgnI3Byb2plY3RzLWJ1dHRvbnMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xpY2tUb2dnbGVNZW51KTtcclxuICAgICAgICB2YXIgYnV0dG9ucyA9IHNlbGVjdC5hbGwoJyNwcm9qZWN0cy1idXR0b25zIGEnKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBidXR0b25zW2ldO1xyXG4gICAgICAgICAgICBjbGFzc2VzKGJ1dHRvbikuYWRkKCdzaG93Jyk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiICsgYnV0dG9uLmdldEF0dHJpYnV0ZShcImhyZWZcIikpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuY2xpY2tQcm9qZWN0KGV2ZW50LCB0aGlzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlByb2plY3RzKi9cclxuICAgICAgICBjbGFzc2VzKHNlbGVjdCgnI3Byb2plY3RzJykpLmFkZCgnc2hvdycpO1xyXG4gICAgICAgIHZhciBwcm9qZWN0cyA9IHNlbGVjdC5hbGwoJyNwcm9qZWN0cyAucHJvamVjdCcpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0ID0gcHJvamVjdHNbaV07XHJcbiAgICAgICAgICAgIGNsYXNzZXMocHJvamVjdCkuYWRkKCdzaG93Jyk7XHJcbiAgICAgICAgICAgIGNsYXNzZXMoc2VsZWN0KCcudGV4dCcsIHByb2plY3QpKS5hZGQoJ3Nob3cnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbWFnZXMgPSBzZWxlY3QuYWxsKCdpbWcnLCBwcm9qZWN0KTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpbWFnZXMubGVuZ3RoOyArK2opIHtcclxuICAgICAgICAgICAgICAgIGxldCBpbWcgPSBpbWFnZXNbal07XHJcbiAgICAgICAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKFwic3JjXCIsIGltZy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNyY1wiKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLnNjcm9sbC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRoaXMuY2hlY2tTY3JvbGwoKTsgfS5iaW5kKHRoaXMpLCAxMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICBzY3JvbGwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmNoZWNrU2Nyb2xsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tTY3JvbGxBbmltKCkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tTY3JvbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja1Njcm9sbCgpIHtcclxuICAgICAgICBsZXQgaCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgICAgICBsZXQgcHJvamVjdHMgPSBzZWxlY3QuYWxsKCcjcHJvamVjdHMgLnByb2plY3QnKTtcclxuICAgICAgICBsZXQgY1Byb2plY3QgPSBudWxsOyAgXHJcbiAgICAgICAgbGV0IGJpZ2dlc3QgPSAtMTtcclxuICAgICAgICBsZXQgYmlnID0gMDsgXHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSBwcm9qZWN0c1tpXTtcclxuICAgICAgICAgICAgbGV0IGJyID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgbGV0IHQgPSBici50b3A7XHJcbiAgICAgICAgICAgIGxldCBiID0gYnIuYm90dG9tO1xyXG4gICAgICAgICAgICBsZXQgcGVyYyA9IE1hdGgubWF4KDAsIHQpO1xyXG4gICAgICAgICAgICBpZih0IC0gaCA8IDAgJiYgYiAtIGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZighY2xhc3Nlcy5oYXMobm9kZSwgJ2FuaW0nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMuYWRkKG5vZGUsICdhbmltJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYmlnZ2VzdCA9IGk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoYmlnZ2VzdCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgbGV0IGJ0biA9IHNlbGVjdC5hbGwoJyNwcm9qZWN0cy1idXR0b25zIGEnKVtiaWdnZXN0XTtcclxuICAgICAgICAgICAgaWYoIWNsYXNzZXMuaGFzKGJ0biwgJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYnRuTGlzdCA9IHNlbGVjdC5hbGwoJyNwcm9qZWN0cy1idXR0b25zIGEnKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnRuTGlzdC5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucmVtb3ZlKGJ0bkxpc3RbaV0sICdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNsYXNzZXMuYWRkKGJ0biwgJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGlja1Byb2plY3QoZXZlbnQsIGxpbmspIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlTWVudSgpO1xyXG5cclxuICAgICAgICBsZXQgbmFtZSA9IGxpbmsuZ2V0QXR0cmlidXRlKCduYW1lJyk7XHJcblxyXG4gICAgICAgIGxldCBwcm9qZWN0ID0gc2VsZWN0KCcjcHJvamVjdHMgLnByb2plY3QuJyArIG5hbWUpO1xyXG4gICAgICAgIGxldCBjdG5Ub3AgPSBzZWxlY3QoJyNwcm9qZWN0cycpLm9mZnNldFRvcDtcclxuICAgICAgICBUd2Vlbi50byh3aW5kb3csIDEsIHtzY3JvbGxUbzp7IHk6IGN0blRvcCArIHByb2plY3Qub2Zmc2V0VG9wIH0sIGVhc2U6IEV4cG8uZWFzZUluT3V0LCBvbkNvbXBsZXRlOnRoaXMuY2hlY2tTY3JvbGxBbmltLmJpbmQodGhpcyl9KTtcclxuICAgIH1cclxufSBcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdsb2JhbFBhZ2U7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBHbG9iYWxQYWdlID0gcmVxdWlyZSgnLi9HbG9iYWxQYWdlJyk7XHJcbnZhciBkb21yZWFkeSA9IHJlcXVpcmUoJ2RldGVjdC1kb20tcmVhZHknKTtcclxuXHJcbiBcclxuZG9tcmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gIGxldCBnbG9iUGFnZSA9IG5ldyBHbG9iYWxQYWdlKCk7XHJcbn0pO1xyXG4iLCJ2YXIgVEhSRUUgPSByZXF1aXJlKCd0aHJlZScpO1xyXG5cclxuXHJcbmNsYXNzIEludHJvIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG4gXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdpbml0IGludHJvJyk7XHJcbiAgICB9XHJcbn1cclxuICAgICBcclxubW9kdWxlLmV4cG9ydHMgPSBJbnRybztcclxuIiwiLyohXG4gKiBWRVJTSU9OOiAxLjE4LjJcbiAqIERBVEU6IDIwMTUtMTItMjJcbiAqIFVQREFURVMgQU5EIERPQ1MgQVQ6IGh0dHA6Ly9ncmVlbnNvY2suY29tXG4gKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDA4LTIwMTYsIEdyZWVuU29jay4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFRoaXMgd29yayBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBhdCBodHRwOi8vZ3JlZW5zb2NrLmNvbS9zdGFuZGFyZC1saWNlbnNlIG9yIGZvclxuICogQ2x1YiBHcmVlblNvY2sgbWVtYmVycywgdGhlIHNvZnR3YXJlIGFncmVlbWVudCB0aGF0IHdhcyBpc3N1ZWQgd2l0aCB5b3VyIG1lbWJlcnNoaXAuXG4gKiBcbiAqIEBhdXRob3I6IEphY2sgRG95bGUsIGphY2tAZ3JlZW5zb2NrLmNvbVxuICovXG4oZnVuY3Rpb24od2luZG93LCBtb2R1bGVOYW1lKSB7XG5cblx0XHRcInVzZSBzdHJpY3RcIjtcblx0XHR2YXIgX2dsb2JhbHMgPSB3aW5kb3cuR3JlZW5Tb2NrR2xvYmFscyA9IHdpbmRvdy5HcmVlblNvY2tHbG9iYWxzIHx8IHdpbmRvdztcblx0XHRpZiAoX2dsb2JhbHMuVHdlZW5MaXRlKSB7XG5cdFx0XHRyZXR1cm47IC8vaW4gY2FzZSB0aGUgY29yZSBzZXQgb2YgY2xhc3NlcyBpcyBhbHJlYWR5IGxvYWRlZCwgZG9uJ3QgaW5zdGFudGlhdGUgdHdpY2UuXG5cdFx0fVxuXHRcdHZhciBfbmFtZXNwYWNlID0gZnVuY3Rpb24obnMpIHtcblx0XHRcdFx0dmFyIGEgPSBucy5zcGxpdChcIi5cIiksXG5cdFx0XHRcdFx0cCA9IF9nbG9iYWxzLCBpO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHBbYVtpXV0gPSBwID0gcFthW2ldXSB8fCB7fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcDtcblx0XHRcdH0sXG5cdFx0XHRncyA9IF9uYW1lc3BhY2UoXCJjb20uZ3JlZW5zb2NrXCIpLFxuXHRcdFx0X3RpbnlOdW0gPSAwLjAwMDAwMDAwMDEsXG5cdFx0XHRfc2xpY2UgPSBmdW5jdGlvbihhKSB7IC8vZG9uJ3QgdXNlIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRhcmdldCwgMCkgYmVjYXVzZSB0aGF0IGRvZXNuJ3Qgd29yayBpbiBJRTggd2l0aCBhIE5vZGVMaXN0IHRoYXQncyByZXR1cm5lZCBieSBxdWVyeVNlbGVjdG9yQWxsKClcblx0XHRcdFx0dmFyIGIgPSBbXSxcblx0XHRcdFx0XHRsID0gYS5sZW5ndGgsXG5cdFx0XHRcdFx0aTtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSAhPT0gbDsgYi5wdXNoKGFbaSsrXSkpIHt9XG5cdFx0XHRcdHJldHVybiBiO1xuXHRcdFx0fSxcblx0XHRcdF9lbXB0eUZ1bmMgPSBmdW5jdGlvbigpIHt9LFxuXHRcdFx0X2lzQXJyYXkgPSAoZnVuY3Rpb24oKSB7IC8vd29ya3MgYXJvdW5kIGlzc3VlcyBpbiBpZnJhbWUgZW52aXJvbm1lbnRzIHdoZXJlIHRoZSBBcnJheSBnbG9iYWwgaXNuJ3Qgc2hhcmVkLCB0aHVzIGlmIHRoZSBvYmplY3Qgb3JpZ2luYXRlcyBpbiBhIGRpZmZlcmVudCB3aW5kb3cvaWZyYW1lLCBcIihvYmogaW5zdGFuY2VvZiBBcnJheSlcIiB3aWxsIGV2YWx1YXRlIGZhbHNlLiBXZSBhZGRlZCBzb21lIHNwZWVkIG9wdGltaXphdGlvbnMgdG8gYXZvaWQgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCkgdW5sZXNzIGl0J3MgYWJzb2x1dGVseSBuZWNlc3NhcnkgYmVjYXVzZSBpdCdzIFZFUlkgc2xvdyAobGlrZSAyMHggc2xvd2VyKVxuXHRcdFx0XHR2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuXHRcdFx0XHRcdGFycmF5ID0gdG9TdHJpbmcuY2FsbChbXSk7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbihvYmopIHtcblx0XHRcdFx0XHRyZXR1cm4gb2JqICE9IG51bGwgJiYgKG9iaiBpbnN0YW5jZW9mIEFycmF5IHx8ICh0eXBlb2Yob2JqKSA9PT0gXCJvYmplY3RcIiAmJiAhIW9iai5wdXNoICYmIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gYXJyYXkpKTtcblx0XHRcdFx0fTtcblx0XHRcdH0oKSksXG5cdFx0XHRhLCBpLCBwLCBfdGlja2VyLCBfdGlja2VyQWN0aXZlLFxuXHRcdFx0X2RlZkxvb2t1cCA9IHt9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBjb25zdHJ1Y3RvclxuXHRcdFx0ICogRGVmaW5lcyBhIEdyZWVuU29jayBjbGFzcywgb3B0aW9uYWxseSB3aXRoIGFuIGFycmF5IG9mIGRlcGVuZGVuY2llcyB0aGF0IG11c3QgYmUgaW5zdGFudGlhdGVkIGZpcnN0IGFuZCBwYXNzZWQgaW50byB0aGUgZGVmaW5pdGlvbi5cblx0XHRcdCAqIFRoaXMgYWxsb3dzIHVzZXJzIHRvIGxvYWQgR3JlZW5Tb2NrIEpTIGZpbGVzIGluIGFueSBvcmRlciBldmVuIGlmIHRoZXkgaGF2ZSBpbnRlcmRlcGVuZGVuY2llcyAobGlrZSBDU1NQbHVnaW4gZXh0ZW5kcyBUd2VlblBsdWdpbiB3aGljaCBpc1xuXHRcdFx0ICogaW5zaWRlIFR3ZWVuTGl0ZS5qcywgYnV0IGlmIENTU1BsdWdpbiBpcyBsb2FkZWQgZmlyc3QsIGl0IHNob3VsZCB3YWl0IHRvIHJ1biBpdHMgY29kZSB1bnRpbCBUd2VlbkxpdGUuanMgbG9hZHMgYW5kIGluc3RhbnRpYXRlcyBUd2VlblBsdWdpblxuXHRcdFx0ICogYW5kIHRoZW4gcGFzcyBUd2VlblBsdWdpbiB0byBDU1NQbHVnaW4ncyBkZWZpbml0aW9uKS4gVGhpcyBpcyBhbGwgZG9uZSBhdXRvbWF0aWNhbGx5IGFuZCBpbnRlcm5hbGx5LlxuXHRcdFx0ICpcblx0XHRcdCAqIEV2ZXJ5IGRlZmluaXRpb24gd2lsbCBiZSBhZGRlZCB0byBhIFwiY29tLmdyZWVuc29ja1wiIGdsb2JhbCBvYmplY3QgKHR5cGljYWxseSB3aW5kb3csIGJ1dCBpZiBhIHdpbmRvdy5HcmVlblNvY2tHbG9iYWxzIG9iamVjdCBpcyBmb3VuZCxcblx0XHRcdCAqIGl0IHdpbGwgZ28gdGhlcmUgYXMgb2YgdjEuNykuIEZvciBleGFtcGxlLCBUd2VlbkxpdGUgd2lsbCBiZSBmb3VuZCBhdCB3aW5kb3cuY29tLmdyZWVuc29jay5Ud2VlbkxpdGUgYW5kIHNpbmNlIGl0J3MgYSBnbG9iYWwgY2xhc3MgdGhhdCBzaG91bGQgYmUgYXZhaWxhYmxlIGFueXdoZXJlLFxuXHRcdFx0ICogaXQgaXMgQUxTTyByZWZlcmVuY2VkIGF0IHdpbmRvdy5Ud2VlbkxpdGUuIEhvd2V2ZXIgc29tZSBjbGFzc2VzIGFyZW4ndCBjb25zaWRlcmVkIGdsb2JhbCwgbGlrZSB0aGUgYmFzZSBjb20uZ3JlZW5zb2NrLmNvcmUuQW5pbWF0aW9uIGNsYXNzLCBzb1xuXHRcdFx0ICogdGhvc2Ugd2lsbCBvbmx5IGJlIGF0IHRoZSBwYWNrYWdlIGxpa2Ugd2luZG93LmNvbS5ncmVlbnNvY2suY29yZS5BbmltYXRpb24uIEFnYWluLCBpZiB5b3UgZGVmaW5lIGEgR3JlZW5Tb2NrR2xvYmFscyBvYmplY3Qgb24gdGhlIHdpbmRvdywgZXZlcnl0aGluZ1xuXHRcdFx0ICogZ2V0cyB0dWNrZWQgbmVhdGx5IGluc2lkZSB0aGVyZSBpbnN0ZWFkIG9mIG9uIHRoZSB3aW5kb3cgZGlyZWN0bHkuIFRoaXMgYWxsb3dzIHlvdSB0byBkbyBhZHZhbmNlZCB0aGluZ3MgbGlrZSBsb2FkIG11bHRpcGxlIHZlcnNpb25zIG9mIEdyZWVuU29ja1xuXHRcdFx0ICogZmlsZXMgYW5kIHB1dCB0aGVtIGludG8gZGlzdGluY3Qgb2JqZWN0cyAoaW1hZ2luZSBhIGJhbm5lciBhZCB1c2VzIGEgbmV3ZXIgdmVyc2lvbiBidXQgdGhlIG1haW4gc2l0ZSB1c2VzIGFuIG9sZGVyIG9uZSkuIEluIHRoYXQgY2FzZSwgeW91IGNvdWxkXG5cdFx0XHQgKiBzYW5kYm94IHRoZSBiYW5uZXIgb25lIGxpa2U6XG5cdFx0XHQgKlxuXHRcdFx0ICogPHNjcmlwdD5cblx0XHRcdCAqICAgICB2YXIgZ3MgPSB3aW5kb3cuR3JlZW5Tb2NrR2xvYmFscyA9IHt9OyAvL3RoZSBuZXdlciB2ZXJzaW9uIHdlJ3JlIGFib3V0IHRvIGxvYWQgY291bGQgbm93IGJlIHJlZmVyZW5jZWQgaW4gYSBcImdzXCIgb2JqZWN0LCBsaWtlIGdzLlR3ZWVuTGl0ZS50byguLi4pLiBVc2Ugd2hhdGV2ZXIgYWxpYXMgeW91IHdhbnQgYXMgbG9uZyBhcyBpdCdzIHVuaXF1ZSwgXCJnc1wiIG9yIFwiYmFubmVyXCIgb3Igd2hhdGV2ZXIuXG5cdFx0XHQgKiA8L3NjcmlwdD5cblx0XHRcdCAqIDxzY3JpcHQgc3JjPVwianMvZ3JlZW5zb2NrL3YxLjcvVHdlZW5NYXguanNcIj48L3NjcmlwdD5cblx0XHRcdCAqIDxzY3JpcHQ+XG5cdFx0XHQgKiAgICAgd2luZG93LkdyZWVuU29ja0dsb2JhbHMgPSB3aW5kb3cuX2dzUXVldWUgPSB3aW5kb3cuX2dzRGVmaW5lID0gbnVsbDsgLy9yZXNldCBpdCBiYWNrIHRvIG51bGwgKGFsb25nIHdpdGggdGhlIHNwZWNpYWwgX2dzUXVldWUgdmFyaWFibGUpIHNvIHRoYXQgdGhlIG5leHQgbG9hZCBvZiBUd2Vlbk1heCBhZmZlY3RzIHRoZSB3aW5kb3cgYW5kIHdlIGNhbiByZWZlcmVuY2UgdGhpbmdzIGRpcmVjdGx5IGxpa2UgVHdlZW5MaXRlLnRvKC4uLilcblx0XHRcdCAqIDwvc2NyaXB0PlxuXHRcdFx0ICogPHNjcmlwdCBzcmM9XCJqcy9ncmVlbnNvY2svdjEuNi9Ud2Vlbk1heC5qc1wiPjwvc2NyaXB0PlxuXHRcdFx0ICogPHNjcmlwdD5cblx0XHRcdCAqICAgICBncy5Ud2VlbkxpdGUudG8oLi4uKTsgLy93b3VsZCB1c2UgdjEuN1xuXHRcdFx0ICogICAgIFR3ZWVuTGl0ZS50byguLi4pOyAvL3dvdWxkIHVzZSB2MS42XG5cdFx0XHQgKiA8L3NjcmlwdD5cblx0XHRcdCAqXG5cdFx0XHQgKiBAcGFyYW0geyFzdHJpbmd9IG5zIFRoZSBuYW1lc3BhY2Ugb2YgdGhlIGNsYXNzIGRlZmluaXRpb24sIGxlYXZpbmcgb2ZmIFwiY29tLmdyZWVuc29jay5cIiBhcyB0aGF0J3MgYXNzdW1lZC4gRm9yIGV4YW1wbGUsIFwiVHdlZW5MaXRlXCIgb3IgXCJwbHVnaW5zLkNTU1BsdWdpblwiIG9yIFwiZWFzaW5nLkJhY2tcIi5cblx0XHRcdCAqIEBwYXJhbSB7IUFycmF5LjxzdHJpbmc+fSBkZXBlbmRlbmNpZXMgQW4gYXJyYXkgb2YgZGVwZW5kZW5jaWVzIChkZXNjcmliZWQgYXMgdGhlaXIgbmFtZXNwYWNlcyBtaW51cyBcImNvbS5ncmVlbnNvY2suXCIgcHJlZml4KS4gRm9yIGV4YW1wbGUgW1wiVHdlZW5MaXRlXCIsXCJwbHVnaW5zLlR3ZWVuUGx1Z2luXCIsXCJjb3JlLkFuaW1hdGlvblwiXVxuXHRcdFx0ICogQHBhcmFtIHshZnVuY3Rpb24oKTpPYmplY3R9IGZ1bmMgVGhlIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCBhbmQgcGFzc2VkIHRoZSByZXNvbHZlZCBkZXBlbmRlbmNpZXMgd2hpY2ggd2lsbCByZXR1cm4gdGhlIGFjdHVhbCBjbGFzcyBmb3IgdGhpcyBkZWZpbml0aW9uLlxuXHRcdFx0ICogQHBhcmFtIHtib29sZWFuPX0gZ2xvYmFsIElmIHRydWUsIHRoZSBjbGFzcyB3aWxsIGJlIGFkZGVkIHRvIHRoZSBnbG9iYWwgc2NvcGUgKHR5cGljYWxseSB3aW5kb3cgdW5sZXNzIHlvdSBkZWZpbmUgYSB3aW5kb3cuR3JlZW5Tb2NrR2xvYmFscyBvYmplY3QpXG5cdFx0XHQgKi9cblx0XHRcdERlZmluaXRpb24gPSBmdW5jdGlvbihucywgZGVwZW5kZW5jaWVzLCBmdW5jLCBnbG9iYWwpIHtcblx0XHRcdFx0dGhpcy5zYyA9IChfZGVmTG9va3VwW25zXSkgPyBfZGVmTG9va3VwW25zXS5zYyA6IFtdOyAvL3N1YmNsYXNzZXNcblx0XHRcdFx0X2RlZkxvb2t1cFtuc10gPSB0aGlzO1xuXHRcdFx0XHR0aGlzLmdzQ2xhc3MgPSBudWxsO1xuXHRcdFx0XHR0aGlzLmZ1bmMgPSBmdW5jO1xuXHRcdFx0XHR2YXIgX2NsYXNzZXMgPSBbXTtcblx0XHRcdFx0dGhpcy5jaGVjayA9IGZ1bmN0aW9uKGluaXQpIHtcblx0XHRcdFx0XHR2YXIgaSA9IGRlcGVuZGVuY2llcy5sZW5ndGgsXG5cdFx0XHRcdFx0XHRtaXNzaW5nID0gaSxcblx0XHRcdFx0XHRcdGN1ciwgYSwgbiwgY2wsIGhhc01vZHVsZTtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdGlmICgoY3VyID0gX2RlZkxvb2t1cFtkZXBlbmRlbmNpZXNbaV1dIHx8IG5ldyBEZWZpbml0aW9uKGRlcGVuZGVuY2llc1tpXSwgW10pKS5nc0NsYXNzKSB7XG5cdFx0XHRcdFx0XHRcdF9jbGFzc2VzW2ldID0gY3VyLmdzQ2xhc3M7XG5cdFx0XHRcdFx0XHRcdG1pc3NpbmctLTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoaW5pdCkge1xuXHRcdFx0XHRcdFx0XHRjdXIuc2MucHVzaCh0aGlzKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKG1pc3NpbmcgPT09IDAgJiYgZnVuYykge1xuXHRcdFx0XHRcdFx0YSA9IChcImNvbS5ncmVlbnNvY2suXCIgKyBucykuc3BsaXQoXCIuXCIpO1xuXHRcdFx0XHRcdFx0biA9IGEucG9wKCk7XG5cdFx0XHRcdFx0XHRjbCA9IF9uYW1lc3BhY2UoYS5qb2luKFwiLlwiKSlbbl0gPSB0aGlzLmdzQ2xhc3MgPSBmdW5jLmFwcGx5KGZ1bmMsIF9jbGFzc2VzKTtcblxuXHRcdFx0XHRcdFx0Ly9leHBvcnRzIHRvIG11bHRpcGxlIGVudmlyb25tZW50c1xuXHRcdFx0XHRcdFx0aWYgKGdsb2JhbCkge1xuXHRcdFx0XHRcdFx0XHRfZ2xvYmFsc1tuXSA9IGNsOyAvL3Byb3ZpZGVzIGEgd2F5IHRvIGF2b2lkIGdsb2JhbCBuYW1lc3BhY2UgcG9sbHV0aW9uLiBCeSBkZWZhdWx0LCB0aGUgbWFpbiBjbGFzc2VzIGxpa2UgVHdlZW5MaXRlLCBQb3dlcjEsIFN0cm9uZywgZXRjLiBhcmUgYWRkZWQgdG8gd2luZG93IHVubGVzcyBhIEdyZWVuU29ja0dsb2JhbHMgaXMgZGVmaW5lZC4gU28gaWYgeW91IHdhbnQgdG8gaGF2ZSB0aGluZ3MgYWRkZWQgdG8gYSBjdXN0b20gb2JqZWN0IGluc3RlYWQsIGp1c3QgZG8gc29tZXRoaW5nIGxpa2Ugd2luZG93LkdyZWVuU29ja0dsb2JhbHMgPSB7fSBiZWZvcmUgbG9hZGluZyBhbnkgR3JlZW5Tb2NrIGZpbGVzLiBZb3UgY2FuIGV2ZW4gc2V0IHVwIGFuIGFsaWFzIGxpa2Ugd2luZG93LkdyZWVuU29ja0dsb2JhbHMgPSB3aW5kb3dzLmdzID0ge30gc28gdGhhdCB5b3UgY2FuIGFjY2VzcyBldmVyeXRoaW5nIGxpa2UgZ3MuVHdlZW5MaXRlLiBBbHNvIHJlbWVtYmVyIHRoYXQgQUxMIGNsYXNzZXMgYXJlIGFkZGVkIHRvIHRoZSB3aW5kb3cuY29tLmdyZWVuc29jayBvYmplY3QgKGluIHRoZWlyIHJlc3BlY3RpdmUgcGFja2FnZXMsIGxpa2UgY29tLmdyZWVuc29jay5lYXNpbmcuUG93ZXIxLCBjb20uZ3JlZW5zb2NrLlR3ZWVuTGl0ZSwgZXRjLilcblx0XHRcdFx0XHRcdFx0aGFzTW9kdWxlID0gKHR5cGVvZihtb2R1bGUpICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzKTtcblx0XHRcdFx0XHRcdFx0aWYgKCFoYXNNb2R1bGUgJiYgdHlwZW9mKGRlZmluZSkgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKXsgLy9BTURcblx0XHRcdFx0XHRcdFx0XHRkZWZpbmUoKHdpbmRvdy5HcmVlblNvY2tBTURQYXRoID8gd2luZG93LkdyZWVuU29ja0FNRFBhdGggKyBcIi9cIiA6IFwiXCIpICsgbnMuc3BsaXQoXCIuXCIpLnBvcCgpLCBbXSwgZnVuY3Rpb24oKSB7IHJldHVybiBjbDsgfSk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAobnMgPT09IG1vZHVsZU5hbWUgJiYgaGFzTW9kdWxlKXsgLy9ub2RlXG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlLmV4cG9ydHMgPSBjbDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMuc2MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5zY1tpXS5jaGVjaygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0dGhpcy5jaGVjayh0cnVlKTtcblx0XHRcdH0sXG5cblx0XHRcdC8vdXNlZCB0byBjcmVhdGUgRGVmaW5pdGlvbiBpbnN0YW5jZXMgKHdoaWNoIGJhc2ljYWxseSByZWdpc3RlcnMgYSBjbGFzcyB0aGF0IGhhcyBkZXBlbmRlbmNpZXMpLlxuXHRcdFx0X2dzRGVmaW5lID0gd2luZG93Ll9nc0RlZmluZSA9IGZ1bmN0aW9uKG5zLCBkZXBlbmRlbmNpZXMsIGZ1bmMsIGdsb2JhbCkge1xuXHRcdFx0XHRyZXR1cm4gbmV3IERlZmluaXRpb24obnMsIGRlcGVuZGVuY2llcywgZnVuYywgZ2xvYmFsKTtcblx0XHRcdH0sXG5cblx0XHRcdC8vYSBxdWljayB3YXkgdG8gY3JlYXRlIGEgY2xhc3MgdGhhdCBkb2Vzbid0IGhhdmUgYW55IGRlcGVuZGVuY2llcy4gUmV0dXJucyB0aGUgY2xhc3MsIGJ1dCBmaXJzdCByZWdpc3RlcnMgaXQgaW4gdGhlIEdyZWVuU29jayBuYW1lc3BhY2Ugc28gdGhhdCBvdGhlciBjbGFzc2VzIGNhbiBncmFiIGl0IChvdGhlciBjbGFzc2VzIG1pZ2h0IGJlIGRlcGVuZGVudCBvbiB0aGUgY2xhc3MpLlxuXHRcdFx0X2NsYXNzID0gZ3MuX2NsYXNzID0gZnVuY3Rpb24obnMsIGZ1bmMsIGdsb2JhbCkge1xuXHRcdFx0XHRmdW5jID0gZnVuYyB8fCBmdW5jdGlvbigpIHt9O1xuXHRcdFx0XHRfZ3NEZWZpbmUobnMsIFtdLCBmdW5jdGlvbigpeyByZXR1cm4gZnVuYzsgfSwgZ2xvYmFsKTtcblx0XHRcdFx0cmV0dXJuIGZ1bmM7XG5cdFx0XHR9O1xuXG5cdFx0X2dzRGVmaW5lLmdsb2JhbHMgPSBfZ2xvYmFscztcblxuXG5cbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBFYXNlXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0XHR2YXIgX2Jhc2VQYXJhbXMgPSBbMCwgMCwgMSwgMV0sXG5cdFx0XHRfYmxhbmtBcnJheSA9IFtdLFxuXHRcdFx0RWFzZSA9IF9jbGFzcyhcImVhc2luZy5FYXNlXCIsIGZ1bmN0aW9uKGZ1bmMsIGV4dHJhUGFyYW1zLCB0eXBlLCBwb3dlcikge1xuXHRcdFx0XHR0aGlzLl9mdW5jID0gZnVuYztcblx0XHRcdFx0dGhpcy5fdHlwZSA9IHR5cGUgfHwgMDtcblx0XHRcdFx0dGhpcy5fcG93ZXIgPSBwb3dlciB8fCAwO1xuXHRcdFx0XHR0aGlzLl9wYXJhbXMgPSBleHRyYVBhcmFtcyA/IF9iYXNlUGFyYW1zLmNvbmNhdChleHRyYVBhcmFtcykgOiBfYmFzZVBhcmFtcztcblx0XHRcdH0sIHRydWUpLFxuXHRcdFx0X2Vhc2VNYXAgPSBFYXNlLm1hcCA9IHt9LFxuXHRcdFx0X2Vhc2VSZWcgPSBFYXNlLnJlZ2lzdGVyID0gZnVuY3Rpb24oZWFzZSwgbmFtZXMsIHR5cGVzLCBjcmVhdGUpIHtcblx0XHRcdFx0dmFyIG5hID0gbmFtZXMuc3BsaXQoXCIsXCIpLFxuXHRcdFx0XHRcdGkgPSBuYS5sZW5ndGgsXG5cdFx0XHRcdFx0dGEgPSAodHlwZXMgfHwgXCJlYXNlSW4sZWFzZU91dCxlYXNlSW5PdXRcIikuc3BsaXQoXCIsXCIpLFxuXHRcdFx0XHRcdGUsIG5hbWUsIGosIHR5cGU7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdG5hbWUgPSBuYVtpXTtcblx0XHRcdFx0XHRlID0gY3JlYXRlID8gX2NsYXNzKFwiZWFzaW5nLlwiK25hbWUsIG51bGwsIHRydWUpIDogZ3MuZWFzaW5nW25hbWVdIHx8IHt9O1xuXHRcdFx0XHRcdGogPSB0YS5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taiA+IC0xKSB7XG5cdFx0XHRcdFx0XHR0eXBlID0gdGFbal07XG5cdFx0XHRcdFx0XHRfZWFzZU1hcFtuYW1lICsgXCIuXCIgKyB0eXBlXSA9IF9lYXNlTWFwW3R5cGUgKyBuYW1lXSA9IGVbdHlwZV0gPSBlYXNlLmdldFJhdGlvID8gZWFzZSA6IGVhc2VbdHlwZV0gfHwgbmV3IGVhc2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRwID0gRWFzZS5wcm90b3R5cGU7XG5cdFx0cC5fY2FsY0VuZCA9IGZhbHNlO1xuXHRcdHAuZ2V0UmF0aW8gPSBmdW5jdGlvbihwKSB7XG5cdFx0XHRpZiAodGhpcy5fZnVuYykge1xuXHRcdFx0XHR0aGlzLl9wYXJhbXNbMF0gPSBwO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZnVuYy5hcHBseShudWxsLCB0aGlzLl9wYXJhbXMpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHQgPSB0aGlzLl90eXBlLFxuXHRcdFx0XHRwdyA9IHRoaXMuX3Bvd2VyLFxuXHRcdFx0XHRyID0gKHQgPT09IDEpID8gMSAtIHAgOiAodCA9PT0gMikgPyBwIDogKHAgPCAwLjUpID8gcCAqIDIgOiAoMSAtIHApICogMjtcblx0XHRcdGlmIChwdyA9PT0gMSkge1xuXHRcdFx0XHRyICo9IHI7XG5cdFx0XHR9IGVsc2UgaWYgKHB3ID09PSAyKSB7XG5cdFx0XHRcdHIgKj0gciAqIHI7XG5cdFx0XHR9IGVsc2UgaWYgKHB3ID09PSAzKSB7XG5cdFx0XHRcdHIgKj0gciAqIHIgKiByO1xuXHRcdFx0fSBlbHNlIGlmIChwdyA9PT0gNCkge1xuXHRcdFx0XHRyICo9IHIgKiByICogciAqIHI7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKHQgPT09IDEpID8gMSAtIHIgOiAodCA9PT0gMikgPyByIDogKHAgPCAwLjUpID8gciAvIDIgOiAxIC0gKHIgLyAyKTtcblx0XHR9O1xuXG5cdFx0Ly9jcmVhdGUgYWxsIHRoZSBzdGFuZGFyZCBlYXNlcyBsaWtlIExpbmVhciwgUXVhZCwgQ3ViaWMsIFF1YXJ0LCBRdWludCwgU3Ryb25nLCBQb3dlcjAsIFBvd2VyMSwgUG93ZXIyLCBQb3dlcjMsIGFuZCBQb3dlcjQgKGVhY2ggd2l0aCBlYXNlSW4sIGVhc2VPdXQsIGFuZCBlYXNlSW5PdXQpXG5cdFx0YSA9IFtcIkxpbmVhclwiLFwiUXVhZFwiLFwiQ3ViaWNcIixcIlF1YXJ0XCIsXCJRdWludCxTdHJvbmdcIl07XG5cdFx0aSA9IGEubGVuZ3RoO1xuXHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0cCA9IGFbaV0rXCIsUG93ZXJcIitpO1xuXHRcdFx0X2Vhc2VSZWcobmV3IEVhc2UobnVsbCxudWxsLDEsaSksIHAsIFwiZWFzZU91dFwiLCB0cnVlKTtcblx0XHRcdF9lYXNlUmVnKG5ldyBFYXNlKG51bGwsbnVsbCwyLGkpLCBwLCBcImVhc2VJblwiICsgKChpID09PSAwKSA/IFwiLGVhc2VOb25lXCIgOiBcIlwiKSk7XG5cdFx0XHRfZWFzZVJlZyhuZXcgRWFzZShudWxsLG51bGwsMyxpKSwgcCwgXCJlYXNlSW5PdXRcIik7XG5cdFx0fVxuXHRcdF9lYXNlTWFwLmxpbmVhciA9IGdzLmVhc2luZy5MaW5lYXIuZWFzZUluO1xuXHRcdF9lYXNlTWFwLnN3aW5nID0gZ3MuZWFzaW5nLlF1YWQuZWFzZUluT3V0OyAvL2ZvciBqUXVlcnkgZm9sa3NcblxuXG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogRXZlbnREaXNwYXRjaGVyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0XHR2YXIgRXZlbnREaXNwYXRjaGVyID0gX2NsYXNzKFwiZXZlbnRzLkV2ZW50RGlzcGF0Y2hlclwiLCBmdW5jdGlvbih0YXJnZXQpIHtcblx0XHRcdHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuXHRcdFx0dGhpcy5fZXZlbnRUYXJnZXQgPSB0YXJnZXQgfHwgdGhpcztcblx0XHR9KTtcblx0XHRwID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZTtcblxuXHRcdHAuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBzY29wZSwgdXNlUGFyYW0sIHByaW9yaXR5KSB7XG5cdFx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0XHR2YXIgbGlzdCA9IHRoaXMuX2xpc3RlbmVyc1t0eXBlXSxcblx0XHRcdFx0aW5kZXggPSAwLFxuXHRcdFx0XHRsaXN0ZW5lciwgaTtcblx0XHRcdGlmIChsaXN0ID09IG51bGwpIHtcblx0XHRcdFx0dGhpcy5fbGlzdGVuZXJzW3R5cGVdID0gbGlzdCA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0aSA9IGxpc3QubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGxpc3RlbmVyID0gbGlzdFtpXTtcblx0XHRcdFx0aWYgKGxpc3RlbmVyLmMgPT09IGNhbGxiYWNrICYmIGxpc3RlbmVyLnMgPT09IHNjb3BlKSB7XG5cdFx0XHRcdFx0bGlzdC5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoaW5kZXggPT09IDAgJiYgbGlzdGVuZXIucHIgPCBwcmlvcml0eSkge1xuXHRcdFx0XHRcdGluZGV4ID0gaSArIDE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGxpc3Quc3BsaWNlKGluZGV4LCAwLCB7YzpjYWxsYmFjaywgczpzY29wZSwgdXA6dXNlUGFyYW0sIHByOnByaW9yaXR5fSk7XG5cdFx0XHRpZiAodGhpcyA9PT0gX3RpY2tlciAmJiAhX3RpY2tlckFjdGl2ZSkge1xuXHRcdFx0XHRfdGlja2VyLndha2UoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cC5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgY2FsbGJhY2spIHtcblx0XHRcdHZhciBsaXN0ID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdLCBpO1xuXHRcdFx0aWYgKGxpc3QpIHtcblx0XHRcdFx0aSA9IGxpc3QubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRpZiAobGlzdFtpXS5jID09PSBjYWxsYmFjaykge1xuXHRcdFx0XHRcdFx0bGlzdC5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHAuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKHR5cGUpIHtcblx0XHRcdHZhciBsaXN0ID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdLFxuXHRcdFx0XHRpLCB0LCBsaXN0ZW5lcjtcblx0XHRcdGlmIChsaXN0KSB7XG5cdFx0XHRcdGkgPSBsaXN0Lmxlbmd0aDtcblx0XHRcdFx0dCA9IHRoaXMuX2V2ZW50VGFyZ2V0O1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRsaXN0ZW5lciA9IGxpc3RbaV07XG5cdFx0XHRcdFx0aWYgKGxpc3RlbmVyKSB7XG5cdFx0XHRcdFx0XHRpZiAobGlzdGVuZXIudXApIHtcblx0XHRcdFx0XHRcdFx0bGlzdGVuZXIuYy5jYWxsKGxpc3RlbmVyLnMgfHwgdCwge3R5cGU6dHlwZSwgdGFyZ2V0OnR9KTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGxpc3RlbmVyLmMuY2FsbChsaXN0ZW5lci5zIHx8IHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFRpY2tlclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG4gXHRcdHZhciBfcmVxQW5pbUZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSxcblx0XHRcdF9jYW5jZWxBbmltRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUsXG5cdFx0XHRfZ2V0VGltZSA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge3JldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTt9LFxuXHRcdFx0X2xhc3RVcGRhdGUgPSBfZ2V0VGltZSgpO1xuXG5cdFx0Ly9ub3cgdHJ5IHRvIGRldGVybWluZSB0aGUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGFuZCBjYW5jZWxBbmltYXRpb25GcmFtZSBmdW5jdGlvbnMgYW5kIGlmIG5vbmUgYXJlIGZvdW5kLCB3ZSdsbCB1c2UgYSBzZXRUaW1lb3V0KCkvY2xlYXJUaW1lb3V0KCkgcG9seWZpbGwuXG5cdFx0YSA9IFtcIm1zXCIsXCJtb3pcIixcIndlYmtpdFwiLFwib1wiXTtcblx0XHRpID0gYS5sZW5ndGg7XG5cdFx0d2hpbGUgKC0taSA+IC0xICYmICFfcmVxQW5pbUZyYW1lKSB7XG5cdFx0XHRfcmVxQW5pbUZyYW1lID0gd2luZG93W2FbaV0gKyBcIlJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcblx0XHRcdF9jYW5jZWxBbmltRnJhbWUgPSB3aW5kb3dbYVtpXSArIFwiQ2FuY2VsQW5pbWF0aW9uRnJhbWVcIl0gfHwgd2luZG93W2FbaV0gKyBcIkNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcblx0XHR9XG5cblx0XHRfY2xhc3MoXCJUaWNrZXJcIiwgZnVuY3Rpb24oZnBzLCB1c2VSQUYpIHtcblx0XHRcdHZhciBfc2VsZiA9IHRoaXMsXG5cdFx0XHRcdF9zdGFydFRpbWUgPSBfZ2V0VGltZSgpLFxuXHRcdFx0XHRfdXNlUkFGID0gKHVzZVJBRiAhPT0gZmFsc2UgJiYgX3JlcUFuaW1GcmFtZSkgPyBcImF1dG9cIiA6IGZhbHNlLFxuXHRcdFx0XHRfbGFnVGhyZXNob2xkID0gNTAwLFxuXHRcdFx0XHRfYWRqdXN0ZWRMYWcgPSAzMyxcblx0XHRcdFx0X3RpY2tXb3JkID0gXCJ0aWNrXCIsIC8vaGVscHMgcmVkdWNlIGdjIGJ1cmRlblxuXHRcdFx0XHRfZnBzLCBfcmVxLCBfaWQsIF9nYXAsIF9uZXh0VGltZSxcblx0XHRcdFx0X3RpY2sgPSBmdW5jdGlvbihtYW51YWwpIHtcblx0XHRcdFx0XHR2YXIgZWxhcHNlZCA9IF9nZXRUaW1lKCkgLSBfbGFzdFVwZGF0ZSxcblx0XHRcdFx0XHRcdG92ZXJsYXAsIGRpc3BhdGNoO1xuXHRcdFx0XHRcdGlmIChlbGFwc2VkID4gX2xhZ1RocmVzaG9sZCkge1xuXHRcdFx0XHRcdFx0X3N0YXJ0VGltZSArPSBlbGFwc2VkIC0gX2FkanVzdGVkTGFnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRfbGFzdFVwZGF0ZSArPSBlbGFwc2VkO1xuXHRcdFx0XHRcdF9zZWxmLnRpbWUgPSAoX2xhc3RVcGRhdGUgLSBfc3RhcnRUaW1lKSAvIDEwMDA7XG5cdFx0XHRcdFx0b3ZlcmxhcCA9IF9zZWxmLnRpbWUgLSBfbmV4dFRpbWU7XG5cdFx0XHRcdFx0aWYgKCFfZnBzIHx8IG92ZXJsYXAgPiAwIHx8IG1hbnVhbCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0X3NlbGYuZnJhbWUrKztcblx0XHRcdFx0XHRcdF9uZXh0VGltZSArPSBvdmVybGFwICsgKG92ZXJsYXAgPj0gX2dhcCA/IDAuMDA0IDogX2dhcCAtIG92ZXJsYXApO1xuXHRcdFx0XHRcdFx0ZGlzcGF0Y2ggPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAobWFudWFsICE9PSB0cnVlKSB7IC8vbWFrZSBzdXJlIHRoZSByZXF1ZXN0IGlzIG1hZGUgYmVmb3JlIHdlIGRpc3BhdGNoIHRoZSBcInRpY2tcIiBldmVudCBzbyB0aGF0IHRpbWluZyBpcyBtYWludGFpbmVkLiBPdGhlcndpc2UsIGlmIHByb2Nlc3NpbmcgdGhlIFwidGlja1wiIHJlcXVpcmVzIGEgYnVuY2ggb2YgdGltZSAobGlrZSAxNW1zKSBhbmQgd2UncmUgdXNpbmcgYSBzZXRUaW1lb3V0KCkgdGhhdCdzIGJhc2VkIG9uIDE2LjdtcywgaXQnZCB0ZWNobmljYWxseSB0YWtlIDMxLjdtcyBiZXR3ZWVuIGZyYW1lcyBvdGhlcndpc2UuXG5cdFx0XHRcdFx0XHRfaWQgPSBfcmVxKF90aWNrKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGRpc3BhdGNoKSB7XG5cdFx0XHRcdFx0XHRfc2VsZi5kaXNwYXRjaEV2ZW50KF90aWNrV29yZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRFdmVudERpc3BhdGNoZXIuY2FsbChfc2VsZik7XG5cdFx0XHRfc2VsZi50aW1lID0gX3NlbGYuZnJhbWUgPSAwO1xuXHRcdFx0X3NlbGYudGljayA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRfdGljayh0cnVlKTtcblx0XHRcdH07XG5cblx0XHRcdF9zZWxmLmxhZ1Ntb290aGluZyA9IGZ1bmN0aW9uKHRocmVzaG9sZCwgYWRqdXN0ZWRMYWcpIHtcblx0XHRcdFx0X2xhZ1RocmVzaG9sZCA9IHRocmVzaG9sZCB8fCAoMSAvIF90aW55TnVtKTsgLy96ZXJvIHNob3VsZCBiZSBpbnRlcnByZXRlZCBhcyBiYXNpY2FsbHkgdW5saW1pdGVkXG5cdFx0XHRcdF9hZGp1c3RlZExhZyA9IE1hdGgubWluKGFkanVzdGVkTGFnLCBfbGFnVGhyZXNob2xkLCAwKTtcblx0XHRcdH07XG5cblx0XHRcdF9zZWxmLnNsZWVwID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChfaWQgPT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIV91c2VSQUYgfHwgIV9jYW5jZWxBbmltRnJhbWUpIHtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoX2lkKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfY2FuY2VsQW5pbUZyYW1lKF9pZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0X3JlcSA9IF9lbXB0eUZ1bmM7XG5cdFx0XHRcdF9pZCA9IG51bGw7XG5cdFx0XHRcdGlmIChfc2VsZiA9PT0gX3RpY2tlcikge1xuXHRcdFx0XHRcdF90aWNrZXJBY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0X3NlbGYud2FrZSA9IGZ1bmN0aW9uKHNlYW1sZXNzKSB7XG5cdFx0XHRcdGlmIChfaWQgIT09IG51bGwpIHtcblx0XHRcdFx0XHRfc2VsZi5zbGVlcCgpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHNlYW1sZXNzKSB7XG5cdFx0XHRcdFx0X3N0YXJ0VGltZSArPSAtX2xhc3RVcGRhdGUgKyAoX2xhc3RVcGRhdGUgPSBfZ2V0VGltZSgpKTtcblx0XHRcdFx0fSBlbHNlIGlmIChfc2VsZi5mcmFtZSA+IDEwKSB7IC8vZG9uJ3QgdHJpZ2dlciBsYWdTbW9vdGhpbmcgaWYgd2UncmUganVzdCB3YWtpbmcgdXAsIGFuZCBtYWtlIHN1cmUgdGhhdCBhdCBsZWFzdCAxMCBmcmFtZXMgaGF2ZSBlbGFwc2VkIGJlY2F1c2Ugb2YgdGhlIGlPUyBidWcgdGhhdCB3ZSB3b3JrIGFyb3VuZCBiZWxvdyB3aXRoIHRoZSAxLjUtc2Vjb25kIHNldFRpbW91dCgpLlxuXHRcdFx0XHRcdF9sYXN0VXBkYXRlID0gX2dldFRpbWUoKSAtIF9sYWdUaHJlc2hvbGQgKyA1O1xuXHRcdFx0XHR9XG5cdFx0XHRcdF9yZXEgPSAoX2ZwcyA9PT0gMCkgPyBfZW1wdHlGdW5jIDogKCFfdXNlUkFGIHx8ICFfcmVxQW5pbUZyYW1lKSA/IGZ1bmN0aW9uKGYpIHsgcmV0dXJuIHNldFRpbWVvdXQoZiwgKChfbmV4dFRpbWUgLSBfc2VsZi50aW1lKSAqIDEwMDAgKyAxKSB8IDApOyB9IDogX3JlcUFuaW1GcmFtZTtcblx0XHRcdFx0aWYgKF9zZWxmID09PSBfdGlja2VyKSB7XG5cdFx0XHRcdFx0X3RpY2tlckFjdGl2ZSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0X3RpY2soMik7XG5cdFx0XHR9O1xuXG5cdFx0XHRfc2VsZi5mcHMgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRyZXR1cm4gX2Zwcztcblx0XHRcdFx0fVxuXHRcdFx0XHRfZnBzID0gdmFsdWU7XG5cdFx0XHRcdF9nYXAgPSAxIC8gKF9mcHMgfHwgNjApO1xuXHRcdFx0XHRfbmV4dFRpbWUgPSB0aGlzLnRpbWUgKyBfZ2FwO1xuXHRcdFx0XHRfc2VsZi53YWtlKCk7XG5cdFx0XHR9O1xuXG5cdFx0XHRfc2VsZi51c2VSQUYgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRyZXR1cm4gX3VzZVJBRjtcblx0XHRcdFx0fVxuXHRcdFx0XHRfc2VsZi5zbGVlcCgpO1xuXHRcdFx0XHRfdXNlUkFGID0gdmFsdWU7XG5cdFx0XHRcdF9zZWxmLmZwcyhfZnBzKTtcblx0XHRcdH07XG5cdFx0XHRfc2VsZi5mcHMoZnBzKTtcblxuXHRcdFx0Ly9hIGJ1ZyBpbiBpT1MgNiBTYWZhcmkgb2NjYXNpb25hbGx5IHByZXZlbnRzIHRoZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgZnJvbSB3b3JraW5nIGluaXRpYWxseSwgc28gd2UgdXNlIGEgMS41LXNlY29uZCB0aW1lb3V0IHRoYXQgYXV0b21hdGljYWxseSBmYWxscyBiYWNrIHRvIHNldFRpbWVvdXQoKSBpZiBpdCBzZW5zZXMgdGhpcyBjb25kaXRpb24uXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoX3VzZVJBRiA9PT0gXCJhdXRvXCIgJiYgX3NlbGYuZnJhbWUgPCA1ICYmIGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSAhPT0gXCJoaWRkZW5cIikge1xuXHRcdFx0XHRcdF9zZWxmLnVzZVJBRihmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIDE1MDApO1xuXHRcdH0pO1xuXG5cdFx0cCA9IGdzLlRpY2tlci5wcm90b3R5cGUgPSBuZXcgZ3MuZXZlbnRzLkV2ZW50RGlzcGF0Y2hlcigpO1xuXHRcdHAuY29uc3RydWN0b3IgPSBncy5UaWNrZXI7XG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEFuaW1hdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdFx0dmFyIEFuaW1hdGlvbiA9IF9jbGFzcyhcImNvcmUuQW5pbWF0aW9uXCIsIGZ1bmN0aW9uKGR1cmF0aW9uLCB2YXJzKSB7XG5cdFx0XHRcdHRoaXMudmFycyA9IHZhcnMgPSB2YXJzIHx8IHt9O1xuXHRcdFx0XHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX3RvdGFsRHVyYXRpb24gPSBkdXJhdGlvbiB8fCAwO1xuXHRcdFx0XHR0aGlzLl9kZWxheSA9IE51bWJlcih2YXJzLmRlbGF5KSB8fCAwO1xuXHRcdFx0XHR0aGlzLl90aW1lU2NhbGUgPSAxO1xuXHRcdFx0XHR0aGlzLl9hY3RpdmUgPSAodmFycy5pbW1lZGlhdGVSZW5kZXIgPT09IHRydWUpO1xuXHRcdFx0XHR0aGlzLmRhdGEgPSB2YXJzLmRhdGE7XG5cdFx0XHRcdHRoaXMuX3JldmVyc2VkID0gKHZhcnMucmV2ZXJzZWQgPT09IHRydWUpO1xuXG5cdFx0XHRcdGlmICghX3Jvb3RUaW1lbGluZSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIV90aWNrZXJBY3RpdmUpIHsgLy9zb21lIGJyb3dzZXJzIChsaWtlIGlPUyA2IFNhZmFyaSkgc2h1dCBkb3duIEphdmFTY3JpcHQgZXhlY3V0aW9uIHdoZW4gdGhlIHRhYiBpcyBkaXNhYmxlZCBhbmQgdGhleSBbb2NjYXNpb25hbGx5XSBuZWdsZWN0IHRvIHN0YXJ0IHVwIHJlcXVlc3RBbmltYXRpb25GcmFtZSBhZ2FpbiB3aGVuIHJldHVybmluZyAtIHRoaXMgY29kZSBlbnN1cmVzIHRoYXQgdGhlIGVuZ2luZSBzdGFydHMgdXAgYWdhaW4gcHJvcGVybHkuXG5cdFx0XHRcdFx0X3RpY2tlci53YWtlKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgdGwgPSB0aGlzLnZhcnMudXNlRnJhbWVzID8gX3Jvb3RGcmFtZXNUaW1lbGluZSA6IF9yb290VGltZWxpbmU7XG5cdFx0XHRcdHRsLmFkZCh0aGlzLCB0bC5fdGltZSk7XG5cblx0XHRcdFx0aWYgKHRoaXMudmFycy5wYXVzZWQpIHtcblx0XHRcdFx0XHR0aGlzLnBhdXNlZCh0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRfdGlja2VyID0gQW5pbWF0aW9uLnRpY2tlciA9IG5ldyBncy5UaWNrZXIoKTtcblx0XHRwID0gQW5pbWF0aW9uLnByb3RvdHlwZTtcblx0XHRwLl9kaXJ0eSA9IHAuX2djID0gcC5faW5pdHRlZCA9IHAuX3BhdXNlZCA9IGZhbHNlO1xuXHRcdHAuX3RvdGFsVGltZSA9IHAuX3RpbWUgPSAwO1xuXHRcdHAuX3Jhd1ByZXZUaW1lID0gLTE7XG5cdFx0cC5fbmV4dCA9IHAuX2xhc3QgPSBwLl9vblVwZGF0ZSA9IHAuX3RpbWVsaW5lID0gcC50aW1lbGluZSA9IG51bGw7XG5cdFx0cC5fcGF1c2VkID0gZmFsc2U7XG5cblxuXHRcdC8vc29tZSBicm93c2VycyAobGlrZSBpT1MpIG9jY2FzaW9uYWxseSBkcm9wIHRoZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgZXZlbnQgd2hlbiB0aGUgdXNlciBzd2l0Y2hlcyB0byBhIGRpZmZlcmVudCB0YWIgYW5kIHRoZW4gY29tZXMgYmFjayBhZ2Fpbiwgc28gd2UgdXNlIGEgMi1zZWNvbmQgc2V0VGltZW91dCgpIHRvIHNlbnNlIGlmL3doZW4gdGhhdCBjb25kaXRpb24gb2NjdXJzIGFuZCB0aGVuIHdha2UoKSB0aGUgdGlja2VyLlxuXHRcdHZhciBfY2hlY2tUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChfdGlja2VyQWN0aXZlICYmIF9nZXRUaW1lKCkgLSBfbGFzdFVwZGF0ZSA+IDIwMDApIHtcblx0XHRcdFx0XHRfdGlja2VyLndha2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzZXRUaW1lb3V0KF9jaGVja1RpbWVvdXQsIDIwMDApO1xuXHRcdFx0fTtcblx0XHRfY2hlY2tUaW1lb3V0KCk7XG5cblxuXHRcdHAucGxheSA9IGZ1bmN0aW9uKGZyb20sIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRpZiAoZnJvbSAhPSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuc2Vlayhmcm9tLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXZlcnNlZChmYWxzZSkucGF1c2VkKGZhbHNlKTtcblx0XHR9O1xuXG5cdFx0cC5wYXVzZSA9IGZ1bmN0aW9uKGF0VGltZSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdGlmIChhdFRpbWUgIT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLnNlZWsoYXRUaW1lLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXVzZWQodHJ1ZSk7XG5cdFx0fTtcblxuXHRcdHAucmVzdW1lID0gZnVuY3Rpb24oZnJvbSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdGlmIChmcm9tICE9IG51bGwpIHtcblx0XHRcdFx0dGhpcy5zZWVrKGZyb20sIHN1cHByZXNzRXZlbnRzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnBhdXNlZChmYWxzZSk7XG5cdFx0fTtcblxuXHRcdHAuc2VlayA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy50b3RhbFRpbWUoTnVtYmVyKHRpbWUpLCBzdXBwcmVzc0V2ZW50cyAhPT0gZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLnJlc3RhcnQgPSBmdW5jdGlvbihpbmNsdWRlRGVsYXksIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXZlcnNlZChmYWxzZSkucGF1c2VkKGZhbHNlKS50b3RhbFRpbWUoaW5jbHVkZURlbGF5ID8gLXRoaXMuX2RlbGF5IDogMCwgKHN1cHByZXNzRXZlbnRzICE9PSBmYWxzZSksIHRydWUpO1xuXHRcdH07XG5cblx0XHRwLnJldmVyc2UgPSBmdW5jdGlvbihmcm9tLCBzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0aWYgKGZyb20gIT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLnNlZWsoKGZyb20gfHwgdGhpcy50b3RhbER1cmF0aW9uKCkpLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXZlcnNlZCh0cnVlKS5wYXVzZWQoZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLnJlbmRlciA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSkge1xuXHRcdFx0Ly9zdHViIC0gd2Ugb3ZlcnJpZGUgdGhpcyBtZXRob2QgaW4gc3ViY2xhc3Nlcy5cblx0XHR9O1xuXG5cdFx0cC5pbnZhbGlkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLl90aW1lID0gdGhpcy5fdG90YWxUaW1lID0gMDtcblx0XHRcdHRoaXMuX2luaXR0ZWQgPSB0aGlzLl9nYyA9IGZhbHNlO1xuXHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSAtMTtcblx0XHRcdGlmICh0aGlzLl9nYyB8fCAhdGhpcy50aW1lbGluZSkge1xuXHRcdFx0XHR0aGlzLl9lbmFibGVkKHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuaXNBY3RpdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0bCA9IHRoaXMuX3RpbWVsaW5lLCAvL3RoZSAyIHJvb3QgdGltZWxpbmVzIHdvbid0IGhhdmUgYSBfdGltZWxpbmU7IHRoZXkncmUgYWx3YXlzIGFjdGl2ZS5cblx0XHRcdFx0c3RhcnRUaW1lID0gdGhpcy5fc3RhcnRUaW1lLFxuXHRcdFx0XHRyYXdUaW1lO1xuXHRcdFx0cmV0dXJuICghdGwgfHwgKCF0aGlzLl9nYyAmJiAhdGhpcy5fcGF1c2VkICYmIHRsLmlzQWN0aXZlKCkgJiYgKHJhd1RpbWUgPSB0bC5yYXdUaW1lKCkpID49IHN0YXJ0VGltZSAmJiByYXdUaW1lIDwgc3RhcnRUaW1lICsgdGhpcy50b3RhbER1cmF0aW9uKCkgLyB0aGlzLl90aW1lU2NhbGUpKTtcblx0XHR9O1xuXG5cdFx0cC5fZW5hYmxlZCA9IGZ1bmN0aW9uIChlbmFibGVkLCBpZ25vcmVUaW1lbGluZSkge1xuXHRcdFx0aWYgKCFfdGlja2VyQWN0aXZlKSB7XG5cdFx0XHRcdF90aWNrZXIud2FrZSgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZ2MgPSAhZW5hYmxlZDtcblx0XHRcdHRoaXMuX2FjdGl2ZSA9IHRoaXMuaXNBY3RpdmUoKTtcblx0XHRcdGlmIChpZ25vcmVUaW1lbGluZSAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRpZiAoZW5hYmxlZCAmJiAhdGhpcy50aW1lbGluZSkge1xuXHRcdFx0XHRcdHRoaXMuX3RpbWVsaW5lLmFkZCh0aGlzLCB0aGlzLl9zdGFydFRpbWUgLSB0aGlzLl9kZWxheSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIWVuYWJsZWQgJiYgdGhpcy50aW1lbGluZSkge1xuXHRcdFx0XHRcdHRoaXMuX3RpbWVsaW5lLl9yZW1vdmUodGhpcywgdHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cblx0XHRwLl9raWxsID0gZnVuY3Rpb24odmFycywgdGFyZ2V0KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLmtpbGwgPSBmdW5jdGlvbih2YXJzLCB0YXJnZXQpIHtcblx0XHRcdHRoaXMuX2tpbGwodmFycywgdGFyZ2V0KTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLl91bmNhY2hlID0gZnVuY3Rpb24oaW5jbHVkZVNlbGYpIHtcblx0XHRcdHZhciB0d2VlbiA9IGluY2x1ZGVTZWxmID8gdGhpcyA6IHRoaXMudGltZWxpbmU7XG5cdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0dHdlZW4uX2RpcnR5ID0gdHJ1ZTtcblx0XHRcdFx0dHdlZW4gPSB0d2Vlbi50aW1lbGluZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLl9zd2FwU2VsZkluUGFyYW1zID0gZnVuY3Rpb24ocGFyYW1zKSB7XG5cdFx0XHR2YXIgaSA9IHBhcmFtcy5sZW5ndGgsXG5cdFx0XHRcdGNvcHkgPSBwYXJhbXMuY29uY2F0KCk7XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0aWYgKHBhcmFtc1tpXSA9PT0gXCJ7c2VsZn1cIikge1xuXHRcdFx0XHRcdGNvcHlbaV0gPSB0aGlzO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY29weTtcblx0XHR9O1xuXG5cdFx0cC5fY2FsbGJhY2sgPSBmdW5jdGlvbih0eXBlKSB7XG5cdFx0XHR2YXIgdiA9IHRoaXMudmFycztcblx0XHRcdHZbdHlwZV0uYXBwbHkodlt0eXBlICsgXCJTY29wZVwiXSB8fCB2LmNhbGxiYWNrU2NvcGUgfHwgdGhpcywgdlt0eXBlICsgXCJQYXJhbXNcIl0gfHwgX2JsYW5rQXJyYXkpO1xuXHRcdH07XG5cbi8vLS0tLUFuaW1hdGlvbiBnZXR0ZXJzL3NldHRlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRcdHAuZXZlbnRDYWxsYmFjayA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBwYXJhbXMsIHNjb3BlKSB7XG5cdFx0XHRpZiAoKHR5cGUgfHwgXCJcIikuc3Vic3RyKDAsMikgPT09IFwib25cIikge1xuXHRcdFx0XHR2YXIgdiA9IHRoaXMudmFycztcblx0XHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0XHRyZXR1cm4gdlt0eXBlXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2FsbGJhY2sgPT0gbnVsbCkge1xuXHRcdFx0XHRcdGRlbGV0ZSB2W3R5cGVdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZbdHlwZV0gPSBjYWxsYmFjaztcblx0XHRcdFx0XHR2W3R5cGUgKyBcIlBhcmFtc1wiXSA9IChfaXNBcnJheShwYXJhbXMpICYmIHBhcmFtcy5qb2luKFwiXCIpLmluZGV4T2YoXCJ7c2VsZn1cIikgIT09IC0xKSA/IHRoaXMuX3N3YXBTZWxmSW5QYXJhbXMocGFyYW1zKSA6IHBhcmFtcztcblx0XHRcdFx0XHR2W3R5cGUgKyBcIlNjb3BlXCJdID0gc2NvcGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR5cGUgPT09IFwib25VcGRhdGVcIikge1xuXHRcdFx0XHRcdHRoaXMuX29uVXBkYXRlID0gY2FsbGJhY2s7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLmRlbGF5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZGVsYXk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpIHtcblx0XHRcdFx0dGhpcy5zdGFydFRpbWUoIHRoaXMuX3N0YXJ0VGltZSArIHZhbHVlIC0gdGhpcy5fZGVsYXkgKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2RlbGF5ID0gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC5kdXJhdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0dGhpcy5fZGlydHkgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2R1cmF0aW9uO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZHVyYXRpb24gPSB0aGlzLl90b3RhbER1cmF0aW9uID0gdmFsdWU7XG5cdFx0XHR0aGlzLl91bmNhY2hlKHRydWUpOyAvL3RydWUgaW4gY2FzZSBpdCdzIGEgVHdlZW5NYXggb3IgVGltZWxpbmVNYXggdGhhdCBoYXMgYSByZXBlYXQgLSB3ZSdsbCBuZWVkIHRvIHJlZnJlc2ggdGhlIHRvdGFsRHVyYXRpb24uXG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpIGlmICh0aGlzLl90aW1lID4gMCkgaWYgKHRoaXMuX3RpbWUgPCB0aGlzLl9kdXJhdGlvbikgaWYgKHZhbHVlICE9PSAwKSB7XG5cdFx0XHRcdHRoaXMudG90YWxUaW1lKHRoaXMuX3RvdGFsVGltZSAqICh2YWx1ZSAvIHRoaXMuX2R1cmF0aW9uKSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC50b3RhbER1cmF0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHRoaXMuX2RpcnR5ID0gZmFsc2U7XG5cdFx0XHRyZXR1cm4gKCFhcmd1bWVudHMubGVuZ3RoKSA/IHRoaXMuX3RvdGFsRHVyYXRpb24gOiB0aGlzLmR1cmF0aW9uKHZhbHVlKTtcblx0XHR9O1xuXG5cdFx0cC50aW1lID0gZnVuY3Rpb24odmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3RpbWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fZGlydHkpIHtcblx0XHRcdFx0dGhpcy50b3RhbER1cmF0aW9uKCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy50b3RhbFRpbWUoKHZhbHVlID4gdGhpcy5fZHVyYXRpb24pID8gdGhpcy5fZHVyYXRpb24gOiB2YWx1ZSwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLnRvdGFsVGltZSA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzLCB1bmNhcHBlZCkge1xuXHRcdFx0aWYgKCFfdGlja2VyQWN0aXZlKSB7XG5cdFx0XHRcdF90aWNrZXIud2FrZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl90b3RhbFRpbWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUpIHtcblx0XHRcdFx0aWYgKHRpbWUgPCAwICYmICF1bmNhcHBlZCkge1xuXHRcdFx0XHRcdHRpbWUgKz0gdGhpcy50b3RhbER1cmF0aW9uKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2RpcnR5KSB7XG5cdFx0XHRcdFx0XHR0aGlzLnRvdGFsRHVyYXRpb24oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIHRvdGFsRHVyYXRpb24gPSB0aGlzLl90b3RhbER1cmF0aW9uLFxuXHRcdFx0XHRcdFx0dGwgPSB0aGlzLl90aW1lbGluZTtcblx0XHRcdFx0XHRpZiAodGltZSA+IHRvdGFsRHVyYXRpb24gJiYgIXVuY2FwcGVkKSB7XG5cdFx0XHRcdFx0XHR0aW1lID0gdG90YWxEdXJhdGlvbjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRUaW1lID0gKHRoaXMuX3BhdXNlZCA/IHRoaXMuX3BhdXNlVGltZSA6IHRsLl90aW1lKSAtICgoIXRoaXMuX3JldmVyc2VkID8gdGltZSA6IHRvdGFsRHVyYXRpb24gLSB0aW1lKSAvIHRoaXMuX3RpbWVTY2FsZSk7XG5cdFx0XHRcdFx0aWYgKCF0bC5fZGlydHkpIHsgLy9mb3IgcGVyZm9ybWFuY2UgaW1wcm92ZW1lbnQuIElmIHRoZSBwYXJlbnQncyBjYWNoZSBpcyBhbHJlYWR5IGRpcnR5LCBpdCBhbHJlYWR5IHRvb2sgY2FyZSBvZiBtYXJraW5nIHRoZSBhbmNlc3RvcnMgYXMgZGlydHkgdG9vLCBzbyBza2lwIHRoZSBmdW5jdGlvbiBjYWxsIGhlcmUuXG5cdFx0XHRcdFx0XHR0aGlzLl91bmNhY2hlKGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9pbiBjYXNlIGFueSBvZiB0aGUgYW5jZXN0b3IgdGltZWxpbmVzIGhhZCBjb21wbGV0ZWQgYnV0IHNob3VsZCBub3cgYmUgZW5hYmxlZCwgd2Ugc2hvdWxkIHJlc2V0IHRoZWlyIHRvdGFsVGltZSgpIHdoaWNoIHdpbGwgYWxzbyBlbnN1cmUgdGhhdCB0aGV5J3JlIGxpbmVkIHVwIHByb3Blcmx5IGFuZCBlbmFibGVkLiBTa2lwIGZvciBhbmltYXRpb25zIHRoYXQgYXJlIG9uIHRoZSByb290ICh3YXN0ZWZ1bCkuIEV4YW1wbGU6IGEgVGltZWxpbmVMaXRlLmV4cG9ydFJvb3QoKSBpcyBwZXJmb3JtZWQgd2hlbiB0aGVyZSdzIGEgcGF1c2VkIHR3ZWVuIG9uIHRoZSByb290LCB0aGUgZXhwb3J0IHdpbGwgbm90IGNvbXBsZXRlIHVudGlsIHRoYXQgdHdlZW4gaXMgdW5wYXVzZWQsIGJ1dCBpbWFnaW5lIGEgY2hpbGQgZ2V0cyByZXN0YXJ0ZWQgbGF0ZXIsIGFmdGVyIGFsbCBbdW5wYXVzZWRdIHR3ZWVucyBoYXZlIGNvbXBsZXRlZC4gVGhlIHN0YXJ0VGltZSBvZiB0aGF0IGNoaWxkIHdvdWxkIGdldCBwdXNoZWQgb3V0LCBidXQgb25lIG9mIHRoZSBhbmNlc3RvcnMgbWF5IGhhdmUgY29tcGxldGVkLlxuXHRcdFx0XHRcdGlmICh0bC5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHRcdHdoaWxlICh0bC5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHRsLl90aW1lbGluZS5fdGltZSAhPT0gKHRsLl9zdGFydFRpbWUgKyB0bC5fdG90YWxUaW1lKSAvIHRsLl90aW1lU2NhbGUpIHtcblx0XHRcdFx0XHRcdFx0XHR0bC50b3RhbFRpbWUodGwuX3RvdGFsVGltZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dGwgPSB0bC5fdGltZWxpbmU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl9nYykge1xuXHRcdFx0XHRcdHRoaXMuX2VuYWJsZWQodHJ1ZSwgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl90b3RhbFRpbWUgIT09IHRpbWUgfHwgdGhpcy5fZHVyYXRpb24gPT09IDApIHtcblx0XHRcdFx0XHRpZiAoX2xhenlUd2VlbnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRfbGF6eVJlbmRlcigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLnJlbmRlcih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZmFsc2UpO1xuXHRcdFx0XHRcdGlmIChfbGF6eVR3ZWVucy5sZW5ndGgpIHsgLy9pbiBjYXNlIHJlbmRlcmluZyBjYXVzZWQgYW55IHR3ZWVucyB0byBsYXp5LWluaXQsIHdlIHNob3VsZCByZW5kZXIgdGhlbSBiZWNhdXNlIHR5cGljYWxseSB3aGVuIHNvbWVvbmUgY2FsbHMgc2VlaygpIG9yIHRpbWUoKSBvciBwcm9ncmVzcygpLCB0aGV5IGV4cGVjdCBhbiBpbW1lZGlhdGUgcmVuZGVyLlxuXHRcdFx0XHRcdFx0X2xhenlSZW5kZXIoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLnByb2dyZXNzID0gcC50b3RhbFByb2dyZXNzID0gZnVuY3Rpb24odmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHR2YXIgZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uKCk7XG5cdFx0XHRyZXR1cm4gKCFhcmd1bWVudHMubGVuZ3RoKSA/IChkdXJhdGlvbiA/IHRoaXMuX3RpbWUgLyBkdXJhdGlvbiA6IHRoaXMucmF0aW8pIDogdGhpcy50b3RhbFRpbWUoZHVyYXRpb24gKiB2YWx1ZSwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLnN0YXJ0VGltZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3N0YXJ0VGltZTtcblx0XHRcdH1cblx0XHRcdGlmICh2YWx1ZSAhPT0gdGhpcy5fc3RhcnRUaW1lKSB7XG5cdFx0XHRcdHRoaXMuX3N0YXJ0VGltZSA9IHZhbHVlO1xuXHRcdFx0XHRpZiAodGhpcy50aW1lbGluZSkgaWYgKHRoaXMudGltZWxpbmUuX3NvcnRDaGlsZHJlbikge1xuXHRcdFx0XHRcdHRoaXMudGltZWxpbmUuYWRkKHRoaXMsIHZhbHVlIC0gdGhpcy5fZGVsYXkpOyAvL2Vuc3VyZXMgdGhhdCBhbnkgbmVjZXNzYXJ5IHJlLXNlcXVlbmNpbmcgb2YgQW5pbWF0aW9ucyBpbiB0aGUgdGltZWxpbmUgb2NjdXJzIHRvIG1ha2Ugc3VyZSB0aGUgcmVuZGVyaW5nIG9yZGVyIGlzIGNvcnJlY3QuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLmVuZFRpbWUgPSBmdW5jdGlvbihpbmNsdWRlUmVwZWF0cykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3N0YXJ0VGltZSArICgoaW5jbHVkZVJlcGVhdHMgIT0gZmFsc2UpID8gdGhpcy50b3RhbER1cmF0aW9uKCkgOiB0aGlzLmR1cmF0aW9uKCkpIC8gdGhpcy5fdGltZVNjYWxlO1xuXHRcdH07XG5cblx0XHRwLnRpbWVTY2FsZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3RpbWVTY2FsZTtcblx0XHRcdH1cblx0XHRcdHZhbHVlID0gdmFsdWUgfHwgX3RpbnlOdW07IC8vY2FuJ3QgYWxsb3cgemVybyBiZWNhdXNlIGl0J2xsIHRocm93IHRoZSBtYXRoIG9mZlxuXHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lICYmIHRoaXMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nKSB7XG5cdFx0XHRcdHZhciBwYXVzZVRpbWUgPSB0aGlzLl9wYXVzZVRpbWUsXG5cdFx0XHRcdFx0dCA9IChwYXVzZVRpbWUgfHwgcGF1c2VUaW1lID09PSAwKSA/IHBhdXNlVGltZSA6IHRoaXMuX3RpbWVsaW5lLnRvdGFsVGltZSgpO1xuXHRcdFx0XHR0aGlzLl9zdGFydFRpbWUgPSB0IC0gKCh0IC0gdGhpcy5fc3RhcnRUaW1lKSAqIHRoaXMuX3RpbWVTY2FsZSAvIHZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3RpbWVTY2FsZSA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuY2FjaGUoZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLnJldmVyc2VkID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fcmV2ZXJzZWQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAodmFsdWUgIT0gdGhpcy5fcmV2ZXJzZWQpIHtcblx0XHRcdFx0dGhpcy5fcmV2ZXJzZWQgPSB2YWx1ZTtcblx0XHRcdFx0dGhpcy50b3RhbFRpbWUoKCh0aGlzLl90aW1lbGluZSAmJiAhdGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpID8gdGhpcy50b3RhbER1cmF0aW9uKCkgLSB0aGlzLl90b3RhbFRpbWUgOiB0aGlzLl90b3RhbFRpbWUpLCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLnBhdXNlZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3BhdXNlZDtcblx0XHRcdH1cblx0XHRcdHZhciB0bCA9IHRoaXMuX3RpbWVsaW5lLFxuXHRcdFx0XHRyYXcsIGVsYXBzZWQ7XG5cdFx0XHRpZiAodmFsdWUgIT0gdGhpcy5fcGF1c2VkKSBpZiAodGwpIHtcblx0XHRcdFx0aWYgKCFfdGlja2VyQWN0aXZlICYmICF2YWx1ZSkge1xuXHRcdFx0XHRcdF90aWNrZXIud2FrZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJhdyA9IHRsLnJhd1RpbWUoKTtcblx0XHRcdFx0ZWxhcHNlZCA9IHJhdyAtIHRoaXMuX3BhdXNlVGltZTtcblx0XHRcdFx0aWYgKCF2YWx1ZSAmJiB0bC5zbW9vdGhDaGlsZFRpbWluZykge1xuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0VGltZSArPSBlbGFwc2VkO1xuXHRcdFx0XHRcdHRoaXMuX3VuY2FjaGUoZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3BhdXNlVGltZSA9IHZhbHVlID8gcmF3IDogbnVsbDtcblx0XHRcdFx0dGhpcy5fcGF1c2VkID0gdmFsdWU7XG5cdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IHRoaXMuaXNBY3RpdmUoKTtcblx0XHRcdFx0aWYgKCF2YWx1ZSAmJiBlbGFwc2VkICE9PSAwICYmIHRoaXMuX2luaXR0ZWQgJiYgdGhpcy5kdXJhdGlvbigpKSB7XG5cdFx0XHRcdFx0cmF3ID0gdGwuc21vb3RoQ2hpbGRUaW1pbmcgPyB0aGlzLl90b3RhbFRpbWUgOiAocmF3IC0gdGhpcy5fc3RhcnRUaW1lKSAvIHRoaXMuX3RpbWVTY2FsZTtcblx0XHRcdFx0XHR0aGlzLnJlbmRlcihyYXcsIChyYXcgPT09IHRoaXMuX3RvdGFsVGltZSksIHRydWUpOyAvL2luIGNhc2UgdGhlIHRhcmdldCdzIHByb3BlcnRpZXMgY2hhbmdlZCB2aWEgc29tZSBvdGhlciB0d2VlbiBvciBtYW51YWwgdXBkYXRlIGJ5IHRoZSB1c2VyLCB3ZSBzaG91bGQgZm9yY2UgYSByZW5kZXIuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9nYyAmJiAhdmFsdWUpIHtcblx0XHRcdFx0dGhpcy5fZW5hYmxlZCh0cnVlLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBTaW1wbGVUaW1lbGluZVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdFx0dmFyIFNpbXBsZVRpbWVsaW5lID0gX2NsYXNzKFwiY29yZS5TaW1wbGVUaW1lbGluZVwiLCBmdW5jdGlvbih2YXJzKSB7XG5cdFx0XHRBbmltYXRpb24uY2FsbCh0aGlzLCAwLCB2YXJzKTtcblx0XHRcdHRoaXMuYXV0b1JlbW92ZUNoaWxkcmVuID0gdGhpcy5zbW9vdGhDaGlsZFRpbWluZyA9IHRydWU7XG5cdFx0fSk7XG5cblx0XHRwID0gU2ltcGxlVGltZWxpbmUucHJvdG90eXBlID0gbmV3IEFuaW1hdGlvbigpO1xuXHRcdHAuY29uc3RydWN0b3IgPSBTaW1wbGVUaW1lbGluZTtcblx0XHRwLmtpbGwoKS5fZ2MgPSBmYWxzZTtcblx0XHRwLl9maXJzdCA9IHAuX2xhc3QgPSBwLl9yZWNlbnQgPSBudWxsO1xuXHRcdHAuX3NvcnRDaGlsZHJlbiA9IGZhbHNlO1xuXG5cdFx0cC5hZGQgPSBwLmluc2VydCA9IGZ1bmN0aW9uKGNoaWxkLCBwb3NpdGlvbiwgYWxpZ24sIHN0YWdnZXIpIHtcblx0XHRcdHZhciBwcmV2VHdlZW4sIHN0O1xuXHRcdFx0Y2hpbGQuX3N0YXJ0VGltZSA9IE51bWJlcihwb3NpdGlvbiB8fCAwKSArIGNoaWxkLl9kZWxheTtcblx0XHRcdGlmIChjaGlsZC5fcGF1c2VkKSBpZiAodGhpcyAhPT0gY2hpbGQuX3RpbWVsaW5lKSB7IC8vd2Ugb25seSBhZGp1c3QgdGhlIF9wYXVzZVRpbWUgaWYgaXQgd2Fzbid0IGluIHRoaXMgdGltZWxpbmUgYWxyZWFkeS4gUmVtZW1iZXIsIHNvbWV0aW1lcyBhIHR3ZWVuIHdpbGwgYmUgaW5zZXJ0ZWQgYWdhaW4gaW50byB0aGUgc2FtZSB0aW1lbGluZSB3aGVuIGl0cyBzdGFydFRpbWUgaXMgY2hhbmdlZCBzbyB0aGF0IHRoZSB0d2VlbnMgaW4gdGhlIFRpbWVsaW5lTGl0ZS9NYXggYXJlIHJlLW9yZGVyZWQgcHJvcGVybHkgaW4gdGhlIGxpbmtlZCBsaXN0IChzbyBldmVyeXRoaW5nIHJlbmRlcnMgaW4gdGhlIHByb3BlciBvcmRlcikuXG5cdFx0XHRcdGNoaWxkLl9wYXVzZVRpbWUgPSBjaGlsZC5fc3RhcnRUaW1lICsgKCh0aGlzLnJhd1RpbWUoKSAtIGNoaWxkLl9zdGFydFRpbWUpIC8gY2hpbGQuX3RpbWVTY2FsZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY2hpbGQudGltZWxpbmUpIHtcblx0XHRcdFx0Y2hpbGQudGltZWxpbmUuX3JlbW92ZShjaGlsZCwgdHJ1ZSk7IC8vcmVtb3ZlcyBmcm9tIGV4aXN0aW5nIHRpbWVsaW5lIHNvIHRoYXQgaXQgY2FuIGJlIHByb3Blcmx5IGFkZGVkIHRvIHRoaXMgb25lLlxuXHRcdFx0fVxuXHRcdFx0Y2hpbGQudGltZWxpbmUgPSBjaGlsZC5fdGltZWxpbmUgPSB0aGlzO1xuXHRcdFx0aWYgKGNoaWxkLl9nYykge1xuXHRcdFx0XHRjaGlsZC5fZW5hYmxlZCh0cnVlLCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdHByZXZUd2VlbiA9IHRoaXMuX2xhc3Q7XG5cdFx0XHRpZiAodGhpcy5fc29ydENoaWxkcmVuKSB7XG5cdFx0XHRcdHN0ID0gY2hpbGQuX3N0YXJ0VGltZTtcblx0XHRcdFx0d2hpbGUgKHByZXZUd2VlbiAmJiBwcmV2VHdlZW4uX3N0YXJ0VGltZSA+IHN0KSB7XG5cdFx0XHRcdFx0cHJldlR3ZWVuID0gcHJldlR3ZWVuLl9wcmV2O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAocHJldlR3ZWVuKSB7XG5cdFx0XHRcdGNoaWxkLl9uZXh0ID0gcHJldlR3ZWVuLl9uZXh0O1xuXHRcdFx0XHRwcmV2VHdlZW4uX25leHQgPSBjaGlsZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNoaWxkLl9uZXh0ID0gdGhpcy5fZmlyc3Q7XG5cdFx0XHRcdHRoaXMuX2ZpcnN0ID0gY2hpbGQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY2hpbGQuX25leHQpIHtcblx0XHRcdFx0Y2hpbGQuX25leHQuX3ByZXYgPSBjaGlsZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX2xhc3QgPSBjaGlsZDtcblx0XHRcdH1cblx0XHRcdGNoaWxkLl9wcmV2ID0gcHJldlR3ZWVuO1xuXHRcdFx0dGhpcy5fcmVjZW50ID0gY2hpbGQ7XG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUpIHtcblx0XHRcdFx0dGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLl9yZW1vdmUgPSBmdW5jdGlvbih0d2Vlbiwgc2tpcERpc2FibGUpIHtcblx0XHRcdGlmICh0d2Vlbi50aW1lbGluZSA9PT0gdGhpcykge1xuXHRcdFx0XHRpZiAoIXNraXBEaXNhYmxlKSB7XG5cdFx0XHRcdFx0dHdlZW4uX2VuYWJsZWQoZmFsc2UsIHRydWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHR3ZWVuLl9wcmV2KSB7XG5cdFx0XHRcdFx0dHdlZW4uX3ByZXYuX25leHQgPSB0d2Vlbi5fbmV4dDtcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl9maXJzdCA9PT0gdHdlZW4pIHtcblx0XHRcdFx0XHR0aGlzLl9maXJzdCA9IHR3ZWVuLl9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0d2Vlbi5fbmV4dCkge1xuXHRcdFx0XHRcdHR3ZWVuLl9uZXh0Ll9wcmV2ID0gdHdlZW4uX3ByZXY7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fbGFzdCA9PT0gdHdlZW4pIHtcblx0XHRcdFx0XHR0aGlzLl9sYXN0ID0gdHdlZW4uX3ByZXY7XG5cdFx0XHRcdH1cblx0XHRcdFx0dHdlZW4uX25leHQgPSB0d2Vlbi5fcHJldiA9IHR3ZWVuLnRpbWVsaW5lID0gbnVsbDtcblx0XHRcdFx0aWYgKHR3ZWVuID09PSB0aGlzLl9yZWNlbnQpIHtcblx0XHRcdFx0XHR0aGlzLl9yZWNlbnQgPSB0aGlzLl9sYXN0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lKSB7XG5cdFx0XHRcdFx0dGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAucmVuZGVyID0gZnVuY3Rpb24odGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKSB7XG5cdFx0XHR2YXIgdHdlZW4gPSB0aGlzLl9maXJzdCxcblx0XHRcdFx0bmV4dDtcblx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRoaXMuX3RpbWUgPSB0aGlzLl9yYXdQcmV2VGltZSA9IHRpbWU7XG5cdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0bmV4dCA9IHR3ZWVuLl9uZXh0OyAvL3JlY29yZCBpdCBoZXJlIGJlY2F1c2UgdGhlIHZhbHVlIGNvdWxkIGNoYW5nZSBhZnRlciByZW5kZXJpbmcuLi5cblx0XHRcdFx0aWYgKHR3ZWVuLl9hY3RpdmUgfHwgKHRpbWUgPj0gdHdlZW4uX3N0YXJ0VGltZSAmJiAhdHdlZW4uX3BhdXNlZCkpIHtcblx0XHRcdFx0XHRpZiAoIXR3ZWVuLl9yZXZlcnNlZCkge1xuXHRcdFx0XHRcdFx0dHdlZW4ucmVuZGVyKCh0aW1lIC0gdHdlZW4uX3N0YXJ0VGltZSkgKiB0d2Vlbi5fdGltZVNjYWxlLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0d2Vlbi5yZW5kZXIoKCghdHdlZW4uX2RpcnR5KSA/IHR3ZWVuLl90b3RhbER1cmF0aW9uIDogdHdlZW4udG90YWxEdXJhdGlvbigpKSAtICgodGltZSAtIHR3ZWVuLl9zdGFydFRpbWUpICogdHdlZW4uX3RpbWVTY2FsZSksIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHR3ZWVuID0gbmV4dDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cC5yYXdUaW1lID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIV90aWNrZXJBY3RpdmUpIHtcblx0XHRcdFx0X3RpY2tlci53YWtlKCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fdG90YWxUaW1lO1xuXHRcdH07XG5cbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBUd2VlbkxpdGVcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXHRcdHZhciBUd2VlbkxpdGUgPSBfY2xhc3MoXCJUd2VlbkxpdGVcIiwgZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycykge1xuXHRcdFx0XHRBbmltYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbiwgdmFycyk7XG5cdFx0XHRcdHRoaXMucmVuZGVyID0gVHdlZW5MaXRlLnByb3RvdHlwZS5yZW5kZXI7IC8vc3BlZWQgb3B0aW1pemF0aW9uIChhdm9pZCBwcm90b3R5cGUgbG9va3VwIG9uIHRoaXMgXCJob3RcIiBtZXRob2QpXG5cblx0XHRcdFx0aWYgKHRhcmdldCA9PSBudWxsKSB7XG5cdFx0XHRcdFx0dGhyb3cgXCJDYW5ub3QgdHdlZW4gYSBudWxsIHRhcmdldC5cIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0ID0gKHR5cGVvZih0YXJnZXQpICE9PSBcInN0cmluZ1wiKSA/IHRhcmdldCA6IFR3ZWVuTGl0ZS5zZWxlY3Rvcih0YXJnZXQpIHx8IHRhcmdldDtcblxuXHRcdFx0XHR2YXIgaXNTZWxlY3RvciA9ICh0YXJnZXQuanF1ZXJ5IHx8ICh0YXJnZXQubGVuZ3RoICYmIHRhcmdldCAhPT0gd2luZG93ICYmIHRhcmdldFswXSAmJiAodGFyZ2V0WzBdID09PSB3aW5kb3cgfHwgKHRhcmdldFswXS5ub2RlVHlwZSAmJiB0YXJnZXRbMF0uc3R5bGUgJiYgIXRhcmdldC5ub2RlVHlwZSkpKSksXG5cdFx0XHRcdFx0b3ZlcndyaXRlID0gdGhpcy52YXJzLm92ZXJ3cml0ZSxcblx0XHRcdFx0XHRpLCB0YXJnLCB0YXJnZXRzO1xuXG5cdFx0XHRcdHRoaXMuX292ZXJ3cml0ZSA9IG92ZXJ3cml0ZSA9IChvdmVyd3JpdGUgPT0gbnVsbCkgPyBfb3ZlcndyaXRlTG9va3VwW1R3ZWVuTGl0ZS5kZWZhdWx0T3ZlcndyaXRlXSA6ICh0eXBlb2Yob3ZlcndyaXRlKSA9PT0gXCJudW1iZXJcIikgPyBvdmVyd3JpdGUgPj4gMCA6IF9vdmVyd3JpdGVMb29rdXBbb3ZlcndyaXRlXTtcblxuXHRcdFx0XHRpZiAoKGlzU2VsZWN0b3IgfHwgdGFyZ2V0IGluc3RhbmNlb2YgQXJyYXkgfHwgKHRhcmdldC5wdXNoICYmIF9pc0FycmF5KHRhcmdldCkpKSAmJiB0eXBlb2YodGFyZ2V0WzBdKSAhPT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRcdHRoaXMuX3RhcmdldHMgPSB0YXJnZXRzID0gX3NsaWNlKHRhcmdldCk7ICAvL2Rvbid0IHVzZSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0YXJnZXQsIDApIGJlY2F1c2UgdGhhdCBkb2Vzbid0IHdvcmsgaW4gSUU4IHdpdGggYSBOb2RlTGlzdCB0aGF0J3MgcmV0dXJuZWQgYnkgcXVlcnlTZWxlY3RvckFsbCgpXG5cdFx0XHRcdFx0dGhpcy5fcHJvcExvb2t1cCA9IFtdO1xuXHRcdFx0XHRcdHRoaXMuX3NpYmxpbmdzID0gW107XG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHRhcmdldHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdHRhcmcgPSB0YXJnZXRzW2ldO1xuXHRcdFx0XHRcdFx0aWYgKCF0YXJnKSB7XG5cdFx0XHRcdFx0XHRcdHRhcmdldHMuc3BsaWNlKGktLSwgMSk7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YodGFyZykgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRcdFx0dGFyZyA9IHRhcmdldHNbaS0tXSA9IFR3ZWVuTGl0ZS5zZWxlY3Rvcih0YXJnKTsgLy9pbiBjYXNlIGl0J3MgYW4gYXJyYXkgb2Ygc3RyaW5nc1xuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mKHRhcmcpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGFyZ2V0cy5zcGxpY2UoaSsxLCAxKTsgLy90byBhdm9pZCBhbiBlbmRsZXNzIGxvb3AgKGNhbid0IGltYWdpbmUgd2h5IHRoZSBzZWxlY3RvciB3b3VsZCByZXR1cm4gYSBzdHJpbmcsIGJ1dCBqdXN0IGluIGNhc2UpXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHRhcmcubGVuZ3RoICYmIHRhcmcgIT09IHdpbmRvdyAmJiB0YXJnWzBdICYmICh0YXJnWzBdID09PSB3aW5kb3cgfHwgKHRhcmdbMF0ubm9kZVR5cGUgJiYgdGFyZ1swXS5zdHlsZSAmJiAhdGFyZy5ub2RlVHlwZSkpKSB7IC8vaW4gY2FzZSB0aGUgdXNlciBpcyBwYXNzaW5nIGluIGFuIGFycmF5IG9mIHNlbGVjdG9yIG9iamVjdHMgKGxpa2UgalF1ZXJ5IG9iamVjdHMpLCB3ZSBuZWVkIHRvIGNoZWNrIG9uZSBtb3JlIGxldmVsIGFuZCBwdWxsIHRoaW5ncyBvdXQgaWYgbmVjZXNzYXJ5LiBBbHNvIG5vdGUgdGhhdCA8c2VsZWN0PiBlbGVtZW50cyBwYXNzIGFsbCB0aGUgY3JpdGVyaWEgcmVnYXJkaW5nIGxlbmd0aCBhbmQgdGhlIGZpcnN0IGNoaWxkIGhhdmluZyBzdHlsZSwgc28gd2UgbXVzdCBhbHNvIGNoZWNrIHRvIGVuc3VyZSB0aGUgdGFyZ2V0IGlzbid0IGFuIEhUTUwgbm9kZSBpdHNlbGYuXG5cdFx0XHRcdFx0XHRcdHRhcmdldHMuc3BsaWNlKGktLSwgMSk7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3RhcmdldHMgPSB0YXJnZXRzID0gdGFyZ2V0cy5jb25jYXQoX3NsaWNlKHRhcmcpKTtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLl9zaWJsaW5nc1tpXSA9IF9yZWdpc3Rlcih0YXJnLCB0aGlzLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHRpZiAob3ZlcndyaXRlID09PSAxKSBpZiAodGhpcy5fc2libGluZ3NbaV0ubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0XHRfYXBwbHlPdmVyd3JpdGUodGFyZywgdGhpcywgbnVsbCwgMSwgdGhpcy5fc2libGluZ3NbaV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX3Byb3BMb29rdXAgPSB7fTtcblx0XHRcdFx0XHR0aGlzLl9zaWJsaW5ncyA9IF9yZWdpc3Rlcih0YXJnZXQsIHRoaXMsIGZhbHNlKTtcblx0XHRcdFx0XHRpZiAob3ZlcndyaXRlID09PSAxKSBpZiAodGhpcy5fc2libGluZ3MubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0X2FwcGx5T3ZlcndyaXRlKHRhcmdldCwgdGhpcywgbnVsbCwgMSwgdGhpcy5fc2libGluZ3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGhpcy52YXJzLmltbWVkaWF0ZVJlbmRlciB8fCAoZHVyYXRpb24gPT09IDAgJiYgdGhpcy5fZGVsYXkgPT09IDAgJiYgdGhpcy52YXJzLmltbWVkaWF0ZVJlbmRlciAhPT0gZmFsc2UpKSB7XG5cdFx0XHRcdFx0dGhpcy5fdGltZSA9IC1fdGlueU51bTsgLy9mb3JjZXMgYSByZW5kZXIgd2l0aG91dCBoYXZpbmcgdG8gc2V0IHRoZSByZW5kZXIoKSBcImZvcmNlXCIgcGFyYW1ldGVyIHRvIHRydWUgYmVjYXVzZSB3ZSB3YW50IHRvIGFsbG93IGxhenlpbmcgYnkgZGVmYXVsdCAodXNpbmcgdGhlIFwiZm9yY2VcIiBwYXJhbWV0ZXIgYWx3YXlzIGZvcmNlcyBhbiBpbW1lZGlhdGUgZnVsbCByZW5kZXIpXG5cdFx0XHRcdFx0dGhpcy5yZW5kZXIoLXRoaXMuX2RlbGF5KTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdHJ1ZSksXG5cdFx0XHRfaXNTZWxlY3RvciA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0cmV0dXJuICh2ICYmIHYubGVuZ3RoICYmIHYgIT09IHdpbmRvdyAmJiB2WzBdICYmICh2WzBdID09PSB3aW5kb3cgfHwgKHZbMF0ubm9kZVR5cGUgJiYgdlswXS5zdHlsZSAmJiAhdi5ub2RlVHlwZSkpKTsgLy93ZSBjYW5ub3QgY2hlY2sgXCJub2RlVHlwZVwiIGlmIHRoZSB0YXJnZXQgaXMgd2luZG93IGZyb20gd2l0aGluIGFuIGlmcmFtZSwgb3RoZXJ3aXNlIGl0IHdpbGwgdHJpZ2dlciBhIHNlY3VyaXR5IGVycm9yIGluIHNvbWUgYnJvd3NlcnMgbGlrZSBGaXJlZm94LlxuXHRcdFx0fSxcblx0XHRcdF9hdXRvQ1NTID0gZnVuY3Rpb24odmFycywgdGFyZ2V0KSB7XG5cdFx0XHRcdHZhciBjc3MgPSB7fSxcblx0XHRcdFx0XHRwO1xuXHRcdFx0XHRmb3IgKHAgaW4gdmFycykge1xuXHRcdFx0XHRcdGlmICghX3Jlc2VydmVkUHJvcHNbcF0gJiYgKCEocCBpbiB0YXJnZXQpIHx8IHAgPT09IFwidHJhbnNmb3JtXCIgfHwgcCA9PT0gXCJ4XCIgfHwgcCA9PT0gXCJ5XCIgfHwgcCA9PT0gXCJ3aWR0aFwiIHx8IHAgPT09IFwiaGVpZ2h0XCIgfHwgcCA9PT0gXCJjbGFzc05hbWVcIiB8fCBwID09PSBcImJvcmRlclwiKSAmJiAoIV9wbHVnaW5zW3BdIHx8IChfcGx1Z2luc1twXSAmJiBfcGx1Z2luc1twXS5fYXV0b0NTUykpKSB7IC8vbm90ZTogPGltZz4gZWxlbWVudHMgY29udGFpbiByZWFkLW9ubHkgXCJ4XCIgYW5kIFwieVwiIHByb3BlcnRpZXMuIFdlIHNob3VsZCBhbHNvIHByaW9yaXRpemUgZWRpdGluZyBjc3Mgd2lkdGgvaGVpZ2h0IHJhdGhlciB0aGFuIHRoZSBlbGVtZW50J3MgcHJvcGVydGllcy5cblx0XHRcdFx0XHRcdGNzc1twXSA9IHZhcnNbcF07XG5cdFx0XHRcdFx0XHRkZWxldGUgdmFyc1twXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFycy5jc3MgPSBjc3M7XG5cdFx0XHR9O1xuXG5cdFx0cCA9IFR3ZWVuTGl0ZS5wcm90b3R5cGUgPSBuZXcgQW5pbWF0aW9uKCk7XG5cdFx0cC5jb25zdHJ1Y3RvciA9IFR3ZWVuTGl0ZTtcblx0XHRwLmtpbGwoKS5fZ2MgPSBmYWxzZTtcblxuLy8tLS0tVHdlZW5MaXRlIGRlZmF1bHRzLCBvdmVyd3JpdGUgbWFuYWdlbWVudCwgYW5kIHJvb3QgdXBkYXRlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHRwLnJhdGlvID0gMDtcblx0XHRwLl9maXJzdFBUID0gcC5fdGFyZ2V0cyA9IHAuX292ZXJ3cml0dGVuUHJvcHMgPSBwLl9zdGFydEF0ID0gbnVsbDtcblx0XHRwLl9ub3RpZnlQbHVnaW5zT2ZFbmFibGVkID0gcC5fbGF6eSA9IGZhbHNlO1xuXG5cdFx0VHdlZW5MaXRlLnZlcnNpb24gPSBcIjEuMTguMlwiO1xuXHRcdFR3ZWVuTGl0ZS5kZWZhdWx0RWFzZSA9IHAuX2Vhc2UgPSBuZXcgRWFzZShudWxsLCBudWxsLCAxLCAxKTtcblx0XHRUd2VlbkxpdGUuZGVmYXVsdE92ZXJ3cml0ZSA9IFwiYXV0b1wiO1xuXHRcdFR3ZWVuTGl0ZS50aWNrZXIgPSBfdGlja2VyO1xuXHRcdFR3ZWVuTGl0ZS5hdXRvU2xlZXAgPSAxMjA7XG5cdFx0VHdlZW5MaXRlLmxhZ1Ntb290aGluZyA9IGZ1bmN0aW9uKHRocmVzaG9sZCwgYWRqdXN0ZWRMYWcpIHtcblx0XHRcdF90aWNrZXIubGFnU21vb3RoaW5nKHRocmVzaG9sZCwgYWRqdXN0ZWRMYWcpO1xuXHRcdH07XG5cblx0XHRUd2VlbkxpdGUuc2VsZWN0b3IgPSB3aW5kb3cuJCB8fCB3aW5kb3cualF1ZXJ5IHx8IGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciBzZWxlY3RvciA9IHdpbmRvdy4kIHx8IHdpbmRvdy5qUXVlcnk7XG5cdFx0XHRpZiAoc2VsZWN0b3IpIHtcblx0XHRcdFx0VHdlZW5MaXRlLnNlbGVjdG9yID0gc2VsZWN0b3I7XG5cdFx0XHRcdHJldHVybiBzZWxlY3RvcihlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAodHlwZW9mKGRvY3VtZW50KSA9PT0gXCJ1bmRlZmluZWRcIikgPyBlIDogKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGUpIDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoKGUuY2hhckF0KDApID09PSBcIiNcIikgPyBlLnN1YnN0cigxKSA6IGUpKTtcblx0XHR9O1xuXG5cdFx0dmFyIF9sYXp5VHdlZW5zID0gW10sXG5cdFx0XHRfbGF6eUxvb2t1cCA9IHt9LFxuXHRcdFx0X251bWJlcnNFeHAgPSAvKD86KC18LT18XFwrPSk/XFxkKlxcLj9cXGQqKD86ZVtcXC0rXT9cXGQrKT8pWzAtOV0vaWcsXG5cdFx0XHQvL19ub25OdW1iZXJzRXhwID0gLyg/OihbXFwtK10oPyEoXFxkfD0pKSl8W15cXGRcXC0rPWVdfChlKD8hW1xcLStdW1xcZF0pKSkrL2lnLFxuXHRcdFx0X3NldFJhdGlvID0gZnVuY3Rpb24odikge1xuXHRcdFx0XHR2YXIgcHQgPSB0aGlzLl9maXJzdFBULFxuXHRcdFx0XHRcdG1pbiA9IDAuMDAwMDAxLFxuXHRcdFx0XHRcdHZhbDtcblx0XHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdFx0dmFsID0gIXB0LmJsb2IgPyBwdC5jICogdiArIHB0LnMgOiB2ID8gdGhpcy5qb2luKFwiXCIpIDogdGhpcy5zdGFydDtcblx0XHRcdFx0XHRpZiAocHQucikge1xuXHRcdFx0XHRcdFx0dmFsID0gTWF0aC5yb3VuZCh2YWwpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodmFsIDwgbWluKSBpZiAodmFsID4gLW1pbikgeyAvL3ByZXZlbnRzIGlzc3VlcyB3aXRoIGNvbnZlcnRpbmcgdmVyeSBzbWFsbCBudW1iZXJzIHRvIHN0cmluZ3MgaW4gdGhlIGJyb3dzZXJcblx0XHRcdFx0XHRcdHZhbCA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghcHQuZikge1xuXHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHZhbDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHB0LmZwKSB7XG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdKHB0LmZwLCB2YWwpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdKHZhbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQvL2NvbXBhcmVzIHR3byBzdHJpbmdzIChzdGFydC9lbmQpLCBmaW5kcyB0aGUgbnVtYmVycyB0aGF0IGFyZSBkaWZmZXJlbnQgYW5kIHNwaXRzIGJhY2sgYW4gYXJyYXkgcmVwcmVzZW50aW5nIHRoZSB3aG9sZSB2YWx1ZSBidXQgd2l0aCB0aGUgY2hhbmdpbmcgdmFsdWVzIGlzb2xhdGVkIGFzIGVsZW1lbnRzLiBGb3IgZXhhbXBsZSwgXCJyZ2IoMCwwLDApXCIgYW5kIFwicmdiKDEwMCw1MCwwKVwiIHdvdWxkIGJlY29tZSBbXCJyZ2IoXCIsIDAsIFwiLFwiLCA1MCwgXCIsMClcIl0uIE5vdGljZSBpdCBtZXJnZXMgdGhlIHBhcnRzIHRoYXQgYXJlIGlkZW50aWNhbCAocGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uKS4gVGhlIGFycmF5IGFsc28gaGFzIGEgbGlua2VkIGxpc3Qgb2YgUHJvcFR3ZWVucyBhdHRhY2hlZCBzdGFydGluZyB3aXRoIF9maXJzdFBUIHRoYXQgY29udGFpbiB0aGUgdHdlZW5pbmcgZGF0YSAodCwgcCwgcywgYywgZiwgZXRjLikuIEl0IGFsc28gc3RvcmVzIHRoZSBzdGFydGluZyB2YWx1ZSBhcyBhIFwic3RhcnRcIiBwcm9wZXJ0eSBzbyB0aGF0IHdlIGNhbiByZXZlcnQgdG8gaXQgaWYvd2hlbiBuZWNlc3NhcnksIGxpa2Ugd2hlbiBhIHR3ZWVuIHJld2luZHMgZnVsbHkuIElmIHRoZSBxdWFudGl0eSBvZiBudW1iZXJzIGRpZmZlcnMgYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCwgaXQgd2lsbCBhbHdheXMgcHJpb3JpdGl6ZSB0aGUgZW5kIHZhbHVlKHMpLiBUaGUgcHQgcGFyYW1ldGVyIGlzIG9wdGlvbmFsIC0gaXQncyBmb3IgYSBQcm9wVHdlZW4gdGhhdCB3aWxsIGJlIGFwcGVuZGVkIHRvIHRoZSBlbmQgb2YgdGhlIGxpbmtlZCBsaXN0IGFuZCBpcyB0eXBpY2FsbHkgZm9yIGFjdHVhbGx5IHNldHRpbmcgdGhlIHZhbHVlIGFmdGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgaGF2ZSBiZWVuIHVwZGF0ZWQgKHdpdGggYXJyYXkuam9pbihcIlwiKSkuXG5cdFx0XHRfYmxvYkRpZiA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIGZpbHRlciwgcHQpIHtcblx0XHRcdFx0dmFyIGEgPSBbc3RhcnQsIGVuZF0sXG5cdFx0XHRcdFx0Y2hhckluZGV4ID0gMCxcblx0XHRcdFx0XHRzID0gXCJcIixcblx0XHRcdFx0XHRjb2xvciA9IDAsXG5cdFx0XHRcdFx0c3RhcnROdW1zLCBlbmROdW1zLCBudW0sIGksIGwsIG5vbk51bWJlcnMsIGN1cnJlbnROdW07XG5cdFx0XHRcdGEuc3RhcnQgPSBzdGFydDtcblx0XHRcdFx0aWYgKGZpbHRlcikge1xuXHRcdFx0XHRcdGZpbHRlcihhKTsgLy9wYXNzIGFuIGFycmF5IHdpdGggdGhlIHN0YXJ0aW5nIGFuZCBlbmRpbmcgdmFsdWVzIGFuZCBsZXQgdGhlIGZpbHRlciBkbyB3aGF0ZXZlciBpdCBuZWVkcyB0byB0aGUgdmFsdWVzLlxuXHRcdFx0XHRcdHN0YXJ0ID0gYVswXTtcblx0XHRcdFx0XHRlbmQgPSBhWzFdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGEubGVuZ3RoID0gMDtcblx0XHRcdFx0c3RhcnROdW1zID0gc3RhcnQubWF0Y2goX251bWJlcnNFeHApIHx8IFtdO1xuXHRcdFx0XHRlbmROdW1zID0gZW5kLm1hdGNoKF9udW1iZXJzRXhwKSB8fCBbXTtcblx0XHRcdFx0aWYgKHB0KSB7XG5cdFx0XHRcdFx0cHQuX25leHQgPSBudWxsO1xuXHRcdFx0XHRcdHB0LmJsb2IgPSAxO1xuXHRcdFx0XHRcdGEuX2ZpcnN0UFQgPSBwdDsgLy9hcHBseSBsYXN0IGluIHRoZSBsaW5rZWQgbGlzdCAod2hpY2ggbWVhbnMgaW5zZXJ0aW5nIGl0IGZpcnN0KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGwgPSBlbmROdW1zLmxlbmd0aDtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRcdGN1cnJlbnROdW0gPSBlbmROdW1zW2ldO1xuXHRcdFx0XHRcdG5vbk51bWJlcnMgPSBlbmQuc3Vic3RyKGNoYXJJbmRleCwgZW5kLmluZGV4T2YoY3VycmVudE51bSwgY2hhckluZGV4KS1jaGFySW5kZXgpO1xuXHRcdFx0XHRcdHMgKz0gKG5vbk51bWJlcnMgfHwgIWkpID8gbm9uTnVtYmVycyA6IFwiLFwiOyAvL25vdGU6IFNWRyBzcGVjIGFsbG93cyBvbWlzc2lvbiBvZiBjb21tYS9zcGFjZSB3aGVuIGEgbmVnYXRpdmUgc2lnbiBpcyB3ZWRnZWQgYmV0d2VlbiB0d28gbnVtYmVycywgbGlrZSAyLjUtNS4zIGluc3RlYWQgb2YgMi41LC01LjMgYnV0IHdoZW4gdHdlZW5pbmcsIHRoZSBuZWdhdGl2ZSB2YWx1ZSBtYXkgc3dpdGNoIHRvIHBvc2l0aXZlLCBzbyB3ZSBpbnNlcnQgdGhlIGNvbW1hIGp1c3QgaW4gY2FzZS5cblx0XHRcdFx0XHRjaGFySW5kZXggKz0gbm9uTnVtYmVycy5sZW5ndGg7XG5cdFx0XHRcdFx0aWYgKGNvbG9yKSB7IC8vc2Vuc2UgcmdiYSgpIHZhbHVlcyBhbmQgcm91bmQgdGhlbS5cblx0XHRcdFx0XHRcdGNvbG9yID0gKGNvbG9yICsgMSkgJSA1O1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAobm9uTnVtYmVycy5zdWJzdHIoLTUpID09PSBcInJnYmEoXCIpIHtcblx0XHRcdFx0XHRcdGNvbG9yID0gMTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGN1cnJlbnROdW0gPT09IHN0YXJ0TnVtc1tpXSB8fCBzdGFydE51bXMubGVuZ3RoIDw9IGkpIHtcblx0XHRcdFx0XHRcdHMgKz0gY3VycmVudE51bTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKHMpIHtcblx0XHRcdFx0XHRcdFx0YS5wdXNoKHMpO1xuXHRcdFx0XHRcdFx0XHRzID0gXCJcIjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG51bSA9IHBhcnNlRmxvYXQoc3RhcnROdW1zW2ldKTtcblx0XHRcdFx0XHRcdGEucHVzaChudW0pO1xuXHRcdFx0XHRcdFx0YS5fZmlyc3RQVCA9IHtfbmV4dDogYS5fZmlyc3RQVCwgdDphLCBwOiBhLmxlbmd0aC0xLCBzOm51bSwgYzooKGN1cnJlbnROdW0uY2hhckF0KDEpID09PSBcIj1cIikgPyBwYXJzZUludChjdXJyZW50TnVtLmNoYXJBdCgwKSArIFwiMVwiLCAxMCkgKiBwYXJzZUZsb2F0KGN1cnJlbnROdW0uc3Vic3RyKDIpKSA6IChwYXJzZUZsb2F0KGN1cnJlbnROdW0pIC0gbnVtKSkgfHwgMCwgZjowLCByOihjb2xvciAmJiBjb2xvciA8IDQpfTtcblx0XHRcdFx0XHRcdC8vbm90ZTogd2UgZG9uJ3Qgc2V0IF9wcmV2IGJlY2F1c2Ugd2UnbGwgbmV2ZXIgbmVlZCB0byByZW1vdmUgaW5kaXZpZHVhbCBQcm9wVHdlZW5zIGZyb20gdGhpcyBsaXN0LlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjaGFySW5kZXggKz0gY3VycmVudE51bS5sZW5ndGg7XG5cdFx0XHRcdH1cblx0XHRcdFx0cyArPSBlbmQuc3Vic3RyKGNoYXJJbmRleCk7XG5cdFx0XHRcdGlmIChzKSB7XG5cdFx0XHRcdFx0YS5wdXNoKHMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGEuc2V0UmF0aW8gPSBfc2V0UmF0aW87XG5cdFx0XHRcdHJldHVybiBhO1xuXHRcdFx0fSxcblx0XHRcdC8vbm90ZTogXCJmdW5jUGFyYW1cIiBpcyBvbmx5IG5lY2Vzc2FyeSBmb3IgZnVuY3Rpb24tYmFzZWQgZ2V0dGVycy9zZXR0ZXJzIHRoYXQgcmVxdWlyZSBhbiBleHRyYSBwYXJhbWV0ZXIgbGlrZSBnZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiKSBhbmQgc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgdmFsdWUpLiBJbiB0aGlzIGV4YW1wbGUsIGZ1bmNQYXJhbSB3b3VsZCBiZSBcIndpZHRoXCIuIFVzZWQgYnkgQXR0clBsdWdpbiBmb3IgZXhhbXBsZS5cblx0XHRcdF9hZGRQcm9wVHdlZW4gPSBmdW5jdGlvbih0YXJnZXQsIHByb3AsIHN0YXJ0LCBlbmQsIG92ZXJ3cml0ZVByb3AsIHJvdW5kLCBmdW5jUGFyYW0sIHN0cmluZ0ZpbHRlcikge1xuXHRcdFx0XHR2YXIgcyA9IChzdGFydCA9PT0gXCJnZXRcIikgPyB0YXJnZXRbcHJvcF0gOiBzdGFydCxcblx0XHRcdFx0XHR0eXBlID0gdHlwZW9mKHRhcmdldFtwcm9wXSksXG5cdFx0XHRcdFx0aXNSZWxhdGl2ZSA9ICh0eXBlb2YoZW5kKSA9PT0gXCJzdHJpbmdcIiAmJiBlbmQuY2hhckF0KDEpID09PSBcIj1cIiksXG5cdFx0XHRcdFx0cHQgPSB7dDp0YXJnZXQsIHA6cHJvcCwgczpzLCBmOih0eXBlID09PSBcImZ1bmN0aW9uXCIpLCBwZzowLCBuOm92ZXJ3cml0ZVByb3AgfHwgcHJvcCwgcjpyb3VuZCwgcHI6MCwgYzppc1JlbGF0aXZlID8gcGFyc2VJbnQoZW5kLmNoYXJBdCgwKSArIFwiMVwiLCAxMCkgKiBwYXJzZUZsb2F0KGVuZC5zdWJzdHIoMikpIDogKHBhcnNlRmxvYXQoZW5kKSAtIHMpIHx8IDB9LFxuXHRcdFx0XHRcdGJsb2IsIGdldHRlck5hbWU7XG5cdFx0XHRcdGlmICh0eXBlICE9PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09IFwiZnVuY3Rpb25cIiAmJiBzdGFydCA9PT0gXCJnZXRcIikge1xuXHRcdFx0XHRcdFx0Z2V0dGVyTmFtZSA9ICgocHJvcC5pbmRleE9mKFwic2V0XCIpIHx8IHR5cGVvZih0YXJnZXRbXCJnZXRcIiArIHByb3Auc3Vic3RyKDMpXSkgIT09IFwiZnVuY3Rpb25cIikgPyBwcm9wIDogXCJnZXRcIiArIHByb3Auc3Vic3RyKDMpKTtcblx0XHRcdFx0XHRcdHB0LnMgPSBzID0gZnVuY1BhcmFtID8gdGFyZ2V0W2dldHRlck5hbWVdKGZ1bmNQYXJhbSkgOiB0YXJnZXRbZ2V0dGVyTmFtZV0oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHR5cGVvZihzKSA9PT0gXCJzdHJpbmdcIiAmJiAoZnVuY1BhcmFtIHx8IGlzTmFOKHMpKSkge1xuXHRcdFx0XHRcdFx0Ly9hIGJsb2IgKHN0cmluZyB0aGF0IGhhcyBtdWx0aXBsZSBudW1iZXJzIGluIGl0KVxuXHRcdFx0XHRcdFx0cHQuZnAgPSBmdW5jUGFyYW07XG5cdFx0XHRcdFx0XHRibG9iID0gX2Jsb2JEaWYocywgZW5kLCBzdHJpbmdGaWx0ZXIgfHwgVHdlZW5MaXRlLmRlZmF1bHRTdHJpbmdGaWx0ZXIsIHB0KTtcblx0XHRcdFx0XHRcdHB0ID0ge3Q6YmxvYiwgcDpcInNldFJhdGlvXCIsIHM6MCwgYzoxLCBmOjIsIHBnOjAsIG46b3ZlcndyaXRlUHJvcCB8fCBwcm9wLCBwcjowfTsgLy9cIjJcIiBpbmRpY2F0ZXMgaXQncyBhIEJsb2IgcHJvcGVydHkgdHdlZW4uIE5lZWRlZCBmb3IgUm91bmRQcm9wc1BsdWdpbiBmb3IgZXhhbXBsZS5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKCFpc1JlbGF0aXZlKSB7XG5cdFx0XHRcdFx0XHRwdC5zID0gcGFyc2VGbG9hdChzKTtcblx0XHRcdFx0XHRcdHB0LmMgPSAocGFyc2VGbG9hdChlbmQpIC0gcHQucykgfHwgMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHB0LmMpIHsgLy9vbmx5IGFkZCBpdCB0byB0aGUgbGlua2VkIGxpc3QgaWYgdGhlcmUncyBhIGNoYW5nZS5cblx0XHRcdFx0XHRpZiAoKHB0Ll9uZXh0ID0gdGhpcy5fZmlyc3RQVCkpIHtcblx0XHRcdFx0XHRcdHB0Ll9uZXh0Ll9wcmV2ID0gcHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdDtcblx0XHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRfaW50ZXJuYWxzID0gVHdlZW5MaXRlLl9pbnRlcm5hbHMgPSB7aXNBcnJheTpfaXNBcnJheSwgaXNTZWxlY3RvcjpfaXNTZWxlY3RvciwgbGF6eVR3ZWVuczpfbGF6eVR3ZWVucywgYmxvYkRpZjpfYmxvYkRpZn0sIC8vZ2l2ZXMgdXMgYSB3YXkgdG8gZXhwb3NlIGNlcnRhaW4gcHJpdmF0ZSB2YWx1ZXMgdG8gb3RoZXIgR3JlZW5Tb2NrIGNsYXNzZXMgd2l0aG91dCBjb250YW1pbmF0aW5nIHRoYSBtYWluIFR3ZWVuTGl0ZSBvYmplY3QuXG5cdFx0XHRfcGx1Z2lucyA9IFR3ZWVuTGl0ZS5fcGx1Z2lucyA9IHt9LFxuXHRcdFx0X3R3ZWVuTG9va3VwID0gX2ludGVybmFscy50d2Vlbkxvb2t1cCA9IHt9LFxuXHRcdFx0X3R3ZWVuTG9va3VwTnVtID0gMCxcblx0XHRcdF9yZXNlcnZlZFByb3BzID0gX2ludGVybmFscy5yZXNlcnZlZFByb3BzID0ge2Vhc2U6MSwgZGVsYXk6MSwgb3ZlcndyaXRlOjEsIG9uQ29tcGxldGU6MSwgb25Db21wbGV0ZVBhcmFtczoxLCBvbkNvbXBsZXRlU2NvcGU6MSwgdXNlRnJhbWVzOjEsIHJ1bkJhY2t3YXJkczoxLCBzdGFydEF0OjEsIG9uVXBkYXRlOjEsIG9uVXBkYXRlUGFyYW1zOjEsIG9uVXBkYXRlU2NvcGU6MSwgb25TdGFydDoxLCBvblN0YXJ0UGFyYW1zOjEsIG9uU3RhcnRTY29wZToxLCBvblJldmVyc2VDb21wbGV0ZToxLCBvblJldmVyc2VDb21wbGV0ZVBhcmFtczoxLCBvblJldmVyc2VDb21wbGV0ZVNjb3BlOjEsIG9uUmVwZWF0OjEsIG9uUmVwZWF0UGFyYW1zOjEsIG9uUmVwZWF0U2NvcGU6MSwgZWFzZVBhcmFtczoxLCB5b3lvOjEsIGltbWVkaWF0ZVJlbmRlcjoxLCByZXBlYXQ6MSwgcmVwZWF0RGVsYXk6MSwgZGF0YToxLCBwYXVzZWQ6MSwgcmV2ZXJzZWQ6MSwgYXV0b0NTUzoxLCBsYXp5OjEsIG9uT3ZlcndyaXRlOjEsIGNhbGxiYWNrU2NvcGU6MSwgc3RyaW5nRmlsdGVyOjF9LFxuXHRcdFx0X292ZXJ3cml0ZUxvb2t1cCA9IHtub25lOjAsIGFsbDoxLCBhdXRvOjIsIGNvbmN1cnJlbnQ6MywgYWxsT25TdGFydDo0LCBwcmVleGlzdGluZzo1LCBcInRydWVcIjoxLCBcImZhbHNlXCI6MH0sXG5cdFx0XHRfcm9vdEZyYW1lc1RpbWVsaW5lID0gQW5pbWF0aW9uLl9yb290RnJhbWVzVGltZWxpbmUgPSBuZXcgU2ltcGxlVGltZWxpbmUoKSxcblx0XHRcdF9yb290VGltZWxpbmUgPSBBbmltYXRpb24uX3Jvb3RUaW1lbGluZSA9IG5ldyBTaW1wbGVUaW1lbGluZSgpLFxuXHRcdFx0X25leHRHQ0ZyYW1lID0gMzAsXG5cdFx0XHRfbGF6eVJlbmRlciA9IF9pbnRlcm5hbHMubGF6eVJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgaSA9IF9sYXp5VHdlZW5zLmxlbmd0aCxcblx0XHRcdFx0XHR0d2Vlbjtcblx0XHRcdFx0X2xhenlMb29rdXAgPSB7fTtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0dHdlZW4gPSBfbGF6eVR3ZWVuc1tpXTtcblx0XHRcdFx0XHRpZiAodHdlZW4gJiYgdHdlZW4uX2xhenkgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHR0d2Vlbi5yZW5kZXIodHdlZW4uX2xhenlbMF0sIHR3ZWVuLl9sYXp5WzFdLCB0cnVlKTtcblx0XHRcdFx0XHRcdHR3ZWVuLl9sYXp5ID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdF9sYXp5VHdlZW5zLmxlbmd0aCA9IDA7XG5cdFx0XHR9O1xuXG5cdFx0X3Jvb3RUaW1lbGluZS5fc3RhcnRUaW1lID0gX3RpY2tlci50aW1lO1xuXHRcdF9yb290RnJhbWVzVGltZWxpbmUuX3N0YXJ0VGltZSA9IF90aWNrZXIuZnJhbWU7XG5cdFx0X3Jvb3RUaW1lbGluZS5fYWN0aXZlID0gX3Jvb3RGcmFtZXNUaW1lbGluZS5fYWN0aXZlID0gdHJ1ZTtcblx0XHRzZXRUaW1lb3V0KF9sYXp5UmVuZGVyLCAxKTsgLy9vbiBzb21lIG1vYmlsZSBkZXZpY2VzLCB0aGVyZSBpc24ndCBhIFwidGlja1wiIGJlZm9yZSBjb2RlIHJ1bnMgd2hpY2ggbWVhbnMgYW55IGxhenkgcmVuZGVycyB3b3VsZG4ndCBydW4gYmVmb3JlIHRoZSBuZXh0IG9mZmljaWFsIFwidGlja1wiLlxuXG5cdFx0QW5pbWF0aW9uLl91cGRhdGVSb290ID0gVHdlZW5MaXRlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgaSwgYSwgcDtcblx0XHRcdFx0aWYgKF9sYXp5VHdlZW5zLmxlbmd0aCkgeyAvL2lmIGNvZGUgaXMgcnVuIG91dHNpZGUgb2YgdGhlIHJlcXVlc3RBbmltYXRpb25GcmFtZSBsb29wLCB0aGVyZSBtYXkgYmUgdHdlZW5zIHF1ZXVlZCBBRlRFUiB0aGUgZW5naW5lIHJlZnJlc2hlZCwgc28gd2UgbmVlZCB0byBlbnN1cmUgYW55IHBlbmRpbmcgcmVuZGVycyBvY2N1ciBiZWZvcmUgd2UgcmVmcmVzaCBhZ2Fpbi5cblx0XHRcdFx0XHRfbGF6eVJlbmRlcigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdF9yb290VGltZWxpbmUucmVuZGVyKChfdGlja2VyLnRpbWUgLSBfcm9vdFRpbWVsaW5lLl9zdGFydFRpbWUpICogX3Jvb3RUaW1lbGluZS5fdGltZVNjYWxlLCBmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRfcm9vdEZyYW1lc1RpbWVsaW5lLnJlbmRlcigoX3RpY2tlci5mcmFtZSAtIF9yb290RnJhbWVzVGltZWxpbmUuX3N0YXJ0VGltZSkgKiBfcm9vdEZyYW1lc1RpbWVsaW5lLl90aW1lU2NhbGUsIGZhbHNlLCBmYWxzZSk7XG5cdFx0XHRcdGlmIChfbGF6eVR3ZWVucy5sZW5ndGgpIHtcblx0XHRcdFx0XHRfbGF6eVJlbmRlcigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChfdGlja2VyLmZyYW1lID49IF9uZXh0R0NGcmFtZSkgeyAvL2R1bXAgZ2FyYmFnZSBldmVyeSAxMjAgZnJhbWVzIG9yIHdoYXRldmVyIHRoZSB1c2VyIHNldHMgVHdlZW5MaXRlLmF1dG9TbGVlcCB0b1xuXHRcdFx0XHRcdF9uZXh0R0NGcmFtZSA9IF90aWNrZXIuZnJhbWUgKyAocGFyc2VJbnQoVHdlZW5MaXRlLmF1dG9TbGVlcCwgMTApIHx8IDEyMCk7XG5cdFx0XHRcdFx0Zm9yIChwIGluIF90d2Vlbkxvb2t1cCkge1xuXHRcdFx0XHRcdFx0YSA9IF90d2Vlbkxvb2t1cFtwXS50d2VlbnM7XG5cdFx0XHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGFbaV0uX2djKSB7XG5cdFx0XHRcdFx0XHRcdFx0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChhLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRkZWxldGUgX3R3ZWVuTG9va3VwW3BdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL2lmIHRoZXJlIGFyZSBubyBtb3JlIHR3ZWVucyBpbiB0aGUgcm9vdCB0aW1lbGluZXMsIG9yIGlmIHRoZXkncmUgYWxsIHBhdXNlZCwgbWFrZSB0aGUgX3RpbWVyIHNsZWVwIHRvIHJlZHVjZSBsb2FkIG9uIHRoZSBDUFUgc2xpZ2h0bHlcblx0XHRcdFx0XHRwID0gX3Jvb3RUaW1lbGluZS5fZmlyc3Q7XG5cdFx0XHRcdFx0aWYgKCFwIHx8IHAuX3BhdXNlZCkgaWYgKFR3ZWVuTGl0ZS5hdXRvU2xlZXAgJiYgIV9yb290RnJhbWVzVGltZWxpbmUuX2ZpcnN0ICYmIF90aWNrZXIuX2xpc3RlbmVycy50aWNrLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdFx0d2hpbGUgKHAgJiYgcC5fcGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRcdHAgPSBwLl9uZXh0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCFwKSB7XG5cdFx0XHRcdFx0XHRcdF90aWNrZXIuc2xlZXAoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRfdGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJ0aWNrXCIsIEFuaW1hdGlvbi5fdXBkYXRlUm9vdCk7XG5cblx0XHR2YXIgX3JlZ2lzdGVyID0gZnVuY3Rpb24odGFyZ2V0LCB0d2Vlbiwgc2NydWIpIHtcblx0XHRcdFx0dmFyIGlkID0gdGFyZ2V0Ll9nc1R3ZWVuSUQsIGEsIGk7XG5cdFx0XHRcdGlmICghX3R3ZWVuTG9va3VwW2lkIHx8ICh0YXJnZXQuX2dzVHdlZW5JRCA9IGlkID0gXCJ0XCIgKyAoX3R3ZWVuTG9va3VwTnVtKyspKV0pIHtcblx0XHRcdFx0XHRfdHdlZW5Mb29rdXBbaWRdID0ge3RhcmdldDp0YXJnZXQsIHR3ZWVuczpbXX07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR3ZWVuKSB7XG5cdFx0XHRcdFx0YSA9IF90d2Vlbkxvb2t1cFtpZF0udHdlZW5zO1xuXHRcdFx0XHRcdGFbKGkgPSBhLmxlbmd0aCldID0gdHdlZW47XG5cdFx0XHRcdFx0aWYgKHNjcnViKSB7XG5cdFx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGFbaV0gPT09IHR3ZWVuKSB7XG5cdFx0XHRcdFx0XHRcdFx0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIF90d2Vlbkxvb2t1cFtpZF0udHdlZW5zO1xuXHRcdFx0fSxcblx0XHRcdF9vbk92ZXJ3cml0ZSA9IGZ1bmN0aW9uKG92ZXJ3cml0dGVuVHdlZW4sIG92ZXJ3cml0aW5nVHdlZW4sIHRhcmdldCwga2lsbGVkUHJvcHMpIHtcblx0XHRcdFx0dmFyIGZ1bmMgPSBvdmVyd3JpdHRlblR3ZWVuLnZhcnMub25PdmVyd3JpdGUsIHIxLCByMjtcblx0XHRcdFx0aWYgKGZ1bmMpIHtcblx0XHRcdFx0XHRyMSA9IGZ1bmMob3ZlcndyaXR0ZW5Ud2Vlbiwgb3ZlcndyaXRpbmdUd2VlbiwgdGFyZ2V0LCBraWxsZWRQcm9wcyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZnVuYyA9IFR3ZWVuTGl0ZS5vbk92ZXJ3cml0ZTtcblx0XHRcdFx0aWYgKGZ1bmMpIHtcblx0XHRcdFx0XHRyMiA9IGZ1bmMob3ZlcndyaXR0ZW5Ud2Vlbiwgb3ZlcndyaXRpbmdUd2VlbiwgdGFyZ2V0LCBraWxsZWRQcm9wcyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIChyMSAhPT0gZmFsc2UgJiYgcjIgIT09IGZhbHNlKTtcblx0XHRcdH0sXG5cdFx0XHRfYXBwbHlPdmVyd3JpdGUgPSBmdW5jdGlvbih0YXJnZXQsIHR3ZWVuLCBwcm9wcywgbW9kZSwgc2libGluZ3MpIHtcblx0XHRcdFx0dmFyIGksIGNoYW5nZWQsIGN1clR3ZWVuLCBsO1xuXHRcdFx0XHRpZiAobW9kZSA9PT0gMSB8fCBtb2RlID49IDQpIHtcblx0XHRcdFx0XHRsID0gc2libGluZ3MubGVuZ3RoO1xuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmICgoY3VyVHdlZW4gPSBzaWJsaW5nc1tpXSkgIT09IHR3ZWVuKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghY3VyVHdlZW4uX2djKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGN1clR3ZWVuLl9raWxsKG51bGwsIHRhcmdldCwgdHdlZW4pKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAobW9kZSA9PT0gNSkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGNoYW5nZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9OT1RFOiBBZGQgMC4wMDAwMDAwMDAxIHRvIG92ZXJjb21lIGZsb2F0aW5nIHBvaW50IGVycm9ycyB0aGF0IGNhbiBjYXVzZSB0aGUgc3RhcnRUaW1lIHRvIGJlIFZFUlkgc2xpZ2h0bHkgb2ZmICh3aGVuIGEgdHdlZW4ncyB0aW1lKCkgaXMgc2V0IGZvciBleGFtcGxlKVxuXHRcdFx0XHR2YXIgc3RhcnRUaW1lID0gdHdlZW4uX3N0YXJ0VGltZSArIF90aW55TnVtLFxuXHRcdFx0XHRcdG92ZXJsYXBzID0gW10sXG5cdFx0XHRcdFx0b0NvdW50ID0gMCxcblx0XHRcdFx0XHR6ZXJvRHVyID0gKHR3ZWVuLl9kdXJhdGlvbiA9PT0gMCksXG5cdFx0XHRcdFx0Z2xvYmFsU3RhcnQ7XG5cdFx0XHRcdGkgPSBzaWJsaW5ncy5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGlmICgoY3VyVHdlZW4gPSBzaWJsaW5nc1tpXSkgPT09IHR3ZWVuIHx8IGN1clR3ZWVuLl9nYyB8fCBjdXJUd2Vlbi5fcGF1c2VkKSB7XG5cdFx0XHRcdFx0XHQvL2lnbm9yZVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY3VyVHdlZW4uX3RpbWVsaW5lICE9PSB0d2Vlbi5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHRcdGdsb2JhbFN0YXJ0ID0gZ2xvYmFsU3RhcnQgfHwgX2NoZWNrT3ZlcmxhcCh0d2VlbiwgMCwgemVyb0R1cik7XG5cdFx0XHRcdFx0XHRpZiAoX2NoZWNrT3ZlcmxhcChjdXJUd2VlbiwgZ2xvYmFsU3RhcnQsIHplcm9EdXIpID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdG92ZXJsYXBzW29Db3VudCsrXSA9IGN1clR3ZWVuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY3VyVHdlZW4uX3N0YXJ0VGltZSA8PSBzdGFydFRpbWUpIGlmIChjdXJUd2Vlbi5fc3RhcnRUaW1lICsgY3VyVHdlZW4udG90YWxEdXJhdGlvbigpIC8gY3VyVHdlZW4uX3RpbWVTY2FsZSA+IHN0YXJ0VGltZSkgaWYgKCEoKHplcm9EdXIgfHwgIWN1clR3ZWVuLl9pbml0dGVkKSAmJiBzdGFydFRpbWUgLSBjdXJUd2Vlbi5fc3RhcnRUaW1lIDw9IDAuMDAwMDAwMDAwMikpIHtcblx0XHRcdFx0XHRcdG92ZXJsYXBzW29Db3VudCsrXSA9IGN1clR3ZWVuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGkgPSBvQ291bnQ7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGN1clR3ZWVuID0gb3ZlcmxhcHNbaV07XG5cdFx0XHRcdFx0aWYgKG1vZGUgPT09IDIpIGlmIChjdXJUd2Vlbi5fa2lsbChwcm9wcywgdGFyZ2V0LCB0d2VlbikpIHtcblx0XHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAobW9kZSAhPT0gMiB8fCAoIWN1clR3ZWVuLl9maXJzdFBUICYmIGN1clR3ZWVuLl9pbml0dGVkKSkge1xuXHRcdFx0XHRcdFx0aWYgKG1vZGUgIT09IDIgJiYgIV9vbk92ZXJ3cml0ZShjdXJUd2VlbiwgdHdlZW4pKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGN1clR3ZWVuLl9lbmFibGVkKGZhbHNlLCBmYWxzZSkpIHsgLy9pZiBhbGwgcHJvcGVydHkgdHdlZW5zIGhhdmUgYmVlbiBvdmVyd3JpdHRlbiwga2lsbCB0aGUgdHdlZW4uXG5cdFx0XHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gY2hhbmdlZDtcblx0XHRcdH0sXG5cdFx0XHRfY2hlY2tPdmVybGFwID0gZnVuY3Rpb24odHdlZW4sIHJlZmVyZW5jZSwgemVyb0R1cikge1xuXHRcdFx0XHR2YXIgdGwgPSB0d2Vlbi5fdGltZWxpbmUsXG5cdFx0XHRcdFx0dHMgPSB0bC5fdGltZVNjYWxlLFxuXHRcdFx0XHRcdHQgPSB0d2Vlbi5fc3RhcnRUaW1lO1xuXHRcdFx0XHR3aGlsZSAodGwuX3RpbWVsaW5lKSB7XG5cdFx0XHRcdFx0dCArPSB0bC5fc3RhcnRUaW1lO1xuXHRcdFx0XHRcdHRzICo9IHRsLl90aW1lU2NhbGU7XG5cdFx0XHRcdFx0aWYgKHRsLl9wYXVzZWQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAtMTAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0bCA9IHRsLl90aW1lbGluZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0IC89IHRzO1xuXHRcdFx0XHRyZXR1cm4gKHQgPiByZWZlcmVuY2UpID8gdCAtIHJlZmVyZW5jZSA6ICgoemVyb0R1ciAmJiB0ID09PSByZWZlcmVuY2UpIHx8ICghdHdlZW4uX2luaXR0ZWQgJiYgdCAtIHJlZmVyZW5jZSA8IDIgKiBfdGlueU51bSkpID8gX3RpbnlOdW0gOiAoKHQgKz0gdHdlZW4udG90YWxEdXJhdGlvbigpIC8gdHdlZW4uX3RpbWVTY2FsZSAvIHRzKSA+IHJlZmVyZW5jZSArIF90aW55TnVtKSA/IDAgOiB0IC0gcmVmZXJlbmNlIC0gX3RpbnlOdW07XG5cdFx0XHR9O1xuXG5cbi8vLS0tLSBUd2VlbkxpdGUgaW5zdGFuY2UgbWV0aG9kcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0cC5faW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHYgPSB0aGlzLnZhcnMsXG5cdFx0XHRcdG9wID0gdGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcyxcblx0XHRcdFx0ZHVyID0gdGhpcy5fZHVyYXRpb24sXG5cdFx0XHRcdGltbWVkaWF0ZSA9ICEhdi5pbW1lZGlhdGVSZW5kZXIsXG5cdFx0XHRcdGVhc2UgPSB2LmVhc2UsXG5cdFx0XHRcdGksIGluaXRQbHVnaW5zLCBwdCwgcCwgc3RhcnRWYXJzO1xuXHRcdFx0aWYgKHYuc3RhcnRBdCkge1xuXHRcdFx0XHRpZiAodGhpcy5fc3RhcnRBdCkge1xuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQucmVuZGVyKC0xLCB0cnVlKTsgLy9pZiB3ZSd2ZSBydW4gYSBzdGFydEF0IHByZXZpb3VzbHkgKHdoZW4gdGhlIHR3ZWVuIGluc3RhbnRpYXRlZCksIHdlIHNob3VsZCByZXZlcnQgaXQgc28gdGhhdCB0aGUgdmFsdWVzIHJlLWluc3RhbnRpYXRlIGNvcnJlY3RseSBwYXJ0aWN1bGFybHkgZm9yIHJlbGF0aXZlIHR3ZWVucy4gV2l0aG91dCB0aGlzLCBhIFR3ZWVuTGl0ZS5mcm9tVG8ob2JqLCAxLCB7eDpcIis9MTAwXCJ9LCB7eDpcIi09MTAwXCJ9KSwgZm9yIGV4YW1wbGUsIHdvdWxkIGFjdHVhbGx5IGp1bXAgdG8gKz0yMDAgYmVjYXVzZSB0aGUgc3RhcnRBdCB3b3VsZCBydW4gdHdpY2UsIGRvdWJsaW5nIHRoZSByZWxhdGl2ZSBjaGFuZ2UuXG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5raWxsKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0c3RhcnRWYXJzID0ge307XG5cdFx0XHRcdGZvciAocCBpbiB2LnN0YXJ0QXQpIHsgLy9jb3B5IHRoZSBwcm9wZXJ0aWVzL3ZhbHVlcyBpbnRvIGEgbmV3IG9iamVjdCB0byBhdm9pZCBjb2xsaXNpb25zLCBsaWtlIHZhciB0byA9IHt4OjB9LCBmcm9tID0ge3g6NTAwfTsgdGltZWxpbmUuZnJvbVRvKGUsIDEsIGZyb20sIHRvKS5mcm9tVG8oZSwgMSwgdG8sIGZyb20pO1xuXHRcdFx0XHRcdHN0YXJ0VmFyc1twXSA9IHYuc3RhcnRBdFtwXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzdGFydFZhcnMub3ZlcndyaXRlID0gZmFsc2U7XG5cdFx0XHRcdHN0YXJ0VmFycy5pbW1lZGlhdGVSZW5kZXIgPSB0cnVlO1xuXHRcdFx0XHRzdGFydFZhcnMubGF6eSA9IChpbW1lZGlhdGUgJiYgdi5sYXp5ICE9PSBmYWxzZSk7XG5cdFx0XHRcdHN0YXJ0VmFycy5zdGFydEF0ID0gc3RhcnRWYXJzLmRlbGF5ID0gbnVsbDsgLy9ubyBuZXN0aW5nIG9mIHN0YXJ0QXQgb2JqZWN0cyBhbGxvd2VkIChvdGhlcndpc2UgaXQgY291bGQgY2F1c2UgYW4gaW5maW5pdGUgbG9vcCkuXG5cdFx0XHRcdHRoaXMuX3N0YXJ0QXQgPSBUd2VlbkxpdGUudG8odGhpcy50YXJnZXQsIDAsIHN0YXJ0VmFycyk7XG5cdFx0XHRcdGlmIChpbW1lZGlhdGUpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5fdGltZSA+IDApIHtcblx0XHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQgPSBudWxsOyAvL3R3ZWVucyB0aGF0IHJlbmRlciBpbW1lZGlhdGVseSAobGlrZSBtb3N0IGZyb20oKSBhbmQgZnJvbVRvKCkgdHdlZW5zKSBzaG91bGRuJ3QgcmV2ZXJ0IHdoZW4gdGhlaXIgcGFyZW50IHRpbWVsaW5lJ3MgcGxheWhlYWQgZ29lcyBiYWNrd2FyZCBwYXN0IHRoZSBzdGFydFRpbWUgYmVjYXVzZSB0aGUgaW5pdGlhbCByZW5kZXIgY291bGQgaGF2ZSBoYXBwZW5lZCBhbnl0aW1lIGFuZCBpdCBzaG91bGRuJ3QgYmUgZGlyZWN0bHkgY29ycmVsYXRlZCB0byB0aGlzIHR3ZWVuJ3Mgc3RhcnRUaW1lLiBJbWFnaW5lIHNldHRpbmcgdXAgYSBjb21wbGV4IGFuaW1hdGlvbiB3aGVyZSB0aGUgYmVnaW5uaW5nIHN0YXRlcyBvZiB2YXJpb3VzIG9iamVjdHMgYXJlIHJlbmRlcmVkIGltbWVkaWF0ZWx5IGJ1dCB0aGUgdHdlZW4gZG9lc24ndCBoYXBwZW4gZm9yIHF1aXRlIHNvbWUgdGltZSAtIGlmIHdlIHJldmVydCB0byB0aGUgc3RhcnRpbmcgdmFsdWVzIGFzIHNvb24gYXMgdGhlIHBsYXloZWFkIGdvZXMgYmFja3dhcmQgcGFzdCB0aGUgdHdlZW4ncyBzdGFydFRpbWUsIGl0IHdpbGwgdGhyb3cgdGhpbmdzIG9mZiB2aXN1YWxseS4gUmV2ZXJzaW9uIHNob3VsZCBvbmx5IGhhcHBlbiBpbiBUaW1lbGluZUxpdGUvTWF4IGluc3RhbmNlcyB3aGVyZSBpbW1lZGlhdGVSZW5kZXIgd2FzIGZhbHNlICh3aGljaCBpcyB0aGUgZGVmYXVsdCBpbiB0aGUgY29udmVuaWVuY2UgbWV0aG9kcyBsaWtlIGZyb20oKSkuXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChkdXIgIT09IDApIHtcblx0XHRcdFx0XHRcdHJldHVybjsgLy93ZSBza2lwIGluaXRpYWxpemF0aW9uIGhlcmUgc28gdGhhdCBvdmVyd3JpdGluZyBkb2Vzbid0IG9jY3VyIHVudGlsIHRoZSB0d2VlbiBhY3R1YWxseSBiZWdpbnMuIE90aGVyd2lzZSwgaWYgeW91IGNyZWF0ZSBzZXZlcmFsIGltbWVkaWF0ZVJlbmRlcjp0cnVlIHR3ZWVucyBvZiB0aGUgc2FtZSB0YXJnZXQvcHJvcGVydGllcyB0byBkcm9wIGludG8gYSBUaW1lbGluZUxpdGUgb3IgVGltZWxpbmVNYXgsIHRoZSBsYXN0IG9uZSBjcmVhdGVkIHdvdWxkIG92ZXJ3cml0ZSB0aGUgZmlyc3Qgb25lcyBiZWNhdXNlIHRoZXkgZGlkbid0IGdldCBwbGFjZWQgaW50byB0aGUgdGltZWxpbmUgeWV0IGJlZm9yZSB0aGUgZmlyc3QgcmVuZGVyIG9jY3VycyBhbmQga2lja3MgaW4gb3ZlcndyaXRpbmcuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHYucnVuQmFja3dhcmRzICYmIGR1ciAhPT0gMCkge1xuXHRcdFx0XHQvL2Zyb20oKSB0d2VlbnMgbXVzdCBiZSBoYW5kbGVkIHVuaXF1ZWx5OiB0aGVpciBiZWdpbm5pbmcgdmFsdWVzIG11c3QgYmUgcmVuZGVyZWQgYnV0IHdlIGRvbid0IHdhbnQgb3ZlcndyaXRpbmcgdG8gb2NjdXIgeWV0ICh3aGVuIHRpbWUgaXMgc3RpbGwgMCkuIFdhaXQgdW50aWwgdGhlIHR3ZWVuIGFjdHVhbGx5IGJlZ2lucyBiZWZvcmUgZG9pbmcgYWxsIHRoZSByb3V0aW5lcyBsaWtlIG92ZXJ3cml0aW5nLiBBdCB0aGF0IHRpbWUsIHdlIHNob3VsZCByZW5kZXIgYXQgdGhlIEVORCBvZiB0aGUgdHdlZW4gdG8gZW5zdXJlIHRoYXQgdGhpbmdzIGluaXRpYWxpemUgY29ycmVjdGx5IChyZW1lbWJlciwgZnJvbSgpIHR3ZWVucyBnbyBiYWNrd2FyZHMpXG5cdFx0XHRcdGlmICh0aGlzLl9zdGFydEF0KSB7XG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5yZW5kZXIoLTEsIHRydWUpO1xuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQua2lsbCgpO1xuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQgPSBudWxsO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lICE9PSAwKSB7IC8vaW4gcmFyZSBjYXNlcyAobGlrZSBpZiBhIGZyb20oKSB0d2VlbiBydW5zIGFuZCB0aGVuIGlzIGludmFsaWRhdGUoKS1lZCksIGltbWVkaWF0ZVJlbmRlciBjb3VsZCBiZSB0cnVlIGJ1dCB0aGUgaW5pdGlhbCBmb3JjZWQtcmVuZGVyIGdldHMgc2tpcHBlZCwgc28gdGhlcmUncyBubyBuZWVkIHRvIGZvcmNlIHRoZSByZW5kZXIgaW4gdGhpcyBjb250ZXh0IHdoZW4gdGhlIF90aW1lIGlzIGdyZWF0ZXIgdGhhbiAwXG5cdFx0XHRcdFx0XHRpbW1lZGlhdGUgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHQgPSB7fTtcblx0XHRcdFx0XHRmb3IgKHAgaW4gdikgeyAvL2NvcHkgcHJvcHMgaW50byBhIG5ldyBvYmplY3QgYW5kIHNraXAgYW55IHJlc2VydmVkIHByb3BzLCBvdGhlcndpc2Ugb25Db21wbGV0ZSBvciBvblVwZGF0ZSBvciBvblN0YXJ0IGNvdWxkIGZpcmUuIFdlIHNob3VsZCwgaG93ZXZlciwgcGVybWl0IGF1dG9DU1MgdG8gZ28gdGhyb3VnaC5cblx0XHRcdFx0XHRcdGlmICghX3Jlc2VydmVkUHJvcHNbcF0gfHwgcCA9PT0gXCJhdXRvQ1NTXCIpIHtcblx0XHRcdFx0XHRcdFx0cHRbcF0gPSB2W3BdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdC5vdmVyd3JpdGUgPSAwO1xuXHRcdFx0XHRcdHB0LmRhdGEgPSBcImlzRnJvbVN0YXJ0XCI7IC8vd2UgdGFnIHRoZSB0d2VlbiB3aXRoIGFzIFwiaXNGcm9tU3RhcnRcIiBzbyB0aGF0IGlmIFtpbnNpZGUgYSBwbHVnaW5dIHdlIG5lZWQgdG8gb25seSBkbyBzb21ldGhpbmcgYXQgdGhlIHZlcnkgRU5EIG9mIGEgdHdlZW4sIHdlIGhhdmUgYSB3YXkgb2YgaWRlbnRpZnlpbmcgdGhpcyB0d2VlbiBhcyBtZXJlbHkgdGhlIG9uZSB0aGF0J3Mgc2V0dGluZyB0aGUgYmVnaW5uaW5nIHZhbHVlcyBmb3IgYSBcImZyb20oKVwiIHR3ZWVuLiBGb3IgZXhhbXBsZSwgY2xlYXJQcm9wcyBpbiBDU1NQbHVnaW4gc2hvdWxkIG9ubHkgZ2V0IGFwcGxpZWQgYXQgdGhlIHZlcnkgRU5EIG9mIGEgdHdlZW4gYW5kIHdpdGhvdXQgdGhpcyB0YWcsIGZyb20oLi4ue2hlaWdodDoxMDAsIGNsZWFyUHJvcHM6XCJoZWlnaHRcIiwgZGVsYXk6MX0pIHdvdWxkIHdpcGUgdGhlIGhlaWdodCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0d2VlbiBhbmQgYWZ0ZXIgMSBzZWNvbmQsIGl0J2Qga2ljayBiYWNrIGluLlxuXHRcdFx0XHRcdHB0LmxhenkgPSAoaW1tZWRpYXRlICYmIHYubGF6eSAhPT0gZmFsc2UpO1xuXHRcdFx0XHRcdHB0LmltbWVkaWF0ZVJlbmRlciA9IGltbWVkaWF0ZTsgLy96ZXJvLWR1cmF0aW9uIHR3ZWVucyByZW5kZXIgaW1tZWRpYXRlbHkgYnkgZGVmYXVsdCwgYnV0IGlmIHdlJ3JlIG5vdCBzcGVjaWZpY2FsbHkgaW5zdHJ1Y3RlZCB0byByZW5kZXIgdGhpcyB0d2VlbiBpbW1lZGlhdGVseSwgd2Ugc2hvdWxkIHNraXAgdGhpcyBhbmQgbWVyZWx5IF9pbml0KCkgdG8gcmVjb3JkIHRoZSBzdGFydGluZyB2YWx1ZXMgKHJlbmRlcmluZyB0aGVtIGltbWVkaWF0ZWx5IHdvdWxkIHB1c2ggdGhlbSB0byBjb21wbGV0aW9uIHdoaWNoIGlzIHdhc3RlZnVsIGluIHRoYXQgY2FzZSAtIHdlJ2QgaGF2ZSB0byByZW5kZXIoLTEpIGltbWVkaWF0ZWx5IGFmdGVyKVxuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQgPSBUd2VlbkxpdGUudG8odGhpcy50YXJnZXQsIDAsIHB0KTtcblx0XHRcdFx0XHRpZiAoIWltbWVkaWF0ZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5faW5pdCgpOyAvL2Vuc3VyZXMgdGhhdCB0aGUgaW5pdGlhbCB2YWx1ZXMgYXJlIHJlY29yZGVkXG5cdFx0XHRcdFx0XHR0aGlzLl9zdGFydEF0Ll9lbmFibGVkKGZhbHNlKTsgLy9ubyBuZWVkIHRvIGhhdmUgdGhlIHR3ZWVuIHJlbmRlciBvbiB0aGUgbmV4dCBjeWNsZS4gRGlzYWJsZSBpdCBiZWNhdXNlIHdlJ2xsIGFsd2F5cyBtYW51YWxseSBjb250cm9sIHRoZSByZW5kZXJzIG9mIHRoZSBfc3RhcnRBdCB0d2Vlbi5cblx0XHRcdFx0XHRcdGlmICh0aGlzLnZhcnMuaW1tZWRpYXRlUmVuZGVyKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQgPSBudWxsO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fdGltZSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZWFzZSA9IGVhc2UgPSAoIWVhc2UpID8gVHdlZW5MaXRlLmRlZmF1bHRFYXNlIDogKGVhc2UgaW5zdGFuY2VvZiBFYXNlKSA/IGVhc2UgOiAodHlwZW9mKGVhc2UpID09PSBcImZ1bmN0aW9uXCIpID8gbmV3IEVhc2UoZWFzZSwgdi5lYXNlUGFyYW1zKSA6IF9lYXNlTWFwW2Vhc2VdIHx8IFR3ZWVuTGl0ZS5kZWZhdWx0RWFzZTtcblx0XHRcdGlmICh2LmVhc2VQYXJhbXMgaW5zdGFuY2VvZiBBcnJheSAmJiBlYXNlLmNvbmZpZykge1xuXHRcdFx0XHR0aGlzLl9lYXNlID0gZWFzZS5jb25maWcuYXBwbHkoZWFzZSwgdi5lYXNlUGFyYW1zKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2Vhc2VUeXBlID0gdGhpcy5fZWFzZS5fdHlwZTtcblx0XHRcdHRoaXMuX2Vhc2VQb3dlciA9IHRoaXMuX2Vhc2UuX3Bvd2VyO1xuXHRcdFx0dGhpcy5fZmlyc3RQVCA9IG51bGw7XG5cblx0XHRcdGlmICh0aGlzLl90YXJnZXRzKSB7XG5cdFx0XHRcdGkgPSB0aGlzLl90YXJnZXRzLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0aWYgKCB0aGlzLl9pbml0UHJvcHMoIHRoaXMuX3RhcmdldHNbaV0sICh0aGlzLl9wcm9wTG9va3VwW2ldID0ge30pLCB0aGlzLl9zaWJsaW5nc1tpXSwgKG9wID8gb3BbaV0gOiBudWxsKSkgKSB7XG5cdFx0XHRcdFx0XHRpbml0UGx1Z2lucyA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpbml0UGx1Z2lucyA9IHRoaXMuX2luaXRQcm9wcyh0aGlzLnRhcmdldCwgdGhpcy5fcHJvcExvb2t1cCwgdGhpcy5fc2libGluZ3MsIG9wKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGluaXRQbHVnaW5zKSB7XG5cdFx0XHRcdFR3ZWVuTGl0ZS5fb25QbHVnaW5FdmVudChcIl9vbkluaXRBbGxQcm9wc1wiLCB0aGlzKTsgLy9yZW9yZGVycyB0aGUgYXJyYXkgaW4gb3JkZXIgb2YgcHJpb3JpdHkuIFVzZXMgYSBzdGF0aWMgVHdlZW5QbHVnaW4gbWV0aG9kIGluIG9yZGVyIHRvIG1pbmltaXplIGZpbGUgc2l6ZSBpbiBUd2VlbkxpdGVcblx0XHRcdH1cblx0XHRcdGlmIChvcCkgaWYgKCF0aGlzLl9maXJzdFBUKSBpZiAodHlwZW9mKHRoaXMudGFyZ2V0KSAhPT0gXCJmdW5jdGlvblwiKSB7IC8vaWYgYWxsIHR3ZWVuaW5nIHByb3BlcnRpZXMgaGF2ZSBiZWVuIG92ZXJ3cml0dGVuLCBraWxsIHRoZSB0d2Vlbi4gSWYgdGhlIHRhcmdldCBpcyBhIGZ1bmN0aW9uLCBpdCdzIHByb2JhYmx5IGEgZGVsYXllZENhbGwgc28gbGV0IGl0IGxpdmUuXG5cdFx0XHRcdHRoaXMuX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdH1cblx0XHRcdGlmICh2LnJ1bkJhY2t3YXJkcykge1xuXHRcdFx0XHRwdCA9IHRoaXMuX2ZpcnN0UFQ7XG5cdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdHB0LnMgKz0gcHQuYztcblx0XHRcdFx0XHRwdC5jID0gLXB0LmM7XG5cdFx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fb25VcGRhdGUgPSB2Lm9uVXBkYXRlO1xuXHRcdFx0dGhpcy5faW5pdHRlZCA9IHRydWU7XG5cdFx0fTtcblxuXHRcdHAuX2luaXRQcm9wcyA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvcExvb2t1cCwgc2libGluZ3MsIG92ZXJ3cml0dGVuUHJvcHMpIHtcblx0XHRcdHZhciBwLCBpLCBpbml0UGx1Z2lucywgcGx1Z2luLCBwdCwgdjtcblx0XHRcdGlmICh0YXJnZXQgPT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChfbGF6eUxvb2t1cFt0YXJnZXQuX2dzVHdlZW5JRF0pIHtcblx0XHRcdFx0X2xhenlSZW5kZXIoKTsgLy9pZiBvdGhlciB0d2VlbnMgb2YgdGhlIHNhbWUgdGFyZ2V0IGhhdmUgcmVjZW50bHkgaW5pdHRlZCBidXQgaGF2ZW4ndCByZW5kZXJlZCB5ZXQsIHdlJ3ZlIGdvdCB0byBmb3JjZSB0aGUgcmVuZGVyIHNvIHRoYXQgdGhlIHN0YXJ0aW5nIHZhbHVlcyBhcmUgY29ycmVjdCAoaW1hZ2luZSBwb3B1bGF0aW5nIGEgdGltZWxpbmUgd2l0aCBhIGJ1bmNoIG9mIHNlcXVlbnRpYWwgdHdlZW5zIGFuZCB0aGVuIGp1bXBpbmcgdG8gdGhlIGVuZClcblx0XHRcdH1cblxuXHRcdFx0aWYgKCF0aGlzLnZhcnMuY3NzKSBpZiAodGFyZ2V0LnN0eWxlKSBpZiAodGFyZ2V0ICE9PSB3aW5kb3cgJiYgdGFyZ2V0Lm5vZGVUeXBlKSBpZiAoX3BsdWdpbnMuY3NzKSBpZiAodGhpcy52YXJzLmF1dG9DU1MgIT09IGZhbHNlKSB7IC8vaXQncyBzbyBjb21tb24gdG8gdXNlIFR3ZWVuTGl0ZS9NYXggdG8gYW5pbWF0ZSB0aGUgY3NzIG9mIERPTSBlbGVtZW50cywgd2UgYXNzdW1lIHRoYXQgaWYgdGhlIHRhcmdldCBpcyBhIERPTSBlbGVtZW50LCB0aGF0J3Mgd2hhdCBpcyBpbnRlbmRlZCAoYSBjb252ZW5pZW5jZSBzbyB0aGF0IHVzZXJzIGRvbid0IGhhdmUgdG8gd3JhcCB0aGluZ3MgaW4gY3NzOnt9LCBhbHRob3VnaCB3ZSBzdGlsbCByZWNvbW1lbmQgaXQgZm9yIGEgc2xpZ2h0IHBlcmZvcm1hbmNlIGJvb3N0IGFuZCBiZXR0ZXIgc3BlY2lmaWNpdHkpLiBOb3RlOiB3ZSBjYW5ub3QgY2hlY2sgXCJub2RlVHlwZVwiIG9uIHRoZSB3aW5kb3cgaW5zaWRlIGFuIGlmcmFtZS5cblx0XHRcdFx0X2F1dG9DU1ModGhpcy52YXJzLCB0YXJnZXQpO1xuXHRcdFx0fVxuXHRcdFx0Zm9yIChwIGluIHRoaXMudmFycykge1xuXHRcdFx0XHR2ID0gdGhpcy52YXJzW3BdO1xuXHRcdFx0XHRpZiAoX3Jlc2VydmVkUHJvcHNbcF0pIHtcblx0XHRcdFx0XHRpZiAodikgaWYgKCh2IGluc3RhbmNlb2YgQXJyYXkpIHx8ICh2LnB1c2ggJiYgX2lzQXJyYXkodikpKSBpZiAodi5qb2luKFwiXCIpLmluZGV4T2YoXCJ7c2VsZn1cIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnZhcnNbcF0gPSB2ID0gdGhpcy5fc3dhcFNlbGZJblBhcmFtcyh2LCB0aGlzKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIGlmIChfcGx1Z2luc1twXSAmJiAocGx1Z2luID0gbmV3IF9wbHVnaW5zW3BdKCkpLl9vbkluaXRUd2Vlbih0YXJnZXQsIHRoaXMudmFyc1twXSwgdGhpcykpIHtcblxuXHRcdFx0XHRcdC8vdCAtIHRhcmdldCBcdFx0W29iamVjdF1cblx0XHRcdFx0XHQvL3AgLSBwcm9wZXJ0eSBcdFx0W3N0cmluZ11cblx0XHRcdFx0XHQvL3MgLSBzdGFydFx0XHRcdFtudW1iZXJdXG5cdFx0XHRcdFx0Ly9jIC0gY2hhbmdlXHRcdFtudW1iZXJdXG5cdFx0XHRcdFx0Ly9mIC0gaXNGdW5jdGlvblx0W2Jvb2xlYW5dXG5cdFx0XHRcdFx0Ly9uIC0gbmFtZVx0XHRcdFtzdHJpbmddXG5cdFx0XHRcdFx0Ly9wZyAtIGlzUGx1Z2luIFx0W2Jvb2xlYW5dXG5cdFx0XHRcdFx0Ly9wciAtIHByaW9yaXR5XHRcdFtudW1iZXJdXG5cdFx0XHRcdFx0dGhpcy5fZmlyc3RQVCA9IHB0ID0ge19uZXh0OnRoaXMuX2ZpcnN0UFQsIHQ6cGx1Z2luLCBwOlwic2V0UmF0aW9cIiwgczowLCBjOjEsIGY6MSwgbjpwLCBwZzoxLCBwcjpwbHVnaW4uX3ByaW9yaXR5fTtcblx0XHRcdFx0XHRpID0gcGx1Z2luLl9vdmVyd3JpdGVQcm9wcy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRwcm9wTG9va3VwW3BsdWdpbi5fb3ZlcndyaXRlUHJvcHNbaV1dID0gdGhpcy5fZmlyc3RQVDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHBsdWdpbi5fcHJpb3JpdHkgfHwgcGx1Z2luLl9vbkluaXRBbGxQcm9wcykge1xuXHRcdFx0XHRcdFx0aW5pdFBsdWdpbnMgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocGx1Z2luLl9vbkRpc2FibGUgfHwgcGx1Z2luLl9vbkVuYWJsZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwdC5fbmV4dCkge1xuXHRcdFx0XHRcdFx0cHQuX25leHQuX3ByZXYgPSBwdDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwcm9wTG9va3VwW3BdID0gX2FkZFByb3BUd2Vlbi5jYWxsKHRoaXMsIHRhcmdldCwgcCwgXCJnZXRcIiwgdiwgcCwgMCwgbnVsbCwgdGhpcy52YXJzLnN0cmluZ0ZpbHRlcik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG92ZXJ3cml0dGVuUHJvcHMpIGlmICh0aGlzLl9raWxsKG92ZXJ3cml0dGVuUHJvcHMsIHRhcmdldCkpIHsgLy9hbm90aGVyIHR3ZWVuIG1heSBoYXZlIHRyaWVkIHRvIG92ZXJ3cml0ZSBwcm9wZXJ0aWVzIG9mIHRoaXMgdHdlZW4gYmVmb3JlIGluaXQoKSB3YXMgY2FsbGVkIChsaWtlIGlmIHR3byB0d2VlbnMgc3RhcnQgYXQgdGhlIHNhbWUgdGltZSwgdGhlIG9uZSBjcmVhdGVkIHNlY29uZCB3aWxsIHJ1biBmaXJzdClcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2luaXRQcm9wcyh0YXJnZXQsIHByb3BMb29rdXAsIHNpYmxpbmdzLCBvdmVyd3JpdHRlblByb3BzKTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9vdmVyd3JpdGUgPiAxKSBpZiAodGhpcy5fZmlyc3RQVCkgaWYgKHNpYmxpbmdzLmxlbmd0aCA+IDEpIGlmIChfYXBwbHlPdmVyd3JpdGUodGFyZ2V0LCB0aGlzLCBwcm9wTG9va3VwLCB0aGlzLl9vdmVyd3JpdGUsIHNpYmxpbmdzKSkge1xuXHRcdFx0XHR0aGlzLl9raWxsKHByb3BMb29rdXAsIHRhcmdldCk7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9pbml0UHJvcHModGFyZ2V0LCBwcm9wTG9va3VwLCBzaWJsaW5ncywgb3ZlcndyaXR0ZW5Qcm9wcyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fZmlyc3RQVCkgaWYgKCh0aGlzLnZhcnMubGF6eSAhPT0gZmFsc2UgJiYgdGhpcy5fZHVyYXRpb24pIHx8ICh0aGlzLnZhcnMubGF6eSAmJiAhdGhpcy5fZHVyYXRpb24pKSB7IC8vemVybyBkdXJhdGlvbiB0d2VlbnMgZG9uJ3QgbGF6eSByZW5kZXIgYnkgZGVmYXVsdDsgZXZlcnl0aGluZyBlbHNlIGRvZXMuXG5cdFx0XHRcdF9sYXp5TG9va3VwW3RhcmdldC5fZ3NUd2VlbklEXSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaW5pdFBsdWdpbnM7XG5cdFx0fTtcblxuXHRcdHAucmVuZGVyID0gZnVuY3Rpb24odGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKSB7XG5cdFx0XHR2YXIgcHJldlRpbWUgPSB0aGlzLl90aW1lLFxuXHRcdFx0XHRkdXJhdGlvbiA9IHRoaXMuX2R1cmF0aW9uLFxuXHRcdFx0XHRwcmV2UmF3UHJldlRpbWUgPSB0aGlzLl9yYXdQcmV2VGltZSxcblx0XHRcdFx0aXNDb21wbGV0ZSwgY2FsbGJhY2ssIHB0LCByYXdQcmV2VGltZTtcblx0XHRcdGlmICh0aW1lID49IGR1cmF0aW9uIC0gMC4wMDAwMDAxKSB7IC8vdG8gd29yayBhcm91bmQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCBtYXRoIGFydGlmYWN0cy5cblx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fdGltZSA9IGR1cmF0aW9uO1xuXHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5fY2FsY0VuZCA/IHRoaXMuX2Vhc2UuZ2V0UmF0aW8oMSkgOiAxO1xuXHRcdFx0XHRpZiAoIXRoaXMuX3JldmVyc2VkICkge1xuXHRcdFx0XHRcdGlzQ29tcGxldGUgPSB0cnVlO1xuXHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvbkNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0Zm9yY2UgPSAoZm9yY2UgfHwgdGhpcy5fdGltZWxpbmUuYXV0b1JlbW92ZUNoaWxkcmVuKTsgLy9vdGhlcndpc2UsIGlmIHRoZSBhbmltYXRpb24gaXMgdW5wYXVzZWQvYWN0aXZhdGVkIGFmdGVyIGl0J3MgYWxyZWFkeSBmaW5pc2hlZCwgaXQgZG9lc24ndCBnZXQgcmVtb3ZlZCBmcm9tIHRoZSBwYXJlbnQgdGltZWxpbmUuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGR1cmF0aW9uID09PSAwKSBpZiAodGhpcy5faW5pdHRlZCB8fCAhdGhpcy52YXJzLmxhenkgfHwgZm9yY2UpIHsgLy96ZXJvLWR1cmF0aW9uIHR3ZWVucyBhcmUgdHJpY2t5IGJlY2F1c2Ugd2UgbXVzdCBkaXNjZXJuIHRoZSBtb21lbnR1bS9kaXJlY3Rpb24gb2YgdGltZSBpbiBvcmRlciB0byBkZXRlcm1pbmUgd2hldGhlciB0aGUgc3RhcnRpbmcgdmFsdWVzIHNob3VsZCBiZSByZW5kZXJlZCBvciB0aGUgZW5kaW5nIHZhbHVlcy4gSWYgdGhlIFwicGxheWhlYWRcIiBvZiBpdHMgdGltZWxpbmUgZ29lcyBwYXN0IHRoZSB6ZXJvLWR1cmF0aW9uIHR3ZWVuIGluIHRoZSBmb3J3YXJkIGRpcmVjdGlvbiBvciBsYW5kcyBkaXJlY3RseSBvbiBpdCwgdGhlIGVuZCB2YWx1ZXMgc2hvdWxkIGJlIHJlbmRlcmVkLCBidXQgaWYgdGhlIHRpbWVsaW5lJ3MgXCJwbGF5aGVhZFwiIG1vdmVzIHBhc3QgaXQgaW4gdGhlIGJhY2t3YXJkIGRpcmVjdGlvbiAoZnJvbSBhIHBvc3RpdGl2ZSB0aW1lIHRvIGEgbmVnYXRpdmUgdGltZSksIHRoZSBzdGFydGluZyB2YWx1ZXMgbXVzdCBiZSByZW5kZXJlZC5cblx0XHRcdFx0XHRpZiAodGhpcy5fc3RhcnRUaW1lID09PSB0aGlzLl90aW1lbGluZS5fZHVyYXRpb24pIHsgLy9pZiBhIHplcm8tZHVyYXRpb24gdHdlZW4gaXMgYXQgdGhlIFZFUlkgZW5kIG9mIGEgdGltZWxpbmUgYW5kIHRoYXQgdGltZWxpbmUgcmVuZGVycyBhdCBpdHMgZW5kLCBpdCB3aWxsIHR5cGljYWxseSBhZGQgYSB0aW55IGJpdCBvZiBjdXNoaW9uIHRvIHRoZSByZW5kZXIgdGltZSB0byBwcmV2ZW50IHJvdW5kaW5nIGVycm9ycyBmcm9tIGdldHRpbmcgaW4gdGhlIHdheSBvZiB0d2VlbnMgcmVuZGVyaW5nIHRoZWlyIFZFUlkgZW5kLiBJZiB3ZSB0aGVuIHJldmVyc2UoKSB0aGF0IHRpbWVsaW5lLCB0aGUgemVyby1kdXJhdGlvbiB0d2VlbiB3aWxsIHRyaWdnZXIgaXRzIG9uUmV2ZXJzZUNvbXBsZXRlIGV2ZW4gdGhvdWdoIHRlY2huaWNhbGx5IHRoZSBwbGF5aGVhZCBkaWRuJ3QgcGFzcyBvdmVyIGl0IGFnYWluLiBJdCdzIGEgdmVyeSBzcGVjaWZpYyBlZGdlIGNhc2Ugd2UgbXVzdCBhY2NvbW1vZGF0ZS5cblx0XHRcdFx0XHRcdHRpbWUgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocHJldlJhd1ByZXZUaW1lIDwgMCB8fCAodGltZSA8PSAwICYmIHRpbWUgPj0gLTAuMDAwMDAwMSkgfHwgKHByZXZSYXdQcmV2VGltZSA9PT0gX3RpbnlOdW0gJiYgdGhpcy5kYXRhICE9PSBcImlzUGF1c2VcIikpIGlmIChwcmV2UmF3UHJldlRpbWUgIT09IHRpbWUpIHsgLy9ub3RlOiB3aGVuIHRoaXMuZGF0YSBpcyBcImlzUGF1c2VcIiwgaXQncyBhIGNhbGxiYWNrIGFkZGVkIGJ5IGFkZFBhdXNlKCkgb24gYSB0aW1lbGluZSB0aGF0IHdlIHNob3VsZCBub3QgYmUgdHJpZ2dlcmVkIHdoZW4gTEVBVklORyBpdHMgZXhhY3Qgc3RhcnQgdGltZS4gSW4gb3RoZXIgd29yZHMsIHRsLmFkZFBhdXNlKDEpLnBsYXkoMSkgc2hvdWxkbid0IHBhdXNlLlxuXHRcdFx0XHRcdFx0Zm9yY2UgPSB0cnVlO1xuXHRcdFx0XHRcdFx0aWYgKHByZXZSYXdQcmV2VGltZSA+IF90aW55TnVtKSB7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvblJldmVyc2VDb21wbGV0ZVwiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IHJhd1ByZXZUaW1lID0gKCFzdXBwcmVzc0V2ZW50cyB8fCB0aW1lIHx8IHByZXZSYXdQcmV2VGltZSA9PT0gdGltZSkgPyB0aW1lIDogX3RpbnlOdW07IC8vd2hlbiB0aGUgcGxheWhlYWQgYXJyaXZlcyBhdCBFWEFDVExZIHRpbWUgMCAocmlnaHQgb24gdG9wKSBvZiBhIHplcm8tZHVyYXRpb24gdHdlZW4sIHdlIG5lZWQgdG8gZGlzY2VybiBpZiBldmVudHMgYXJlIHN1cHByZXNzZWQgc28gdGhhdCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBhZ2FpbiAobmV4dCB0aW1lKSwgaXQnbGwgdHJpZ2dlciB0aGUgY2FsbGJhY2suIElmIGV2ZW50cyBhcmUgTk9UIHN1cHByZXNzZWQsIG9idmlvdXNseSB0aGUgY2FsbGJhY2sgd291bGQgYmUgdHJpZ2dlcmVkIGluIHRoaXMgcmVuZGVyLiBCYXNpY2FsbHksIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZSBlaXRoZXIgd2hlbiB0aGUgcGxheWhlYWQgQVJSSVZFUyBvciBMRUFWRVMgdGhpcyBleGFjdCBzcG90LCBub3QgYm90aC4gSW1hZ2luZSBkb2luZyBhIHRpbWVsaW5lLnNlZWsoMCkgYW5kIHRoZXJlJ3MgYSBjYWxsYmFjayB0aGF0IHNpdHMgYXQgMC4gU2luY2UgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIG9uIHRoYXQgc2VlaygpIGJ5IGRlZmF1bHQsIG5vdGhpbmcgd2lsbCBmaXJlLCBidXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgb2ZmIG9mIHRoYXQgcG9zaXRpb24sIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZS4gVGhpcyBiZWhhdmlvciBpcyB3aGF0IHBlb3BsZSBpbnR1aXRpdmVseSBleHBlY3QuIFdlIHNldCB0aGUgX3Jhd1ByZXZUaW1lIHRvIGJlIGEgcHJlY2lzZSB0aW55IG51bWJlciB0byBpbmRpY2F0ZSB0aGlzIHNjZW5hcmlvIHJhdGhlciB0aGFuIHVzaW5nIGFub3RoZXIgcHJvcGVydHkvdmFyaWFibGUgd2hpY2ggd291bGQgaW5jcmVhc2UgbWVtb3J5IHVzYWdlLiBUaGlzIHRlY2huaXF1ZSBpcyBsZXNzIHJlYWRhYmxlLCBidXQgbW9yZSBlZmZpY2llbnQuXG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIGlmICh0aW1lIDwgMC4wMDAwMDAxKSB7IC8vdG8gd29yayBhcm91bmQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCBtYXRoIGFydGlmYWN0cywgcm91bmQgc3VwZXIgc21hbGwgdmFsdWVzIHRvIDAuXG5cdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRoaXMuX3RpbWUgPSAwO1xuXHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5fY2FsY0VuZCA/IHRoaXMuX2Vhc2UuZ2V0UmF0aW8oMCkgOiAwO1xuXHRcdFx0XHRpZiAocHJldlRpbWUgIT09IDAgfHwgKGR1cmF0aW9uID09PSAwICYmIHByZXZSYXdQcmV2VGltZSA+IDApKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uUmV2ZXJzZUNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0aXNDb21wbGV0ZSA9IHRoaXMuX3JldmVyc2VkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aW1lIDwgMCkge1xuXHRcdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdGlmIChkdXJhdGlvbiA9PT0gMCkgaWYgKHRoaXMuX2luaXR0ZWQgfHwgIXRoaXMudmFycy5sYXp5IHx8IGZvcmNlKSB7IC8vemVyby1kdXJhdGlvbiB0d2VlbnMgYXJlIHRyaWNreSBiZWNhdXNlIHdlIG11c3QgZGlzY2VybiB0aGUgbW9tZW50dW0vZGlyZWN0aW9uIG9mIHRpbWUgaW4gb3JkZXIgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIHN0YXJ0aW5nIHZhbHVlcyBzaG91bGQgYmUgcmVuZGVyZWQgb3IgdGhlIGVuZGluZyB2YWx1ZXMuIElmIHRoZSBcInBsYXloZWFkXCIgb2YgaXRzIHRpbWVsaW5lIGdvZXMgcGFzdCB0aGUgemVyby1kdXJhdGlvbiB0d2VlbiBpbiB0aGUgZm9yd2FyZCBkaXJlY3Rpb24gb3IgbGFuZHMgZGlyZWN0bHkgb24gaXQsIHRoZSBlbmQgdmFsdWVzIHNob3VsZCBiZSByZW5kZXJlZCwgYnV0IGlmIHRoZSB0aW1lbGluZSdzIFwicGxheWhlYWRcIiBtb3ZlcyBwYXN0IGl0IGluIHRoZSBiYWNrd2FyZCBkaXJlY3Rpb24gKGZyb20gYSBwb3N0aXRpdmUgdGltZSB0byBhIG5lZ2F0aXZlIHRpbWUpLCB0aGUgc3RhcnRpbmcgdmFsdWVzIG11c3QgYmUgcmVuZGVyZWQuXG5cdFx0XHRcdFx0XHRpZiAocHJldlJhd1ByZXZUaW1lID49IDAgJiYgIShwcmV2UmF3UHJldlRpbWUgPT09IF90aW55TnVtICYmIHRoaXMuZGF0YSA9PT0gXCJpc1BhdXNlXCIpKSB7XG5cdFx0XHRcdFx0XHRcdGZvcmNlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gcmF3UHJldlRpbWUgPSAoIXN1cHByZXNzRXZlbnRzIHx8IHRpbWUgfHwgcHJldlJhd1ByZXZUaW1lID09PSB0aW1lKSA/IHRpbWUgOiBfdGlueU51bTsgLy93aGVuIHRoZSBwbGF5aGVhZCBhcnJpdmVzIGF0IEVYQUNUTFkgdGltZSAwIChyaWdodCBvbiB0b3ApIG9mIGEgemVyby1kdXJhdGlvbiB0d2Vlbiwgd2UgbmVlZCB0byBkaXNjZXJuIGlmIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBzbyB0aGF0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIGFnYWluIChuZXh0IHRpbWUpLCBpdCdsbCB0cmlnZ2VyIHRoZSBjYWxsYmFjay4gSWYgZXZlbnRzIGFyZSBOT1Qgc3VwcHJlc3NlZCwgb2J2aW91c2x5IHRoZSBjYWxsYmFjayB3b3VsZCBiZSB0cmlnZ2VyZWQgaW4gdGhpcyByZW5kZXIuIEJhc2ljYWxseSwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlIGVpdGhlciB3aGVuIHRoZSBwbGF5aGVhZCBBUlJJVkVTIG9yIExFQVZFUyB0aGlzIGV4YWN0IHNwb3QsIG5vdCBib3RoLiBJbWFnaW5lIGRvaW5nIGEgdGltZWxpbmUuc2VlaygwKSBhbmQgdGhlcmUncyBhIGNhbGxiYWNrIHRoYXQgc2l0cyBhdCAwLiBTaW5jZSBldmVudHMgYXJlIHN1cHByZXNzZWQgb24gdGhhdCBzZWVrKCkgYnkgZGVmYXVsdCwgbm90aGluZyB3aWxsIGZpcmUsIGJ1dCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBvZmYgb2YgdGhhdCBwb3NpdGlvbiwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlLiBUaGlzIGJlaGF2aW9yIGlzIHdoYXQgcGVvcGxlIGludHVpdGl2ZWx5IGV4cGVjdC4gV2Ugc2V0IHRoZSBfcmF3UHJldlRpbWUgdG8gYmUgYSBwcmVjaXNlIHRpbnkgbnVtYmVyIHRvIGluZGljYXRlIHRoaXMgc2NlbmFyaW8gcmF0aGVyIHRoYW4gdXNpbmcgYW5vdGhlciBwcm9wZXJ0eS92YXJpYWJsZSB3aGljaCB3b3VsZCBpbmNyZWFzZSBtZW1vcnkgdXNhZ2UuIFRoaXMgdGVjaG5pcXVlIGlzIGxlc3MgcmVhZGFibGUsIGJ1dCBtb3JlIGVmZmljaWVudC5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCF0aGlzLl9pbml0dGVkKSB7IC8vaWYgd2UgcmVuZGVyIHRoZSB2ZXJ5IGJlZ2lubmluZyAodGltZSA9PSAwKSBvZiBhIGZyb21UbygpLCB3ZSBtdXN0IGZvcmNlIHRoZSByZW5kZXIgKG5vcm1hbCB0d2VlbnMgd291bGRuJ3QgbmVlZCB0byByZW5kZXIgYXQgYSB0aW1lIG9mIDAgd2hlbiB0aGUgcHJldlRpbWUgd2FzIGFsc28gMCkuIFRoaXMgaXMgYWxzbyBtYW5kYXRvcnkgdG8gbWFrZSBzdXJlIG92ZXJ3cml0aW5nIGtpY2tzIGluIGltbWVkaWF0ZWx5LlxuXHRcdFx0XHRcdGZvcmNlID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fdGltZSA9IHRpbWU7XG5cblx0XHRcdFx0aWYgKHRoaXMuX2Vhc2VUeXBlKSB7XG5cdFx0XHRcdFx0dmFyIHIgPSB0aW1lIC8gZHVyYXRpb24sIHR5cGUgPSB0aGlzLl9lYXNlVHlwZSwgcG93ID0gdGhpcy5fZWFzZVBvd2VyO1xuXHRcdFx0XHRcdGlmICh0eXBlID09PSAxIHx8ICh0eXBlID09PSAzICYmIHIgPj0gMC41KSkge1xuXHRcdFx0XHRcdFx0ciA9IDEgLSByO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gMykge1xuXHRcdFx0XHRcdFx0ciAqPSAyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocG93ID09PSAxKSB7XG5cdFx0XHRcdFx0XHRyICo9IHI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwb3cgPT09IDIpIHtcblx0XHRcdFx0XHRcdHIgKj0gciAqIHI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwb3cgPT09IDMpIHtcblx0XHRcdFx0XHRcdHIgKj0gciAqIHIgKiByO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocG93ID09PSA0KSB7XG5cdFx0XHRcdFx0XHRyICo9IHIgKiByICogciAqIHI7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09IDEpIHtcblx0XHRcdFx0XHRcdHRoaXMucmF0aW8gPSAxIC0gcjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09IDIpIHtcblx0XHRcdFx0XHRcdHRoaXMucmF0aW8gPSByO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGltZSAvIGR1cmF0aW9uIDwgMC41KSB7XG5cdFx0XHRcdFx0XHR0aGlzLnJhdGlvID0gciAvIDI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMucmF0aW8gPSAxIC0gKHIgLyAyKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5nZXRSYXRpbyh0aW1lIC8gZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl90aW1lID09PSBwcmV2VGltZSAmJiAhZm9yY2UpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fSBlbHNlIGlmICghdGhpcy5faW5pdHRlZCkge1xuXHRcdFx0XHR0aGlzLl9pbml0KCk7XG5cdFx0XHRcdGlmICghdGhpcy5faW5pdHRlZCB8fCB0aGlzLl9nYykgeyAvL2ltbWVkaWF0ZVJlbmRlciB0d2VlbnMgdHlwaWNhbGx5IHdvbid0IGluaXRpYWxpemUgdW50aWwgdGhlIHBsYXloZWFkIGFkdmFuY2VzIChfdGltZSBpcyBncmVhdGVyIHRoYW4gMCkgaW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgb3ZlcndyaXRpbmcgb2NjdXJzIHByb3Blcmx5LiBBbHNvLCBpZiBhbGwgb2YgdGhlIHR3ZWVuaW5nIHByb3BlcnRpZXMgaGF2ZSBiZWVuIG92ZXJ3cml0dGVuICh3aGljaCB3b3VsZCBjYXVzZSBfZ2MgdG8gYmUgdHJ1ZSwgYXMgc2V0IGluIF9pbml0KCkpLCB3ZSBzaG91bGRuJ3QgY29udGludWUgb3RoZXJ3aXNlIGFuIG9uU3RhcnQgY2FsbGJhY2sgY291bGQgYmUgY2FsbGVkIGZvciBleGFtcGxlLlxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fSBlbHNlIGlmICghZm9yY2UgJiYgdGhpcy5fZmlyc3RQVCAmJiAoKHRoaXMudmFycy5sYXp5ICE9PSBmYWxzZSAmJiB0aGlzLl9kdXJhdGlvbikgfHwgKHRoaXMudmFycy5sYXp5ICYmICF0aGlzLl9kdXJhdGlvbikpKSB7XG5cdFx0XHRcdFx0dGhpcy5fdGltZSA9IHRoaXMuX3RvdGFsVGltZSA9IHByZXZUaW1lO1xuXHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gcHJldlJhd1ByZXZUaW1lO1xuXHRcdFx0XHRcdF9sYXp5VHdlZW5zLnB1c2godGhpcyk7XG5cdFx0XHRcdFx0dGhpcy5fbGF6eSA9IFt0aW1lLCBzdXBwcmVzc0V2ZW50c107XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vX2Vhc2UgaXMgaW5pdGlhbGx5IHNldCB0byBkZWZhdWx0RWFzZSwgc28gbm93IHRoYXQgaW5pdCgpIGhhcyBydW4sIF9lYXNlIGlzIHNldCBwcm9wZXJseSBhbmQgd2UgbmVlZCB0byByZWNhbGN1bGF0ZSB0aGUgcmF0aW8uIE92ZXJhbGwgdGhpcyBpcyBmYXN0ZXIgdGhhbiB1c2luZyBjb25kaXRpb25hbCBsb2dpYyBlYXJsaWVyIGluIHRoZSBtZXRob2QgdG8gYXZvaWQgaGF2aW5nIHRvIHNldCByYXRpbyB0d2ljZSBiZWNhdXNlIHdlIG9ubHkgaW5pdCgpIG9uY2UgYnV0IHJlbmRlclRpbWUoKSBnZXRzIGNhbGxlZCBWRVJZIGZyZXF1ZW50bHkuXG5cdFx0XHRcdGlmICh0aGlzLl90aW1lICYmICFpc0NvbXBsZXRlKSB7XG5cdFx0XHRcdFx0dGhpcy5yYXRpbyA9IHRoaXMuX2Vhc2UuZ2V0UmF0aW8odGhpcy5fdGltZSAvIGR1cmF0aW9uKTtcblx0XHRcdFx0fSBlbHNlIGlmIChpc0NvbXBsZXRlICYmIHRoaXMuX2Vhc2UuX2NhbGNFbmQpIHtcblx0XHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5nZXRSYXRpbygodGhpcy5fdGltZSA9PT0gMCkgPyAwIDogMSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9sYXp5ICE9PSBmYWxzZSkgeyAvL2luIGNhc2UgYSBsYXp5IHJlbmRlciBpcyBwZW5kaW5nLCB3ZSBzaG91bGQgZmx1c2ggaXQgYmVjYXVzZSB0aGUgbmV3IHJlbmRlciBpcyBvY2N1cnJpbmcgbm93IChpbWFnaW5lIGEgbGF6eSB0d2VlbiBpbnN0YW50aWF0aW5nIGFuZCB0aGVuIGltbWVkaWF0ZWx5IHRoZSB1c2VyIGNhbGxzIHR3ZWVuLnNlZWsodHdlZW4uZHVyYXRpb24oKSksIHNraXBwaW5nIHRvIHRoZSBlbmQgLSB0aGUgZW5kIHJlbmRlciB3b3VsZCBiZSBmb3JjZWQsIGFuZCB0aGVuIGlmIHdlIGRpZG4ndCBmbHVzaCB0aGUgbGF6eSByZW5kZXIsIGl0J2QgZmlyZSBBRlRFUiB0aGUgc2VlaygpLCByZW5kZXJpbmcgaXQgYXQgdGhlIHdyb25nIHRpbWUuXG5cdFx0XHRcdHRoaXMuX2xhenkgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICghdGhpcy5fYWN0aXZlKSBpZiAoIXRoaXMuX3BhdXNlZCAmJiB0aGlzLl90aW1lICE9PSBwcmV2VGltZSAmJiB0aW1lID49IDApIHtcblx0XHRcdFx0dGhpcy5fYWN0aXZlID0gdHJ1ZTsgIC8vc28gdGhhdCBpZiB0aGUgdXNlciByZW5kZXJzIGEgdHdlZW4gKGFzIG9wcG9zZWQgdG8gdGhlIHRpbWVsaW5lIHJlbmRlcmluZyBpdCksIHRoZSB0aW1lbGluZSBpcyBmb3JjZWQgdG8gcmUtcmVuZGVyIGFuZCBhbGlnbiBpdCB3aXRoIHRoZSBwcm9wZXIgdGltZS9mcmFtZSBvbiB0aGUgbmV4dCByZW5kZXJpbmcgY3ljbGUuIE1heWJlIHRoZSB0d2VlbiBhbHJlYWR5IGZpbmlzaGVkIGJ1dCB0aGUgdXNlciBtYW51YWxseSByZS1yZW5kZXJzIGl0IGFzIGhhbGZ3YXkgZG9uZS5cblx0XHRcdH1cblx0XHRcdGlmIChwcmV2VGltZSA9PT0gMCkge1xuXHRcdFx0XHRpZiAodGhpcy5fc3RhcnRBdCkge1xuXHRcdFx0XHRcdGlmICh0aW1lID49IDApIHtcblx0XHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQucmVuZGVyKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICghY2FsbGJhY2spIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrID0gXCJfZHVtbXlHU1wiOyAvL2lmIG5vIGNhbGxiYWNrIGlzIGRlZmluZWQsIHVzZSBhIGR1bW15IHZhbHVlIGp1c3Qgc28gdGhhdCB0aGUgY29uZGl0aW9uIGF0IHRoZSBlbmQgZXZhbHVhdGVzIGFzIHRydWUgYmVjYXVzZSBfc3RhcnRBdCBzaG91bGQgcmVuZGVyIEFGVEVSIHRoZSBub3JtYWwgcmVuZGVyIGxvb3Agd2hlbiB0aGUgdGltZSBpcyBuZWdhdGl2ZS4gV2UgY291bGQgaGFuZGxlIHRoaXMgaW4gYSBtb3JlIGludHVpdGl2ZSB3YXksIG9mIGNvdXJzZSwgYnV0IHRoZSByZW5kZXIgbG9vcCBpcyB0aGUgTU9TVCBpbXBvcnRhbnQgdGhpbmcgdG8gb3B0aW1pemUsIHNvIHRoaXMgdGVjaG5pcXVlIGFsbG93cyB1cyB0byBhdm9pZCBhZGRpbmcgZXh0cmEgY29uZGl0aW9uYWwgbG9naWMgaW4gYSBoaWdoLWZyZXF1ZW5jeSBhcmVhLlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGhpcy52YXJzLm9uU3RhcnQpIGlmICh0aGlzLl90aW1lICE9PSAwIHx8IGR1cmF0aW9uID09PSAwKSBpZiAoIXN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soXCJvblN0YXJ0XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRwdCA9IHRoaXMuX2ZpcnN0UFQ7XG5cdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0aWYgKHB0LmYpIHtcblx0XHRcdFx0XHRwdC50W3B0LnBdKHB0LmMgKiB0aGlzLnJhdGlvICsgcHQucyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cHQudFtwdC5wXSA9IHB0LmMgKiB0aGlzLnJhdGlvICsgcHQucztcblx0XHRcdFx0fVxuXHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fb25VcGRhdGUpIHtcblx0XHRcdFx0aWYgKHRpbWUgPCAwKSBpZiAodGhpcy5fc3RhcnRBdCAmJiB0aW1lICE9PSAtMC4wMDAxKSB7IC8vaWYgdGhlIHR3ZWVuIGlzIHBvc2l0aW9uZWQgYXQgdGhlIFZFUlkgYmVnaW5uaW5nIChfc3RhcnRUaW1lIDApIG9mIGl0cyBwYXJlbnQgdGltZWxpbmUsIGl0J3MgaWxsZWdhbCBmb3IgdGhlIHBsYXloZWFkIHRvIGdvIGJhY2sgZnVydGhlciwgc28gd2Ugc2hvdWxkIG5vdCByZW5kZXIgdGhlIHJlY29yZGVkIHN0YXJ0QXQgdmFsdWVzLlxuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQucmVuZGVyKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7IC8vbm90ZTogZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIHdlIHR1Y2sgdGhpcyBjb25kaXRpb25hbCBsb2dpYyBpbnNpZGUgbGVzcyB0cmF2ZWxlZCBhcmVhcyAobW9zdCB0d2VlbnMgZG9uJ3QgaGF2ZSBhbiBvblVwZGF0ZSkuIFdlJ2QganVzdCBoYXZlIGl0IGF0IHRoZSBlbmQgYmVmb3JlIHRoZSBvbkNvbXBsZXRlLCBidXQgdGhlIHZhbHVlcyBzaG91bGQgYmUgdXBkYXRlZCBiZWZvcmUgYW55IG9uVXBkYXRlIGlzIGNhbGxlZCwgc28gd2UgQUxTTyBwdXQgaXQgaGVyZSBhbmQgdGhlbiBpZiBpdCdzIG5vdCBjYWxsZWQsIHdlIGRvIHNvIGxhdGVyIG5lYXIgdGhlIG9uQ29tcGxldGUuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFzdXBwcmVzc0V2ZW50cykgaWYgKHRoaXMuX3RpbWUgIT09IHByZXZUaW1lIHx8IGlzQ29tcGxldGUpIHtcblx0XHRcdFx0XHR0aGlzLl9jYWxsYmFjayhcIm9uVXBkYXRlXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoY2FsbGJhY2spIGlmICghdGhpcy5fZ2MgfHwgZm9yY2UpIHsgLy9jaGVjayBfZ2MgYmVjYXVzZSB0aGVyZSdzIGEgY2hhbmNlIHRoYXQga2lsbCgpIGNvdWxkIGJlIGNhbGxlZCBpbiBhbiBvblVwZGF0ZVxuXHRcdFx0XHRpZiAodGltZSA8IDAgJiYgdGhpcy5fc3RhcnRBdCAmJiAhdGhpcy5fb25VcGRhdGUgJiYgdGltZSAhPT0gLTAuMDAwMSkgeyAvLy0wLjAwMDEgaXMgYSBzcGVjaWFsIHZhbHVlIHRoYXQgd2UgdXNlIHdoZW4gbG9vcGluZyBiYWNrIHRvIHRoZSBiZWdpbm5pbmcgb2YgYSByZXBlYXRlZCBUaW1lbGluZU1heCwgaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGRuJ3QgcmVuZGVyIHRoZSBfc3RhcnRBdCB2YWx1ZXMuXG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5yZW5kZXIodGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaXNDb21wbGV0ZSkge1xuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4pIHtcblx0XHRcdFx0XHRcdHRoaXMuX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFzdXBwcmVzc0V2ZW50cyAmJiB0aGlzLnZhcnNbY2FsbGJhY2tdKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soY2FsbGJhY2spO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChkdXJhdGlvbiA9PT0gMCAmJiB0aGlzLl9yYXdQcmV2VGltZSA9PT0gX3RpbnlOdW0gJiYgcmF3UHJldlRpbWUgIT09IF90aW55TnVtKSB7IC8vdGhlIG9uQ29tcGxldGUgb3Igb25SZXZlcnNlQ29tcGxldGUgY291bGQgdHJpZ2dlciBtb3ZlbWVudCBvZiB0aGUgcGxheWhlYWQgYW5kIGZvciB6ZXJvLWR1cmF0aW9uIHR3ZWVucyAod2hpY2ggbXVzdCBkaXNjZXJuIGRpcmVjdGlvbikgdGhhdCBsYW5kIGRpcmVjdGx5IGJhY2sgb24gdGhlaXIgc3RhcnQgdGltZSwgd2UgZG9uJ3Qgd2FudCB0byBmaXJlIGFnYWluIG9uIHRoZSBuZXh0IHJlbmRlci4gVGhpbmsgb2Ygc2V2ZXJhbCBhZGRQYXVzZSgpJ3MgaW4gYSB0aW1lbGluZSB0aGF0IGZvcmNlcyB0aGUgcGxheWhlYWQgdG8gYSBjZXJ0YWluIHNwb3QsIGJ1dCB3aGF0IGlmIGl0J3MgYWxyZWFkeSBwYXVzZWQgYW5kIGFub3RoZXIgdHdlZW4gaXMgdHdlZW5pbmcgdGhlIFwidGltZVwiIG9mIHRoZSB0aW1lbGluZT8gRWFjaCB0aW1lIGl0IG1vdmVzIFtmb3J3YXJkXSBwYXN0IHRoYXQgc3BvdCwgaXQgd291bGQgbW92ZSBiYWNrLCBhbmQgc2luY2Ugc3VwcHJlc3NFdmVudHMgaXMgdHJ1ZSwgaXQnZCByZXNldCBfcmF3UHJldlRpbWUgdG8gX3RpbnlOdW0gc28gdGhhdCB3aGVuIGl0IGJlZ2lucyBhZ2FpbiwgdGhlIGNhbGxiYWNrIHdvdWxkIGZpcmUgKHNvIHVsdGltYXRlbHkgaXQgY291bGQgYm91bmNlIGJhY2sgYW5kIGZvcnRoIGR1cmluZyB0aGF0IHR3ZWVuKS4gQWdhaW4sIHRoaXMgaXMgYSB2ZXJ5IHVuY29tbW9uIHNjZW5hcmlvLCBidXQgcG9zc2libGUgbm9uZXRoZWxlc3MuXG5cdFx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHAuX2tpbGwgPSBmdW5jdGlvbih2YXJzLCB0YXJnZXQsIG92ZXJ3cml0aW5nVHdlZW4pIHtcblx0XHRcdGlmICh2YXJzID09PSBcImFsbFwiKSB7XG5cdFx0XHRcdHZhcnMgPSBudWxsO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZhcnMgPT0gbnVsbCkgaWYgKHRhcmdldCA9PSBudWxsIHx8IHRhcmdldCA9PT0gdGhpcy50YXJnZXQpIHtcblx0XHRcdFx0dGhpcy5fbGF6eSA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0dGFyZ2V0ID0gKHR5cGVvZih0YXJnZXQpICE9PSBcInN0cmluZ1wiKSA/ICh0YXJnZXQgfHwgdGhpcy5fdGFyZ2V0cyB8fCB0aGlzLnRhcmdldCkgOiBUd2VlbkxpdGUuc2VsZWN0b3IodGFyZ2V0KSB8fCB0YXJnZXQ7XG5cdFx0XHR2YXIgc2ltdWx0YW5lb3VzT3ZlcndyaXRlID0gKG92ZXJ3cml0aW5nVHdlZW4gJiYgdGhpcy5fdGltZSAmJiBvdmVyd3JpdGluZ1R3ZWVuLl9zdGFydFRpbWUgPT09IHRoaXMuX3N0YXJ0VGltZSAmJiB0aGlzLl90aW1lbGluZSA9PT0gb3ZlcndyaXRpbmdUd2Vlbi5fdGltZWxpbmUpLFxuXHRcdFx0XHRpLCBvdmVyd3JpdHRlblByb3BzLCBwLCBwdCwgcHJvcExvb2t1cCwgY2hhbmdlZCwga2lsbFByb3BzLCByZWNvcmQsIGtpbGxlZDtcblx0XHRcdGlmICgoX2lzQXJyYXkodGFyZ2V0KSB8fCBfaXNTZWxlY3Rvcih0YXJnZXQpKSAmJiB0eXBlb2YodGFyZ2V0WzBdKSAhPT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRpID0gdGFyZ2V0Lmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2tpbGwodmFycywgdGFyZ2V0W2ldLCBvdmVyd3JpdGluZ1R3ZWVuKSkge1xuXHRcdFx0XHRcdFx0Y2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAodGhpcy5fdGFyZ2V0cykge1xuXHRcdFx0XHRcdGkgPSB0aGlzLl90YXJnZXRzLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdGlmICh0YXJnZXQgPT09IHRoaXMuX3RhcmdldHNbaV0pIHtcblx0XHRcdFx0XHRcdFx0cHJvcExvb2t1cCA9IHRoaXMuX3Byb3BMb29rdXBbaV0gfHwge307XG5cdFx0XHRcdFx0XHRcdHRoaXMuX292ZXJ3cml0dGVuUHJvcHMgPSB0aGlzLl9vdmVyd3JpdHRlblByb3BzIHx8IFtdO1xuXHRcdFx0XHRcdFx0XHRvdmVyd3JpdHRlblByb3BzID0gdGhpcy5fb3ZlcndyaXR0ZW5Qcm9wc1tpXSA9IHZhcnMgPyB0aGlzLl9vdmVyd3JpdHRlblByb3BzW2ldIHx8IHt9IDogXCJhbGxcIjtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKHRhcmdldCAhPT0gdGhpcy50YXJnZXQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cHJvcExvb2t1cCA9IHRoaXMuX3Byb3BMb29rdXA7XG5cdFx0XHRcdFx0b3ZlcndyaXR0ZW5Qcm9wcyA9IHRoaXMuX292ZXJ3cml0dGVuUHJvcHMgPSB2YXJzID8gdGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcyB8fCB7fSA6IFwiYWxsXCI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAocHJvcExvb2t1cCkge1xuXHRcdFx0XHRcdGtpbGxQcm9wcyA9IHZhcnMgfHwgcHJvcExvb2t1cDtcblx0XHRcdFx0XHRyZWNvcmQgPSAodmFycyAhPT0gb3ZlcndyaXR0ZW5Qcm9wcyAmJiBvdmVyd3JpdHRlblByb3BzICE9PSBcImFsbFwiICYmIHZhcnMgIT09IHByb3BMb29rdXAgJiYgKHR5cGVvZih2YXJzKSAhPT0gXCJvYmplY3RcIiB8fCAhdmFycy5fdGVtcEtpbGwpKTsgLy9fdGVtcEtpbGwgaXMgYSBzdXBlci1zZWNyZXQgd2F5IHRvIGRlbGV0ZSBhIHBhcnRpY3VsYXIgdHdlZW5pbmcgcHJvcGVydHkgYnV0IE5PVCBoYXZlIGl0IHJlbWVtYmVyZWQgYXMgYW4gb2ZmaWNpYWwgb3ZlcndyaXR0ZW4gcHJvcGVydHkgKGxpa2UgaW4gQmV6aWVyUGx1Z2luKVxuXHRcdFx0XHRcdGlmIChvdmVyd3JpdGluZ1R3ZWVuICYmIChUd2VlbkxpdGUub25PdmVyd3JpdGUgfHwgdGhpcy52YXJzLm9uT3ZlcndyaXRlKSkge1xuXHRcdFx0XHRcdFx0Zm9yIChwIGluIGtpbGxQcm9wcykge1xuXHRcdFx0XHRcdFx0XHRpZiAocHJvcExvb2t1cFtwXSkge1xuXHRcdFx0XHRcdFx0XHRcdGlmICgha2lsbGVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRraWxsZWQgPSBbXTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0a2lsbGVkLnB1c2gocCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICgoa2lsbGVkIHx8ICF2YXJzKSAmJiAhX29uT3ZlcndyaXRlKHRoaXMsIG92ZXJ3cml0aW5nVHdlZW4sIHRhcmdldCwga2lsbGVkKSkgeyAvL2lmIHRoZSBvbk92ZXJ3cml0ZSByZXR1cm5lZCBmYWxzZSwgdGhhdCBtZWFucyB0aGUgdXNlciB3YW50cyB0byBvdmVycmlkZSB0aGUgb3ZlcndyaXRpbmcgKGNhbmNlbCBpdCkuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmb3IgKHAgaW4ga2lsbFByb3BzKSB7XG5cdFx0XHRcdFx0XHRpZiAoKHB0ID0gcHJvcExvb2t1cFtwXSkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHNpbXVsdGFuZW91c092ZXJ3cml0ZSkgeyAvL2lmIGFub3RoZXIgdHdlZW4gb3ZlcndyaXRlcyB0aGlzIG9uZSBhbmQgdGhleSBib3RoIHN0YXJ0IGF0IGV4YWN0bHkgdGhlIHNhbWUgdGltZSwgeWV0IHRoaXMgdHdlZW4gaGFzIGFscmVhZHkgcmVuZGVyZWQgb25jZSAoZm9yIGV4YW1wbGUsIGF0IDAuMDAxKSBiZWNhdXNlIGl0J3MgZmlyc3QgaW4gdGhlIHF1ZXVlLCB3ZSBzaG91bGQgcmV2ZXJ0IHRoZSB2YWx1ZXMgdG8gd2hlcmUgdGhleSB3ZXJlIGF0IDAgc28gdGhhdCB0aGUgc3RhcnRpbmcgdmFsdWVzIGFyZW4ndCBjb250YW1pbmF0ZWQgb24gdGhlIG92ZXJ3cml0aW5nIHR3ZWVuLlxuXHRcdFx0XHRcdFx0XHRcdGlmIChwdC5mKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwdC50W3B0LnBdKHB0LnMpO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQucztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0Y2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKHB0LnBnICYmIHB0LnQuX2tpbGwoa2lsbFByb3BzKSkge1xuXHRcdFx0XHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlOyAvL3NvbWUgcGx1Z2lucyBuZWVkIHRvIGJlIG5vdGlmaWVkIHNvIHRoZXkgY2FuIHBlcmZvcm0gY2xlYW51cCB0YXNrcyBmaXJzdFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICghcHQucGcgfHwgcHQudC5fb3ZlcndyaXRlUHJvcHMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHB0Ll9wcmV2KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwdC5fcHJldi5fbmV4dCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAocHQgPT09IHRoaXMuX2ZpcnN0UFQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdC5fbmV4dDtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHB0Ll9uZXh0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwdC5fbmV4dC5fcHJldiA9IHB0Ll9wcmV2O1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRwdC5fbmV4dCA9IHB0Ll9wcmV2ID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRkZWxldGUgcHJvcExvb2t1cFtwXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChyZWNvcmQpIHtcblx0XHRcdFx0XHRcdFx0b3ZlcndyaXR0ZW5Qcm9wc1twXSA9IDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghdGhpcy5fZmlyc3RQVCAmJiB0aGlzLl9pbml0dGVkKSB7IC8vaWYgYWxsIHR3ZWVuaW5nIHByb3BlcnRpZXMgYXJlIGtpbGxlZCwga2lsbCB0aGUgdHdlZW4uIFdpdGhvdXQgdGhpcyBsaW5lLCBpZiB0aGVyZSdzIGEgdHdlZW4gd2l0aCBtdWx0aXBsZSB0YXJnZXRzIGFuZCB0aGVuIHlvdSBraWxsVHdlZW5zT2YoKSBlYWNoIHRhcmdldCBpbmRpdmlkdWFsbHksIHRoZSB0d2VlbiB3b3VsZCB0ZWNobmljYWxseSBzdGlsbCByZW1haW4gYWN0aXZlIGFuZCBmaXJlIGl0cyBvbkNvbXBsZXRlIGV2ZW4gdGhvdWdoIHRoZXJlIGFyZW4ndCBhbnkgbW9yZSBwcm9wZXJ0aWVzIHR3ZWVuaW5nLlxuXHRcdFx0XHRcdFx0dGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNoYW5nZWQ7XG5cdFx0fTtcblxuXHRcdHAuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQpIHtcblx0XHRcdFx0VHdlZW5MaXRlLl9vblBsdWdpbkV2ZW50KFwiX29uRGlzYWJsZVwiLCB0aGlzKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2ZpcnN0UFQgPSB0aGlzLl9vdmVyd3JpdHRlblByb3BzID0gdGhpcy5fc3RhcnRBdCA9IHRoaXMuX29uVXBkYXRlID0gbnVsbDtcblx0XHRcdHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQgPSB0aGlzLl9hY3RpdmUgPSB0aGlzLl9sYXp5ID0gZmFsc2U7XG5cdFx0XHR0aGlzLl9wcm9wTG9va3VwID0gKHRoaXMuX3RhcmdldHMpID8ge30gOiBbXTtcblx0XHRcdEFuaW1hdGlvbi5wcm90b3R5cGUuaW52YWxpZGF0ZS5jYWxsKHRoaXMpO1xuXHRcdFx0aWYgKHRoaXMudmFycy5pbW1lZGlhdGVSZW5kZXIpIHtcblx0XHRcdFx0dGhpcy5fdGltZSA9IC1fdGlueU51bTsgLy9mb3JjZXMgYSByZW5kZXIgd2l0aG91dCBoYXZpbmcgdG8gc2V0IHRoZSByZW5kZXIoKSBcImZvcmNlXCIgcGFyYW1ldGVyIHRvIHRydWUgYmVjYXVzZSB3ZSB3YW50IHRvIGFsbG93IGxhenlpbmcgYnkgZGVmYXVsdCAodXNpbmcgdGhlIFwiZm9yY2VcIiBwYXJhbWV0ZXIgYWx3YXlzIGZvcmNlcyBhbiBpbW1lZGlhdGUgZnVsbCByZW5kZXIpXG5cdFx0XHRcdHRoaXMucmVuZGVyKC10aGlzLl9kZWxheSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC5fZW5hYmxlZCA9IGZ1bmN0aW9uKGVuYWJsZWQsIGlnbm9yZVRpbWVsaW5lKSB7XG5cdFx0XHRpZiAoIV90aWNrZXJBY3RpdmUpIHtcblx0XHRcdFx0X3RpY2tlci53YWtlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZW5hYmxlZCAmJiB0aGlzLl9nYykge1xuXHRcdFx0XHR2YXIgdGFyZ2V0cyA9IHRoaXMuX3RhcmdldHMsXG5cdFx0XHRcdFx0aTtcblx0XHRcdFx0aWYgKHRhcmdldHMpIHtcblx0XHRcdFx0XHRpID0gdGFyZ2V0cy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9zaWJsaW5nc1tpXSA9IF9yZWdpc3Rlcih0YXJnZXRzW2ldLCB0aGlzLCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fc2libGluZ3MgPSBfcmVnaXN0ZXIodGhpcy50YXJnZXQsIHRoaXMsIHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRBbmltYXRpb24ucHJvdG90eXBlLl9lbmFibGVkLmNhbGwodGhpcywgZW5hYmxlZCwgaWdub3JlVGltZWxpbmUpO1xuXHRcdFx0aWYgKHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQpIGlmICh0aGlzLl9maXJzdFBUKSB7XG5cdFx0XHRcdHJldHVybiBUd2VlbkxpdGUuX29uUGx1Z2luRXZlbnQoKGVuYWJsZWQgPyBcIl9vbkVuYWJsZVwiIDogXCJfb25EaXNhYmxlXCIpLCB0aGlzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cbi8vLS0tLVR3ZWVuTGl0ZSBzdGF0aWMgbWV0aG9kcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0VHdlZW5MaXRlLnRvID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycykge1xuXHRcdFx0cmV0dXJuIG5ldyBUd2VlbkxpdGUodGFyZ2V0LCBkdXJhdGlvbiwgdmFycyk7XG5cdFx0fTtcblxuXHRcdFR3ZWVuTGl0ZS5mcm9tID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycykge1xuXHRcdFx0dmFycy5ydW5CYWNrd2FyZHMgPSB0cnVlO1xuXHRcdFx0dmFycy5pbW1lZGlhdGVSZW5kZXIgPSAodmFycy5pbW1lZGlhdGVSZW5kZXIgIT0gZmFsc2UpO1xuXHRcdFx0cmV0dXJuIG5ldyBUd2VlbkxpdGUodGFyZ2V0LCBkdXJhdGlvbiwgdmFycyk7XG5cdFx0fTtcblxuXHRcdFR3ZWVuTGl0ZS5mcm9tVG8gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCBmcm9tVmFycywgdG9WYXJzKSB7XG5cdFx0XHR0b1ZhcnMuc3RhcnRBdCA9IGZyb21WYXJzO1xuXHRcdFx0dG9WYXJzLmltbWVkaWF0ZVJlbmRlciA9ICh0b1ZhcnMuaW1tZWRpYXRlUmVuZGVyICE9IGZhbHNlICYmIGZyb21WYXJzLmltbWVkaWF0ZVJlbmRlciAhPSBmYWxzZSk7XG5cdFx0XHRyZXR1cm4gbmV3IFR3ZWVuTGl0ZSh0YXJnZXQsIGR1cmF0aW9uLCB0b1ZhcnMpO1xuXHRcdH07XG5cblx0XHRUd2VlbkxpdGUuZGVsYXllZENhbGwgPSBmdW5jdGlvbihkZWxheSwgY2FsbGJhY2ssIHBhcmFtcywgc2NvcGUsIHVzZUZyYW1lcykge1xuXHRcdFx0cmV0dXJuIG5ldyBUd2VlbkxpdGUoY2FsbGJhY2ssIDAsIHtkZWxheTpkZWxheSwgb25Db21wbGV0ZTpjYWxsYmFjaywgb25Db21wbGV0ZVBhcmFtczpwYXJhbXMsIGNhbGxiYWNrU2NvcGU6c2NvcGUsIG9uUmV2ZXJzZUNvbXBsZXRlOmNhbGxiYWNrLCBvblJldmVyc2VDb21wbGV0ZVBhcmFtczpwYXJhbXMsIGltbWVkaWF0ZVJlbmRlcjpmYWxzZSwgbGF6eTpmYWxzZSwgdXNlRnJhbWVzOnVzZUZyYW1lcywgb3ZlcndyaXRlOjB9KTtcblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLnNldCA9IGZ1bmN0aW9uKHRhcmdldCwgdmFycykge1xuXHRcdFx0cmV0dXJuIG5ldyBUd2VlbkxpdGUodGFyZ2V0LCAwLCB2YXJzKTtcblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLmdldFR3ZWVuc09mID0gZnVuY3Rpb24odGFyZ2V0LCBvbmx5QWN0aXZlKSB7XG5cdFx0XHRpZiAodGFyZ2V0ID09IG51bGwpIHsgcmV0dXJuIFtdOyB9XG5cdFx0XHR0YXJnZXQgPSAodHlwZW9mKHRhcmdldCkgIT09IFwic3RyaW5nXCIpID8gdGFyZ2V0IDogVHdlZW5MaXRlLnNlbGVjdG9yKHRhcmdldCkgfHwgdGFyZ2V0O1xuXHRcdFx0dmFyIGksIGEsIGosIHQ7XG5cdFx0XHRpZiAoKF9pc0FycmF5KHRhcmdldCkgfHwgX2lzU2VsZWN0b3IodGFyZ2V0KSkgJiYgdHlwZW9mKHRhcmdldFswXSkgIT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0aSA9IHRhcmdldC5sZW5ndGg7XG5cdFx0XHRcdGEgPSBbXTtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0YSA9IGEuY29uY2F0KFR3ZWVuTGl0ZS5nZXRUd2VlbnNPZih0YXJnZXRbaV0sIG9ubHlBY3RpdmUpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdC8vbm93IGdldCByaWQgb2YgYW55IGR1cGxpY2F0ZXMgKHR3ZWVucyBvZiBhcnJheXMgb2Ygb2JqZWN0cyBjb3VsZCBjYXVzZSBkdXBsaWNhdGVzKVxuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHR0ID0gYVtpXTtcblx0XHRcdFx0XHRqID0gaTtcblx0XHRcdFx0XHR3aGlsZSAoLS1qID4gLTEpIHtcblx0XHRcdFx0XHRcdGlmICh0ID09PSBhW2pdKSB7XG5cdFx0XHRcdFx0XHRcdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YSA9IF9yZWdpc3Rlcih0YXJnZXQpLmNvbmNhdCgpO1xuXHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGlmIChhW2ldLl9nYyB8fCAob25seUFjdGl2ZSAmJiAhYVtpXS5pc0FjdGl2ZSgpKSkge1xuXHRcdFx0XHRcdFx0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYTtcblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLmtpbGxUd2VlbnNPZiA9IFR3ZWVuTGl0ZS5raWxsRGVsYXllZENhbGxzVG8gPSBmdW5jdGlvbih0YXJnZXQsIG9ubHlBY3RpdmUsIHZhcnMpIHtcblx0XHRcdGlmICh0eXBlb2Yob25seUFjdGl2ZSkgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0dmFycyA9IG9ubHlBY3RpdmU7IC8vZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IChiZWZvcmUgXCJvbmx5QWN0aXZlXCIgcGFyYW1ldGVyIHdhcyBpbnNlcnRlZClcblx0XHRcdFx0b25seUFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGEgPSBUd2VlbkxpdGUuZ2V0VHdlZW5zT2YodGFyZ2V0LCBvbmx5QWN0aXZlKSxcblx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGFbaV0uX2tpbGwodmFycywgdGFyZ2V0KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFR3ZWVuUGx1Z2luICAgKGNvdWxkIGVhc2lseSBiZSBzcGxpdCBvdXQgYXMgYSBzZXBhcmF0ZSBmaWxlL2NsYXNzLCBidXQgaW5jbHVkZWQgZm9yIGVhc2Ugb2YgdXNlIChzbyB0aGF0IHBlb3BsZSBkb24ndCBuZWVkIHRvIGluY2x1ZGUgYW5vdGhlciBzY3JpcHQgY2FsbCBiZWZvcmUgbG9hZGluZyBwbHVnaW5zIHdoaWNoIGlzIGVhc3kgdG8gZm9yZ2V0KVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdFx0dmFyIFR3ZWVuUGx1Z2luID0gX2NsYXNzKFwicGx1Z2lucy5Ud2VlblBsdWdpblwiLCBmdW5jdGlvbihwcm9wcywgcHJpb3JpdHkpIHtcblx0XHRcdFx0XHR0aGlzLl9vdmVyd3JpdGVQcm9wcyA9IChwcm9wcyB8fCBcIlwiKS5zcGxpdChcIixcIik7XG5cdFx0XHRcdFx0dGhpcy5fcHJvcE5hbWUgPSB0aGlzLl9vdmVyd3JpdGVQcm9wc1swXTtcblx0XHRcdFx0XHR0aGlzLl9wcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0XHRcdFx0dGhpcy5fc3VwZXIgPSBUd2VlblBsdWdpbi5wcm90b3R5cGU7XG5cdFx0XHRcdH0sIHRydWUpO1xuXG5cdFx0cCA9IFR3ZWVuUGx1Z2luLnByb3RvdHlwZTtcblx0XHRUd2VlblBsdWdpbi52ZXJzaW9uID0gXCIxLjE4LjBcIjtcblx0XHRUd2VlblBsdWdpbi5BUEkgPSAyO1xuXHRcdHAuX2ZpcnN0UFQgPSBudWxsO1xuXHRcdHAuX2FkZFR3ZWVuID0gX2FkZFByb3BUd2Vlbjtcblx0XHRwLnNldFJhdGlvID0gX3NldFJhdGlvO1xuXG5cdFx0cC5fa2lsbCA9IGZ1bmN0aW9uKGxvb2t1cCkge1xuXHRcdFx0dmFyIGEgPSB0aGlzLl9vdmVyd3JpdGVQcm9wcyxcblx0XHRcdFx0cHQgPSB0aGlzLl9maXJzdFBULFxuXHRcdFx0XHRpO1xuXHRcdFx0aWYgKGxvb2t1cFt0aGlzLl9wcm9wTmFtZV0gIT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLl9vdmVyd3JpdGVQcm9wcyA9IFtdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRpZiAobG9va3VwW2FbaV1dICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdGlmIChsb29rdXBbcHQubl0gIT0gbnVsbCkge1xuXHRcdFx0XHRcdGlmIChwdC5fbmV4dCkge1xuXHRcdFx0XHRcdFx0cHQuX25leHQuX3ByZXYgPSBwdC5fcHJldjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHB0Ll9wcmV2KSB7XG5cdFx0XHRcdFx0XHRwdC5fcHJldi5fbmV4dCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHRcdFx0cHQuX3ByZXYgPSBudWxsO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fZmlyc3RQVCA9PT0gcHQpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdC5fbmV4dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cdFx0cC5fcm91bmRQcm9wcyA9IGZ1bmN0aW9uKGxvb2t1cCwgdmFsdWUpIHtcblx0XHRcdHZhciBwdCA9IHRoaXMuX2ZpcnN0UFQ7XG5cdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0aWYgKGxvb2t1cFt0aGlzLl9wcm9wTmFtZV0gfHwgKHB0Lm4gIT0gbnVsbCAmJiBsb29rdXBbIHB0Lm4uc3BsaXQodGhpcy5fcHJvcE5hbWUgKyBcIl9cIikuam9pbihcIlwiKSBdKSkgeyAvL3NvbWUgcHJvcGVydGllcyB0aGF0IGFyZSB2ZXJ5IHBsdWdpbi1zcGVjaWZpYyBhZGQgYSBwcmVmaXggbmFtZWQgYWZ0ZXIgdGhlIF9wcm9wTmFtZSBwbHVzIGFuIHVuZGVyc2NvcmUsIHNvIHdlIG5lZWQgdG8gaWdub3JlIHRoYXQgZXh0cmEgc3R1ZmYgaGVyZS5cblx0XHRcdFx0XHRwdC5yID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLl9vblBsdWdpbkV2ZW50ID0gZnVuY3Rpb24odHlwZSwgdHdlZW4pIHtcblx0XHRcdHZhciBwdCA9IHR3ZWVuLl9maXJzdFBULFxuXHRcdFx0XHRjaGFuZ2VkLCBwdDIsIGZpcnN0LCBsYXN0LCBuZXh0O1xuXHRcdFx0aWYgKHR5cGUgPT09IFwiX29uSW5pdEFsbFByb3BzXCIpIHtcblx0XHRcdFx0Ly9zb3J0cyB0aGUgUHJvcFR3ZWVuIGxpbmtlZCBsaXN0IGluIG9yZGVyIG9mIHByaW9yaXR5IGJlY2F1c2Ugc29tZSBwbHVnaW5zIG5lZWQgdG8gcmVuZGVyIGVhcmxpZXIvbGF0ZXIgdGhhbiBvdGhlcnMsIGxpa2UgTW90aW9uQmx1clBsdWdpbiBhcHBsaWVzIGl0cyBlZmZlY3RzIGFmdGVyIGFsbCB4L3kvYWxwaGEgdHdlZW5zIGhhdmUgcmVuZGVyZWQgb24gZWFjaCBmcmFtZS5cblx0XHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdFx0bmV4dCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHRcdHB0MiA9IGZpcnN0O1xuXHRcdFx0XHRcdHdoaWxlIChwdDIgJiYgcHQyLnByID4gcHQucHIpIHtcblx0XHRcdFx0XHRcdHB0MiA9IHB0Mi5fbmV4dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKChwdC5fcHJldiA9IHB0MiA/IHB0Mi5fcHJldiA6IGxhc3QpKSB7XG5cdFx0XHRcdFx0XHRwdC5fcHJldi5fbmV4dCA9IHB0O1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRmaXJzdCA9IHB0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoKHB0Ll9uZXh0ID0gcHQyKSkge1xuXHRcdFx0XHRcdFx0cHQyLl9wcmV2ID0gcHQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxhc3QgPSBwdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHQgPSBuZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHB0ID0gdHdlZW4uX2ZpcnN0UFQgPSBmaXJzdDtcblx0XHRcdH1cblx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRpZiAocHQucGcpIGlmICh0eXBlb2YocHQudFt0eXBlXSkgPT09IFwiZnVuY3Rpb25cIikgaWYgKHB0LnRbdHlwZV0oKSkge1xuXHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY2hhbmdlZDtcblx0XHR9O1xuXG5cdFx0VHdlZW5QbHVnaW4uYWN0aXZhdGUgPSBmdW5jdGlvbihwbHVnaW5zKSB7XG5cdFx0XHR2YXIgaSA9IHBsdWdpbnMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGlmIChwbHVnaW5zW2ldLkFQSSA9PT0gVHdlZW5QbHVnaW4uQVBJKSB7XG5cdFx0XHRcdFx0X3BsdWdpbnNbKG5ldyBwbHVnaW5zW2ldKCkpLl9wcm9wTmFtZV0gPSBwbHVnaW5zW2ldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9O1xuXG5cdFx0Ly9wcm92aWRlcyBhIG1vcmUgY29uY2lzZSB3YXkgdG8gZGVmaW5lIHBsdWdpbnMgdGhhdCBoYXZlIG5vIGRlcGVuZGVuY2llcyBiZXNpZGVzIFR3ZWVuUGx1Z2luIGFuZCBUd2VlbkxpdGUsIHdyYXBwaW5nIGNvbW1vbiBib2lsZXJwbGF0ZSBzdHVmZiBpbnRvIG9uZSBmdW5jdGlvbiAoYWRkZWQgaW4gMS45LjApLiBZb3UgZG9uJ3QgTkVFRCB0byB1c2UgdGhpcyB0byBkZWZpbmUgYSBwbHVnaW4gLSB0aGUgb2xkIHdheSBzdGlsbCB3b3JrcyBhbmQgY2FuIGJlIHVzZWZ1bCBpbiBjZXJ0YWluIChyYXJlKSBzaXR1YXRpb25zLlxuXHRcdF9nc0RlZmluZS5wbHVnaW4gPSBmdW5jdGlvbihjb25maWcpIHtcblx0XHRcdGlmICghY29uZmlnIHx8ICFjb25maWcucHJvcE5hbWUgfHwgIWNvbmZpZy5pbml0IHx8ICFjb25maWcuQVBJKSB7IHRocm93IFwiaWxsZWdhbCBwbHVnaW4gZGVmaW5pdGlvbi5cIjsgfVxuXHRcdFx0dmFyIHByb3BOYW1lID0gY29uZmlnLnByb3BOYW1lLFxuXHRcdFx0XHRwcmlvcml0eSA9IGNvbmZpZy5wcmlvcml0eSB8fCAwLFxuXHRcdFx0XHRvdmVyd3JpdGVQcm9wcyA9IGNvbmZpZy5vdmVyd3JpdGVQcm9wcyxcblx0XHRcdFx0bWFwID0ge2luaXQ6XCJfb25Jbml0VHdlZW5cIiwgc2V0Olwic2V0UmF0aW9cIiwga2lsbDpcIl9raWxsXCIsIHJvdW5kOlwiX3JvdW5kUHJvcHNcIiwgaW5pdEFsbDpcIl9vbkluaXRBbGxQcm9wc1wifSxcblx0XHRcdFx0UGx1Z2luID0gX2NsYXNzKFwicGx1Z2lucy5cIiArIHByb3BOYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcE5hbWUuc3Vic3RyKDEpICsgXCJQbHVnaW5cIixcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFR3ZWVuUGx1Z2luLmNhbGwodGhpcywgcHJvcE5hbWUsIHByaW9yaXR5KTtcblx0XHRcdFx0XHRcdHRoaXMuX292ZXJ3cml0ZVByb3BzID0gb3ZlcndyaXRlUHJvcHMgfHwgW107XG5cdFx0XHRcdFx0fSwgKGNvbmZpZy5nbG9iYWwgPT09IHRydWUpKSxcblx0XHRcdFx0cCA9IFBsdWdpbi5wcm90b3R5cGUgPSBuZXcgVHdlZW5QbHVnaW4ocHJvcE5hbWUpLFxuXHRcdFx0XHRwcm9wO1xuXHRcdFx0cC5jb25zdHJ1Y3RvciA9IFBsdWdpbjtcblx0XHRcdFBsdWdpbi5BUEkgPSBjb25maWcuQVBJO1xuXHRcdFx0Zm9yIChwcm9wIGluIG1hcCkge1xuXHRcdFx0XHRpZiAodHlwZW9mKGNvbmZpZ1twcm9wXSkgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdHBbbWFwW3Byb3BdXSA9IGNvbmZpZ1twcm9wXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0UGx1Z2luLnZlcnNpb24gPSBjb25maWcudmVyc2lvbjtcblx0XHRcdFR3ZWVuUGx1Z2luLmFjdGl2YXRlKFtQbHVnaW5dKTtcblx0XHRcdHJldHVybiBQbHVnaW47XG5cdFx0fTtcblxuXG5cdFx0Ly9ub3cgcnVuIHRocm91Z2ggYWxsIHRoZSBkZXBlbmRlbmNpZXMgZGlzY292ZXJlZCBhbmQgaWYgYW55IGFyZSBtaXNzaW5nLCBsb2cgdGhhdCB0byB0aGUgY29uc29sZSBhcyBhIHdhcm5pbmcuIFRoaXMgaXMgd2h5IGl0J3MgYmVzdCB0byBoYXZlIFR3ZWVuTGl0ZSBsb2FkIGxhc3QgLSBpdCBjYW4gY2hlY2sgYWxsIHRoZSBkZXBlbmRlbmNpZXMgZm9yIHlvdS5cblx0XHRhID0gd2luZG93Ll9nc1F1ZXVlO1xuXHRcdGlmIChhKSB7XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRhW2ldKCk7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHAgaW4gX2RlZkxvb2t1cCkge1xuXHRcdFx0XHRpZiAoIV9kZWZMb29rdXBbcF0uZnVuYykge1xuXHRcdFx0XHRcdHdpbmRvdy5jb25zb2xlLmxvZyhcIkdTQVAgZW5jb3VudGVyZWQgbWlzc2luZyBkZXBlbmRlbmN5OiBjb20uZ3JlZW5zb2NrLlwiICsgcCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRfdGlja2VyQWN0aXZlID0gZmFsc2U7IC8vZW5zdXJlcyB0aGF0IHRoZSBmaXJzdCBvZmZpY2lhbCBhbmltYXRpb24gZm9yY2VzIGEgdGlja2VyLnRpY2soKSB0byB1cGRhdGUgdGhlIHRpbWUgd2hlbiBpdCBpcyBpbnN0YW50aWF0ZWRcblxufSkoKHR5cGVvZihtb2R1bGUpICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzICYmIHR5cGVvZihnbG9iYWwpICE9PSBcInVuZGVmaW5lZFwiKSA/IGdsb2JhbCA6IHRoaXMgfHwgd2luZG93LCBcIlR3ZWVuTGl0ZVwiKTsiLCIvKiFcbiAqIFZFUlNJT046IDEuMTUuM1xuICogREFURTogMjAxNS0xMi0yMlxuICogVVBEQVRFUyBBTkQgRE9DUyBBVDogaHR0cDovL2dyZWVuc29jay5jb21cbiAqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxNiwgR3JlZW5Tb2NrLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVGhpcyB3b3JrIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIGF0IGh0dHA6Ly9ncmVlbnNvY2suY29tL3N0YW5kYXJkLWxpY2Vuc2Ugb3IgZm9yXG4gKiBDbHViIEdyZWVuU29jayBtZW1iZXJzLCB0aGUgc29mdHdhcmUgYWdyZWVtZW50IHRoYXQgd2FzIGlzc3VlZCB3aXRoIHlvdXIgbWVtYmVyc2hpcC5cbiAqIFxuICogQGF1dGhvcjogSmFjayBEb3lsZSwgamFja0BncmVlbnNvY2suY29tXG4gKiovXG52YXIgX2dzU2NvcGUgPSAodHlwZW9mKG1vZHVsZSkgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mKGdsb2JhbCkgIT09IFwidW5kZWZpbmVkXCIpID8gZ2xvYmFsIDogdGhpcyB8fCB3aW5kb3c7IC8vaGVscHMgZW5zdXJlIGNvbXBhdGliaWxpdHkgd2l0aCBBTUQvUmVxdWlyZUpTIGFuZCBDb21tb25KUy9Ob2RlXG4oX2dzU2NvcGUuX2dzUXVldWUgfHwgKF9nc1Njb3BlLl9nc1F1ZXVlID0gW10pKS5wdXNoKCBmdW5jdGlvbigpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRfZ3NTY29wZS5fZ3NEZWZpbmUoXCJlYXNpbmcuQmFja1wiLCBbXCJlYXNpbmcuRWFzZVwiXSwgZnVuY3Rpb24oRWFzZSkge1xuXHRcdFxuXHRcdHZhciB3ID0gKF9nc1Njb3BlLkdyZWVuU29ja0dsb2JhbHMgfHwgX2dzU2NvcGUpLFxuXHRcdFx0Z3MgPSB3LmNvbS5ncmVlbnNvY2ssXG5cdFx0XHRfMlBJID0gTWF0aC5QSSAqIDIsXG5cdFx0XHRfSEFMRl9QSSA9IE1hdGguUEkgLyAyLFxuXHRcdFx0X2NsYXNzID0gZ3MuX2NsYXNzLFxuXHRcdFx0X2NyZWF0ZSA9IGZ1bmN0aW9uKG4sIGYpIHtcblx0XHRcdFx0dmFyIEMgPSBfY2xhc3MoXCJlYXNpbmcuXCIgKyBuLCBmdW5jdGlvbigpe30sIHRydWUpLFxuXHRcdFx0XHRcdHAgPSBDLnByb3RvdHlwZSA9IG5ldyBFYXNlKCk7XG5cdFx0XHRcdHAuY29uc3RydWN0b3IgPSBDO1xuXHRcdFx0XHRwLmdldFJhdGlvID0gZjtcblx0XHRcdFx0cmV0dXJuIEM7XG5cdFx0XHR9LFxuXHRcdFx0X2Vhc2VSZWcgPSBFYXNlLnJlZ2lzdGVyIHx8IGZ1bmN0aW9uKCl7fSwgLy9wdXQgYW4gZW1wdHkgZnVuY3Rpb24gaW4gcGxhY2UganVzdCBhcyBhIHNhZmV0eSBtZWFzdXJlIGluIGNhc2Ugc29tZW9uZSBsb2FkcyBhbiBPTEQgdmVyc2lvbiBvZiBUd2VlbkxpdGUuanMgd2hlcmUgRWFzZS5yZWdpc3RlciBkb2Vzbid0IGV4aXN0LlxuXHRcdFx0X3dyYXAgPSBmdW5jdGlvbihuYW1lLCBFYXNlT3V0LCBFYXNlSW4sIEVhc2VJbk91dCwgYWxpYXNlcykge1xuXHRcdFx0XHR2YXIgQyA9IF9jbGFzcyhcImVhc2luZy5cIituYW1lLCB7XG5cdFx0XHRcdFx0ZWFzZU91dDpuZXcgRWFzZU91dCgpLFxuXHRcdFx0XHRcdGVhc2VJbjpuZXcgRWFzZUluKCksXG5cdFx0XHRcdFx0ZWFzZUluT3V0Om5ldyBFYXNlSW5PdXQoKVxuXHRcdFx0XHR9LCB0cnVlKTtcblx0XHRcdFx0X2Vhc2VSZWcoQywgbmFtZSk7XG5cdFx0XHRcdHJldHVybiBDO1xuXHRcdFx0fSxcblx0XHRcdEVhc2VQb2ludCA9IGZ1bmN0aW9uKHRpbWUsIHZhbHVlLCBuZXh0KSB7XG5cdFx0XHRcdHRoaXMudCA9IHRpbWU7XG5cdFx0XHRcdHRoaXMudiA9IHZhbHVlO1xuXHRcdFx0XHRpZiAobmV4dCkge1xuXHRcdFx0XHRcdHRoaXMubmV4dCA9IG5leHQ7XG5cdFx0XHRcdFx0bmV4dC5wcmV2ID0gdGhpcztcblx0XHRcdFx0XHR0aGlzLmMgPSBuZXh0LnYgLSB2YWx1ZTtcblx0XHRcdFx0XHR0aGlzLmdhcCA9IG5leHQudCAtIHRpbWU7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8vQmFja1xuXHRcdFx0X2NyZWF0ZUJhY2sgPSBmdW5jdGlvbihuLCBmKSB7XG5cdFx0XHRcdHZhciBDID0gX2NsYXNzKFwiZWFzaW5nLlwiICsgbiwgZnVuY3Rpb24ob3ZlcnNob290KSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9wMSA9IChvdmVyc2hvb3QgfHwgb3ZlcnNob290ID09PSAwKSA/IG92ZXJzaG9vdCA6IDEuNzAxNTg7XG5cdFx0XHRcdFx0XHR0aGlzLl9wMiA9IHRoaXMuX3AxICogMS41MjU7XG5cdFx0XHRcdFx0fSwgdHJ1ZSksIFxuXHRcdFx0XHRcdHAgPSBDLnByb3RvdHlwZSA9IG5ldyBFYXNlKCk7XG5cdFx0XHRcdHAuY29uc3RydWN0b3IgPSBDO1xuXHRcdFx0XHRwLmdldFJhdGlvID0gZjtcblx0XHRcdFx0cC5jb25maWcgPSBmdW5jdGlvbihvdmVyc2hvb3QpIHtcblx0XHRcdFx0XHRyZXR1cm4gbmV3IEMob3ZlcnNob290KTtcblx0XHRcdFx0fTtcblx0XHRcdFx0cmV0dXJuIEM7XG5cdFx0XHR9LFxuXG5cdFx0XHRCYWNrID0gX3dyYXAoXCJCYWNrXCIsXG5cdFx0XHRcdF9jcmVhdGVCYWNrKFwiQmFja091dFwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdFx0cmV0dXJuICgocCA9IHAgLSAxKSAqIHAgKiAoKHRoaXMuX3AxICsgMSkgKiBwICsgdGhpcy5fcDEpICsgMSk7XG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRfY3JlYXRlQmFjayhcIkJhY2tJblwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHAgKiBwICogKCh0aGlzLl9wMSArIDEpICogcCAtIHRoaXMuX3AxKTtcblx0XHRcdFx0fSksXG5cdFx0XHRcdF9jcmVhdGVCYWNrKFwiQmFja0luT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0XHRyZXR1cm4gKChwICo9IDIpIDwgMSkgPyAwLjUgKiBwICogcCAqICgodGhpcy5fcDIgKyAxKSAqIHAgLSB0aGlzLl9wMikgOiAwLjUgKiAoKHAgLT0gMikgKiBwICogKCh0aGlzLl9wMiArIDEpICogcCArIHRoaXMuX3AyKSArIDIpO1xuXHRcdFx0XHR9KVxuXHRcdFx0KSxcblxuXG5cdFx0XHQvL1Nsb3dNb1xuXHRcdFx0U2xvd01vID0gX2NsYXNzKFwiZWFzaW5nLlNsb3dNb1wiLCBmdW5jdGlvbihsaW5lYXJSYXRpbywgcG93ZXIsIHlveW9Nb2RlKSB7XG5cdFx0XHRcdHBvd2VyID0gKHBvd2VyIHx8IHBvd2VyID09PSAwKSA/IHBvd2VyIDogMC43O1xuXHRcdFx0XHRpZiAobGluZWFyUmF0aW8gPT0gbnVsbCkge1xuXHRcdFx0XHRcdGxpbmVhclJhdGlvID0gMC43O1xuXHRcdFx0XHR9IGVsc2UgaWYgKGxpbmVhclJhdGlvID4gMSkge1xuXHRcdFx0XHRcdGxpbmVhclJhdGlvID0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9wID0gKGxpbmVhclJhdGlvICE9PSAxKSA/IHBvd2VyIDogMDtcblx0XHRcdFx0dGhpcy5fcDEgPSAoMSAtIGxpbmVhclJhdGlvKSAvIDI7XG5cdFx0XHRcdHRoaXMuX3AyID0gbGluZWFyUmF0aW87XG5cdFx0XHRcdHRoaXMuX3AzID0gdGhpcy5fcDEgKyB0aGlzLl9wMjtcblx0XHRcdFx0dGhpcy5fY2FsY0VuZCA9ICh5b3lvTW9kZSA9PT0gdHJ1ZSk7XG5cdFx0XHR9LCB0cnVlKSxcblx0XHRcdHAgPSBTbG93TW8ucHJvdG90eXBlID0gbmV3IEVhc2UoKSxcblx0XHRcdFN0ZXBwZWRFYXNlLCBSb3VnaEVhc2UsIF9jcmVhdGVFbGFzdGljO1xuXHRcdFx0XG5cdFx0cC5jb25zdHJ1Y3RvciA9IFNsb3dNbztcblx0XHRwLmdldFJhdGlvID0gZnVuY3Rpb24ocCkge1xuXHRcdFx0dmFyIHIgPSBwICsgKDAuNSAtIHApICogdGhpcy5fcDtcblx0XHRcdGlmIChwIDwgdGhpcy5fcDEpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2NhbGNFbmQgPyAxIC0gKChwID0gMSAtIChwIC8gdGhpcy5fcDEpKSAqIHApIDogciAtICgocCA9IDEgLSAocCAvIHRoaXMuX3AxKSkgKiBwICogcCAqIHAgKiByKTtcblx0XHRcdH0gZWxzZSBpZiAocCA+IHRoaXMuX3AzKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9jYWxjRW5kID8gMSAtIChwID0gKHAgLSB0aGlzLl9wMykgLyB0aGlzLl9wMSkgKiBwIDogciArICgocCAtIHIpICogKHAgPSAocCAtIHRoaXMuX3AzKSAvIHRoaXMuX3AxKSAqIHAgKiBwICogcCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2FsY0VuZCA/IDEgOiByO1xuXHRcdH07XG5cdFx0U2xvd01vLmVhc2UgPSBuZXcgU2xvd01vKDAuNywgMC43KTtcblx0XHRcblx0XHRwLmNvbmZpZyA9IFNsb3dNby5jb25maWcgPSBmdW5jdGlvbihsaW5lYXJSYXRpbywgcG93ZXIsIHlveW9Nb2RlKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFNsb3dNbyhsaW5lYXJSYXRpbywgcG93ZXIsIHlveW9Nb2RlKTtcblx0XHR9O1xuXG5cblx0XHQvL1N0ZXBwZWRFYXNlXG5cdFx0U3RlcHBlZEVhc2UgPSBfY2xhc3MoXCJlYXNpbmcuU3RlcHBlZEVhc2VcIiwgZnVuY3Rpb24oc3RlcHMpIHtcblx0XHRcdFx0c3RlcHMgPSBzdGVwcyB8fCAxO1xuXHRcdFx0XHR0aGlzLl9wMSA9IDEgLyBzdGVwcztcblx0XHRcdFx0dGhpcy5fcDIgPSBzdGVwcyArIDE7XG5cdFx0XHR9LCB0cnVlKTtcblx0XHRwID0gU3RlcHBlZEVhc2UucHJvdG90eXBlID0gbmV3IEVhc2UoKTtcdFxuXHRcdHAuY29uc3RydWN0b3IgPSBTdGVwcGVkRWFzZTtcblx0XHRwLmdldFJhdGlvID0gZnVuY3Rpb24ocCkge1xuXHRcdFx0aWYgKHAgPCAwKSB7XG5cdFx0XHRcdHAgPSAwO1xuXHRcdFx0fSBlbHNlIGlmIChwID49IDEpIHtcblx0XHRcdFx0cCA9IDAuOTk5OTk5OTk5O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICgodGhpcy5fcDIgKiBwKSA+PiAwKSAqIHRoaXMuX3AxO1xuXHRcdH07XG5cdFx0cC5jb25maWcgPSBTdGVwcGVkRWFzZS5jb25maWcgPSBmdW5jdGlvbihzdGVwcykge1xuXHRcdFx0cmV0dXJuIG5ldyBTdGVwcGVkRWFzZShzdGVwcyk7XG5cdFx0fTtcblxuXG5cdFx0Ly9Sb3VnaEVhc2Vcblx0XHRSb3VnaEVhc2UgPSBfY2xhc3MoXCJlYXNpbmcuUm91Z2hFYXNlXCIsIGZ1bmN0aW9uKHZhcnMpIHtcblx0XHRcdHZhcnMgPSB2YXJzIHx8IHt9O1xuXHRcdFx0dmFyIHRhcGVyID0gdmFycy50YXBlciB8fCBcIm5vbmVcIixcblx0XHRcdFx0YSA9IFtdLFxuXHRcdFx0XHRjbnQgPSAwLFxuXHRcdFx0XHRwb2ludHMgPSAodmFycy5wb2ludHMgfHwgMjApIHwgMCxcblx0XHRcdFx0aSA9IHBvaW50cyxcblx0XHRcdFx0cmFuZG9taXplID0gKHZhcnMucmFuZG9taXplICE9PSBmYWxzZSksXG5cdFx0XHRcdGNsYW1wID0gKHZhcnMuY2xhbXAgPT09IHRydWUpLFxuXHRcdFx0XHR0ZW1wbGF0ZSA9ICh2YXJzLnRlbXBsYXRlIGluc3RhbmNlb2YgRWFzZSkgPyB2YXJzLnRlbXBsYXRlIDogbnVsbCxcblx0XHRcdFx0c3RyZW5ndGggPSAodHlwZW9mKHZhcnMuc3RyZW5ndGgpID09PSBcIm51bWJlclwiKSA/IHZhcnMuc3RyZW5ndGggKiAwLjQgOiAwLjQsXG5cdFx0XHRcdHgsIHksIGJ1bXAsIGludlgsIG9iaiwgcG50O1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdHggPSByYW5kb21pemUgPyBNYXRoLnJhbmRvbSgpIDogKDEgLyBwb2ludHMpICogaTtcblx0XHRcdFx0eSA9IHRlbXBsYXRlID8gdGVtcGxhdGUuZ2V0UmF0aW8oeCkgOiB4O1xuXHRcdFx0XHRpZiAodGFwZXIgPT09IFwibm9uZVwiKSB7XG5cdFx0XHRcdFx0YnVtcCA9IHN0cmVuZ3RoO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRhcGVyID09PSBcIm91dFwiKSB7XG5cdFx0XHRcdFx0aW52WCA9IDEgLSB4O1xuXHRcdFx0XHRcdGJ1bXAgPSBpbnZYICogaW52WCAqIHN0cmVuZ3RoO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRhcGVyID09PSBcImluXCIpIHtcblx0XHRcdFx0XHRidW1wID0geCAqIHggKiBzdHJlbmd0aDtcblx0XHRcdFx0fSBlbHNlIGlmICh4IDwgMC41KSB7ICAvL1wiYm90aFwiIChzdGFydClcblx0XHRcdFx0XHRpbnZYID0geCAqIDI7XG5cdFx0XHRcdFx0YnVtcCA9IGludlggKiBpbnZYICogMC41ICogc3RyZW5ndGg7XG5cdFx0XHRcdH0gZWxzZSB7XHRcdFx0XHQvL1wiYm90aFwiIChlbmQpXG5cdFx0XHRcdFx0aW52WCA9ICgxIC0geCkgKiAyO1xuXHRcdFx0XHRcdGJ1bXAgPSBpbnZYICogaW52WCAqIDAuNSAqIHN0cmVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChyYW5kb21pemUpIHtcblx0XHRcdFx0XHR5ICs9IChNYXRoLnJhbmRvbSgpICogYnVtcCkgLSAoYnVtcCAqIDAuNSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoaSAlIDIpIHtcblx0XHRcdFx0XHR5ICs9IGJ1bXAgKiAwLjU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0eSAtPSBidW1wICogMC41O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjbGFtcCkge1xuXHRcdFx0XHRcdGlmICh5ID4gMSkge1xuXHRcdFx0XHRcdFx0eSA9IDE7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh5IDwgMCkge1xuXHRcdFx0XHRcdFx0eSA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGFbY250KytdID0ge3g6eCwgeTp5fTtcblx0XHRcdH1cblx0XHRcdGEuc29ydChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHRcdHJldHVybiBhLnggLSBiLng7XG5cdFx0XHR9KTtcblxuXHRcdFx0cG50ID0gbmV3IEVhc2VQb2ludCgxLCAxLCBudWxsKTtcblx0XHRcdGkgPSBwb2ludHM7XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0b2JqID0gYVtpXTtcblx0XHRcdFx0cG50ID0gbmV3IEVhc2VQb2ludChvYmoueCwgb2JqLnksIHBudCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX3ByZXYgPSBuZXcgRWFzZVBvaW50KDAsIDAsIChwbnQudCAhPT0gMCkgPyBwbnQgOiBwbnQubmV4dCk7XG5cdFx0fSwgdHJ1ZSk7XG5cdFx0cCA9IFJvdWdoRWFzZS5wcm90b3R5cGUgPSBuZXcgRWFzZSgpO1xuXHRcdHAuY29uc3RydWN0b3IgPSBSb3VnaEVhc2U7XG5cdFx0cC5nZXRSYXRpbyA9IGZ1bmN0aW9uKHApIHtcblx0XHRcdHZhciBwbnQgPSB0aGlzLl9wcmV2O1xuXHRcdFx0aWYgKHAgPiBwbnQudCkge1xuXHRcdFx0XHR3aGlsZSAocG50Lm5leHQgJiYgcCA+PSBwbnQudCkge1xuXHRcdFx0XHRcdHBudCA9IHBudC5uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHBudCA9IHBudC5wcmV2O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0d2hpbGUgKHBudC5wcmV2ICYmIHAgPD0gcG50LnQpIHtcblx0XHRcdFx0XHRwbnQgPSBwbnQucHJldjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fcHJldiA9IHBudDtcblx0XHRcdHJldHVybiAocG50LnYgKyAoKHAgLSBwbnQudCkgLyBwbnQuZ2FwKSAqIHBudC5jKTtcblx0XHR9O1xuXHRcdHAuY29uZmlnID0gZnVuY3Rpb24odmFycykge1xuXHRcdFx0cmV0dXJuIG5ldyBSb3VnaEVhc2UodmFycyk7XG5cdFx0fTtcblx0XHRSb3VnaEVhc2UuZWFzZSA9IG5ldyBSb3VnaEVhc2UoKTtcblxuXG5cdFx0Ly9Cb3VuY2Vcblx0XHRfd3JhcChcIkJvdW5jZVwiLFxuXHRcdFx0X2NyZWF0ZShcIkJvdW5jZU91dFwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdGlmIChwIDwgMSAvIDIuNzUpIHtcblx0XHRcdFx0XHRyZXR1cm4gNy41NjI1ICogcCAqIHA7XG5cdFx0XHRcdH0gZWxzZSBpZiAocCA8IDIgLyAyLjc1KSB7XG5cdFx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIChwIC09IDEuNSAvIDIuNzUpICogcCArIDAuNzU7XG5cdFx0XHRcdH0gZWxzZSBpZiAocCA8IDIuNSAvIDIuNzUpIHtcblx0XHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKHAgLT0gMi4yNSAvIDIuNzUpICogcCArIDAuOTM3NTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKHAgLT0gMi42MjUgLyAyLjc1KSAqIHAgKyAwLjk4NDM3NTtcblx0XHRcdH0pLFxuXHRcdFx0X2NyZWF0ZShcIkJvdW5jZUluXCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0aWYgKChwID0gMSAtIHApIDwgMSAvIDIuNzUpIHtcblx0XHRcdFx0XHRyZXR1cm4gMSAtICg3LjU2MjUgKiBwICogcCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAocCA8IDIgLyAyLjc1KSB7XG5cdFx0XHRcdFx0cmV0dXJuIDEgLSAoNy41NjI1ICogKHAgLT0gMS41IC8gMi43NSkgKiBwICsgMC43NSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAocCA8IDIuNSAvIDIuNzUpIHtcblx0XHRcdFx0XHRyZXR1cm4gMSAtICg3LjU2MjUgKiAocCAtPSAyLjI1IC8gMi43NSkgKiBwICsgMC45Mzc1KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gMSAtICg3LjU2MjUgKiAocCAtPSAyLjYyNSAvIDIuNzUpICogcCArIDAuOTg0Mzc1KTtcblx0XHRcdH0pLFxuXHRcdFx0X2NyZWF0ZShcIkJvdW5jZUluT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0dmFyIGludmVydCA9IChwIDwgMC41KTtcblx0XHRcdFx0aWYgKGludmVydCkge1xuXHRcdFx0XHRcdHAgPSAxIC0gKHAgKiAyKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwID0gKHAgKiAyKSAtIDE7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHAgPCAxIC8gMi43NSkge1xuXHRcdFx0XHRcdHAgPSA3LjU2MjUgKiBwICogcDtcblx0XHRcdFx0fSBlbHNlIGlmIChwIDwgMiAvIDIuNzUpIHtcblx0XHRcdFx0XHRwID0gNy41NjI1ICogKHAgLT0gMS41IC8gMi43NSkgKiBwICsgMC43NTtcblx0XHRcdFx0fSBlbHNlIGlmIChwIDwgMi41IC8gMi43NSkge1xuXHRcdFx0XHRcdHAgPSA3LjU2MjUgKiAocCAtPSAyLjI1IC8gMi43NSkgKiBwICsgMC45Mzc1O1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHAgPSA3LjU2MjUgKiAocCAtPSAyLjYyNSAvIDIuNzUpICogcCArIDAuOTg0Mzc1O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBpbnZlcnQgPyAoMSAtIHApICogMC41IDogcCAqIDAuNSArIDAuNTtcblx0XHRcdH0pXG5cdFx0KTtcblxuXG5cdFx0Ly9DSVJDXG5cdFx0X3dyYXAoXCJDaXJjXCIsXG5cdFx0XHRfY3JlYXRlKFwiQ2lyY091dFwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHJldHVybiBNYXRoLnNxcnQoMSAtIChwID0gcCAtIDEpICogcCk7XG5cdFx0XHR9KSxcblx0XHRcdF9jcmVhdGUoXCJDaXJjSW5cIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gLShNYXRoLnNxcnQoMSAtIChwICogcCkpIC0gMSk7XG5cdFx0XHR9KSxcblx0XHRcdF9jcmVhdGUoXCJDaXJjSW5PdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gKChwKj0yKSA8IDEpID8gLTAuNSAqIChNYXRoLnNxcnQoMSAtIHAgKiBwKSAtIDEpIDogMC41ICogKE1hdGguc3FydCgxIC0gKHAgLT0gMikgKiBwKSArIDEpO1xuXHRcdFx0fSlcblx0XHQpO1xuXG5cblx0XHQvL0VsYXN0aWNcblx0XHRfY3JlYXRlRWxhc3RpYyA9IGZ1bmN0aW9uKG4sIGYsIGRlZikge1xuXHRcdFx0dmFyIEMgPSBfY2xhc3MoXCJlYXNpbmcuXCIgKyBuLCBmdW5jdGlvbihhbXBsaXR1ZGUsIHBlcmlvZCkge1xuXHRcdFx0XHRcdHRoaXMuX3AxID0gKGFtcGxpdHVkZSA+PSAxKSA/IGFtcGxpdHVkZSA6IDE7IC8vbm90ZTogaWYgYW1wbGl0dWRlIGlzIDwgMSwgd2Ugc2ltcGx5IGFkanVzdCB0aGUgcGVyaW9kIGZvciBhIG1vcmUgbmF0dXJhbCBmZWVsLiBPdGhlcndpc2UgdGhlIG1hdGggZG9lc24ndCB3b3JrIHJpZ2h0IGFuZCB0aGUgY3VydmUgc3RhcnRzIGF0IDEuXG5cdFx0XHRcdFx0dGhpcy5fcDIgPSAocGVyaW9kIHx8IGRlZikgLyAoYW1wbGl0dWRlIDwgMSA/IGFtcGxpdHVkZSA6IDEpO1xuXHRcdFx0XHRcdHRoaXMuX3AzID0gdGhpcy5fcDIgLyBfMlBJICogKE1hdGguYXNpbigxIC8gdGhpcy5fcDEpIHx8IDApO1xuXHRcdFx0XHRcdHRoaXMuX3AyID0gXzJQSSAvIHRoaXMuX3AyOyAvL3ByZWNhbGN1bGF0ZSB0byBvcHRpbWl6ZVxuXHRcdFx0XHR9LCB0cnVlKSxcblx0XHRcdFx0cCA9IEMucHJvdG90eXBlID0gbmV3IEVhc2UoKTtcblx0XHRcdHAuY29uc3RydWN0b3IgPSBDO1xuXHRcdFx0cC5nZXRSYXRpbyA9IGY7XG5cdFx0XHRwLmNvbmZpZyA9IGZ1bmN0aW9uKGFtcGxpdHVkZSwgcGVyaW9kKSB7XG5cdFx0XHRcdHJldHVybiBuZXcgQyhhbXBsaXR1ZGUsIHBlcmlvZCk7XG5cdFx0XHR9O1xuXHRcdFx0cmV0dXJuIEM7XG5cdFx0fTtcblx0XHRfd3JhcChcIkVsYXN0aWNcIixcblx0XHRcdF9jcmVhdGVFbGFzdGljKFwiRWxhc3RpY091dFwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9wMSAqIE1hdGgucG93KDIsIC0xMCAqIHApICogTWF0aC5zaW4oIChwIC0gdGhpcy5fcDMpICogdGhpcy5fcDIgKSArIDE7XG5cdFx0XHR9LCAwLjMpLFxuXHRcdFx0X2NyZWF0ZUVsYXN0aWMoXCJFbGFzdGljSW5cIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gLSh0aGlzLl9wMSAqIE1hdGgucG93KDIsIDEwICogKHAgLT0gMSkpICogTWF0aC5zaW4oIChwIC0gdGhpcy5fcDMpICogdGhpcy5fcDIgKSk7XG5cdFx0XHR9LCAwLjMpLFxuXHRcdFx0X2NyZWF0ZUVsYXN0aWMoXCJFbGFzdGljSW5PdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gKChwICo9IDIpIDwgMSkgPyAtMC41ICogKHRoaXMuX3AxICogTWF0aC5wb3coMiwgMTAgKiAocCAtPSAxKSkgKiBNYXRoLnNpbiggKHAgLSB0aGlzLl9wMykgKiB0aGlzLl9wMikpIDogdGhpcy5fcDEgKiBNYXRoLnBvdygyLCAtMTAgKihwIC09IDEpKSAqIE1hdGguc2luKCAocCAtIHRoaXMuX3AzKSAqIHRoaXMuX3AyICkgKiAwLjUgKyAxO1xuXHRcdFx0fSwgMC40NSlcblx0XHQpO1xuXG5cblx0XHQvL0V4cG9cblx0XHRfd3JhcChcIkV4cG9cIixcblx0XHRcdF9jcmVhdGUoXCJFeHBvT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuIDEgLSBNYXRoLnBvdygyLCAtMTAgKiBwKTtcblx0XHRcdH0pLFxuXHRcdFx0X2NyZWF0ZShcIkV4cG9JblwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHJldHVybiBNYXRoLnBvdygyLCAxMCAqIChwIC0gMSkpIC0gMC4wMDE7XG5cdFx0XHR9KSxcblx0XHRcdF9jcmVhdGUoXCJFeHBvSW5PdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gKChwICo9IDIpIDwgMSkgPyAwLjUgKiBNYXRoLnBvdygyLCAxMCAqIChwIC0gMSkpIDogMC41ICogKDIgLSBNYXRoLnBvdygyLCAtMTAgKiAocCAtIDEpKSk7XG5cdFx0XHR9KVxuXHRcdCk7XG5cblxuXHRcdC8vU2luZVxuXHRcdF93cmFwKFwiU2luZVwiLFxuXHRcdFx0X2NyZWF0ZShcIlNpbmVPdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gTWF0aC5zaW4ocCAqIF9IQUxGX1BJKTtcblx0XHRcdH0pLFxuXHRcdFx0X2NyZWF0ZShcIlNpbmVJblwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHJldHVybiAtTWF0aC5jb3MocCAqIF9IQUxGX1BJKSArIDE7XG5cdFx0XHR9KSxcblx0XHRcdF9jcmVhdGUoXCJTaW5lSW5PdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gLTAuNSAqIChNYXRoLmNvcyhNYXRoLlBJICogcCkgLSAxKTtcblx0XHRcdH0pXG5cdFx0KTtcblxuXHRcdF9jbGFzcyhcImVhc2luZy5FYXNlTG9va3VwXCIsIHtcblx0XHRcdFx0ZmluZDpmdW5jdGlvbihzKSB7XG5cdFx0XHRcdFx0cmV0dXJuIEVhc2UubWFwW3NdO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB0cnVlKTtcblxuXHRcdC8vcmVnaXN0ZXIgdGhlIG5vbi1zdGFuZGFyZCBlYXNlc1xuXHRcdF9lYXNlUmVnKHcuU2xvd01vLCBcIlNsb3dNb1wiLCBcImVhc2UsXCIpO1xuXHRcdF9lYXNlUmVnKFJvdWdoRWFzZSwgXCJSb3VnaEVhc2VcIiwgXCJlYXNlLFwiKTtcblx0XHRfZWFzZVJlZyhTdGVwcGVkRWFzZSwgXCJTdGVwcGVkRWFzZVwiLCBcImVhc2UsXCIpO1xuXHRcdFxuXHRcdHJldHVybiBCYWNrO1xuXHRcdFxuXHR9LCB0cnVlKTtcblxufSk7IGlmIChfZ3NTY29wZS5fZ3NEZWZpbmUpIHsgX2dzU2NvcGUuX2dzUXVldWUucG9wKCkoKTsgfVxuXG4vL2V4cG9ydCB0byBBTUQvUmVxdWlyZUpTIGFuZCBDb21tb25KUy9Ob2RlIChwcmVjdXJzb3IgdG8gZnVsbCBtb2R1bGFyIGJ1aWxkIHN5c3RlbSBjb21pbmcgYXQgYSBsYXRlciBkYXRlKVxuKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblx0dmFyIGdldEdsb2JhbCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoX2dzU2NvcGUuR3JlZW5Tb2NrR2xvYmFscyB8fCBfZ3NTY29wZSk7XG5cdH07XG5cdGlmICh0eXBlb2YoZGVmaW5lKSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHsgLy9BTURcblx0XHRkZWZpbmUoW1wiVHdlZW5MaXRlXCJdLCBnZXRHbG9iYWwpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZihtb2R1bGUpICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzKSB7IC8vbm9kZVxuXHRcdHJlcXVpcmUoXCIuLi9Ud2VlbkxpdGUuanNcIik7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBnZXRHbG9iYWwoKTtcblx0fVxufSgpKTsiLCIvKiFcbiAqIFZFUlNJT046IDEuNy42XG4gKiBEQVRFOiAyMDE1LTEyLTEwXG4gKiBVUERBVEVTIEFORCBET0NTIEFUOiBodHRwOi8vZ3JlZW5zb2NrLmNvbVxuICpcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwOC0yMDE2LCBHcmVlblNvY2suIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIHdvcmsgaXMgc3ViamVjdCB0byB0aGUgdGVybXMgYXQgaHR0cDovL2dyZWVuc29jay5jb20vc3RhbmRhcmQtbGljZW5zZSBvciBmb3JcbiAqIENsdWIgR3JlZW5Tb2NrIG1lbWJlcnMsIHRoZSBzb2Z0d2FyZSBhZ3JlZW1lbnQgdGhhdCB3YXMgaXNzdWVkIHdpdGggeW91ciBtZW1iZXJzaGlwLlxuICogXG4gKiBAYXV0aG9yOiBKYWNrIERveWxlLCBqYWNrQGdyZWVuc29jay5jb21cbiAqKi9cbnZhciBfZ3NTY29wZSA9ICh0eXBlb2YobW9kdWxlKSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0eXBlb2YoZ2xvYmFsKSAhPT0gXCJ1bmRlZmluZWRcIikgPyBnbG9iYWwgOiB0aGlzIHx8IHdpbmRvdzsgLy9oZWxwcyBlbnN1cmUgY29tcGF0aWJpbGl0eSB3aXRoIEFNRC9SZXF1aXJlSlMgYW5kIENvbW1vbkpTL05vZGVcbihfZ3NTY29wZS5fZ3NRdWV1ZSB8fCAoX2dzU2NvcGUuX2dzUXVldWUgPSBbXSkpLnB1c2goIGZ1bmN0aW9uKCkge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuXHRcdF93aW5kb3cgPSB3aW5kb3csXG5cdFx0X21heCA9IGZ1bmN0aW9uKGVsZW1lbnQsIGF4aXMpIHtcblx0XHRcdHZhciBkaW0gPSAoYXhpcyA9PT0gXCJ4XCIpID8gXCJXaWR0aFwiIDogXCJIZWlnaHRcIixcblx0XHRcdFx0c2Nyb2xsID0gXCJzY3JvbGxcIiArIGRpbSxcblx0XHRcdFx0Y2xpZW50ID0gXCJjbGllbnRcIiArIGRpbSxcblx0XHRcdFx0Ym9keSA9IGRvY3VtZW50LmJvZHk7XG5cdFx0XHRyZXR1cm4gKGVsZW1lbnQgPT09IF93aW5kb3cgfHwgZWxlbWVudCA9PT0gX2RvYyB8fCBlbGVtZW50ID09PSBib2R5KSA/IE1hdGgubWF4KF9kb2Nbc2Nyb2xsXSwgYm9keVtzY3JvbGxdKSAtIChfd2luZG93W1wiaW5uZXJcIiArIGRpbV0gfHwgX2RvY1tjbGllbnRdIHx8IGJvZHlbY2xpZW50XSkgOiBlbGVtZW50W3Njcm9sbF0gLSBlbGVtZW50W1wib2Zmc2V0XCIgKyBkaW1dO1xuXHRcdH0sXG5cblx0XHRTY3JvbGxUb1BsdWdpbiA9IF9nc1Njb3BlLl9nc0RlZmluZS5wbHVnaW4oe1xuXHRcdFx0cHJvcE5hbWU6IFwic2Nyb2xsVG9cIixcblx0XHRcdEFQSTogMixcblx0XHRcdHZlcnNpb246XCIxLjcuNlwiLFxuXG5cdFx0XHQvL2NhbGxlZCB3aGVuIHRoZSB0d2VlbiByZW5kZXJzIGZvciB0aGUgZmlyc3QgdGltZS4gVGhpcyBpcyB3aGVyZSBpbml0aWFsIHZhbHVlcyBzaG91bGQgYmUgcmVjb3JkZWQgYW5kIGFueSBzZXR1cCByb3V0aW5lcyBzaG91bGQgcnVuLlxuXHRcdFx0aW5pdDogZnVuY3Rpb24odGFyZ2V0LCB2YWx1ZSwgdHdlZW4pIHtcblx0XHRcdFx0dGhpcy5fd2R3ID0gKHRhcmdldCA9PT0gX3dpbmRvdyk7XG5cdFx0XHRcdHRoaXMuX3RhcmdldCA9IHRhcmdldDtcblx0XHRcdFx0dGhpcy5fdHdlZW4gPSB0d2Vlbjtcblx0XHRcdFx0aWYgKHR5cGVvZih2YWx1ZSkgIT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHR2YWx1ZSA9IHt5OnZhbHVlfTsgLy9pZiB3ZSBkb24ndCByZWNlaXZlIGFuIG9iamVjdCBhcyB0aGUgcGFyYW1ldGVyLCBhc3N1bWUgdGhlIHVzZXIgaW50ZW5kcyBcInlcIi5cblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnZhcnMgPSB2YWx1ZTtcblx0XHRcdFx0dGhpcy5fYXV0b0tpbGwgPSAodmFsdWUuYXV0b0tpbGwgIT09IGZhbHNlKTtcblx0XHRcdFx0dGhpcy54ID0gdGhpcy54UHJldiA9IHRoaXMuZ2V0WCgpO1xuXHRcdFx0XHR0aGlzLnkgPSB0aGlzLnlQcmV2ID0gdGhpcy5nZXRZKCk7XG5cdFx0XHRcdGlmICh2YWx1ZS54ICE9IG51bGwpIHtcblx0XHRcdFx0XHR0aGlzLl9hZGRUd2Vlbih0aGlzLCBcInhcIiwgdGhpcy54LCAodmFsdWUueCA9PT0gXCJtYXhcIikgPyBfbWF4KHRhcmdldCwgXCJ4XCIpIDogdmFsdWUueCwgXCJzY3JvbGxUb194XCIsIHRydWUpO1xuXHRcdFx0XHRcdHRoaXMuX292ZXJ3cml0ZVByb3BzLnB1c2goXCJzY3JvbGxUb194XCIpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuc2tpcFggPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh2YWx1ZS55ICE9IG51bGwpIHtcblx0XHRcdFx0XHR0aGlzLl9hZGRUd2Vlbih0aGlzLCBcInlcIiwgdGhpcy55LCAodmFsdWUueSA9PT0gXCJtYXhcIikgPyBfbWF4KHRhcmdldCwgXCJ5XCIpIDogdmFsdWUueSwgXCJzY3JvbGxUb195XCIsIHRydWUpO1xuXHRcdFx0XHRcdHRoaXMuX292ZXJ3cml0ZVByb3BzLnB1c2goXCJzY3JvbGxUb195XCIpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuc2tpcFkgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSxcblxuXHRcdFx0Ly9jYWxsZWQgZWFjaCB0aW1lIHRoZSB2YWx1ZXMgc2hvdWxkIGJlIHVwZGF0ZWQsIGFuZCB0aGUgcmF0aW8gZ2V0cyBwYXNzZWQgYXMgdGhlIG9ubHkgcGFyYW1ldGVyICh0eXBpY2FsbHkgaXQncyBhIHZhbHVlIGJldHdlZW4gMCBhbmQgMSwgYnV0IGl0IGNhbiBleGNlZWQgdGhvc2Ugd2hlbiB1c2luZyBhbiBlYXNlIGxpa2UgRWxhc3RpYy5lYXNlT3V0IG9yIEJhY2suZWFzZU91dCwgZXRjLilcblx0XHRcdHNldDogZnVuY3Rpb24odikge1xuXHRcdFx0XHR0aGlzLl9zdXBlci5zZXRSYXRpby5jYWxsKHRoaXMsIHYpO1xuXG5cdFx0XHRcdHZhciB4ID0gKHRoaXMuX3dkdyB8fCAhdGhpcy5za2lwWCkgPyB0aGlzLmdldFgoKSA6IHRoaXMueFByZXYsXG5cdFx0XHRcdFx0eSA9ICh0aGlzLl93ZHcgfHwgIXRoaXMuc2tpcFkpID8gdGhpcy5nZXRZKCkgOiB0aGlzLnlQcmV2LFxuXHRcdFx0XHRcdHlEaWYgPSB5IC0gdGhpcy55UHJldixcblx0XHRcdFx0XHR4RGlmID0geCAtIHRoaXMueFByZXY7XG5cblx0XHRcdFx0aWYgKHRoaXMueCA8IDApIHsgLy9jYW4ndCBzY3JvbGwgdG8gYSBwb3NpdGlvbiBsZXNzIHRoYW4gMCEgTWlnaHQgaGFwcGVuIGlmIHNvbWVvbmUgdXNlcyBhIEJhY2suZWFzZU91dCBvciBFbGFzdGljLmVhc2VPdXQgd2hlbiBzY3JvbGxpbmcgYmFjayB0byB0aGUgdG9wIG9mIHRoZSBwYWdlIChmb3IgZXhhbXBsZSlcblx0XHRcdFx0XHR0aGlzLnggPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLnkgPCAwKSB7XG5cdFx0XHRcdFx0dGhpcy55ID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGhpcy5fYXV0b0tpbGwpIHtcblx0XHRcdFx0XHQvL25vdGU6IGlPUyBoYXMgYSBidWcgdGhhdCB0aHJvd3Mgb2ZmIHRoZSBzY3JvbGwgYnkgc2V2ZXJhbCBwaXhlbHMsIHNvIHdlIG5lZWQgdG8gY2hlY2sgaWYgaXQncyB3aXRoaW4gNyBwaXhlbHMgb2YgdGhlIHByZXZpb3VzIG9uZSB0aGF0IHdlIHNldCBpbnN0ZWFkIG9mIGp1c3QgbG9va2luZyBmb3IgYW4gZXhhY3QgbWF0Y2guXG5cdFx0XHRcdFx0aWYgKCF0aGlzLnNraXBYICYmICh4RGlmID4gNyB8fCB4RGlmIDwgLTcpICYmIHggPCBfbWF4KHRoaXMuX3RhcmdldCwgXCJ4XCIpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNraXBYID0gdHJ1ZTsgLy9pZiB0aGUgdXNlciBzY3JvbGxzIHNlcGFyYXRlbHksIHdlIHNob3VsZCBzdG9wIHR3ZWVuaW5nIVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIXRoaXMuc2tpcFkgJiYgKHlEaWYgPiA3IHx8IHlEaWYgPCAtNykgJiYgeSA8IF9tYXgodGhpcy5fdGFyZ2V0LCBcInlcIikpIHtcblx0XHRcdFx0XHRcdHRoaXMuc2tpcFkgPSB0cnVlOyAvL2lmIHRoZSB1c2VyIHNjcm9sbHMgc2VwYXJhdGVseSwgd2Ugc2hvdWxkIHN0b3AgdHdlZW5pbmchXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0aGlzLnNraXBYICYmIHRoaXMuc2tpcFkpIHtcblx0XHRcdFx0XHRcdHRoaXMuX3R3ZWVuLmtpbGwoKTtcblx0XHRcdFx0XHRcdGlmICh0aGlzLnZhcnMub25BdXRvS2lsbCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnZhcnMub25BdXRvS2lsbC5hcHBseSh0aGlzLnZhcnMub25BdXRvS2lsbFNjb3BlIHx8IHRoaXMuX3R3ZWVuLCB0aGlzLnZhcnMub25BdXRvS2lsbFBhcmFtcyB8fCBbXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl93ZHcpIHtcblx0XHRcdFx0XHRfd2luZG93LnNjcm9sbFRvKCghdGhpcy5za2lwWCkgPyB0aGlzLnggOiB4LCAoIXRoaXMuc2tpcFkpID8gdGhpcy55IDogeSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCF0aGlzLnNraXBZKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl90YXJnZXQuc2Nyb2xsVG9wID0gdGhpcy55O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIXRoaXMuc2tpcFgpIHtcblx0XHRcdFx0XHRcdHRoaXMuX3RhcmdldC5zY3JvbGxMZWZ0ID0gdGhpcy54O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnhQcmV2ID0gdGhpcy54O1xuXHRcdFx0XHR0aGlzLnlQcmV2ID0gdGhpcy55O1xuXHRcdFx0fVxuXG5cdFx0fSksXG5cdFx0cCA9IFNjcm9sbFRvUGx1Z2luLnByb3RvdHlwZTtcblxuXHRTY3JvbGxUb1BsdWdpbi5tYXggPSBfbWF4O1xuXG5cdHAuZ2V0WCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoIXRoaXMuX3dkdykgPyB0aGlzLl90YXJnZXQuc2Nyb2xsTGVmdCA6IChfd2luZG93LnBhZ2VYT2Zmc2V0ICE9IG51bGwpID8gX3dpbmRvdy5wYWdlWE9mZnNldCA6IChfZG9jLnNjcm9sbExlZnQgIT0gbnVsbCkgPyBfZG9jLnNjcm9sbExlZnQgOiBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQ7XG5cdH07XG5cblx0cC5nZXRZID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICghdGhpcy5fd2R3KSA/IHRoaXMuX3RhcmdldC5zY3JvbGxUb3AgOiAoX3dpbmRvdy5wYWdlWU9mZnNldCAhPSBudWxsKSA/IF93aW5kb3cucGFnZVlPZmZzZXQgOiAoX2RvYy5zY3JvbGxUb3AgIT0gbnVsbCkgPyBfZG9jLnNjcm9sbFRvcCA6IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuXHR9O1xuXG5cdHAuX2tpbGwgPSBmdW5jdGlvbihsb29rdXApIHtcblx0XHRpZiAobG9va3VwLnNjcm9sbFRvX3gpIHtcblx0XHRcdHRoaXMuc2tpcFggPSB0cnVlO1xuXHRcdH1cblx0XHRpZiAobG9va3VwLnNjcm9sbFRvX3kpIHtcblx0XHRcdHRoaXMuc2tpcFkgPSB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fc3VwZXIuX2tpbGwuY2FsbCh0aGlzLCBsb29rdXApO1xuXHR9O1xuXG59KTsgaWYgKF9nc1Njb3BlLl9nc0RlZmluZSkgeyBfZ3NTY29wZS5fZ3NRdWV1ZS5wb3AoKSgpOyB9Il19
