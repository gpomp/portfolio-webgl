/// <reference path="../../web/app/themes/portfolio/vendors/DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="../../web/app/themes/portfolio/vendors/DefinitelyTyped/greensock/greensock.d.ts" />
/// <reference path="../../web/app/themes/portfolio/vendors/DefinitelyTyped/svgjs/svgjs.d.ts" />
/// <reference path="../core/GLAnimation.ts" />
/// <reference path="../core/Scene3D.ts" />
/// <reference path="../core/EffectComposer.ts" />
/// <reference path="../helper/ThreeAddOns.ts" />
/// <reference path="../helper/ThreeToDom.ts" />
/// <reference path="../helper/polyfill.ts" />
/// <reference path="../helper/Title.ts" />
declare var page;
declare var _gaq;

module webglExp {
	interface Point {
	    x:number;
	    y:number;
	}

	export class Floor extends THREE.Mesh {

		public static vNumber:number = 100;

		constructor(geometry:THREE.PlaneBufferGeometry, material:THREE.ShaderMaterial) {
		    super(geometry, material);
		}
	}


	export class MaskImg {

		public requestRender:boolean;
		public isDone:boolean;
		public ctnEl:HTMLElement;

		private image;
		private imageWidth;
		private imageHeight;
		private imgReady:boolean;

		private callback:Function;
		private ctn:HTMLElement;
		private bg:NodeList;
		private reveal:number;

		private toLoad:HTMLImageElement;

		constructor(url:string, ctn:Node, callback:Function, id:number, reveal:number = 0) {
			this.reveal = reveal;
			this.ctn = <HTMLElement>ctn;
			this.ctnEl = <HTMLElement>(<HTMLElement>ctn).querySelectorAll(".images > div").item(id);
			this.callback = callback;

			this.toLoad = document.createElement("img");
			this.toLoad.addEventListener("load", this.imgLoaded);
			this.toLoad.setAttribute("src", url);
		}

		imgLoaded = (event) => {
			this.imageWidth = this.toLoad.clientWidth;
			this.imageHeight = this.toLoad.clientHeight;
			var h = this.ctn.offsetWidth / this.toLoad.width * this.toLoad.height ;			
			for (var i = 0; i < this.ctnEl.querySelectorAll("img").length; ++i) {
				var img:HTMLElement = <HTMLElement>this.ctnEl.querySelectorAll("img").item(i);
				img.setAttribute("src", img.getAttribute("data-src"));
				img.style.top = (i * -100) + "%";
			}

			this.ctnEl.style.width = this.ctn.offsetWidth + "px";
			this.ctnEl.style.height = h + "px";

			this.callback();
			this.imgReady = true;
		}

		middleTimeout = () => {
			
		}

		show() {
			this.buildBG();
			this.isDone = true;
		}

		buildBG():number {
			this.bg = this.ctnEl.querySelectorAll("div.bg > div");
			var t:number = .25;
			for (var i = 0; i < this.bg.length; ++i) {
				var el:HTMLElement = <HTMLElement>this.bg[i];

				TweenLite.to(el, t, { rotationX: "0deg", delay: i * t, ease: Back.easeOut });
				TweenLite.to(el, .1, { opacity: 1, delay: i * t, ease: Back.easeOut });
			}
			(<HTMLElement>this.ctnEl.querySelectorAll("div.shadow").item(0)).classList.add("show");
			return this.bg.length * t;
		}

		hide() {

			this.bg = this.ctnEl.querySelectorAll("div.bg > div");
			var count:number = 0;
			(<HTMLElement>this.ctnEl.querySelectorAll("div.shadow").item(0)).classList.remove("show");

			for (var i = this.bg.length - 1; i > -1; --i) {
				var el:HTMLElement = <HTMLElement>this.bg[i];

				TweenLite.to(el, .15, { rotationX: "-90deg", delay: count * .15, ease: Sine.easeOut });
				TweenLite.to(el, .1, { opacity: 0, delay: count * .15 + .05, ease: Sine.easeOut });
				count++;
			}
		}

		reset() {
			this.isDone = false;
		}

		resize() {
			var h = this.ctn.offsetWidth / this.toLoad.width * this.toLoad.height ;			
			for (var i = 0; i < this.ctnEl.querySelectorAll("img").length; ++i) {
				var img:HTMLElement = <HTMLElement>this.ctnEl.querySelectorAll("img").item(i);
				img.setAttribute("src", img.getAttribute("data-src"));
				img.style.top = (i * -100) + "%";
			}

			this.ctnEl.style.width = this.ctn.offsetWidth + "px";
			this.ctnEl.style.height = h + "px";
		}
	} 

	export class Gallery {

		public nbLoaded:number;
		private svg;
		private ctn:Node;

		private ready:boolean;

