<shader type="foglight_mobile">
<vertex>

	uniform float size;
	uniform float bendRatio;

	varying vec2 vUv;
	varying vec4 stagePos;
	varying vec3 pos;
	varying vec3 vNormal;

	void main() {
		vNormal = normal;
	    vUv = uv;

	    pos = position;
	   
	    stagePos = modelMatrix * vec4(pos,1.0);
	  	gl_Position = projectionMatrix *
	                modelViewMatrix *
	                vec4(pos,1.0);
	}
</vertex>

<fragment>
	#extension GL_OES_standard_derivatives : enable

	varying vec2 vUv;
	varying vec4 stagePos;
	varying vec3 pos;
	varying vec3 vNormal;

	uniform vec3 camPosition;
	uniform float fogDistance;
	uniform float alpha;
	uniform sampler2D text;

	void main() {
		float fog = 1.0 - min(1.0, max(0.0, (camPosition.z - stagePos.z) / 140.0)); 
		vec3 light = vec3(0.2, 0.2, 0.2);
		vec3 normal  = normalize(cross(dFdx(stagePos.xyz), dFdy(stagePos.xyz)));

		light = normalize(light);
		 float dProd = max(0.0,
	                    dot(normal, light));
		
		float distance = distance(camPosition, stagePos.xyz);


		vec4 texel = texture2D(text, vUv);
	  	gl_FragColor = vec4(texel.rgb * dProd, texel.a * fog * alpha);
	}
</fragment>

</shader>