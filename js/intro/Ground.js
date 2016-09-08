var work = require('unworkify');
var THREE = require('three');
var glslify = require('glslify');
var Noise = require("noisejs").Noise;
var deviceType = require("./../deviceType");

class Ground {
    constructor(width, height, mouseCanvas, callback) {
        this.width = this.initW = width;
        this.height = this.initH = height; 

        this.resizeTimer = -1;

        this._mouseCanvas = mouseCanvas;

        this.firstCallback = callback;
        this.firstTime = true;


        this.uniforms = {
            time : { type: 'f', value: 0 },
            mouse: { type: 't', value: new THREE.Texture(this._mouseCanvas) }
        };

        this.bufferGeom = new THREE.BufferGeometry();
        this.mat = new THREE.ShaderMaterial({
            vertexShader: glslify('./shaders/bg/vertex.glsl'),
            fragmentShader: glslify('./shaders/bg/fragment.glsl'),
            uniforms: this.uniforms,
            side: THREE.BackSide,
            transparent: true
        });

        this.plane = new THREE.Mesh(this.bufferGeom, this.mat);

        this.createWorker();
        this.buildGeometry();
    }

    createWorker () {
        this.worker = work(require('./workers/getVoronoiPoints.js'));
        this.worker.addEventListener('message', function (ev) {
            var superGeometry = new THREE.Geometry();

            let w = this.width, h = this.height;
            let widthHalf = w / 2;
            let heightHalf = h / 2;

            var noise2d = new Noise();
            let noiseSeed = 153;

            let count = 0;
            for (let j = 0; j < ev.data.length; j++) {
                var cell = ev.data[j];
                count = 0;
                let geom = new THREE.Geometry();
                for (let i = 0; i < cell.length; i += 13) {
                     ev.data[i]

                     let v1 = new THREE.Vector3(
                        cell[i],
                        cell[i + 1],
                        cell[i + 2]
                    );
                    let v2 = new THREE.Vector3(
                        cell[i + 3],
                        cell[i + 4],
                        cell[i + 5]
                    );
                    let v3 = new THREE.Vector3(
                        cell[i + 6],
                        cell[i + 7],
                        cell[i + 8]);

                    let bbox = {
                        x:      cell[i + 9],
                        y:      cell[i + 10],
                        width:  cell[i + 11],
                        height: cell[i + 12]
                    }

                    v1.y = noise2d.perlin2((v1.x) / noiseSeed, (v1.z) / noiseSeed) * 60;
                    v2.y = noise2d.perlin2((v2.x) / noiseSeed, (v2.z) / noiseSeed) * 60;
                    v3.y = noise2d.perlin2((v3.x) / noiseSeed, (v3.z) / noiseSeed) * 60;

                    geom.vertices.push(v1);
                    geom.vertices.push(v2);
                    geom.vertices.push(v3);

                    if(this.isClockWiseTriangle(v1, v2, v3)) {

                        var f = new THREE.Face3( count, count + 2, count + 1);

                        geom.faceVertexUvs[0].push([
                            new THREE.Vector2(1 - (v1.x + widthHalf) / w, 1 - (v1.z + heightHalf) / h),
                            new THREE.Vector2(1 - (v3.x + widthHalf) / w, 1 - (v3.z + heightHalf) / h),
                            new THREE.Vector2(1 - (v2.x + widthHalf) / w, 1 - (v2.z + heightHalf) / h)
                        ]);
                    } else {
                        var f = new THREE.Face3( count, count + 1, count + 2);

                        geom.faceVertexUvs[0].push([
                            new THREE.Vector2(1 - (v1.x + widthHalf) / w, 1 - (v1.z + heightHalf) / h),
                            new THREE.Vector2(1 - (v2.x + widthHalf) / w, 1 - (v2.z + heightHalf) / h),
                            new THREE.Vector2(1 - (v3.x + widthHalf) / w, 1 - (v3.z + heightHalf) / h)
                        ]);
                    }

                    geom.faces.push( f );
                    count += 3;
                 };

                 superGeometry.merge(geom);
            };

            superGeometry.computeFaceNormals();

            var bGeom = new THREE.BufferGeometry();
            bGeom.fromGeometry(superGeometry);
 
            bGeom.computeVertexNormals();

            let vNB = bGeom.attributes.position.count;

            var moveRadius = new Float32Array( vNB );

            for (var i = 0; i < vNB; i++) {
                moveRadius[i] = Math.random();
            };

            this.bufferGeom.addAttribute( 'moveRadius', new THREE.BufferAttribute( moveRadius, 1 ) );

            this.plane = new THREE.Mesh(bGeom, this.mat);

            this.plane.rotation.x = Math.PI * 0.5;
   
            this.firstCallback();

            this.ready = true;


        }.bind(this));  
    }
 
    buildGeometry() {        
        this.worker.postMessage([deviceType() === 'desktop' ? 150 : 90, this.width, this.height]);
    }  

    resize(w, h) {
        this.width = w;
        this.height = h;
        window.clearTimeout(this.resizeTimer);
        this.resizeTimer = window.setTimeout(function() { this.buildGeometry(); }.bind(this), 100);
    }

    isClockWiseTriangle(v1, v2, v3) {
        var angleDiff = (Math.atan2(v2.z - v1.z, v2.x - v1.x) - Math.atan2(v1.z - v3.z, v1.x - v3.x)) / Math.PI * 180;

        if(angleDiff < -179) angleDiff += 360;
        else if(angleDiff > 180) angleDiff -= 360;
        return angleDiff > 0;
    }

    render() {
        this.uniforms.time.value += 0.1;

        this.uniforms.mouse.value.image = this._mouseCanvas;
        this.uniforms.mouse.value.needsUpdate = true;
        this.plane.material.needsUpdate = true;
    }
}

module.exports = Ground;