		private width:number;
		private height:number;
		private imgList:NodeList;
		private svgList:webglExp.MaskImg[];

		private callback:Function;

		constructor(ctn:Node, callback:Function) {
			this.callback = callback;
			this.ctn = ctn;

			this.imgList = (<HTMLElement>ctn).querySelectorAll("img.main");
			this.svgList = [];
			var nbImage = this.imgList.length;
			this.nbLoaded = 0;
			for (var i = 0; i < nbImage; ++i) {
				var imgMask:webglExp.MaskImg = new webglExp.MaskImg((<HTMLImageElement>this.imgList[i]).getAttribute("data-src"), ctn, this.imgLoaded, i, Math.floor(Math.random() * 5));
				
				this.svgList.push(imgMask);
			}			
		}

		resize() {

			for (var i = 0; i < this.svgList.length; ++i) {
				this.svgList[i].resize();
			}

			this.placeImages();
		}

		imgLoaded = () => {
			this.nbLoaded++;
			if(this.nbLoaded >= this.imgList.length) {
				this.placeImages();
				this.launch();
			}
		}

		placeImages() {
			var y:number = 0;
			var angle:number = 5;
			var z:number = 0;
			for (var i = 0; i < this.svgList.length; ++i) {
				var el:HTMLElement = this.svgList[i].ctnEl;
				var dir:number = (i%2 === 0) ? 1 : -1;
				var translate:string = "translate3d(0, "+ y +"px, " + z + "px)";
				var rotate:string = "rotateX(" + (dir * angle) + "deg)";
				el.style[utils.Prefix.transformPrefix()] = translate + " " + rotate;
				var h:number = el.clientHeight;
				var rad:number = dir * angle * Math.PI / 180;
				z += Math.sin(rad) * h;
				y += Math.cos(rad) * h;
			}
			(<HTMLElement>this.ctn).style.height = (y + 30) + "px";
		}

		launch() {
			this.ready = true;
			this.showImage(0);
			this.callback();
		}

		hide() {
			for (var i = 0; i < this.svgList.length; ++i) {
				this.svgList[i].hide();
			}
		}

		reset() {
			for (var i = 0; i < this.svgList.length; ++i) {
				this.svgList[i].reset();
			}
			this.launch();
		}

		showImage(id:number) {
			if(this.ready && !this.svgList[id].isDone) this.svgList[id].show();
		}

		render() {

		}

		checkImages() {
			var h:number = window.innerHeight;
			for (var i = 0; i < this.svgList.length; ++i) {
				var node:HTMLElement = <HTMLElement>this.svgList[i].ctnEl;
				var br = node.getBoundingClientRect();
				var t:number = br.top;
				if(t > 0 && (t + br.height * .5) - h < 0) this.showImage(i);
			}
		}
			
	}

	export class Project extends THREE.Object3D {

		public projectID:number;
		public link:HTMLElement;
		public projectHTML:HTMLElement;
		public galleryReady:boolean;
		public galleryLoading:boolean;
		public inAnimation:boolean;

		private planeList:THREE.Mesh[];
		private sizeList:any[];
		private clickPlane:webglExp.ThreeToDom[];
		private three2Dom:webglExp.ThreeToDom;

		private GUTTER:number = 5;

		private size;

		private ctn:THREE.Object3D;
		private camera:THREE.PerspectiveCamera;

		private totalTexture:number;
		private currTexture:number;

		public uniforms;
		public attributes;
		private fracTween:any[];

		private mesh:THREE.Mesh;

		private gallery:webglExp.Gallery;

		private event:CustomEvent;

		private scrollV:number;
		private dummy:number;

		private title:webglExp.Title;

		constructor(id:number, camera:THREE.PerspectiveCamera) {
		    super();
		    this.projectID = id;
		    this.planeList = [];
		    this.sizeList = [];
		    this.clickPlane = [];
		    this.camera = camera;
		    this.totalTexture = 6;
		    this.currTexture = 0;

		    this.inAnimation = false;

		    this.createButton();

		    var geometry:THREE.OctahedronGeometry = new THREE.OctahedronGeometry(1, 2);
		    geometry.computeFaceNormals();
		    geometry.computeVertexNormals();
		   	this.size = { width: 50, height: 50 };
			// console.log(this.title.getObject());


		    var shaders = (Site.activeDeviceType === 'touch') ? GLAnimation.SHADERLIST.dotImage_mobile : GLAnimation.SHADERLIST.dotImage;

			this.uniforms = {
				camPosition: {
			    	type: 'v3',
			    	value: this.camera.position
			  	}
			};

			this.attributes = {
			  displacement: {
		    	type: 'v3',
		    	value: []
			  },
			  frac: {
			   	type: 'f',
			   	value: []
			  }
			};

			var mat:THREE.ShaderMaterial =
		  	new THREE.ShaderMaterial({
			    vertexShader:   shaders.vertex,
			    fragmentShader: shaders.fragment,
			    uniforms: this.uniforms,
			    attributes: this.attributes,
			    side: THREE.DoubleSide
		  	});

		  	this.fracTween = [];

		  	for (var i = 0; i < geometry.vertices.length; ++i) {
		  		this.attributes.displacement.value.push(new THREE.Vector3(0, 0, 0));
		  		this.attributes.frac.value.push(0);
		  		this.fracTween.push({ f : 0 });
		  	}

		  	this.mesh = new THREE.Mesh(geometry, mat);
		  	this.mesh.scale.set(this.size.width, this.size.width, this.size.width);
			this.add(this.mesh);

			this.projectHTML = <HTMLElement>document.getElementById("projects").querySelectorAll('.project').item(id);


		   
			
			this.gallery = null;
		}

