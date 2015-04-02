/// <reference path="core/Scene3D.ts" />
/// <reference path="core/Gui.ts" />

declare var page;
declare var Modernizr;
declare var _gaq;

class Site {

	public static activeDevice:string;
	public static activeDeviceType:string;
 
	private mainScene;
	private aboutButton:HTMLElement;

	private siteReady:boolean;

	constructor() {
		this.siteReady = false;
		var detect:any = Detector;
		if (detect.webgl) {
			console.log("webgl!");
			new webglExp.Gui(); 
			this.mainScene = new webglExp.Scene3D(this.shaderLoaded);	

			this.deviceType();
			window.addEventListener("resize",this.resize);
		} else {
			console.log("uhoh no webgl!");
			this.configNonWebgl();
		}

		(<HTMLElement>document.querySelectorAll("#intro .hide-intro").item(0)).addEventListener('click', this.hideIntro);

		this.aboutButton = <HTMLElement>document.querySelectorAll(".showIntro").item(0);
		this.aboutButton.addEventListener("click", this.showAbout);
	}

	showAbout = (event) => {
		event.preventDefault();
		(<HTMLElement>document.querySelectorAll("#intro").item(0)).classList.add("show");
		_gaq.push(['_trackEvent', 'intro', 'clicked', 'showintro']);
	}

	configNonWebgl() {
		_gaq.push(['_trackPageview', '/nowebgl']);
		(<HTMLElement>document.querySelectorAll("html").item(0)).classList.add("no-threejs");
		(<HTMLElement>document.querySelectorAll("#open-menu").item(0)).addEventListener('click', this.clickToggleMenu);
			
		/*Buttons*/
		(<HTMLElement>document.querySelectorAll("#projects-buttons").item(0)).classList.add("show");
		var buttons:HTMLCollection = (<HTMLCollection>document.querySelectorAll("#projects-buttons a"));

		for (var i = 0; i < buttons.length; ++i) {
			var button:HTMLElement = (<HTMLElement>buttons.item(i));
			button.classList.add("show");
			button.setAttribute("href", "#" + button.getAttribute("href"));
			var self = this;
			button.addEventListener("click", function(event) {
				self.clickProject(event, this);
			});
		}

		/*Projects*/
		document.getElementById("projects").classList.add("show");
		var projects:HTMLCollection = (<HTMLCollection>document.querySelectorAll("#projects .project"));
		for (var i = 0; i < projects.length; ++i) {
			var project:HTMLElement = (<HTMLElement>projects.item(i));
			project.classList.add("show");
			(<HTMLElement>project.querySelectorAll(".text").item(0)).classList.add("show");
			var images:HTMLCollection = (<HTMLCollection>project.querySelectorAll("img"));

			for (var j = 0; j < images.length; ++j) {
				var img:HTMLElement = (<HTMLElement>images.item(j));
				img.setAttribute("src", img.getAttribute("data-src"));
			}
		}

		window.addEventListener('scroll', this.scroll);

		this.checkScroll();
	}


	scroll = (event) => {
		this.checkScroll();
	}

	checkScrollAnim = () => {
		this.checkScroll();
	}

	checkScroll() {
		var h:number = window.innerHeight;
		var projects:HTMLCollection = (<HTMLCollection>document.querySelectorAll("#projects .project"));
		for (var i = 0; i < projects.length; ++i) {
			var node:HTMLElement = <HTMLElement>projects[i];
			var br = node.getBoundingClientRect();
			var t:number = br.top;
			if(t + 30 > 0 && (t + 300) - h < 0) {
				if(!node.classList.contains("anim")) {
					node.classList.add("anim");
				}
				var pID:number = Array.prototype.indexOf.call(node.parentNode.children, node);
				var btn:HTMLElement = (<HTMLElement>document.querySelectorAll("#projects-buttons a").item(pID));
				if(!btn.classList.contains('active')) {
					var btnList:HTMLCollection = <HTMLCollection>document.querySelectorAll("#projects-buttons a");

					for (var i = 0; i < btnList.length; ++i) {
						(<HTMLElement>btnList.item(i)).classList.remove('active');
					}
					btn.classList.add('active');
				}
				break;
			}
		}
	}

	clickProject = (event, link) => {
		event.preventDefault();
		this.toggleMenu();
		var name:string = link.getAttribute("name");
		var project = (<HTMLElement>document.querySelectorAll("#projects .project." + name).item(0));
		var ctnTop = document.getElementById("projects").offsetTop;

		TweenLite.to(window, 1, {scrollTo:{ y: ctnTop + project.offsetTop, x: 0 }, ease: Expo.easeInOut, onComplete:this.checkScrollAnim});
	}

	clickToggleMenu = (event) => {
		event.preventDefault();
		this.toggleMenu();
	}

	toggleMenu() {
		(<HTMLElement>document.querySelectorAll("#projects-buttons").item(0)).classList.toggle("open");
		(<HTMLElement>document.querySelectorAll("#open-menu").item(0)).classList.toggle("open");
	}

	hideIntro = (event:MouseEvent) => {
		event.preventDefault();
		(<HTMLElement>document.querySelectorAll("#intro").item(0)).classList.remove("show");
		_gaq.push(['_trackEvent', 'intro', 'clicked', "hideintro"]);
	}

	shaderLoaded = () => {
		this.buildRoutes();
		page({hashbang:true});
		this.siteReady = true;
	}

	buildRoutes() {
		page("/", this.mainScene.goToSphere);
		page('/projects/:projectName', this.mainScene.launchProject);
	}

	resize = (event) => {
		this.deviceType();
		if(this.siteReady) {
			this.mainScene.resize();
		}
		
	}

	deviceType() {
		var istouch:boolean = (<HTMLElement>document.querySelectorAll("html").item(0)).classList.contains("touch");
		var browserWidth:number = window.innerWidth,
		browserHeight:number = window.innerHeight;
		var mobileWidth:number = 767,
			tabletWidth:number = 1024,
			desktopWidth:number = 1500;

		if(browserWidth > desktopWidth) {
			Site.activeDevice = 'desktopXl';
			Site.activeDeviceType = 'desktop';
		}
		else if(browserWidth > tabletWidth) {
			Site.activeDevice = 'desktop';
			Site.activeDeviceType = 'desktop';
		}
		else if(browserWidth > mobileWidth && istouch) {
			Site.activeDevice = 'tablet';
			Site.activeDeviceType = 'touch';
		}
		else if(istouch) {
			Site.activeDevice = 'mobile';
			Site.activeDeviceType = 'touch';
		} else {
			Site.activeDevice = 'desktop';
			Site.activeDeviceType = 'desktop';
		}
	}
}


document.addEventListener("DOMContentLoaded", function(event) { 
  var site = new Site();

});