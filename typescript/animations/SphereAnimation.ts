/// <reference path="../../web/app/themes/portfolio/vendors/DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="../../web/app/themes/portfolio/vendors/DefinitelyTyped/greensock/greensock.d.ts" />
/// <reference path="../core/GLAnimation.ts" />
/// <reference path="../core/EffectComposer.ts" />
/// <reference path="../core/Scene3D.ts" />
/// <reference path="../helper/ThreeToDom.ts" />
/// <reference path="../helper/ThreeAddOns.ts" />
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

		private geomSize:number;

		private domEl:HTMLElement;
		private overEl:HTMLElement;
		private three2Dom:webglExp.ThreeToDom;

		private overEvent:CustomEvent;
		private outEvent:CustomEvent;
		private clickEvent:CustomEvent;

		private isExiting:boolean;

		constructor(x:number, y:number, id:number) {
			this.rad = 0.5 + Math.random() * 0.2;
			this.pos = new THREE.Vector2(x, y);
			this.id = id;

			this.overEvent = webglExp.Tools.createCustomEvent(webglExp.SphereAnimation.ON_OVER);
			this.outEvent = webglExp.Tools.createCustomEvent(webglExp.SphereAnimation.ON_OUT);
			this.clickEvent = webglExp.Tools.createCustomEvent(webglExp.SphereAnimation.ON_CLICK);
		}

		createPlane(camera:THREE.PerspectiveCamera, projectName:string):THREE.Mesh {

			this.projectName = projectName;

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
					value: 0
				}
			};

			var shaders = GLAnimation.SHADERLIST.foglight;
			var mat:THREE.ShaderMaterial =
			  	new THREE.ShaderMaterial({
				    vertexShader:   shaders.vertex,
				    fragmentShader: shaders.fragment,
				    uniforms: this.uniforms,
				    side: THREE.DoubleSide,
				    transparent:true
			  	});
			this.geomSize = 5;
			var geom:THREE.SphereGeometry = new THREE.SphereGeometry(this.geomSize, 5, 5);
			this.overPlane = new THREE.Mesh(geom, mat);
			var oPlanePos:THREE.Vector3 = this.convert(this.pos, this.sphereRad + this.geomSize);
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

		elementClick = (event:MouseEvent) => {
			event.preventDefault();
			this.clickEvent.detail.id = this.id;
			this.clickEvent.detail.href = this.href;
			document.dispatchEvent(this.clickEvent);
		}

		over = (event) => {
			this.overEvent.detail.id = this.id;
			document.dispatchEvent(this.overEvent);


			this.overEl.style.left = (this.three2Dom.middlePos.x - this.overEl.offsetWidth / 2) + "px";
			this.overEl.style.top = (this.three2Dom.middlePos.y + this.overEl.offsetHeight) + "px";

			this.overEl.classList.add("over");

		}

		out = (event) => {
			this.outEvent.detail.id = this.id;
			document.dispatchEvent(this.outEvent);

			this.overEl.classList.remove("over");
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
			var oPlanePos:THREE.Vector3 = this.convert(this.pos, this.sphereRad + this.geomSize);
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

			if(this.isExiting) {
				var oPlanePos:THREE.Vector3 = this.convert(this.pos, this.sphereRad + this.geomSize);
				this.overPlane.position.set(oPlanePos.x, oPlanePos.y, oPlanePos.z);
			}
		}

		clear() {
			this.domEl.parentNode.removeChild(this.domEl);
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
			
			this.start = this.pos = this.dest = this.randSpot().randPoint(5);
			this.reset();
			this.distFrac = Math.random();

			var v:THREE.Vector3 = this.convert(this.start);
			this.set(v.x,v.y,v.z);

			
		}

		reset = () => {
			this.startSpot = (SphereAnimation.overID !== -1) ? this.randSpot(SphereAnimation.overID) : this.randSpot();
			this.start = this.startSpot.pos;

			this.speed = 0.005 + Math.random() * 0.03;
			this.distFrac = 0;
			this.currSpot = this.randSpot(this.startSpot.id, true);
			this.spotRad = Math.random() * this.currSpot.rad;
			this.dest = this.currSpot.randPoint(this.spotRad);

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

	export class SphereAnimation extends webglExp.GLAnimation {

		public static ON_OVER:string = "hs_over";
		public static ON_OUT:string = "hs_out";
		public static ON_CLICK:string = "hs_click";

		public static overID:number;

		private _renderer:THREE.WebGLRenderer;
		private _camera:THREE.PerspectiveCamera;
		private composer:webglExp.EffectComposer;
		private composerBloom:webglExp.EffectComposer;
		private composerButton:webglExp.EffectComposer;
		private blendComposer;
		private bloomScene:THREE.Scene;
		private buttonScene:THREE.Scene;
		private blendPass;

		private particleList:webglExp.Particle[];
		private superMesh:THREE.PointCloud;
		private sphereCtn:THREE.Object3D;
		private sceneCtn:THREE.Object3D;
		private buttonCtn:THREE.Object3D;

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

		constructor(scene:THREE.Scene, camera:THREE.PerspectiveCamera, renderer:THREE.WebGLRenderer) {

			super(scene, camera, renderer);

			super.setID("sphere");

			super.getLeaveEvent().detail.name = super.getID();

			SphereAnimation.overID = -1;

			super.setInternalRender(true);

			this._renderer = super.getRenderer();
		    this._renderer.autoClear = false;

		    this.bloomScene = new THREE.Scene();
		    this.buttonScene = new THREE.Scene();


			var gui = super.getGui().get_gui();


		    // Gamma settings make things look 'nicer' for some reason
		    this._renderer.gammaInput = true;
		    this._renderer.gammaOutput = true;

		    this.composer = new webglExp.EffectComposer(this._renderer, scene, camera, Scene3D.WIDTH, Scene3D.HEIGHT);
		    this.composerBloom = new webglExp.EffectComposer(this._renderer, this.bloomScene, camera, Scene3D.WIDTH, Scene3D.HEIGHT);
		    this.composerButton = new webglExp.EffectComposer(this._renderer, this.bloomScene, camera, Scene3D.WIDTH, Scene3D.HEIGHT);
		    
		    var renderTargetParams = {	minFilter: THREE.LinearFilter,
        								magFilter: THREE.LinearFilter, 
        								format: THREE.RGBAFormat,
        								stencilBuffer: true };

			var rt:THREE.WebGLRenderTarget = new THREE.WebGLRenderTarget(Scene3D.WIDTH, Scene3D.HEIGHT, renderTargetParams);

		    this.blendComposer = new THREE.EffectComposer(this._renderer);
		    
		    this.composer.folder = gui.addFolder("Effect Composer");

		    this.sceneCtn = new THREE.Object3D();
		    this.buttonCtn = new THREE.Object3D();

		    scene.add(this.sceneCtn);
		    this.buttonScene.add(this.buttonCtn);

			super.getCamera().position.z = -500;
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

			var folder = gui.addFolder('Sphere Animation');

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

			for(var i:number = 0; i < nbSpot; i++) {
				var phi = Math.acos(-1 + ( 2 * i ) / (nbSpot - 1));

				var theta = Math.sqrt((nbSpot - 1) * Math.PI) * phi;
				var spot:webglExp.HotSpot = new webglExp.HotSpot(theta, phi, i);
				spot.sphereRad = this.uniforms.radius.value;
				this.spots.push(spot);

				var projectName:string = (<HTMLElement>document.querySelectorAll(".project-slug").item(i)).getAttribute("name");

				var button:THREE.Mesh = spot.createPlane(super.getCamera(), projectName);
				this.buttonCtn.add(button);
				button.lookAt(new THREE.Vector3());
			}

			webglExp.Particle.addedSpeed = 0.0;

			for(var i:number = 0; i < 20000; i++) {
				var p:webglExp.Particle = new webglExp.Particle(this.spots);
				this.attributes.start.value.push(p.start);
				this.attributes.dest.value.push(p.dest);
				this.attributes.distFrac.value.push(p.distFrac);
				this.attributes.distance.value.push(p.distance);
				this.attributes.displacement.value.push(4 + Math.random() * 4);
				this.attributes.gap.value.push(i * 0.5);
				this.attributes.outFrac.value.push(1);
				this.particleList.push(p);
				superGeom.vertices.push(p);
			}

			this.buildThetra();

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
			this.superMesh = new THREE.PointCloud(superGeom, shaderMaterial);

			// this.superMesh =  <THREE.Mesh>THREE.SceneUtils.createMultiMaterialObject(superGeom, materials);
			
			/*var obj:THREE.Object3D = THREE.SceneUtils.createMultiMaterialObject(superGeom, materials);
			console.log(this.sphereCtn);*/
			this.sphereCtn.add(this.superMesh);
			this.bloomScene.add(this.sphereCtn);

			this.mouseVel = new webglExp.MouseSpeed(0.01);
			this.mSpeed = 0;

			this.createButtonPasses();
			this.createPasses();
			this.createBloomPasses();

			this.getCamera().lookAt(this.superMesh.position);

			
			this.start();
		}

		buildThetra() {

			var geom:THREE.TetrahedronGeometry = new THREE.TetrahedronGeometry(1, 2);
			
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
			    side: THREE.DoubleSide,
			    transparent:true
		  	});

		  	this.tetraUniforms.pointsTo.value = new THREE.Vector3(1, 1, 1);

			this.middleSphere = new THREE.Mesh(geom, shadTetrahedron);
			
			this.sceneCtn.add(this.middleSphere);
		}

		start() {
			this.frame = 0;
			// this.uniforms.radius.value = 150;
			this.bloomStrength = 12;

			

			for (var i = 0; i < this.spots.length; ++i) {
				this.spots[i].sphereRad = this.uniforms.radius.value;
				this.spots[i].changeRadius();
				TweenLite.to(this.spots[i].uniforms.alpha, 2, { value: 1.0, delay: 4 + i * 0.5 });
			}

			/*this.skipIntro();
			return;*/

			this.inTransition = true;
			this.lookAt = new THREE.Vector3();

			this.inStartTransition = true;
			this.startCounter = 0;
			
			super.getCamera().position.z = 0;
			super.getCamera().position.x = this.uniforms.radius.value + 50;
			this.lookAt = new THREE.Vector3(0, 0, -this.uniforms.radius.value);
			
			this.sphereCtn.rotation.y = Math.PI * 4 + Math.random() * Math.PI * 3;
			var maxTime:number = 0;
			TweenLite.to(this.sphereCtn.rotation, 10, { y : 0, ease: Sine.easeInOut});
			maxTime = Math.max(maxTime, 10);
			
			TweenLite.to(this.uniforms.radius, 5, { value : 150, ease: Strong.easeInOut, delay: 2 });
			maxTime = Math.max(maxTime, 7);

			super.getCamera().position.set(0, 0, 500);

			for (var i = 0; i < this.introThetra.length; ++i) {
				TweenLite.to(this.introThetra[i], 1 + Math.random() * 2, { t : 1.0, ease:Expo.easeInOut, delay: (i * 0.1 + Math.random() * .05) + 7 });
				maxTime = Math.max(maxTime, ((i * 0.1 + Math.random() * .05) + 7) + (1 + Math.random() * 2));
			}

			this.dummyAnim = 0;
			TweenLite.to(this, maxTime, { dummyAnim : 1, onComplete: this.transitionDone});
			

			

		}

		transitionDone = () => {
			this.inStartTransition = false;
			this.startDone();
		}

		skipIntro() {
			super.getCamera().position.set(0, 0, 500);
			super.getCamera().lookAt(new THREE.Vector3());

			this.startDone();
		}

		startDone() {
			this.inTransition = false;
			super.enableCameraAround(this.sphereCtn, document.getElementById("sphere-buttons"));
			var intro:HTMLElement = (<HTMLElement>document.getElementById("intro"));
			var containerIntro:HTMLElement = (<HTMLElement>document.querySelectorAll("#intro .container").item(0));
			intro.classList.add("show");
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
			this.blurh = 2.0;
			TweenLite.to(THREE.BloomPass.blurX, .3, { x : this.blurh / (Scene3D.WIDTH * 2) });
			TweenLite.to(THREE.BloomPass.blurY, .3, { y : this.blurh / (Scene3D.HEIGHT * 2) });
		}

		mouseOut = (event) => {
			SphereAnimation.overID = -1;
			TweenLite.to(webglExp.Particle, .3, { addedSpeed : 0.0 });
			this.blurh = 1.0;
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
				TweenLite.to(this.spots[j].uniforms.alpha, 2, { value: 0.0, delay: 1 + i * 0.5 });
			}

			TweenLite.to(this.sphereCtn.rotation, 6, { y : Math.PI * 2 + Math.random() * Math.PI * 2, ease: Sine.easeIn });
			TweenLite.to(this.uniforms.radius, 5, { value : 0, ease: Strong.easeInOut, delay: 2, onComplete: this.exit });
			for (var i = 0; i < this.introThetra.length; ++i) {
				TweenLite.to(this.introThetra[i], 1 + Math.random() * 2, { t : 0.0, ease:Expo.easeInOut, delay: i * 0.1 + Math.random() * .3 });
			}
		}

		exit = () => {
			var event:CustomEvent = super.getLeaveEvent();
			event.detail.href = this.toHref;
			document.dispatchEvent(event);
		}

		updateAfterReset() {
			this.attributes.start.needsUpdate = true;
			this.attributes.dest.needsUpdate = true;
			this.attributes.distFrac.needsUpdate = true;
			this.attributes.distance.needsUpdate = true;
		}

		clear() {
			for (var i = this.buttonScene.children.length - 1; i >= 0; i--) {
			 	this.buttonScene.remove(this.buttonScene.children[i]);
			}
			this.buttonScene = null;

			for (var i = this.bloomScene.children.length - 1; i >= 0; i--) {
			 	this.bloomScene.remove(this.bloomScene.children[i]);
			}
			this.bloomScene = null;

			for (var i = this.spots.length - 1; i >= 0; i--) {
				this.spots[i].clear();
			}
			super.clear();
		}

		resize() {
			this.composer.getComposer().setSize(Scene3D.WIDTH, Scene3D.HEIGHT);
			this.composerButton.getComposer().setSize(Scene3D.WIDTH, Scene3D.HEIGHT);
			this.composerBloom.getComposer().setSize(Scene3D.WIDTH, Scene3D.HEIGHT);
			this.blendComposer.setSize(Scene3D.WIDTH, Scene3D.HEIGHT);

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

			if(this.inStartTransition || this.inOutTransition) {
				for (var i = 0; i < this.tetraAttr.appear.value.length; ++i) {
					this.tetraAttr.appear.value[i] = this.introThetra[i].t;
				}
				this.tetraAttr.appear.needsUpdate = true;
				this.attributes.outFrac.needsUpdate = true;

				this.startCounter += 500;
				this.outCounter += 500;

				var mSphereScale:number = this.uniforms.radius.value / 3;

				this.middleSphere.scale.set(mSphereScale, mSphereScale, mSphereScale);

				for (var i = 0; i < this.spots.length; ++i) {
					this.spots[i].sphereRad = this.uniforms.radius.value;
					this.spots[i].changeRadius();
				}
			}

			this.frame += 0.1;
			this.tetraUniforms.amplitude.value = this.frame;
			this.uniforms.amplitude.value = this.frame * 0.05;

			this.sceneCtn.quaternion.copy(this.sphereCtn.quaternion);
			this.buttonCtn.quaternion.copy(this.sphereCtn.quaternion);

			if(super.getIsTurning()) {
				this.mSpeed += (this.mouseVel.distSquared - this.mSpeed) * 0.1;
 				this.effectBloom.copyUniforms[ "opacity" ].value = this.bloomStrength + 0.2 * (this.mSpeed);
			} else {
				this.mSpeed += (0 - this.mSpeed) * 0.2;
 				this.effectBloom.copyUniforms[ "opacity" ].value = this.bloomStrength + 0.2 * (this.mSpeed);
			}

			if(this.inTransition) {
				/*if(this.inCurve) {
					var curvPos:THREE.Vector3 = this.camCurve.getPointAt(this.curvPerc);
					//super.getCamera().position.set(curvPos.x, curvPos.y, curvPos.z);
					//this.lookAt = this.camCurve.getPointAt(Math.max(0, this.curvPerc - 0.05));
				}*/

				super.getCamera().lookAt(this.lookAt);

				/*this.currlookAt.x += (this.lookAt.x - this.currlookAt.x) * 0.01;
				this.currlookAt.y += (this.lookAt.y - this.currlookAt.y) * 0.01;
				this.currlookAt.z += (this.lookAt.z - this.currlookAt.z) * 0.01;
				super.getCamera().lookAt(this.currlookAt);*/
			}


			this.composer.getComposer().render();
			this.composerButton.getComposer().render();
			this.composerBloom.getComposer().render();
			this.blendComposer.render();

			// this._renderer.render(super.getScene(), super.getCamera());

			super.render();
		}


		createBloomPasses() {
			var renderPass = new THREE.RenderPass(this.bloomScene, this.getCamera());
			
			// renderPass.clear = false;
			this.bloomStrength = 0;
			this.effectBloom = new THREE.BloomPass(this.bloomStrength, 20, 8.0, 512, true);
			this.blurh = 1.0;

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
			this.blendPass.uniforms["tDiffuse1"].value = this.composer.getComposer().renderTarget2;
			this.blendPass.uniforms["tDiffuse2"].value = this.composerBloom.getComposer().renderTarget2;
			this.blendPass.uniforms["tDiffuse3"].value = this.composerButton.getComposer().renderTarget2;
			this.blendPass.renderToScreen = true;


			this.composerBloom.addPass(renderPass);
			this.composerBloom.addPass(this.effectBloom);
			this.blendComposer.addPass(this.blendPass);
		}

		createPasses() {
			var renderPass = new THREE.RenderPass(this.getScene(), this.getCamera());
			this.composer.addPass(renderPass);
		}

		createButtonPasses() {
			var renderPass = new THREE.RenderPass(this.buttonScene, this.getCamera());
			this.composerButton.addPass(renderPass);
		}
	}
}
