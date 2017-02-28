#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
varying float vAlpha;
varying vec3 vCol;

void main(){
    float alp = 1.0 - length(vUv - vec2(0.5)) * 4.0;
    gl_FragColor = vec4(vCol, vAlpha * alp);
}