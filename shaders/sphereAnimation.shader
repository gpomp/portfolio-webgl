<shader type="sphereAnimation">
<vertex>
	#ifdef GL_ES
	precision highp float;
	#endif


	uniform float radius;
	uniform float pointSize;
	uniform float total;
	uniform vec3 camPos;
	uniform float addedRadius;
	uniform float amplitude;

	attribute float distFrac;
	attribute float outFrac;
	attribute float distance;
	attribute float currRadiusTime;
	attribute vec2 start;
	attribute vec2 dest;
	attribute float displacement;
	attribute float gap;

	varying vec4 stagePos;
	varying vec3 localPos;
	varying float SphereRadius;
	varying float distNow;
	varying float intensity;

	void main() {
		vec3 vNormal = position;
        vec3 vNormel = camPos;
        intensity = pow( abs(0.0 - dot(vNormal, vNormel) ), 5.5 );

		float lat1 = start.x;
	    float lng1 = start.y;
	    float lat2 = dest.x;
	    float lng2 = dest.y;

	    float a = sin((1.0 - distFrac) * distance) / sin(distance);
	   	float b = sin(distFrac * distance) / sin(distance);

	    float x =	a * cos(lat1) * cos(lng1) 	+ b * cos(lat2) * cos(lng2);
	    float y =	a * cos(lat1) * sin(lng1) 	+ b * cos(lat2) * sin(lng2);
	    float z =	a * sin(lat1) 				+ b * sin(lat2);

	    float finalRadius = radius * outFrac +  displacement * sin(0.02 * amplitude + gap);

	    vec3 pos = vec3(finalRadius * x, finalRadius * y +  500.0 * (1.0 - outFrac), finalRadius * z +  100.0 * (1.0 - outFrac));
	    SphereRadius = finalRadius;

	    localPos = pos;
	    stagePos = modelMatrix * vec4(pos,1.0);

	    distNow = distFrac;
	    
	  	gl_Position = projectionMatrix *
	                modelViewMatrix *
	                vec4(pos,1.0);
	}
</vertex>

<fragment>
	#ifdef GL_ES
	precision highp float;
	#endif
	varying vec4 stagePos;
	varying vec3 localPos;
	varying float SphereRadius;
	varying float distNow;
	varying float intensity;

	uniform vec3 camPos;
	uniform float fogDistance;
	uniform float alpha;



	void main() {
		float halfRad = SphereRadius / 2.0;
		float distance = distance(camPos, stagePos.xyz); 
		float fog = 1.0 - min(1.0, max(0.0, distance / fogDistance));
		// vec3 normPos = vec3((halfRad + stagePos.x) / SphereRadius, (halfRad + stagePos.y) / SphereRadius, (halfRad + stagePos.z) / SphereRadius);
	  	vec3 normPos = (vec3(halfRad) + stagePos.xyz) / SphereRadius;
	  	gl_FragColor = vec4(fog * normPos * (0.1 + distNow / 0.5), alpha);
	}
</fragment>

</shader>