<shader type="dotImage">
<vertex>
	#ifdef GL_ES
	precision highp float;
	#endif

	varying vec4 stagePos;
	varying vec3 pos;

	void main() {
	    stagePos = modelMatrix * vec4(position,1.0);
	    pos = position;
	  	gl_Position = projectionMatrix *
	                modelViewMatrix *
	                vec4(position,1.0);
	}
</vertex>

<fragment>
	#ifdef GL_ES
	precision highp float;
	#endif

	varying vec4 stagePos;
	varying vec3 pos;

	uniform vec3 camPosition;

	void main() {
		float fog = min(1.0, max(0.0, abs(camPosition.z - stagePos.z) / 5000.0));
	  	gl_FragColor = vec4(vec3( 1.0 - fog), 1.0);
	}
</fragment>

</shader>