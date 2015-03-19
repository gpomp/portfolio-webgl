/// <reference path="../../web/app/themes/portfolio/vendors/DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="../../web/app/themes/portfolio/vendors/DefinitelyTyped/greensock/greensock.d.ts" />
/// <reference path="../core/GLAnimation.ts" />
/// <reference path="../core/EffectComposer.ts" />
/// <reference path="../core/Scene3D.ts" />
/// <reference path="../helper/ThreeToDom.ts" />
/// <reference path="../helper/ThreeAddOns.ts" />
/// <reference path="../helper/Title.ts" />
module webglExp {

	export class HotSpot {

		public pos:THREE.Vector2;
		public rad:number;
		public sphereRad:number;
		public uniforms;
		
		public id:number;
		public projectName:string;
		public href:string;

		public plane:THREE.Mesh;
		public overPlane:THREE.Mesh;
		public geomSize:number;

		private domEl:HTMLElement;
		private overEl:HTMLElement;
		private three2Dom:webglExp.ThreeToDom;

		private overEvent:CustomEvent;
		private outEvent:CustomEvent;
		private clickEvent:CustomEvent;

		private isExiting:boolean;

		private canvas;
		private context;
		private img;
		private canvasReady:boolean;

		constructor(x:number, y:number, id:number) {
			this.canvasReady = false;

			this.rad = 0.5 + Math.random() * 0.2;
			this.pos = new THREE.Vector2(x, y);
			this.id = id;

			this.overEvent = webglExp.Tools.createCustomEvent(webglExp.SphereAnimation.ON_OVER);
			this.outEvent = webglExp.Tools.createCustomEvent(webglExp.SphereAnimation.ON_OUT);
			this.clickEvent = webglExp.Tools.createCustomEvent(webglExp.SphereAnimation.ON_CLICK);
		}

		createPlane(camera:THREE.PerspectiveCamera, projectName:string):THREE.Mesh {

			this.projectName = projectName;
			this.geomSize = 64;

			this.canvas = document.createElement("canvas");
			this.canvas.setAttribute('width', this.geomSize + 'px');
			this.canvas.setAttribute('height', this.geomSize + 'px');
			this.context = this.canvas.getContext('2d');

			this.uniforms = {
				camPosition: {
			    	type: 'v3',
			    	value: new THREE.Vector3(0, 0, this.sphereRad + 20)
			  	},

				fogDistance: {
					type: 'f',
					value: 630.0
				},

				alpha: {
					type: 'f',
					value: 0.0
				},

				text: {
					type: 't',
					value: new THREE.Texture(this.canvas)
				}
			};

			this.prepCanvas();

			var shaders = GLAnimation.SHADERLIST.foglight;
			var mat:THREE.ShaderMaterial =
			  	new THREE.ShaderMaterial({
				    vertexShader:   shaders.vertex,
				    fragmentShader: shaders.fragment,
				    uniforms: this.uniforms,
				    side: THREE.DoubleSide,
				    transparent:true
			  	});
			var geom:THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(1, 1);
			geom.computeFaceNormals();
			geom.computeVertexNormals();

			this.overPlane = new THREE.Mesh(geom, mat);
			this.overPlane.scale.x = this.geomSize;
			this.overPlane.scale.y = this.geomSize;
			var oPlanePos:THREE.Vector3 = this.convert(this.pos, this.sphereRad + 10);
			this.overPlane.position.set(oPlanePos.x, oPlanePos.y, oPlanePos.z);
			
			this.domEl = <HTMLElement>document.querySelectorAll("#sphere-buttons .hiddenButton").item(this.id);
			this.href = this.domEl.getAttribute("href");
			
			this.overEl = <HTMLElement>document.querySelectorAll("#sphere-buttons .overButton").item(this.id);

			this.three2Dom = new webglExp.ThreeToDom(camera, this.overPlane, this.domEl);
			this.three2Dom.updatePosition();

			this.domEl.addEventListener("click",this.elementClick);

			this.domEl.addEventListener('mouseover', this.over, false);
			this.domEl.addEventListener('mouseout', this.out, false);

			return this.overPlane;
		}

		prepCanvas() {
			this.imgLoaded();
			/*this.img = document.createElement('img');

			this.img.addEventListener('load', this.imgLoaded);
			this.img.src = "/app/themes/portfolio/img/texture.jpg";*/
		}

		imgLoaded = () => {
			this.canvasReady = true;
			this.context.clearRect ( 0 , 0 , this.canvas.width, this.canvas.height );
			var rad = this.geomSize * 0.5;

		    this.context.beginPath();
		    this.context.arc(rad,rad,rad - 5,0,Math.PI * 2);
		    this.context.closePath();
		    this.context.strokeStyle = "#00fefc";
		    this.context.lineWidth = 10;
		    this.context.stroke();
		    this.context.fillStyle = "#000";
		    this.context.fill();

		    this.context.fillStyle = "#00fefc";
			this.context.font = "5pt 'Lato'";
			var str:string = "Project bla bla";
			var tSize:number = this.context.measureText(str).width;
			this.context.fillText(str, (this.canvas.width - tSize) * 0.5, this.canvas.height * 0.5);
		    this.uniforms.text.value.needsUpdate = true;
		}

		elementClick = (event:MouseEvent) => {
			event.preventDefault();
			this.clickEvent.detail.id = this.id;
			this.clickEvent.detail.href = this.href;
			document.dispatchEvent(this.clickEvent);
		}

		over = (event) => {
			this.overEvent.detail.id = this.id;
			document.dispatchEvent(this.overEvent);

/*
			this.overEl.style.left = (this.three2Dom.middlePos.x - this.overEl.offsetWidth / 2) + "px";
			this.overEl.style.top = (this.three2Dom.middlePos.y + this.overEl.offsetHeight) + "px";

			this.overEl.classList.add("over");*/

			// TweenLite.to(this.overPlane.scale, .5, { x: this.geomSize, y: this.geomSize, z: 1.3 });

		}

