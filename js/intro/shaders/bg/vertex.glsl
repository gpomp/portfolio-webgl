
#ifdef GL_ES
    #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
    #else
        precision mediump float;
    #endif
#endif

#pragma glslify: curlNoise = require(glsl-curl-noise)

uniform float time;
uniform sampler2D mouse;

attribute float moveRadius;

varying vec2 vUv;
varying vec3 vNormal;

varying float mouseP;


void main() {
    // vUv = vec2(uv.x * 1375.0 / 1024.0, uv.y * 945.0 / 1024.0); 
    vUv = uv;

    vNormal = normal; 
    vec3 pos = position;

    mouseP = texture2D(mouse, vUv).r; 

    float t = time; 

    // pos.y -= ((cos(time * moveRadius) + sin(time * moveRadius)) * 0.5) * mouseP * 30.0;

    vec3 noiseC = curlNoise(vec3(vUv.x + t, pos.y + t,  vUv.y + t) * vec3(0.1)); 

    noiseC.y *= 10.0; 
 
    pos += noiseC * 9.0; 

    vec3 finalPos = vec3(pos.x * (1.0 - mouseP) + position.x * mouseP, position.y * 2.0 * mouseP, pos.z * (1.0 - mouseP) + position.z * mouseP);
  
    gl_Position = projectionMatrix * 
                modelViewMatrix *
                vec4(finalPos, 1.0);
}
