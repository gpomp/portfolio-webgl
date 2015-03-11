<shader type="dotImage">
<vertex>
	#ifdef GL_ES
	precision highp float;
	#endif

	attribute vec3 displacement;
	attribute float frac;

	varying vec4 stagePos;
	varying vec3 pos;

	void main() {
	    pos = vec3(1.0 - frac) * position;
	    stagePos = modelMatrix * vec4(pos,1.0);
	  	gl_Position = projectionMatrix *
	                modelViewMatrix *
	                vec4(pos,1.0);
	}
</vertex>

<fragment>
	#extension GL_OES_standard_derivatives : enable
	#ifdef GL_ES
	precision highp float;
	#endif

	varying vec4 stagePos;
	varying vec3 pos;

	uniform vec3 camPosition;

	void main() {
	vec3 light = vec3(0.5, 0.2, 1.0);
		vec3 normal  = normalize(cross(dFdx(stagePos.xyz), dFdy(stagePos.xyz)));
		light = normalize(light);
		float dProd = max(0.0,
	                    dot(normal, light));
		float fog = min(1.0, max(0.0, abs(camPosition.z - stagePos.z) / 5000.0));
	  	gl_FragColor = vec4(vec3(( 1.0 - fog) * dProd), 1.0);
	}
</fragment>

</shader>