		out = (event) => {
			this.outEvent.detail.id = this.id;
			document.dispatchEvent(this.outEvent);

			// this.overEl.classList.remove("over");
			// TweenLite.to(this.overPlane.scale, .5, { x: this.geomSize, y: this.geomSize, z: 1 });
		}

		randPoint(vRad:number):THREE.Vector2 {
			/*var rad = vRad * Math.random();*/
			var currRad:number = this.rad * Math.PI / 180;
			var rand:number = 2 * Math.PI * (vRad);
			
			var x = this.pos.x + Math.cos(rand) * currRad;
			var y = this.pos.y + Math.sin(rand) * currRad;

			
			// this.pos.x, this.pos.y this.checkCoords(x), this.checkCoords(y)
			return new THREE.Vector2(x, y);
		}

		checkCoords(x:number):number {
			var circ:number = Math.PI * 2;
			if(x >circ) {
				var diff = x - circ;
				x = -circ + diff;
			} else if(x < -circ) {
				var diff = x + circ;
				x = circ - diff;
			}

			return x;
		}

		checkifInArea(v:THREE.Vector2, rad:number):boolean {
			var isIn:boolean = false;
			var xRad:number = Math.abs(v.x - this.pos.x);
			var yRad:number = Math.abs(v.y - this.pos.y);
			if(	xRad * xRad + yRad * yRad < rad * rad) isIn = true;

			return isIn;
		}

		changeRadius() {
			var oPlanePos:THREE.Vector3 = this.convert(this.pos, this.sphereRad + 10);
			this.overPlane.position.set(oPlanePos.x, oPlanePos.y, oPlanePos.z);
		}

		convert(v:THREE.Vector2, rad?:number):THREE.Vector3 {
			if(!rad) rad = this.sphereRad;
			var phi = (v.x);
        	var theta = (v.y);
        	return new THREE.Vector3(
        						rad * Math.cos(phi) * Math.cos(theta),
        						rad * Math.cos(phi) * Math.sin(theta),
        						rad * Math.sin(phi)
        						);


		}

		render() {
			this.three2Dom.updatePosition();
			if(this.canvasReady) {
				
			}
			if(this.isExiting) {
				var oPlanePos:THREE.Vector3 = this.convert(this.pos, this.sphereRad + 10);
				this.overPlane.position.set(oPlanePos.x, oPlanePos.y, oPlanePos.z);
			}

			this.overPlane.lookAt(new THREE.Vector3(0));
		}

		clear() {
			this.domEl.removeEventListener("click",this.elementClick);

			this.domEl.removeEventListener('mouseover', this.over, false);
			this.domEl.removeEventListener('mouseout', this.out, false);
			// this.domEl.parentNode.removeChild(this.domEl);
		}

		exit() {
			this.domEl.classList.add("disable");
			this.isExiting = true;
			TweenLite.to(this, 3, { sphereRad: 500 + Math.random() * 500, ease: Expo.easeInOut, delay: Math.random() })
		}

		
		
	}

	export class Particle extends THREE.Vector3 {

		public static addedSpeed:number = 1.0;

		public start:THREE.Vector2;
		public dest:THREE.Vector2;
		public distFrac:number;
		public distance:number;

		public outFrac:number;

		private pos:THREE.Vector2;
		private currSpot:webglExp.HotSpot;
		private startSpot:webglExp.HotSpot;
		
		

		private rad:number;
		private hotspots:webglExp.HotSpot[];
		private speed:number;

		private spotRad:number;

		private startTime:number;
		private currTime:number;
		private duration:number;

		private onOutRender:boolean;
		private onInRender:boolean;

		constructor(hotspots:webglExp.HotSpot[]) {
			super(0, 0, 0);
			this.hotspots = hotspots;
			
			this.rad = 0;
			this.outFrac = 0;
			
			// this.start = this.pos = this.dest = this.randSpot().randPoint(5);
			this.start = this.pos = this.dest = this.getRandomPos();
			this.reset();
			this.distFrac = Math.random();

			var v:THREE.Vector3 = this.convert(this.start);
			this.set(v.x,v.y,v.z);

			
		}

		getRandomPos():THREE.Vector2 {

			return new THREE.Vector2(Math.random() * (Math.PI * 2), Math.random() * Math.PI);
		}

		reset = () => {
			this.startSpot = (SphereAnimation.overID !== -1) ? this.randSpot(SphereAnimation.overID) : this.randSpot();
			// this.start = this.startSpot.pos;
			this.start = this.getRandomPos();

			this.speed = 0.005 + Math.random() * 0.003;
			this.distFrac = 0;
			this.currSpot = this.randSpot(this.startSpot.id, true);
			this.spotRad = Math.random() * this.currSpot.rad;
			this.dest = this.getRandomPos();
			this.dest = (SphereAnimation.overID !== -1) ? this.currSpot.randPoint(this.spotRad) : this.getRandomPos();

		    var lat1:number = this.start.x;
		    var lng1:number = this.start.y;

		    var lat2:number = this.dest.x;
		    var lng2:number = this.dest.y;

			this.duration = Math.round((1500 + Math.random() * 3000) * webglExp.Particle.addedSpeed);

			this.distance = Math.acos	(Math.sin(lat1) * Math.sin(lat2) +
										Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng1-lng2));
			this.startTime = Date.now();
		}

		render() {
	        this.distFrac += this.speed + webglExp.Particle.addedSpeed;//this.easeInOutSine(Date.now() - this.startTime,0,1,this.duration);
	        if(this.distFrac > 0.999) this.reset();
		}

		outRender() {
			if(this.onOutRender) return;
			this.outFrac = 1;
			TweenLite.to(this, 5 + Math.random() * 3, {outFrac: 0, ease: Expo.easeInOut});
			this.onOutRender = true;
		}

		inRender() {
			if(this.onInRender) return;
			this.outFrac = 0;
			TweenLite.to(this, 7 + Math.random() * 3, {outFrac: 1, ease: Expo.easeInOut});
			this.onInRender = true;
		}

