<shader type="bgsphere_mobile">
<vertex>
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
	uniform float width;
	uniform float height;
	uniform float small;
	uniform vec2 mousePos;
	uniform vec2 scroll;

	varying vec3 pos;
	varying vec4 stagePos;
	varying vec3 vNormal;

	uniform vec2 hole;
	uniform float holeRatio;
	uniform float holeDist;

	

	varying vec2 vUv;

	void main() {
		pos = position;
		vUv = uv;
		vec2 noise = vec2((pos.x + scroll.x) / 200.0, (pos.y + scroll.y)  / 200.0);
		pos.z = cnoise(noise) * (-80.0 - 30.0 * sin(time * 0.4 + pos.x / width * 20.0 + pos.y / height * 20.0));		
		pos.z += (1.0 - max(0.0, min(1.0, distance(pos.xy, hole) / holeRatio))) * -(holeRatio * 3.0);
		stagePos = modelMatrix * vec4(pos,1.0);
	  	gl_Position = projectionMatrix *
	                modelViewMatrix *
	                vec4(pos,1.0);
	}
</vertex>

<fragment>
	#extension GL_OES_standard_derivatives : enable

	uniform float time;
	uniform float width;
	uniform float height;
	uniform vec2 mousePos;
	uniform vec2 scroll;
	uniform float alpha;
	uniform float fogRatio;
	uniform float colRatio;
	uniform float blackRatio;
	uniform float wnoiseRatio;
	uniform float shadowRatio;

	uniform sampler2D thetraRT;

	varying vec2 vUv;

	varying vec3 pos;
	varying vec4 stagePos;
	varying vec3 vNormal;

	void main() {
		vec3 normal  = normalize(cross(dFdx(stagePos.xyz), dFdy(stagePos.xyz)));
		vec3 light = vec3(0.2, 0.2, 0.2);
		light = normalize(light);
		 float dProd = max(0.0,
	                    dot(normalize(normal), light));

		 float fog = 1.0 - max(0.0, min(1.0, distance(vec3(0, 0, pos.z), pos) / (width * 0.5)));
	  	gl_FragColor = vec4(vec3(0.3 * dProd * fog * alpha), 1.0);
	}
</fragment>

</shader>