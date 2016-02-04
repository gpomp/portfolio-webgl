
#ifdef GL_ES
    #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
    #else
        precision mediump float;
    #endif
#endif


varying vec2 vUv;
varying vec3 vNormal;

varying float mouseP;

uniform float time;

void main() {

    vec3 light = vec3(0.1, 0.3, 0.5);
    float dProd = max(0.0, dot(vNormal, light));

    vec3 highLightCol = vec3(dProd); 
 
    if(mouseP > 0.0) { 
        float t = time * 0.05; 
        float modTime = abs(mod(time, 30.0) / 30.0 * 2.0 - 1.0);
        highLightCol = vec3(0.4 + vUv.x * vNormal.x * 1.1 * modTime, 0.5 + vUv.y * 1.4 * vNormal.y * (1.0 - modTime), 1.0) *  vec3(dProd * 2.0);     
    } 

    // float mouseP = texture2D(mouse, vUv).r;
    //dProd +  
    gl_FragColor = vec4(highLightCol, 1.0);
}