		easeInOutSine(t:number, b:number, c:number, d:number):number {
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		}

		convert(v:THREE.Vector2):THREE.Vector3 {
			var phi = (v.x);
        	var theta = (v.y);

        	return new THREE.Vector3(
        						-this.rad * Math.cos(phi) * Math.cos(theta),
        						this.rad * Math.sin(phi),
        						this.rad * Math.cos(phi) * Math.sin(theta));


		}

		randSpot(spot?:number, dest?:boolean):webglExp.HotSpot {
			var sp = this.hotspots.slice(); 
			if(spot && dest) sp.splice(spot, 1);
			var rand = Math.floor(Math.random() * sp.length);
			if(SphereAnimation.overID !== -1 && dest) {
				rand = SphereAnimation.overID;
				sp = this.hotspots;
			}
			return sp[rand];
		}
	}

	export class SphereBackground {

		public static vNumber:number = 100;

		public mesh:THREE.Object3D;
		public uniforms;
		public scrollSpeed:THREE.Vector2;
		public light:THREE.DirectionalLight;
		public direction:THREE.Vector2;


		private nbPoints:number;
		private mousePos:THREE.Vector2;
		private actMousePos:THREE.Vector2;

		private plane:THREE.Mesh;
		private scroll:number;
		private camera:THREE.PerspectiveCamera;

		private floatingGeomList:THREE.Geometry[];
		private floatingObjects:THREE.Mesh[];
		private floatingMaterial:THREE.MeshPhongMaterial;

		private bgMat:THREE.ShaderMaterial;
		private redoTimeout:number;



		constructor(camera:THREE.PerspectiveCamera, thetraRT, buttonsRT) {
			this.camera = camera;
			this.redoTimeout = -1;
			var objSize:THREE.Vector2 = this.getWidthHeight();

			this.uniforms = {
		    	time: {
    				type: 'f',
    				value: 0
  				},
  				
		    	width: {
    				type: 'f',
    				value: objSize.x
  				},

		    	height: {
    				type: 'f',
    				value: objSize.y
  				},

		    	alpha: {
    				type: 'f',
    				value: 0
  				},

  				mousePos: {
  					type: 'v2',
  					value:new THREE.Vector2()
  				},

  				scroll: {
  					type: 'v2',
  					value:new THREE.Vector2()
  				},

  				fogRatio: {
  					type: 'f',
    				value: 0.8
  				},

  				colRatio: {
  					type: 'f',
    				value: 0.0
  				},

  				blackRatio: {
  					type: 'f',
    				value: 0.2
  				},

  				wnoiseRatio: {
  					type: 'f',
    				value: 0.4
  				},

  				small: {
  					type: 'f',
  					value: 250.0
  				},

  				thetraRT: {
  					type: 't',
  					value: thetraRT
  				},

  				shadowRatio: {
  					type: 'f',
  					value: 1.0
  				}
  				
		    };

		    this.direction = new THREE.Vector2(1, -1);

		    this.light = new THREE.DirectionalLight( 0xffffff, 0.5 );
		    this.light.position.set(0.2, 0.2, 0.2);

		    var colFolder = webglExp.SphereAnimation.guiFolder.addFolder("color ratio");
		    colFolder.add(this.uniforms.colRatio, "value", 0.0, 1.0);

		    var smallFolder = webglExp.SphereAnimation.guiFolder.addFolder("small normal ratio");
		    smallFolder.add(this.uniforms.small, "value", 0, 1000);
		   
		    this.mesh = new THREE.Object3D();
		    this.mesh.rotation.x = -Math.PI / 5;
		    var planeGeom:THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(objSize.x, objSize.y, webglExp.SphereBackground.vNumber, webglExp.SphereBackground.vNumber);

		    var bgShader = GLAnimation.SHADERLIST.bgsphere;
		    this.bgMat = new THREE.ShaderMaterial({
			    vertexShader:   bgShader.vertex,
			    fragmentShader: bgShader.fragment,
			    uniforms: this.uniforms
		  	});

		  	this.plane = new THREE.Mesh(planeGeom, this.bgMat);
		  	this.mesh.add(this.plane);

		    this.mousePos = new THREE.Vector2();
		    this.actMousePos = new THREE.Vector2();
		    this.scrollSpeed = new THREE.Vector2(0.5, 0.6);
		    document.addEventListener("mousemove", this.mouseMove);

		    this.floatingMaterial = new THREE.MeshPhongMaterial({color: 0x888888});

		    this.floatingObjects = [];
		    this.floatingGeomList = [
		    	new THREE.TetrahedronGeometry(5, 2),
		    	new THREE.OctahedronGeometry(5, 2),
		    	new THREE.DodecahedronGeometry(5, 2),
		    	new THREE.SphereGeometry(5, 32, 32)
		    ]
		    var countGeom:number = 0;
		    for (var i = 0; i < 5; ++i) {
		    	this.createObject(countGeom);

		    	countGeom = (countGeom < this.floatingGeomList.length - 1) ? countGeom + 1 : 0;

		    }
		}

		getWidthHeight():THREE.Vector2 {
			var vFOV = this.camera.fov * Math.PI / 180;
			var height = 2 * Math.tan( vFOV / 2 ) * 700;

			var aspect = Scene3D.WIDTH /  Scene3D.HEIGHT;
			var width = height * aspect;
			return new THREE.Vector2(width + width * .5, width + width * .5);
		}

		getSquaredDistance(obj:THREE.Mesh):number {
			return obj.position.x * obj.position.x + obj.position.y * obj.position.y;
		}

		createObject(n:number) {
			var geom:THREE.Geometry = this.floatingGeomList[n];
			var mesh = new THREE.Mesh(geom, this.floatingMaterial);
			this.mesh.add(mesh);
			mesh.position.z = 170;
			this.floatingObjects.push(mesh);
			this.launchObject(mesh.position, mesh.rotation);

		}

		launchObject = (pos, rot) => {
			var d:number = 1 + Math.random() * 7;
			var t:number = 15 + Math.random() * 15;
			var size = this.getWidthHeight();
			var wDir:number = (Math.random() <= .5) ? -1 : 1;
			var hDir:number = (Math.random() <= .5) ? -1 : 1;
			pos.x = size.x * 0.5 * wDir;
			pos.y = size.y * 0.5 * hDir;
			var bPoints = [	
							{x : 0, y : hDir * size.y * 0.5 * (0.2 + Math.random() * 0.10)},
							{x : wDir * size.x * 0.5 * (0.2 + Math.random() * 0.10), y : 0},
							{x: -1 * wDir * size.x * 0.5, y: -1 * hDir * size.y * 0.5}
						];

			TweenLite.to(rot, t, { z: Math.random() * Math.PI * 50 });
			TweenLite.to(pos, t, { 	type:"soft", bezier: {values: bPoints, autoRotate:true}, 
									onCompleteParams:[pos, rot], 
									onComplete: this.launchObject, ease:Sine.easeInOut  })
		}

		mouseMove = (event:MouseEvent) => {
			this.mousePos.x = (event.clientX - Scene3D.WIDTH * .5) / Scene3D.WIDTH;
			this.mousePos.y = -(event.clientY - Scene3D.HEIGHT * .5) / Scene3D.HEIGHT;
		}

		resize(w:number, h:number) {
			this.redoTimeout = window.setTimeout(function() { this.redoMesh(w, h); }.bind(this), 100);
		}

		redoMesh(w:number, h:number) {
			var objSize:THREE.Vector2 = this.getWidthHeight();
			this.uniforms.width = objSize.x;
			this.uniforms.height = objSize.y;
			window.clearTimeout(this.redoTimeout);
			this.mesh.remove(this.plane);
			var planeGeom:THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(objSize.x, objSize.y, webglExp.SphereBackground.vNumber, webglExp.SphereBackground.vNumber);
			this.plane = new THREE.Mesh(planeGeom, this.bgMat);
			this.mesh.add(this.plane);
		}

		render() {
			this.actMousePos.x += (this.mousePos.x - this.actMousePos.x) * 0.1;
			this.actMousePos.y += (this.mousePos.y - this.actMousePos.y) * 0.1;
			this.uniforms.mousePos.value = this.actMousePos;
			this.uniforms.scroll.value.x += this.scrollSpeed.x;
			this.uniforms.scroll.value.y += this.scrollSpeed.y;
			this.scrollSpeed.x += (0.5 - this.scrollSpeed.x) * 0.1;
			this.scrollSpeed.y += (0.6 - this.scrollSpeed.y) * 0.1;
			var w:number = this.uniforms.width.value * .5;
		}
	} 

	export class SphereAnimation extends webglExp.GLAnimation {

		public static ON_OVER:string = "hs_over";
		public static ON_OUT:string = "hs_out";
		public static ON_CLICK:string = "hs_click";

		public static guiFolder;

		public static overID:number;

		private _renderer:THREE.WebGLRenderer;
		private _camera:THREE.PerspectiveCamera;
		private composer:webglExp.EffectComposer;
		private composerBloom:webglExp.EffectComposer;
		private composerButton:webglExp.EffectComposer;
		private composerBackground:webglExp.EffectComposer;
		private blendComposer;
		private bloomScene:THREE.Scene;
		private buttonScene:THREE.Scene;
		private blendPass;

		private particleList:webglExp.Particle[];
		private superMesh:THREE.Line;
		private sphereCtn:THREE.Object3D;
		private sceneCtn:THREE.Object3D;
		private buttonCtn:THREE.Object3D;

		private bgScene:THREE.Scene;
		private bgMesh:THREE.Object3D;

		private sphere:THREE.Mesh;

		private spots:webglExp.HotSpot[];

		private attributes;
		private uniforms;

		/*Post effects*/
		private effectBloom;
		private bloomStrength;
		private effectBlurV;
		private effectBlurH;

		public blurv:number;
		public blurh:number;

		private mouseVel:webglExp.MouseSpeed;
		private mSpeed:number;

		private inTransition:boolean;
		private inCurve:boolean;

		private inOutTransition:boolean;
		private outCounter:number;
		private toHref:string;

		private inStartTransition:boolean;
		private startCounter:number;

		private camCurve:THREE.SplineCurve3;
		private curvPerc:number;
		private lookAt:THREE.Vector3;
		private currlookAt:THREE.Vector3;

		private middleSphere:THREE.Mesh;
		private tetraAttr:any;
		private tetraUniforms:any;
		private frame:number;

		private introThetra:any[];

		private dummyAnim:number;

		private background:webglExp.SphereBackground;

		constructor(scene:THREE.Scene, camera:THREE.PerspectiveCamera, renderer:THREE.WebGLRenderer) {

			super(scene, camera, renderer);

			super.setID("sphere");

			super.getLeaveEvent().detail.name = super.getID();

			SphereAnimation.overID = -1;

			super.setInternalRender(true);

			this._renderer = super.getRenderer();
		    this._renderer.autoClear = true;

		    this.bloomScene = new THREE.Scene();
		    this.buttonScene = new THREE.Scene();
		    this.bgScene = new THREE.Scene();


			var gui = super.getGui().get_gui();

			var folder = webglExp.SphereAnimation.guiFolder = gui.addFolder('Sphere Animation');


		    // Gamma settings make things look 'nicer' for some reason
		    this._renderer.gammaInput = true;
		    this._renderer.gammaOutput = true;

		    this.composer = new webglExp.EffectComposer(this._renderer, scene, camera, Scene3D.WIDTH, Scene3D.HEIGHT);
		    this.composerBloom = new webglExp.EffectComposer(this._renderer, this.bloomScene, camera, Scene3D.WIDTH, Scene3D.HEIGHT);
		    this.composerButton = new webglExp.EffectComposer(this._renderer, this.bloomScene, camera, Scene3D.WIDTH, Scene3D.HEIGHT);

			super.getCamera().position.z = -500;

			this.background = new webglExp.SphereBackground(camera, this.composer.getComposer().renderTarget2 , this.composerButton.getComposer().renderTarget2);
			this.bgMesh = this.background.mesh;
		    this.composerBackground = new webglExp.EffectComposer(this._renderer, this.bgScene, camera, Scene3D.WIDTH, Scene3D.HEIGHT);
		    
			this.bgScene.add( this.bgMesh );
			this.bgScene.add( this.background.light );


		    var renderTargetParams = {	minFilter: THREE.LinearFilter,
        								magFilter: THREE.LinearFilter, 
        								format: THREE.RGBAFormat,
        								stencilBuffer: true };

			var rt:THREE.WebGLRenderTarget = new THREE.WebGLRenderTarget(Scene3D.WIDTH, Scene3D.HEIGHT, renderTargetParams);


		    this.blendComposer = new THREE.EffectComposer(this._renderer, rt);
		    
		    this.composer.folder = gui.addFolder("Effect Composer");

		    this.sceneCtn = new THREE.Object3D();
		    this.buttonCtn = new THREE.Object3D();

		    scene.add(this.sceneCtn);
		    this.buttonScene.add(this.buttonCtn);

			var superGeom:THREE.Geometry = new THREE.Geometry();
			var shaders = GLAnimation.SHADERLIST.sphereAnimation;

			this.uniforms = {
				radius: {
					type: 'f',
					value: 1.0
				},
				pointSize: {
					type: 'f',
					value: 2
				},
				fogDistance: {
					type: 'f',
					value: 630.0
				},
				camPos: {
					type: 'v3',
					value: super.getCamera().position
				},
				addedRadius: {
					type: 'f',
					value: 500.0
				},
				amplitude: {
    				type: 'f',
    				value: 0
  				},
  				alpha: {
  					type: 'f',
  					value: 0.085
  				}
			}

			var camFolder = gui.addFolder("Camera");
			this._camera = super.getCamera();
			var camX = camFolder.add(this._camera.position,"x", -1000, 1000);
			camX.onChange(function(value) {
				this._camera.position.x = value;
			}.bind(this));


			var fog = camFolder.add(this.uniforms.fogDistance,"value", 0, 2000);
			fog.onChange(function(value) {
				this.uniforms.fogDistance.value = value;
			}.bind(this));
			folder.add(this.uniforms.alpha, 'value', 0.00, 1.00);

			var psfolder = folder.addFolder('Point Size');
			psfolder.add(this.uniforms.pointSize, 'value', 1, 5);

			var radfolder = folder.addFolder('Sphere Radius');
			var radGUI = radfolder.add(this.uniforms.radius, 'value', 50, 500);
			radGUI.onChange(function(value) {
				for (var i = 0; i < this.spots.length; ++i) {
					this.spots[i].sphereRad = value;
					this.spots[i].changeRadius();
				}
				var mSphereScale:number = value / 3;

				this.middleSphere.scale.set(mSphereScale, mSphereScale, mSphereScale);
			}.bind(this));


			this.attributes = {
			  start: {
			    type: 'v2',
			    value: []
			  },
			  dest: {
			    type: 'v2',
			    value: []
			  },
			  distance: {
			    type: 'f',
			    value: []
			  },
			  distFrac: {
			    type: 'f',
			    value: []
			  },
			  outFrac: {
			  	type: 'f',
			  	value: []
			  },
			  displacement: {
		    	type: 'f',
		    	value: []
			  },
			  gap: {
			   	type: 'f',
			   	value: []
			  }
			};
			this.particleList = [];

			this.sphereCtn = new THREE.Object3D();

			this.spots = [];
			var nbSpot = document.getElementById("projects").getElementsByClassName("project").length;
 

			document.addEventListener(webglExp.SphereAnimation.ON_OVER, this.mouseOver, false);
			document.addEventListener(webglExp.SphereAnimation.ON_OUT, this.mouseOut, false);
			document.addEventListener(webglExp.SphereAnimation.ON_CLICK, this.mouseClick, false);

			var aspect:number = Scene3D.WIDTH / Scene3D.HEIGHT;

			for(var i:number = 0; i < nbSpot; i++) {
				var phi = Math.acos(-1 + ( 2 * i ) / (nbSpot));

				var theta = Math.sqrt((nbSpot) * Math.PI) * phi;
				var spot:webglExp.HotSpot = new webglExp.HotSpot(theta, phi, i);
				spot.sphereRad = this.uniforms.radius.value;

				

				this.spots.push(spot);

				var projectName:string = (<HTMLElement>document.querySelectorAll(".project-slug").item(i)).getAttribute("name");

				var button:THREE.Mesh = spot.createPlane(super.getCamera(), projectName);

				spot.overPlane.scale.y = spot.overPlane.scale.x = 30;	

				this.buttonCtn.add(button);
				button.lookAt(new THREE.Vector3());
			}

			webglExp.Particle.addedSpeed = 0.0;



			this.buildThetra();

			for(var i:number = 0; i < 5000; i++) {
				var p:webglExp.Particle = new webglExp.Particle(this.spots);
				this.attributes.start.value.push(p.start);
				this.attributes.dest.value.push(p.dest);
				this.attributes.distFrac.value.push(p.distFrac);
				this.attributes.distance.value.push(p.distance);
				this.attributes.displacement.value.push(10 + Math.random() * 20);
				this.attributes.gap.value.push(i * 0.5);
				this.attributes.outFrac.value.push(1);
				this.particleList.push(p);
				superGeom.vertices.push(p);
			}

			// this.sphere = 


			var shaderMaterial:THREE.ShaderMaterial =
		  	new THREE.ShaderMaterial({
			    vertexShader:   shaders.vertex,
			    fragmentShader: shaders.fragment,
			    uniforms: this.uniforms,
			    attributes: this.attributes,
            	//blending: THREE.AdditiveBlending,
			    side: THREE.DoubleSide,
			    transparent:true
		  	});

			var sphereCenter:THREE.Vector3 = new THREE.Vector3();

			superGeom.computeFaceNormals();
			superGeom.computeVertexNormals();
			this.superMesh = new THREE.Line(superGeom, shaderMaterial);

			// this.superMesh =  <THREE.Mesh>THREE.SceneUtils.createMultiMaterialObject(superGeom, materials);
			
			/*var obj:THREE.Object3D = THREE.SceneUtils.createMultiMaterialObject(superGeom, materials);
			console.log(this.sphereCtn);*/
			this.sphereCtn.add(this.superMesh);
			this.bloomScene.add(this.sphereCtn);

			this.mouseVel = new webglExp.MouseSpeed(0.01);
			this.mSpeed = 0;

			this.createBGPass();
			this.createButtonPasses();
			this.createPasses();
			this.createBloomPasses();

			this.getCamera().lookAt(this.superMesh.position);

			
			this.frame = 0;
			this.bloomStrength = 12;

			this.inTransition = true;
			this.lookAt = new THREE.Vector3();

			this.inStartTransition = true;
			this.startCounter = 0;
			this.start();
		}

		buildThetra() {

			var geom:THREE.TetrahedronGeometry = new THREE.TetrahedronGeometry(1, 3);
			
			this.tetraAttr = {
		  		displacement: {
			    	type: 'f',
			    	value: []
			  	},
			  	gap: {
			    	type: 'f',
			    	value: []
			  	},
			  	appear: {
			    	type: 'f',
			    	value: []
			  	}
			};

			this.tetraUniforms = {
  				amplitude: {
    				type: 'f',
    				value: 0
  				},
  				pointAmplitude: {
    				type: 'f',
    				value: 0.0
  				},
  				pointsTo: {
    				type: 'v3',
    				value: new THREE.Vector3(1, 1, 1)
  				}
			};

			this.introThetra = [];
			var tetraVertices = geom.vertices;
			for (var i = 0; i < tetraVertices.length; ++i) {
				this.tetraAttr.appear.value.push(0.0);
				this.introThetra.push({t : 0.0});
				this.tetraAttr.displacement.value.push(Math.random() * 0.3);
				this.tetraAttr.gap.value.push(i * 0.5);
			}

			var shaderT = GLAnimation.SHADERLIST.thetradron;
			var shadTetrahedron:THREE.ShaderMaterial =
		  	new THREE.ShaderMaterial({
			    vertexShader:   shaderT.vertex,
			    fragmentShader: shaderT.fragment,
			    uniforms: this.tetraUniforms,
			    attributes: this.tetraAttr,
			    side: THREE.DoubleSide
		  	});

		  	this.tetraUniforms.pointsTo.value = new THREE.Vector3(1, 1, 1);

			this.middleSphere = new THREE.Mesh(geom, shadTetrahedron);
			
			this.sceneCtn.add(this.middleSphere);
		}

		start() {

			

			for (var i = 0; i < this.spots.length; ++i) {
				this.spots[i].sphereRad = this.uniforms.radius.value;
				this.spots[i].changeRadius();
				TweenLite.to(this.spots[i].uniforms.alpha, 2, { value: 1.0, delay: 4 + i * 0.5 });
			}

			/*this.skipIntro();
			return;*/
			
			super.getCamera().position.z = 0;
			super.getCamera().position.x = this.uniforms.radius.value + 50;
			this.lookAt = new THREE.Vector3(0, 0, -this.uniforms.radius.value);
			
			this.sphereCtn.rotation.y = Math.PI * 4 + Math.random() * Math.PI * 3;
			var maxTime:number = 0;
			TweenLite.to(this.sphereCtn.rotation, 10, { y : 0, ease: Sine.easeInOut});
			maxTime = Math.max(maxTime, 10);

			TweenLite.to(this.background.uniforms.alpha, 3, { value: 1, ease:Sine.easeOut });
			
			TweenLite.to(this.uniforms.radius, 5, { value : 130, ease: Strong.easeInOut, delay: 2 });
			maxTime = Math.max(maxTime, 7);

			super.getCamera().position.set(0, 0, 500);

			for (var i = 0; i < this.introThetra.length; ++i) {
				var t:number = 1 + Math.random() * 0.3;
				var d:number = (i * 0.001 + Math.random() * .01) + 5;
				TweenLite.to(this.introThetra[i], t, { t : 1.0, ease:Expo.easeInOut, delay: d });
				maxTime = Math.max(maxTime, d + t);
			}

			this.dummyAnim = 0;
			TweenLite.to(this, maxTime, { dummyAnim : 1, onComplete: this.transitionDone});
			

			

		}

		transitionDone = () => {
			this.inStartTransition = false;
			this.startDone();
		}

		skipIntro() {
			// super.getCamera().position.set(0, 0, 500);
			super.getCamera().lookAt(new THREE.Vector3());

			this.startDone();
		}

		startDone() {
			super.enableCameraAround(this.sphereCtn, document.getElementById("sphere-buttons"));
			this.inTransition = false;
			var intro:HTMLElement = (<HTMLElement>document.getElementById("intro"));
			var containerIntro:HTMLElement = (<HTMLElement>document.querySelectorAll("#intro .container").item(0));
			(<HTMLElement>document.querySelectorAll("#intro").item(0)).classList.add("show");
		}

		getPointOnSphere(lat:number, lng:number):THREE.Vector3 {
			var r:number = this.uniforms.radius.value + 10;
			return new THREE.Vector3(Math.cos(lat) * Math.cos(lng) * r, Math.cos(lat) * Math.sin(lng) * r, Math.sin(lat) * r);
		}

		mouseOver = (event) => {
			SphereAnimation.overID = event.detail.id;
			TweenLite.to(webglExp.Particle, .3, { addedSpeed : 0.01 });
			TweenLite.to(this.tetraUniforms.pointAmplitude, .4, { value: 1.0 });
			this.tetraUniforms.pointsTo.value = this.spots[event.detail.id].overPlane.position;
			// this.blurh = 2.3;
			TweenLite.to(THREE.BloomPass.blurX, .3, { x : this.blurh / (Scene3D.WIDTH * 2) });
			TweenLite.to(THREE.BloomPass.blurY, .3, { y : this.blurh / (Scene3D.HEIGHT * 2) });
		}

		mouseOut = (event) => {
			SphereAnimation.overID = -1;
			TweenLite.to(webglExp.Particle, 3, { addedSpeed : 0.0 });
			// this.blurh = 0.7;
			TweenLite.to(this.tetraUniforms.pointAmplitude, .4, { value: 0.0 });
			TweenLite.to(THREE.BloomPass.blurX, .3, { x : this.blurh / (Scene3D.WIDTH * 2) });
			TweenLite.to(THREE.BloomPass.blurY, .3, { y : this.blurh / (Scene3D.HEIGHT * 2) });
		}

		mouseClick = (event:CustomEvent) => {
			this.inOutTransition = true;
			this.outCounter = 0;

			this.toHref = event.detail.href;

			for (var j:number = 0; j < this.spots.length; ++j) {
				this.spots[j].exit();
				TweenLite.to(this.spots[j].uniforms.alpha, 2, { value: 0.0, delay: 1 + j * 0.5 });
			}

			
			TweenLite.to(this.sphereCtn.rotation, 3, { y : 0, x: 0, z: 0, ease: Sine.easeInOut });
			// TweenLite.to(this.uniforms.radius, 5, { value : 0, ease: Strong.easeInOut, delay: 2 });
			for (var i = 0; i < this.introThetra.length; ++i) {
				TweenLite.to(this.introThetra[i], 1 + Math.random() * 2, { t : 0.0, ease:Expo.easeInOut });
			}

			TweenLite.to(this.bgMesh.rotation, 3, { x: -Math.PI / 2, delay: 4, ease:Sine.easeOut });
			TweenLite.to(this.bgMesh.position, 3, { x: 0, y: -450, delay: 4, z: super.getCamera().position.z - 700, ease:Sine.easeOut });
			TweenLite.to(this.lookAt, 3, { 	x : 0, y: super.getCamera().position.y - 70, 
											z: super.getCamera().position.z - 100, 
											ease: Sine.easeInOut, 
											delay: 4, onComplete: this.exit });
		}

		exit = () => {
			var event:CustomEvent = super.getLeaveEvent();
			event.detail.href = this.toHref;
			event.detail.scroll = this.background.uniforms.scroll.value;
			document.dispatchEvent(event);
		}

		updateAfterReset() {
			this.attributes.start.needsUpdate = true;
			this.attributes.dest.needsUpdate = true;
			this.attributes.distFrac.needsUpdate = true;
			this.attributes.distance.needsUpdate = true;
		}

		clear() {
			document.removeEventListener(webglExp.SphereAnimation.ON_OVER, this.mouseOver, false);
			document.removeEventListener(webglExp.SphereAnimation.ON_OUT, this.mouseOut, false);
			document.removeEventListener(webglExp.SphereAnimation.ON_CLICK, this.mouseClick, false);

			for (var i = this.buttonScene.children.length - 1; i >= 0; i--) {
			 	this.buttonScene.remove(this.buttonScene.children[i]);
			}
			this.buttonScene = null;

			for (var i = this.bloomScene.children.length - 1; i >= 0; i--) {
			 	this.bloomScene.remove(this.bloomScene.children[i]);
			}
			this.bloomScene = null;

			for (var i = this.bgScene.children.length - 1; i >= 0; i--) {
			 	this.bgScene.remove(this.bgScene.children[i]);
			}
			this.bgScene = null;

			for (var i = this.spots.length - 1; i >= 0; i--) {
				this.spots[i].clear();
			}

			super.disableCameraAround(document.getElementById("sphere-buttons"));

			super.clear();
		}

		resize() {
			this.background.resize(Scene3D.WIDTH, Scene3D.HEIGHT);

			this.composer.getComposer().setSize(Scene3D.WIDTH, Scene3D.HEIGHT);
			this.composerButton.getComposer().setSize(Scene3D.WIDTH, Scene3D.HEIGHT);
			this.composerBackground.getComposer().setSize(Scene3D.WIDTH, Scene3D.HEIGHT);
			this.composerBloom.getComposer().setSize(Scene3D.WIDTH, Scene3D.HEIGHT);
			this.blendComposer.setSize(Scene3D.WIDTH, Scene3D.HEIGHT);

			this.blendPass.uniforms["tBackground"].value = this.composerBackground.getComposer().renderTarget2;
			this.blendPass.uniforms["tDiffuse1"].value = this.composer.getComposer().renderTarget2;
			this.blendPass.uniforms["tDiffuse2"].value = this.composerBloom.getComposer().renderTarget2;
			this.blendPass.uniforms["tDiffuse3"].value = this.composerButton.getComposer().renderTarget2;

		    super.resize();
		}

		render() {

			for(var j:number = 0; j < this.spots.length; j++) {
				this.spots[j].render();
			}

			for(var i:number = 0; i < this.particleList.length; i++) {
				var p:webglExp.Particle = this.particleList[i];
				p.render();

				if(this.outCounter > i) {
					p.outRender();
					this.attributes.outFrac.value[i] = p.outFrac;
				}

				if(this.startCounter > i) {
					p.inRender();
					this.attributes.outFrac.value[i] = p.outFrac;
				}

				this.attributes.start.value[i] = p.start;
				this.attributes.dest.value[i] = p.dest;
				this.attributes.distFrac.value[i] = p.distFrac;
				this.attributes.distance.value[i] = p.distance;
			}

			this.attributes.distFrac.needsUpdate = true;
			this.attributes.start.needsUpdate = true;
			this.attributes.dest.needsUpdate = true;
			this.attributes.distance.needsUpdate = true;

			this.background.render();

			if(this.inStartTransition || this.inOutTransition) {
				for (var i = 0; i < this.tetraAttr.appear.value.length; ++i) {
					this.tetraAttr.appear.value[i] = this.introThetra[i].t;
				}
				this.tetraAttr.appear.needsUpdate = true;
				this.attributes.outFrac.needsUpdate = true;

				this.startCounter += 500;
				this.outCounter += 500;

				var mSphereScale:number = this.uniforms.radius.value - 80;

				this.middleSphere.scale.set(mSphereScale, mSphereScale, mSphereScale);

				for (var i = 0; i < this.spots.length; ++i) {
					this.spots[i].sphereRad = this.uniforms.radius.value;
					this.spots[i].changeRadius();
				}
			}

			this.frame += 0.1;
			this.tetraUniforms.amplitude.value = this.frame;
			this.uniforms.amplitude.value = this.frame * 0.05;
			this.background.uniforms.time.value = this.frame;
			if(!this.inTransition) {

				var xDir:number = this.background.scrollSpeed.x;
				var yDir:number = this.background.scrollSpeed.y;
				this.background.scrollSpeed.y += (super.getControl().oldOr.x - super.getControl().orientation.x) * 20;
				this.background.scrollSpeed.x += (super.getControl().oldOr.y - super.getControl().orientation.y) * 10;
				this.background.direction.set(	Math.sign(this.background.scrollSpeed.x - xDir), 
												Math.sign(this.background.scrollSpeed.y - yDir));
			}
			
			this.sceneCtn.quaternion.copy(this.sphereCtn.quaternion);
			this.buttonCtn.quaternion.copy(this.sphereCtn.quaternion);

			/*if(super.getIsTurning()) {
				this.mSpeed += (this.mouseVel.distSquared - this.mSpeed) * 0.1;
 				this.effectBloom.copyUniforms[ "opacity" ].value = this.bloomStrength + 0.2 * (this.mSpeed);
			} else {
				this.mSpeed += (0 - this.mSpeed) * 0.2;
 				this.effectBloom.copyUniforms[ "opacity" ].value = this.bloomStrength + 0.2 * (this.mSpeed);
			}*/

			if(this.inTransition) {
				/*if(this.inCurve) {
					var curvPos:THREE.Vector3 = this.camCurve.getPointAt(this.curvPerc);
					//super.getCamera().position.set(curvPos.x, curvPos.y, curvPos.z);
					//this.lookAt = this.camCurve.getPointAt(Math.max(0, this.curvPerc - 0.05));
				}*/


				/*this.currlookAt.x += (this.lookAt.x - this.currlookAt.x) * 0.01;
				this.currlookAt.y += (this.lookAt.y - this.currlookAt.y) * 0.01;
				this.currlookAt.z += (this.lookAt.z - this.currlookAt.z) * 0.01;
				super.getCamera().lookAt(this.currlookAt);*/
			}
				super.getCamera().lookAt(this.lookAt);


			this.composerBackground.getComposer().render();
			this.composer.getComposer().render();
			this.composerButton.getComposer().render();
			this.composerBloom.getComposer().render();
			this.blendComposer.render();

			// this._renderer.render(super.getScene(), super.getCamera());

			super.render();
		}


		createBloomPasses() {
			var renderPass = new THREE.RenderPass(this.bloomScene, this.getCamera(), null, new THREE.Color(0, 0, 0), 0);
			renderPass.clear = false;
			this.bloomStrength = 7;
			this.effectBloom = new THREE.BloomPass(this.bloomStrength, 20, 8.0, 512, true);
			this.blurh = 6;

			THREE.BloomPass.blurX = new THREE.Vector2( this.blurh / (Scene3D.WIDTH * 2), 0.0 );
			THREE.BloomPass.blurY = new THREE.Vector2( 0.0, this.blurh / (Scene3D.HEIGHT * 2) );

			var bloomFolder = this.composer.folder.addFolder("Bloom");

			var strengthFolder = bloomFolder.addFolder("strength");
			strengthFolder.add(this.effectBloom.copyUniforms[ "opacity" ], "value", 0.00, 30.00);


			var vbGUI = this.composer.folder.add(this, "blurh", 0.00, 30.00);
			vbGUI.onChange(function(value) {
				THREE.BloomPass.blurX = new THREE.Vector2( value / (Scene3D.WIDTH * 2), 0.0 );
				THREE.BloomPass.blurY = new THREE.Vector2( 0.0, value / (Scene3D.HEIGHT * 2) );
			}.bind(this));


			this.blendPass = new THREE.ShaderPass( <any>THREE.BlendShader );
			this.blendPass.uniforms["tBackground"].value = this.composerBackground.getComposer().renderTarget2;
			this.blendPass.uniforms["tDiffuse1"].value = this.composer.getComposer().renderTarget2;
			this.blendPass.uniforms["tDiffuse2"].value = this.composerBloom.getComposer().renderTarget2;
			this.blendPass.uniforms["tDiffuse3"].value = this.composerButton.getComposer().renderTarget2;
			this.blendPass.renderToScreen = true;

			/*var copyPass = new THREE.ShaderPass(<any>THREE.CopyShader);
			copyPass.renderToScreen = true;*/


			var renderPass2 = new THREE.RenderPass(this.buttonScene, this.getCamera(), null, new THREE.Color(0, 0, 0), 0);
			

			this.composerButton.getComposer().renderTarget1.stencilBuffer = true;
			this.composerButton.getComposer().renderTarget2.stencilBuffer = true;

			this.composerBloom.addPass(renderPass);
			this.composerBloom.addPass(this.effectBloom);

			this.blendComposer.addPass(this.blendPass);
			// this.blendComposer.addPass(copyPassBt);
		}

		createBGPass() {
			var renderPass = new THREE.RenderPass(this.bgScene, this.getCamera());
			this.composerBackground.addPass(renderPass);
		}

		createPasses() {
			var renderPass = new THREE.RenderPass(this.getScene(), this.getCamera());
			this.composer.addPass(renderPass);
		}

		createButtonPasses() {
			var renderPass = new THREE.RenderPass(this.buttonScene, this.getCamera(), null, new THREE.Color(0, 0, 0), 0);
			this.composerButton.addPass(renderPass);
		}
	}
}