		createTitle() {

		   	this.title = new webglExp.Title();
			this.add(this.title.getObject());
		}

		resize() {
			if(this.gallery !== null) {
				this.gallery.resize();
			}

			this.placeTitle();

			
 		}

		openProject() { 
			if(!this.galleryLoading) {
				this.projectHTML.classList.add("show");
				var text:HTMLElement = (<HTMLElement>this.projectHTML.querySelectorAll(".text").item(0));
				text.classList.add("show");
			}
			if(!this.galleryReady && !this.galleryLoading) {
				var imageDiv:Node = this.projectHTML.querySelectorAll('.images').item(0);
				this.gallery = new webglExp.Gallery(imageDiv, this.launchGallery);
				this.galleryLoading = true;
			} else if(!this.galleryLoading) {
				this.gallery.reset();
			}
		}

		checkGallery() {
			if(this.gallery !== null) {
				this.gallery.checkImages();
			}
		}

		disableRelative = () => {
		}

		launchGallery = () => {
			this.galleryReady = true;
			this.galleryLoading = false;
		}

		getRandomPointAround(signX:number, signY:number):THREE.Vector3 {
			var v:THREE.Vector3 = new THREE.Vector3();
			v.z = this.position.z;
			signX = (Math.random() > .5) ? -1 : 1;
			signY = (Math.random() > .5) ? -1 : 1;
			v.y = this.position.y + signY * (this.size.width * 3);

			v.x = this.position.x + signX * (this.size.width * 3);

			return v;
		}

		update(speed?:number) {
			this.mesh.rotation.y += speed * ((Math.PI * 2) / 100);
		}

		createButton() {
			this.link = <HTMLElement>document.querySelectorAll("#projects-buttons a").item(this.projectID);
			this.link.addEventListener('click', this.goToProject);
		}

		goToProject = (event) => {
			event.preventDefault();
			page(this.link.getAttribute("href"));
			_gaq.push(['_trackEvent', 'projects', 'clicked', this.link.getAttribute("href")]);
		}

		leaveFront() {
			this.inAnimation = true;
			this.title.hide();
			var longest:number = 0;
			for (var i = 0; i < this.fracTween.length; ++i) {
				var t:number = .1 + Math.random() * 0.2;
				var d:number = 1 + Math.random() * 0.3;
				TweenLite.to(this.fracTween[i], t, { f : 0, delay: d });
				longest = Math.max(longest, t + d);
			}
			this.dummy = 0;
			TweenLite.to(this, longest, { dummy: 1,  onComplete: this.endAnimation });

			this.gallery.hide();
	
			(<HTMLElement>this.projectHTML.querySelectorAll(".text").item(0)).classList.remove("show");

			TweenLite.to(document.getElementById("projects"), 1.4, { scrollTop: 0, onComplete:this.hideProject })

		}

		hideProject = () => {
			this.projectHTML.classList.remove("show");
		}

		cameraInFront() {
			this.inAnimation = true;
			this.placeTitle();
			this.title.show();

			var longest:number = 0;
			for (var i = 0; i < this.fracTween.length; ++i) {
				var t:number = 0.1 + Math.random() * 0.07;
				var d:number = i * 0.01;
				TweenLite.to(this.fracTween[i], t, { f : 1, delay: d });
				longest = Math.max(longest, t + d);
			}
			this.dummy = 0;
			TweenLite.to(this, longest, { dummy: 1,  onComplete: this.endAnimation });

		}

		placeTitle() {
			this.title.setText(this.projectHTML.querySelectorAll("h1").item(0).textContent.toUpperCase());
			
			var diffObj = this.camera.position.z - this.position.z;
			
			var vFov:number = this.camera.fov * (Math.PI / 180);
			var height = 2 * Math.tan( vFov / 2 ) * diffObj;
			var fractionY = this.title.canvas.height / height;

			var aspect = Scene3D.WIDTH / Scene3D.HEIGHT;
			var width = height * aspect;
			
			this.title.getObject().scale.x = width;
			this.title.getObject().scale.y = width / this.title.canvas.width * this.title.canvas.height;
			this.title.getObject().position.y = 140;
			this.title.getObject().rotation.x = this.camera.rotation.x;
		}

