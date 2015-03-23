<shader type="cylinder_mobile">
<vertex>

	varying vec4 stagePos;
	varying vec3 pos;

	void main() {
		pos = position;
	    stagePos = modelMatrix * vec4(pos,1.0);
	  	gl_Position = projectionMatrix *
	                modelViewMatrix *
	                vec4(pos,1.0);
	}
</vertex>

<fragment>

	varying vec4 stagePos;
	varying vec3 pos;

	void main() {
	
	  	gl_FragColor = vec4(vec3(1.0), 1.0);
	}
</fragment>

</shader>