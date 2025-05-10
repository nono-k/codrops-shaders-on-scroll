uniform float uOpacity;
uniform float uDeepPurple;

varying float vDistortion;

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  float distort = vDistortion * 3.0;

  vec3 brightness = vec3(0.1, 0.1, 0.9);
  vec3 contrast = vec3(0.3, 0.3, 0.3);
  vec3 osilation = vec3(0.5, 0.5, 0.9);
  vec3 phase = vec3(0.9, 0.1, 0.8);

  vec3 color = cosPalette(distort, brightness, contrast, osilation, phase);

  gl_FragColor = vec4(color, vDistortion);
  gl_FragColor += vec4(min(uDeepPurple, 1.0), 0.0, 0.5, min(uOpacity, 1.0));
}