		endAnimation = () => {
			this.inAnimation = false;
		}

		render() {
			this.attributes.displacement.needsUpdate = true;
			this.attributes.frac.needsUpdate = true;

			// this.title.getObject().lookAt(this.camera.position);

			for (var i = 0; i < this.fracTween.length; ++i) {
				this.attributes.frac.value[i] = this.fracTween[i].f;
			}
		}

		renderGallery() {
			/*this.title.getObject().lookAt(this.camera.position);
			this.title.rotation.copy(this.camera.rotation);*/
			this.title.render();
			
		}

		clear() {
			this.link.removeEventListener('click', this.goToProject);
		}
	}

	export class ProjectsAnimation extends webglExp.GLAnimation {
		public blurh;
		private _renderer:THREE.WebGLRenderer;

		private attributes;
		private uniforms;

		private floor:webglExp.Floor;
		private shaderMaterial:THREE.ShaderMaterial;

		private particleList:THREE.Vector3[];
		
		private composer:webglExp.EffectComposer;
		private composerObjects:webglExp.EffectComposer;
		private blendComposer;
		private blendPass;

		private renderPass;
		private effectBloom;
		private effectBlurH;
		private effectBlurV;
		private effectFXAA;
		private bloomStrength;


		private projectsList:webglExp.Project[];
		private project:webglExp.Project;

		private cameraCurve:THREE.SplineCurve3;
		private isCamMoving:boolean;
		private isBluring:boolean;
		private posOnPath:number;

		private currProject:number;
		private projectToGo:number;
		private inProject:boolean;
		private scrollVal:number;
		private currScroll:number;

		private objectScene:THREE.Scene;

		private mouseVel:webglExp.MouseSpeed;
		private mSpeed:number;

		private buttonList:NodeList;

		private isStarted:boolean;

		private nextPrev:HTMLElement;

		private onProjectY:number;

		private frame:number;
		private floorCtn:THREE.Object3D;

		private isBackToSphere:boolean;

		private cylinder:THREE.Mesh;
		private cylinderCtn:THREE.Object3D;
		private cUniforms;

