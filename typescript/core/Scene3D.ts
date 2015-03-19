/// <reference path="../../web/app/themes/portfolio/vendors/DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="GLAnimation.ts" />
/// <reference path="EffectComposer.ts" />
declare var page;

module webglExp {
	export class Scene3D {

		public static ASPECT:number;
		public static FAR:number;
		public static NEAR:number;
		public static VIEW_ANGLE:number;

		public static WIDTH:number;
		public static HEIGHT:number;

		private renderer:THREE.WebGLRenderer;
		private camera:THREE.PerspectiveCamera;
		private scene:THREE.Scene;

		private gui:webglExp.Gui;
		private stats:webglExp.PerfStats;

		private currentAnim:webglExp.GLAnimation;

		private shaderLoadedCB:Function;
		private scroll:THREE.Vector2;
		private frame:number;

		private body:HTMLElement;

		constructor(shaderLoadedCB:Function) {

			this.body = <HTMLElement>document.querySelectorAll("body").item(0);

			this.shaderLoadedCB = shaderLoadedCB;
			var allElements:NodeList = document.getElementsByTagName("script");
			var src:string = "";
		  	for (var i = 0, n = allElements.length; i < n; i++)
		  	{
		  		var e:HTMLElement = <HTMLElement>allElements.item(i);
		    	if (e.getAttribute("data-type") !== null && e.getAttribute("data-type") === "all-shaders")
		    	{
		     		src = e.getAttribute("data-src");
		    	}
		  	}

			var s:THREE.ShaderLoader = new THREE.ShaderLoader(src, this.shaderLoaded);
		}

		shaderLoaded = (data) => {
			console.log("SCENE3D:shaderLoaded");
			GLAnimation.SHADERLIST = data;
			Scene3D.WIDTH = window.innerWidth;
	      	Scene3D.HEIGHT = window.innerHeight;

	      	Scene3D.VIEW_ANGLE = 45;
	      	Scene3D.ASPECT = Scene3D.WIDTH / Scene3D.HEIGHT;
	      	Scene3D.NEAR = 0.1;
	      	Scene3D.FAR = 10000;

	      	this.gui = webglExp.Gui.gui;
	      	this.stats = new webglExp.PerfStats();

	      	
			this.renderer = new THREE.WebGLRenderer({devicePixelRatio: 1, autoClear:true, alpha: true});
			this.camera = new THREE.PerspectiveCamera(Scene3D.VIEW_ANGLE, Scene3D.ASPECT, Scene3D.NEAR, Scene3D.FAR);
			this.scene = new THREE.Scene();
			this.scene.add(this.camera);
			this.camera.name = "mainCamera";

			this.camera.position.z = 1000;

			this.scroll = new THREE.Vector2();
			this.frame = 0;

			this.renderer.setSize(Scene3D.WIDTH,Scene3D.HEIGHT);

			document.body.appendChild(this.renderer.domElement);
			this.renderer.domElement.setAttribute('id', 'canvas3D');
			document.addEventListener(webglExp.GLAnimation.ON_LEAVE_ANIMATION,this.leaveAnimation);

			this.currentAnim = null;
			
			this.render();

			this.shaderLoadedCB();
		}

		render = () => {
			requestAnimationFrame(this.render);
			this.stats.begin();
			if(this.currentAnim !== null) {
				if(!this.currentAnim.getInternalRender()) {
					this.renderer.render(this.scene, this.camera);
				}

				this.currentAnim.render();
			}
			
			this.stats.end();
			
		}

		leaveAnimation = (event:CustomEvent) => {
			this.currentAnim.clear();
			this.currentAnim = null;
			this.scroll = event.detail.scroll;
			this.frame = event.detail.frame;
			document.getElementById("projects").classList.remove("show");
			document.getElementById("projects-buttons").classList.remove("show");
			this.gui.clear();
			page(event.detail.href);
			
		}


		goToSphere = (ctx) => {
			this.body.classList.remove("sphere");
			this.body.classList.remove("projects");
			this.body.classList.add("sphere");
			this.currentAnim = new webglExp.SphereAnimation(this.scene, this.camera, this.renderer);
		}

		launchProject = (ctx) => {
			
			this.body.classList.remove("sphere");
			this.body.classList.remove("projects");
			this.body.classList.add("projects");
			var pList:NodeList = document.querySelectorAll("#projects .project");
			
			var startProject:HTMLElement = <HTMLElement>document.querySelectorAll("#projects .project." + ctx.params.projectName).item(0);
			
			var index:number = Array.prototype.slice.call(pList).indexOf(startProject);

			if(this.currentAnim !== null && this.currentAnim.getID() === "projects") {
				(<webglExp.ProjectsAnimation>this.currentAnim).launchProject(index);
			} else {
				document.getElementById("projects").classList.add("show");
				document.getElementById("projects-buttons").classList.add("show");
				this.currentAnim = new webglExp.ProjectsAnimation(this.scene, this.camera, this.renderer, this.scroll, this.frame, index);
			}

		}

		resize() {
			Scene3D.WIDTH = window.innerWidth;
	      	Scene3D.HEIGHT = window.innerHeight;

			this.camera.aspect = Scene3D.WIDTH / Scene3D.HEIGHT;
		    this.camera.updateProjectionMatrix();

		    this.renderer.setSize( Scene3D.WIDTH, Scene3D.HEIGHT );

		    this.currentAnim.resize();
		}
	}
}