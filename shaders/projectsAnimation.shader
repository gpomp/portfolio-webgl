<shader type="projectsAnimation">
<vertex>
	#ifdef GL_ES
	precision highp float;
	#endif

	uniform float total;
	uniform vec4 square;
	uniform vec3 camPosition;
	uniform float amplitude;

	attribute float corridor;
	attribute float time;
	attribute float displacement;
	attribute float gap;

	varying vec3 finalPos;
	varying float sharedTime;

	//
	// GLSL textureless classic 2D noise "cnoise",
	// with an RSL-style periodic variant "pnoise".
	// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
	// Version: 2011-08-22
	//
	// Many thanks to Ian McEwan of Ashima Arts for the
	// ideas for permutation and gradient selection.
	//
	// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
	// Distributed under the MIT license. See LICENSE file.
	// https://github.com/ashima/webgl-noise
	//

	vec4 mod289(vec4 x)
	{
	  return x - floor(x * (1.0 / 289.0)) * 289.0;
	}

	vec4 permute(vec4 x)
	{
	  return mod289(((x*34.0)+1.0)*x);
	}

	vec4 taylorInvSqrt(vec4 r)
	{
	  return 1.79284291400159 - 0.85373472095314 * r;
	}

	vec2 fade(vec2 t) {
	  return t*t*t*(t*(t*6.0-15.0)+10.0);
	}

	// Classic Perlin noise
	float cnoise(vec2 P)
	{
	  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
	  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
	  Pi = mod289(Pi); // To avoid truncation effects in permutation
	  vec4 ix = Pi.xzxz;
	  vec4 iy = Pi.yyww;
	  vec4 fx = Pf.xzxz;
	  vec4 fy = Pf.yyww;

	  vec4 i = permute(permute(ix) + iy);

	  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
	  vec4 gy = abs(gx) - 0.5 ;
	  vec4 tx = floor(gx + 0.5);
	  gx = gx - tx;

	  vec2 g00 = vec2(gx.x,gy.x);
	  vec2 g10 = vec2(gx.y,gy.y);
	  vec2 g01 = vec2(gx.z,gy.z);
	  vec2 g11 = vec2(gx.w,gy.w);

	  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
	  g00 *= norm.x;  
	  g01 *= norm.y;  
	  g10 *= norm.z;  
	  g11 *= norm.w;  

	  float n00 = dot(g00, vec2(fx.x, fy.x));
	  float n10 = dot(g10, vec2(fx.y, fy.y));
	  float n01 = dot(g01, vec2(fx.z, fy.z));
	  float n11 = dot(g11, vec2(fx.w, fy.w));

	  vec2 fade_xy = fade(Pf.xy);
	  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
	  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
	  return 2.3 * n_xy;
	}

	// Classic Perlin noise, periodic variant
	float pnoise(vec2 P, vec2 rep)
	{
	  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
	  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
	  Pi = mod(Pi, rep.xyxy); // To create noise with explicit period
	  Pi = mod289(Pi);        // To avoid truncation effects in permutation
	  vec4 ix = Pi.xzxz;
	  vec4 iy = Pi.yyww;
	  vec4 fx = Pf.xzxz;
	  vec4 fy = Pf.yyww;

	  vec4 i = permute(permute(ix) + iy);

	  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
	  vec4 gy = abs(gx) - 0.5 ;
	  vec4 tx = floor(gx + 0.5);
	  gx = gx - tx;

	  vec2 g00 = vec2(gx.x,gy.x);
	  vec2 g10 = vec2(gx.y,gy.y);
	  vec2 g01 = vec2(gx.z,gy.z);
	  vec2 g11 = vec2(gx.w,gy.w);

	  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
	  g00 *= norm.x;  
	  g01 *= norm.y;  
	  g10 *= norm.z;  
	  g11 *= norm.w;  

	  float n00 = dot(g00, vec2(fx.x, fy.x));
	  float n10 = dot(g10, vec2(fx.y, fy.y));
	  float n01 = dot(g01, vec2(fx.z, fy.z));
	  float n11 = dot(g11, vec2(fx.w, fy.w));

	  vec2 fade_xy = fade(Pf.xy);
	  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
	  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
	  return 2.3 * n_xy;
	}

	uniform float timePassed;
	varying vec4 stagePos;

	void main() {

	  
	    vec2 noise = vec2(position.x / 200.0, (camPosition.z * 0.3 + position.y) / 200.0);
	    vec3 pos = position;
	    pos.z = cnoise(noise) * 50.0 + displacement * sin(amplitude + gap);
	    stagePos = modelMatrix * vec4(pos,1.0);
	    finalPos = pos;
	    sharedTime = time;

	  	gl_Position = projectionMatrix *
	                modelViewMatrix *
	                vec4(finalPos,1.0);
	}
</vertex>

<fragment>
	#extension GL_OES_standard_derivatives : enable
	#ifdef GL_ES
	precision highp float;
	#endif

	float M_PI = 3.1415926535897932384626433832795;

	uniform vec4 square;
	uniform vec3 camPosition;
	uniform float timePassed;
	uniform float alpha;
	varying vec4 stagePos;

	varying vec3 finalPos;
	varying float sharedTime;

	void main() {
		vec3 light = vec3(0.5, 1.0, 1.0);
		vec3 normal  = normalize(cross(dFdx(stagePos.xyz), dFdy(stagePos.xyz)));
		light = normalize(light);
		float dProd = max(0.0,
	                    dot(normal, light));

		float l = 1500.0;	
		float fog = min(1.0, max(0.0, 1.0 - distance(vec2(0.0), finalPos.xy) / (l * 0.5)));
		float t1 = (timePassed + 1.0) * 0.5;
		float ratio = 0.3;
	  	gl_FragColor = vec4(vec3((	finalPos.x + l * 0.5) / l * ratio + t1 * ratio,
	  								(finalPos.y + l * 0.5) / l * ratio + ratio * (1.0 - t1), 
	  								ratio + finalPos.z / 60.0 * ratio) * dProd * fog, 
	  								alpha);
	}
</fragment>
\
</shader>