		constructor(scene:THREE.Scene, camera:THREE.PerspectiveCamera, renderer:THREE.WebGLRenderer, startScroll:THREE.Vector2, frame:number, index?:number) {

			super(scene, camera, renderer);

			// startScroll = new THREE.Vector2(5000, 5000);

			super.setInternalRender(true);

			super.setID("projects");

			super.getLeaveEvent().detail.name = super.getID();

			this.objectScene = new THREE.Scene();

			this._renderer = super.getRenderer();
			this._renderer.gammaInput = true;
		    this._renderer.gammaOutput = true;
		    this._renderer.autoClear = true;

			var squareWidth:number = 1500;
			var objSize:THREE.Vector2 = this.getWidthHeight();


			this.frame = frame;

			this.uniforms = {
		    	time: {
    				type: 'f',
    				value: this.frame
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
    				value: 1.0
  				},

		    	ratio: {
    				type: 'f',
    				value: 0.0
  				},

  				mousePos: {
  					type: 'v2',
  					value:new THREE.Vector2()
  				},

  				scroll: {
  					type: 'v2',
  					value:new THREE.Vector2(startScroll.x, -startScroll.y)
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
  					value: THREE.ImageUtils.generateDataTexture(4, 4, new THREE.Color(0x000000))
  				},

  				shadowRatio: {
  					type: 'f',
  					value: 0.0
  				},

  				hole: {
  					type: 'v2',
  					value: new THREE.Vector2(0.0, 0.0)
  				},

  				holeRatio: {
  					type: 'f',
  					value: 0.0
  				}
  				
		    };

			var folder = super.getGui().get_gui().addFolder("Projects Animation");
			var fogFolder = folder.addFolder("Fog");
			fogFolder.add(this.uniforms.fogRatio, "value", 0.0, 1.0);

			super.getCamera().rotation.set(0, 0, 0);
			super.getCamera().position.x = startScroll.x;
			super.getCamera().position.z = -startScroll.y;
			var fnb:number =  (Site.activeDeviceType === 'touch') ? Math.floor(webglExp.Floor.vNumber / 2) : webglExp.Floor.vNumber;
			var floorGeom:THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(objSize.x, objSize.y, fnb, fnb);

			this.particleList = [];
			var shaders = (Site.activeDeviceType === 'touch') ? GLAnimation.SHADERLIST.bgsphere_mobile : GLAnimation.SHADERLIST.bgsphere;

			this.shaderMaterial =
		  	new THREE.ShaderMaterial({
			    vertexShader:   shaders.vertex,
			    fragmentShader: shaders.fragment,
			    uniforms: this.uniforms
		  	});

		  	this.floor = new webglExp.Floor(floorGeom, this.shaderMaterial);

		  	this.floorCtn = new THREE.Object3D();
		  	this.floor.rotation.x = -Math.PI / 2;
		  	this.floorCtn.position.y = -450;

		  	this.floorCtn.add(this.floor);
		  	super.getScene().add(this.floorCtn);
		  	this.createCylinders();


		  	this.currProject = -1;
		  	this.project = null;

			this.buttonList = document.querySelectorAll("#projects-buttons a");
		  	this.nextPrev = <HTMLElement>document.getElementById("next-prev");
			Array.prototype.forEach.call(this.buttonList, function(el:HTMLElement, i:number) {
				window.setTimeout(function() {
					el.classList.add("show");
				}, 750 + i * 200);
			}.bind(this));

			this.floorCtn.position.z = super.getCamera().position.z - 700;
			this.floorCtn.position.x = super.getCamera().position.x;

			super.getCamera().lookAt(new THREE.Vector3(super.getCamera().position.x, super.getCamera().position.y - 70, super.getCamera().position.z - 100));

		  	this.createProjects();

		  	this.mSpeed = 0;
		  	this.mouseVel = new webglExp.MouseSpeed(0.01);

		  	this.createPostEffects();

			TweenLite.to(this.uniforms.colRatio, 3, { value:1, delay:1.5, ease: Sine.easeOut });
			TweenLite.to(this.uniforms.fogRatio, 3, { value:0.5, delay:0.5, ease: Sine.easeOut });
			TweenLite.to(this.uniforms.blackRatio, 5, { value:1.0, delay:0.5, ease: Sine.easeOut });
			TweenLite.to(this.uniforms.wnoiseRatio, 5, { value:0.5, delay:0.5, ease: Sine.easeOut });

			this.isStarted = false;

			this.onProjectY = 0;

			this.scrollVal = this.currScroll = 0;
			document.getElementById("projects").addEventListener("scroll", this.projectScroll);

			this.isBackToSphere = false;

			this.launchProject(index, true);

			(<HTMLElement>document.querySelectorAll("#next-prev a.left").item(0)).addEventListener("click", this.prevProject);
			(<HTMLElement>document.querySelectorAll("#next-prev a.right").item(0)).addEventListener("click", this.nextProject);

			(<HTMLElement>document.querySelectorAll("#open-menu").item(0)).addEventListener('click', this.clickToggleMenu);
		}

		setGridSize() {
			var s:THREE.Vector2 = this.getWidthHeight();
			this.uniforms.width.value = s.x;
			this.uniforms.height.value = s.y;
			this.floorCtn.remove(this.floor);
			var floorGeom:THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(s.x, s.y, webglExp.Floor.vNumber, webglExp.Floor.vNumber);
			this.floor = new webglExp.Floor(floorGeom, this.shaderMaterial);
			this.floorCtn.add(this.floor);
			this.floor.rotation.x = -Math.PI / 2;

		}

		getWidthHeight():THREE.Vector2 {
			var vFOV = super.getCamera().fov * Math.PI / 180; 
			var height = 2 * Math.tan( vFOV / 2 ) * 700;

			var aspect = Scene3D.WIDTH /  Scene3D.HEIGHT;
			var width = height * aspect;
			return new THREE.Vector2(width + width * .5, width + width * .5);
		}

		clickToggleMenu = (event:MouseEvent) => {
			event.preventDefault();
			this.toggleMenu();
		}

		toggleMenu() {
			(<HTMLElement>document.querySelectorAll("#projects-buttons").item(0)).classList.toggle("open");
			(<HTMLElement>document.querySelectorAll("#open-menu").item(0)).classList.toggle("open");
		}


		prevProject = (event:MouseEvent) => {
			event.preventDefault();
			var index:number = this.projectToGo <= 0 ? this.buttonList.length - 2 : this.projectToGo - 1;
			this.launchProject(index, true);
		}

		nextProject = (event:MouseEvent) => {
			event.preventDefault();
			var index:number = this.projectToGo >= this.buttonList.length - 2 ? 0 : this.projectToGo + 1;
			this.launchProject(index, true);
		}



		projectScroll = (event:MouseEvent) => {
			var projects:HTMLElement = <HTMLElement>event.target;
			this.projectsMove(projects);
		}

		projectsMove(projects:HTMLElement) {
			var v:number = projects.scrollTop / (projects.scrollHeight - window.innerHeight);
			this.scrollVal = v * -150;

			this.project.checkGallery();
		}

