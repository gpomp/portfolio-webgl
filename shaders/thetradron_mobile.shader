<shader type="thetradron_mobile">
<vertex>

	uniform float amplitude;
	uniform float pointAmplitude;
	uniform vec3 pointsTo;

	attribute float displacement;
	attribute float gap;
	attribute float appear;


	varying vec4 vNormal;
	varying vec4 pos;

	void main() {
		vNormal =  modelViewMatrix *
	                vec4(normal,1.0);
	   	vec3 newPosition =
    		position * appear + normal *
    		vec3(displacement * sin(0.4 * amplitude + gap)) * appear;


    	pos = modelViewMatrix *
	                vec4(normal,1.0);
	   


	  	gl_Position = projectionMatrix *
	                modelViewMatrix *
	                vec4(newPosition,1.0);
	}
</vertex>

<fragment>
	#extension GL_OES_standard_derivatives : enable
	varying vec4 vNormal;
	varying vec4 pos;

	void main() {
		vec3 normal  = normalize(cross(dFdx(pos.xyz), dFdy(pos.xyz)));
		vec3 light = vec3(0.5, 0.2, 1.0);
		light = normalize(light);
		 float dProd = max(0.0,
	                    dot(normalize(normal), light));

	  	gl_FragColor = vec4(vec3(dProd * 0.55), 1.0);
	}
</fragment>

</shader>