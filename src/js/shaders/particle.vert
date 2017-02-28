precision highp float;


attribute vec3 position;
attribute vec3 uv;
attribute vec4 data;
attribute vec4 letterPosition0;
attribute vec4 letterPosition1;
attribute vec4 letterPosition2;
attribute vec4 letterPosition3;
attribute vec4 letterPosition4;
attribute vec4 letterPosition5;
attribute vec4 letterPosition6;
attribute vec4 letterPosition7;
attribute vec4 letterPosition8;
attribute vec4 letterPosition9;
attribute vec4 letterPosition10;
attribute vec4 letterPosition11;
attribute vec4 letterPosition12;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec3 cameraPosition;

uniform float uTheta;
uniform float uTargetRate;
uniform float uTime;

varying vec2 vUv;
varying float vAlpha;
varying vec3 vCol;

#define PI 3.141592653589793

float sineInOut(float t) {
  return -0.5 * (cos(PI * t) - 1.0);
}

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(){
    vUv = uv.xy;
    float theta;
    theta = mix(-uTime * data.y + data.x, uTheta, smoothstep(uv.z, uv.z + 0.8, uTargetRate) );

    vAlpha =  0.17 * smoothstep(uv.z + 0.4, uv.z +1.0, uTargetRate) + 0.03;
    vCol = mix(vec3(0.6, 0.5, 0.4), vec3(1.0), smoothstep(uv.z + 0.7, uv.z + 0.8, uTargetRate));
    float size = 240.;
    float particleSize = data.z;

    float letterData = mod(-theta /3.14 /2.* 26., 26.);
    vec2 outputPos;
    if(letterData < 1.) outputPos = mix(letterPosition0.xy, letterPosition0.zw, sineInOut(fract(letterData))); // a - b
    else if(letterData < 2.0 ) outputPos = mix(letterPosition0.zw, letterPosition1.xy, sineInOut(fract(letterData))); // b - c

    else if(letterData < 3.0 ) outputPos = mix(letterPosition1.xy, letterPosition1.zw, sineInOut(fract(letterData))); // c - d
    else if(letterData < 4.0 ) outputPos = mix(letterPosition1.zw, letterPosition2.xy, sineInOut(fract(letterData))); // d - f

    else if(letterData < 5.0 ) outputPos = mix(letterPosition2.xy, letterPosition2.zw, sineInOut(fract(letterData))); // f - g
    else if(letterData < 6.0 ) outputPos = mix(letterPosition2.zw, letterPosition3.xy, sineInOut(fract(letterData)));

    else if(letterData < 7.0 ) outputPos = mix(letterPosition3.xy, letterPosition3.zw, sineInOut(fract(letterData)));
    else if(letterData < 8.0 ) outputPos = mix(letterPosition3.zw, letterPosition4.xy, sineInOut(fract(letterData)));

    else if(letterData < 9.0)  outputPos = mix(letterPosition4.xy, letterPosition4.zw, sineInOut(fract(letterData)));
    else if(letterData < 10.0)  outputPos = mix(letterPosition4.zw, letterPosition5.xy, sineInOut(fract(letterData)));

    else if(letterData < 11.0 ) outputPos = mix(letterPosition5.xy, letterPosition5.zw, sineInOut(fract(letterData)));
    else if(letterData < 12.0) outputPos = mix(letterPosition5.zw, letterPosition6.xy, sineInOut(fract(letterData)));

    else if(letterData < 13.0) outputPos = mix(letterPosition6.xy, letterPosition6.zw, sineInOut(fract(letterData)));
    else if(letterData < 14.0) outputPos = mix(letterPosition6.zw, letterPosition7.xy, sineInOut(fract(letterData)));

    else if(letterData < 15.0 ) outputPos = mix(letterPosition7.xy, letterPosition7.zw, sineInOut(fract(letterData)));
    else if(letterData < 16. ) outputPos = mix(letterPosition7.zw, letterPosition8.xy, sineInOut(fract(letterData)));

    else if(letterData < 17.0 ) outputPos = mix(letterPosition8.xy, letterPosition8.zw, sineInOut(fract(letterData)));
    else if(letterData < 18.0 ) outputPos = mix(letterPosition8.zw, letterPosition9.xy, sineInOut(fract(letterData)));

    else if(letterData < 19.0) outputPos = mix(letterPosition9.xy, letterPosition9.zw, sineInOut(fract(letterData)));
    else if(letterData < 20.0) outputPos = mix(letterPosition9.zw, letterPosition10.xy, sineInOut(fract(letterData)));

    else if(letterData < 21.0 ) outputPos = mix(letterPosition10.xy, letterPosition10.zw, sineInOut(fract(letterData)));
    else if(letterData < 22.0 ) outputPos = mix(letterPosition10.zw, letterPosition11.xy, sineInOut(fract(letterData)));
    else if(letterData < 23.0 ) outputPos = mix(letterPosition11.xy, letterPosition11.zw, sineInOut(fract(letterData)));
    else if(letterData < 24.0 ) outputPos = mix(letterPosition11.zw, letterPosition12.xy, sineInOut(fract(letterData)));
    else if(letterData < 25.0 ) outputPos = mix(letterPosition12.xy, letterPosition12.zw, sineInOut(fract(letterData)));
    else                        outputPos = mix(letterPosition12.zw, letterPosition0.xy, sineInOut(fract(letterData)));


    float rad = outputPos.x * size + 120.;
    vec3 pt = vec3(rad * cos(theta), size * outputPos.y, rad * sin(theta)) + position;
    vec4 viewPos = viewMatrix * vec4(pt, 1.0);
    vec4 pos =  viewPos;

    vec3 hsvCol = vec3(data.w, 0.4, 0.6);
    gl_Position = projectionMatrix * (modelMatrix * pos + vec4( (uv.x - 0.5),(uv.y - 0.5), 0.0, 0.0) * particleSize );
}