		createPostEffects() {

		    this.composer = new webglExp.EffectComposer(this._renderer, super.getScene(), super.getCamera(), Scene3D.WIDTH, Scene3D.HEIGHT);
		    this.composerObjects = new webglExp.EffectComposer(this._renderer, this.objectScene, super.getCamera(), Scene3D.WIDTH, Scene3D.HEIGHT);
			
			var renderTargetParams = {	minFilter: THREE.LinearFilter,
        								magFilter: THREE.LinearFilter, 
        								format: THREE.RGBAFormat,
        								stencilBuffer: true };
			var rt:THREE.WebGLRenderTarget = new THREE.WebGLRenderTarget(Scene3D.WIDTH, Scene3D.HEIGHT, renderTargetParams);

			this.blendComposer = new THREE.EffectComposer(this._renderer, rt);
			this.blurh = 2;
			THREE.BloomPass.blurX = new THREE.Vector2( this.blurh / (Scene3D.WIDTH * 2), 0.0 );
			THREE.BloomPass.blurY = new THREE.Vector2( 0.0, this.blurh / (Scene3D.HEIGHT * 2) );
			

			var objectRender = new THREE.RenderPass(this.objectScene, super.getCamera());
			this.composerObjects.addPass(objectRender);

			var bloomStrength = 11;
			this.effectBloom = new THREE.BloomPass(bloomStrength, 25, 5.0, 1024);
			this.renderPass = new THREE.RenderPass(this.getScene(), super.getCamera());
			this.renderPass.clear = false;
			this.composer.addPass(this.renderPass);
			// this.composer.addPass(this.effectBloom);

			this.blendPass = new THREE.ShaderPass( <any>THREE.BlendShader );
			this.blendPass.uniforms["tBackground"].value = THREE.ImageUtils.generateDataTexture(4, 4, new THREE.Color(0x000000));
			this.blendPass.uniforms["tDiffuse1"].value = THREE.ImageUtils.generateDataTexture(4, 4, new THREE.Color(0x000000));
			this.blendPass.uniforms["tDiffuse2"].value = this.composer.getComposer().renderTarget2;
			this.blendPass.uniforms["tDiffuse3"].value = this.composerObjects.getComposer().renderTarget2;
			this.blendPass.renderToScreen = true;

			
			this.blendComposer.addPass(this.blendPass);
			//this.sceneBlured();

		}

		createCylinders() {
			var geom:THREE.CylinderGeometry = new THREE.CylinderGeometry(210.0, 150.0, 3000.0, 20, 32, true, 0, Math.PI * 2);
			
			var shaders = (Site.activeDeviceType === 'touch') ? GLAnimation.SHADERLIST.cylinder_mobile : GLAnimation.SHADERLIST.cylinder;

			this.cUniforms = {
				time: {
					type: 'f',
					value: 0.0
				},
				alphaRatio: {
					type: 'f',
					value: 0.0
				}
			};

			var mat:THREE.ShaderMaterial =
		  	new THREE.ShaderMaterial({
			    vertexShader:   shaders.vertex,
			    fragmentShader: shaders.fragment,
			    uniforms: this.cUniforms, 
			    side:THREE.DoubleSide,
			    transparent: true
		  	});

			//var mat:THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000, transparent:true, opacity: 0.5, side:THREE.DoubleSide});

			this.cylinder = new THREE.Mesh(geom, mat);

			this.cylinderCtn = new THREE.Object3D();
			this.cylinderCtn.add(this.cylinder);
			super.getScene().add(this.cylinderCtn);

			this.cylinderCtn.position.y = -480;

			this.cylinder.position.y = 600;
			this.cylinder.rotation.y = Math.PI / 2;

			this.cylinder.scale.x = 0.01;
			this.cylinder.scale.z = 0.01;

			this.cylinderCtn.position.z = super.getCamera().position.z - 700;
			this.cylinderCtn.position.x = super.getCamera().position.x;
		}

		createProjects() {
			this.projectsList = [];
			var z:number = super.getCamera().position.z - 1000;
			for (var i = 0; i < this.buttonList.length - 1; ++i) {
				var project:webglExp.Project = new webglExp.Project(i, super.getCamera());
		  		this.objectScene.add(project); 
		  		project.position.set(super.getCamera().position.x + -100 + Math.random() * 200, super.getCamera().position.y + -100 + Math.random() * 200, z);
		  		project.createTitle();

		  		this.projectsList.push(project);


		  		z -= 4000 + Math.random() * 4000;
			}

			var link:HTMLElement = <HTMLElement>document.querySelectorAll("#projects-buttons a.sphere").item(0);
			link.addEventListener('click', this.clickBackToSphere, false);
		}

