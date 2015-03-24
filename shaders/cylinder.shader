<shader type="cylinder">
<vertex>
	#ifdef GL_ES
	precision highp float;
	#endif

	uniform float time;

	varying vec4 stagePos;
	varying vec3 pos;
	varying vec2 vUv;

	void main() {
		vUv = uv;
		pos = position;
	    stagePos = modelMatrix * vec4(pos,1.0);
	    pos.x += cos(time * 0.2 + pos.y) * 20.0;
	    pos.z += sin(time * 0.2 + pos.y) * 20.0;
	  	gl_Position = projectionMatrix *
	                modelViewMatrix *
	                vec4(pos,1.0);
	}
</vertex>

<fragment>
	#ifdef GL_ES
	precision highp float;
	#endif

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

	uniform float time;
	uniform float alphaRatio;

	varying vec4 stagePos;
	varying vec3 pos;
	varying vec2 vUv;

	void main() {
		float height = 3000.0;
		float halfHeight = height * 0.5;
		vec3 wave_color = vec3(0.0);
		float wave_width = 0.01;
		vec2 uv  = -1.0 * 2.0 * vUv;
		float alphaWave = 0.0;
		float uvPlus = 1.0 / 10.0;

		vec2 noise = vec2((pos.x) / halfHeight, 1.0);
		// - 30.0 * ((sin(time * 0.1) + 1.0) * 0.5)	
		float n = cnoise(noise) * 50.0;

		float alpha = max(0.0, min(1.0, 1.0 - (pos.y + halfHeight) / (halfHeight + sin(time * 0.2 + n) * 20.0)));
		float pSin = (1.0 + sin(time * 0.2 + n)) * 0.5;
		for(float i = 0.0; i &lt; 10.0; i++) {
			
			uv.x += uvPlus * 2.0;
			wave_width = abs(1.0 / (uv.x * (40.0 + sin(time * 0.6 + n) * 20.0))) ;
			alphaWave += wave_width * (1.0 - (pos.y + halfHeight) / height);
			wave_color += vec3(wave_width + (1.0 - pSin), wave_width, wave_width + pSin);
		}
		alphaWave =  max(0.0, min(1.0, alphaWave)) * 0.8;
	  	gl_FragColor = vec4(wave_color * alpha, alphaWave * alphaRatio * alpha );
	}
</fragment>

</shader>