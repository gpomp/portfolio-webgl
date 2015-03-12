<shader type="text">
<vertex>
	#ifdef GL_ES
	precision highp float;
	#endif

	varying vec2 vUv;
	varying vec4 stagePos;
	varying vec3 pos;
	varying vec3 vNormal;

	void main() {
		vNormal = normal;
	    vUv = uv;
	    stagePos = modelMatrix * vec4(position,1.0);
	    pos = position;
	  	gl_Position = projectionMatrix *
	                modelViewMatrix *
	                vec4(position,1.0);
	}
</vertex>

<fragment>
	#extension GL_OES_standard_derivatives : enable
	#ifdef GL_ES
	precision highp float;
	#endif

	varying vec2 vUv;
	varying vec4 stagePos;
	varying vec3 pos;
	varying vec3 vNormal;

	void main() {
		
		vec3 light = vec3(0.5, 0.2, 1.0);
		vec3 normal  = normalize(cross(dFdx(stagePos.xyz), dFdy(stagePos.xyz)));

		light = normalize(light);
		 float dProd = max(0.0,
	                    dot(normal, light));
	  	gl_FragColor = vec4(vec3(1.0), 1.0);
	}
</fragment>

</shader>