		clickBackToSphere = (event:MouseEvent) => {
			event.preventDefault();
			if(this.isBackToSphere) return;
			_gaq.push(['_trackEvent', 'projects', 'clicked', "backsphere"]);
			this.isBackToSphere = true;
			this.closeProject();
			this.toggleMenu();
		}

		backtoSphere() {
			Array.prototype.forEach.call(this.buttonList, function(el:HTMLElement, i:number) {
				window.setTimeout(function() {
					el.classList.remove("show");
				}, 750 + i * 200);
			});
			this.calcRoute(this.projectsList[this.projectsList.length - 1], true);
			this.posOnPath = 0;
			this.isCamMoving = true;
			TweenLite.to(this, 8, { posOnPath : 1, ease:Expo.easeIn, onComplete: this.clearProjects });
			TweenLite.to(this.uniforms.alpha, 2, { value: 0, ease:Sine.easeOut, delay : 6 });
		}

		launchProject(index:number, disableMenu?:boolean) {
			this.projectToGo = index;
			this.openProject(disableMenu);

			Array.prototype.forEach.call(this.buttonList, function(el:HTMLElement, i:number) {
				el.classList.remove("active");
			}.bind(this));

			(<HTMLElement>this.buttonList.item(index)).classList.add("active");
		}

		openProject(disableMenu?:boolean) {
			if(!disableMenu) this.toggleMenu();
			if(this.inProject) this.closeProject();
			else this.showProject();
		}

		closeProject() {
			this.inProject = false;
			this.isBluring = true;
			this.projectsList[this.currProject].leaveFront();

			this.nextPrev.classList.remove("show");

			
			TweenLite.to(this.cylinder.scale, 2, { x: 0.01, z: 0.01, ease:Expo.easeInOut, onComplete: this.holeOff });
			if(this.isBackToSphere) {
				TweenLite.to(this.uniforms.holeRatio, 2, { value:0.0, ease:Expo.easeInOut });
				this.backtoSphere();
			} else {
				TweenLite.to(this.uniforms.holeRatio, 2, { value:0.0, ease:Expo.easeInOut, onComplete: this.showProject });
			}
			
		}

		holeOff = () => {
			this.cUniforms.alphaRatio.value = 0.0;
		}

		showProject = () => {
			this.project = null;
			this.project = this.projectsList[this.projectToGo];
			// this.toggleBlurPass(false);
			var project = this.projectsList[this.projectToGo];
			this.isCamMoving = true;
			this.posOnPath = 0;
			this.calcRoute(project);
			var speed:number = Math.abs(this.projectToGo - this.currProject) / this.projectsList.length * (this.projectsList.length * 2);

			this.currProject = this.projectToGo;
			var ease = Expo.easeInOut;
			if(!this.isStarted) {
				speed += 2;
				ease = Strong.easeInOut;
			}

			this.scrollVal = this.currScroll = 0;
			(<HTMLElement>document.getElementById("projects")).scrollTop = 0;

			this.isStarted = true;
			TweenLite.to(this, speed, { posOnPath : 1, ease: ease, onComplete: this.atProject, overwrite:"all" })
		}

		calcRoute(project:webglExp.Project, toSphere?:boolean) {
			var camCurves:THREE.Vector3[] = [];
			var camPos:THREE.Vector3 = super.getCamera().position.clone();
			camCurves.push(camPos);
			var min = Math.min(camPos.z, project.position.z);
			var max = Math.max(camPos.z, project.position.z);
			var projList:webglExp.Project[] = this.projectsList.slice();
			var backwards:boolean = false;
			if(camPos.z < project.position.z) {
				projList.sort(function(a, b) {
					return (a.position.z > b.position.z) ? 1 : 0;
				});
				backwards = true;
			}
			var signX:number = 1;
			var signY:number = -1;
			for (var i = 0; i < projList.length; ++i) {
				var p:webglExp.Project = projList[i];
				if(p.position.z < max && p.position.z > min && (p.id !== project.id || toSphere)) {
					camCurves.push(p.getRandomPointAround(signX, signY));
					signX *= -1;
					signY *= -1;
				}
			}

			if(backwards) {
				camCurves.push(project.getRandomPointAround(signX, signY));
			}

			var v:THREE.Vector3 = project.position.clone();
			

			if(toSphere) {
				v.z -= 5000;
			}
			else {
				v.z += 500;
				v.y += 300;
			}

			camCurves.push(v);

			this.cameraCurve = new THREE.SplineCurve3(camCurves);
			var geom:THREE.Geometry = new THREE.Geometry();

		}

		atProject = () => {
			this.scrollVal = this.currScroll = 0;
			
			var points = this.cameraCurve.points;
			this.onProjectY = points[points.length - 1].y;
			this.projectsList[this.currProject].cameraInFront();
			this.isCamMoving = false;

			this.isBluring = true;
			TweenLite.to(this.uniforms.holeRatio, 2, { value:350.0, ease:Expo.easeInOut });
			this.cUniforms.alphaRatio.value = 1.0;
			TweenLite.to(this.cylinder.scale, 2, { x: 1, z: 1, ease:Expo.easeInOut, onComplete: this.sceneBlured });


			this.inProject = true;

		}

