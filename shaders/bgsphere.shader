<shader type="bgsphere">
<vertex>
	#ifdef GL_ES
	precision highp float;
	#endif

	varying vec2 pos;

	void main() {
		pos = position.xy;
	  	gl_Position = projectionMatrix *
	                modelViewMatrix *
	                vec4(position,1.0);
	}
</vertex>

<fragment>
	#ifdef GL_ES
	precision highp float;
	#endif

	uniform float time;
	uniform float width;
	uniform float height;

	varying vec2 pos;
	
	float getDis(vec2 v){
		return sqrt(v.x* v.x + v.y*v.y);
	}

	vec3 triangle(float t) {
		
		vec2 p  = vec2((gl_FragCoord.x) / width, (gl_FragCoord.y) / height);
		vec2 p0 = vec2(0.5,0.5) * (1.0 - t) + vec2(0.5,-1.0) * t;
		vec2 p1 = vec2(0.5,0.5) * (1.0 - t)  + vec2(-1.0,2.0) * t;
		vec2 p2 = vec2(0.5,0.5) * (1.0 - t)  + vec2(2.0,2.0) * t;

		vec2 e0 = p1 - p0;
		vec2 e1 = p2 - p1;
		vec2 e2 = p0 - p2;

		vec2 v0 = p - p0;
		vec2 v1 = p - p1;
		vec2 v2 = p - p2;

		vec2 pq0 = v0 - e0*clamp( dot(v0,e0)/dot(e0,e0), 0.0, 1.0 );
		vec2 pq1 = v1 - e1*clamp( dot(v1,e1)/dot(e1,e1), 0.0, 1.0 );
		vec2 pq2 = v2 - e2*clamp( dot(v2,e2)/dot(e2,e2), 0.0, 1.0 );
	    
	    vec2 d = min( min( vec2( dot( pq0, pq0 ), v0.x*e0.y-v0.y*e0.x ),
	                       vec2( dot( pq1, pq1 ), v1.x*e1.y-v1.y*e1.x )),
	                       vec2( dot( pq2, pq2 ), v2.x*e2.y-v2.y*e2.x ));

		float c = -sqrt(d.x) * sign(d.y);
		//
		return vec3(0.05) - sign(c) * vec3(0.05,0.05,0.05);
	}

	vec3 colNorm(vec3 col) {
		return vec3(floor(col.r * 10.0) / 10.0, floor(col.g * 10.0) / 10.0, floor(col.b * 10.0) / 10.0);
	}

	vec3 addTofinal(vec3 col, vec3 finalCol) {
		finalCol.r = max(col.r, finalCol.r);
		finalCol.g = max(col.g, finalCol.g);
		finalCol.b = max(col.b, finalCol.b);

		return finalCol;
	}

	void main() {
		float rtime = time * 0.2;
		float t = max(0.0, min(1.0, mod(rtime, 10.0) / 10.0));
		float t1 = max(0.0, min(1.0, mod(rtime - 2.0, 10.0) / 10.0));
		float t2 = max(0.0, min(1.0, mod(rtime - 4.0, 10.0) / 10.0));
		float t3 = max(0.0, min(1.0, mod(rtime - 6.0, 10.0) / 10.0));
		float t4 = max(0.0, min(1.0, mod(rtime - 8.0, 10.0) / 10.0));


		vec3 col = colNorm(triangle(t)) * (1.0 - t);
		vec3 col1 = colNorm(triangle(t1)) * (1.0 - t1);
		vec3 col2 = colNorm(triangle(t2)) * (1.0 - t2);
		vec3 col3 = colNorm(triangle(t3)) * (1.0 - t3);
		vec3 col4 = colNorm(triangle(t4)) * (1.0 - t4);

		
		//col *= 1.0 - exp(-2.0*abs(c));
		vec3 finalCol = vec3(0);
		finalCol = addTofinal(col, finalCol);
		finalCol = addTofinal(col1, finalCol);
		finalCol = addTofinal(col2, finalCol);
		finalCol = addTofinal(col3, finalCol);
		finalCol = addTofinal(col4, finalCol);

		//col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.02,abs(c)) );

	  	gl_FragColor = vec4(finalCol, 1.0);
	}
</fragment>

</shader>