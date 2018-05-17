var THREE = require("three");
var select = require("dom-select");
var raf = require("raf");

var Ground = require("./Ground");
var DrawCanvas = require("./DrawCanvas");

class Intro {
  constructor() {
    this.init();
  }

  init() {
    this.ready = false;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.autoClear = false;

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.windowWidth / this.windowHeight,
      1,
      3000
    );
    this.camera.position.z = -1000;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.scene = new THREE.Scene();

    this.renderer.setSize(this.windowWidth, this.windowHeight);
    select("#intro-canvas").appendChild(this.renderer.domElement);

    select("#home-intro").style.marginTop =
      this.windowHeight - select("#home-intro").offsetHeight + "px";

    this.setupScene();

    this.render();

    window.addEventListener("resize", this.resize.bind(this));
  }

  resize(event) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.camera.aspect = this.windowWidth / this.windowHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.windowWidth, this.windowHeight);
    this.scene.remove(this.ground.plane);
    this.ground.resize(this.windowWidth, this.windowHeight);
  }

  setupScene() {
    var bgMat = new THREE.MeshBasicMaterial({ color: 0x5e5e5e });

    this.bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 0), bgMat);

    this.bg.material.depthTest = false;
    this.bg.material.depthWrite = false;

    this.bgScene = new THREE.Scene();
    this.bgCam = new THREE.Camera();
    this.bgScene.add(this.bgCam);
    this.bgScene.add(this.bg);

    this.drawCanvas = new DrawCanvas(
      this.windowWidth,
      this.windowHeight,
      select("#drag-canvas")
    );

    this.ground = new Ground(
      this.windowWidth,
      this.windowHeight,
      this.drawCanvas.canvas,
      this.groundReady.bind(this)
    );
  }

  groundReady() {
    this.scene.add(this.ground.plane);
    this.ground.plane.rotation.x = Math.PI / 2;

    this.ready = true;
  }

  render() {
    raf(this.render.bind(this));

    if (this.drawCanvas.ready) {
      this.drawCanvas.render();
    }

    if (this.ground.ready) {
      this.ground.render();
      this.renderer.clear();
      this.renderer.render(this.bgScene, this.bgCam);
      this.renderer.render(this.scene, this.camera);
    }
  }
}

module.exports = Intro;