		toggleBlurPass(b:boolean) {
			
		}

		sceneBlured = () => {
			this.isBluring = false;

			this.project = this.projectsList[this.currProject];
			this.project.openProject();
			this.nextPrev.classList.add("show");
			this.projectsMove(<HTMLElement>this.project.projectHTML);
		}

		render() {
			this.frame += 0.1;
			if(this.isCamMoving) {
				var curvPos:THREE.Vector3 = this.cameraCurve.getPointAt(this.posOnPath);
				var speedZ:number = Math.abs(curvPos.z - super.getCamera().position.z) / 50;
				super.getCamera().position.set(curvPos.x, curvPos.y, curvPos.z);

				for (var i = 0; i < this.projectsList.length; ++i) {
					this.projectsList[i].update(speedZ);
				}
			}

			this.floorCtn.position.z = super.getCamera().position.z - 700;
			this.floorCtn.position.x = super.getCamera().position.x ;

			this.cylinderCtn.position.z = super.getCamera().position.z - 700;
			this.cylinderCtn.position.x = super.getCamera().position.x;

			this.uniforms.time.value = this.frame;
			this.cUniforms.time.value = this.frame;
			this.uniforms.scroll.value.y = -super.getCamera().position.z;
			this.uniforms.scroll.value.x = super.getCamera().position.x;

 			this.composer.getComposer().render();
 			this.composerObjects.getComposer().render();
 			this.blendComposer.render();
			super.render();

			for (var i = 0; i < this.projectsList.length; ++i) {
				if(this.projectsList[i].inAnimation) {
					this.projectsList[i].render();
				}
			}
 			

 			if(this.project !== null && this.project.galleryReady && this.inProject) {

 				this.project.renderGallery();
 				this.currScroll += (this.scrollVal - this.currScroll) * 0.1;
 				super.getCamera().position.y = this.onProjectY + this.currScroll;
 			}

 			
		}

		resize() {
			this.composer.getComposer().setSize(Scene3D.WIDTH, Scene3D.HEIGHT);
			this.composerObjects.getComposer().setSize(Scene3D.WIDTH, Scene3D.HEIGHT);
			this.blendComposer.setSize(Scene3D.WIDTH, Scene3D.HEIGHT);

			
			this.blendPass.uniforms["tBackground"].value = THREE.ImageUtils.generateDataTexture(4, 4, new THREE.Color(0x000000));
			this.blendPass.uniforms["tDiffuse1"].value = THREE.ImageUtils.generateDataTexture(4, 4, new THREE.Color(0x000000));
			this.blendPass.uniforms["tDiffuse2"].value = this.composer.getComposer().renderTarget2;
			this.blendPass.uniforms["tDiffuse3"].value = this.composerObjects.getComposer().renderTarget2;

			if(this.project !== null && this.project.galleryReady) {
				this.project.resize();
			}

			this.setGridSize();

			super.resize();
		}

		clearProjects = () => {
			var event:CustomEvent = super.getLeaveEvent();
			event.detail.href = "/";
			document.dispatchEvent(event);
		}

		clear() {
			console.log("clear projects");

			for (var i = 0; i < this.projectsList.length; ++i) {
				this.projectsList[i].clear();
			}
			document.getElementById("projects").removeEventListener("scroll", this.projectScroll);
			(<HTMLElement>document.querySelectorAll("#next-prev a.left").item(0)).removeEventListener("click", this.prevProject);
			(<HTMLElement>document.querySelectorAll("#next-prev a.right").item(0)).removeEventListener("click", this.nextProject);
			(<HTMLElement>document.querySelectorAll("#open-menu").item(0)).removeEventListener('click', this.clickToggleMenu);
			(<HTMLElement>document.querySelectorAll("#projects-buttons a.sphere").item(0)).removeEventListener('click', this.clickBackToSphere, false);

			this.blendPass.uniforms["tBackground"].value = null;
			this.blendPass.uniforms["tDiffuse1"].value = null;
			this.blendPass.uniforms["tDiffuse2"].value = null;
			this.blendPass.uniforms["tDiffuse3"].value = null;

			this.composer.getComposer().setSize(1, 1);
			this.composerObjects.getComposer().setSize(1, 1);
			this.blendComposer.setSize(1, 1);

			for (var i = this.objectScene.children.length - 1; i >= 0; i--) {
			 	this.objectScene.remove(this.objectScene.children[i]);
			}
			this.objectScene = null;
			

			super.clear();
		}
	}
}
