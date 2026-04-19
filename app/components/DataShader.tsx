'use client';

import { useEffect, useRef } from 'react';

/* ============================================
   💡 DATA STREAM SHADER — ADJUSTABLE VARIABLES
   ============================================ */
const SHADER_CONFIG = {
  // ISO PROJECTION — Controls the 2.5D perspective tilt
  isoYMultiplier:   0.6,  // Squash/stretch vertically (0.5 = flatter, 1.0 = normal)
  isoXOffset:       0.8,  // Horizontal skew based on Y (0 = no skew, 1.0 = more skew)
  isoZoom:          1.9,  // Zoom level (1.5 = zoomed out, 3.0 = zoomed in)

  // NOISE — Controls the organic wave patterns
  noiseFreq1:       300.0, // Primary noise frequency (higher = more detail)
  noiseFreq2:       80.0,  // Secondary noise frequency (n2 — reserved for layering)
  noiseFreq3:       60.0,  // Tertiary noise frequency (n2's Y component)

  // SPIKE — Controls the sharp vertical spikes
  spikeFreq:        500.0,  // Spike density (higher = more spikes)
  spikePow:         3.0,    // Spike sharpness (2.0 = soft, 5.0 = needle-like)

  // PULSE — Animated breathing effect
  pulseSpeed:       1.5,    // Pulse animation speed (0.5 = slow, 3.0 = fast)

  // HEIGHT LAYERS — Front/mid/back layer proportions
  frontHeightMult:  1.0,    // Front layer height multiplier
  midHeightMult:    0.8,    // Mid layer height (relative to front)
  backHeightMult:   0.4,    // Back layer height (relative to front)

  // POINT LAYERS — Brightness per depth layer
  frontBrightness:  1.2,   // Front points brightness
  midBrightness:    0.7,    // Mid points brightness
  backBrightness:   0.3,    // Back points brightness

  // VISUAL POLISH
  pointSize:        1.5,    // Base point size in pixels
  layerCount:       6,      // Number of depth layers (more = denser, less = cleaner)
  visibilityBoost:  1.4,    // Overall brightness multiplier
  contrastPow:      0.6,    // Contrast curve (lower = more contrast)
  falloffPow:       1.5,    // Edge fade sharpness (1.0 = linear, 3.0 = sharp)
  depthFadeY:       0.4,    // Bottom fade threshold (higher = more fade)
};

export default function DataShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext('webgl');

    if (!gl) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;

    canvas.style.width = canvas.clientWidth + 'px';
    canvas.style.height = canvas.clientHeight + 'px';

    gl.viewport(0, 0, canvas.width, canvas.height);

    const vertex = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(
      vertex,
      `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `
    );
    gl.compileShader(vertex);

    const fragment = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(
      fragment,
      `
      precision mediump float;

      uniform vec2 u_resolution;
      uniform float u_time;

      float noise(float x) { return sin(x * 0.1) * 0.5 + sin(x * 0.03) * 0.5; }

      vec2 iso(vec2 uv) {
        vec2 p = uv - 0.9;
        p.y *= ${SHADER_CONFIG.isoYMultiplier.toFixed(1)};
        p.x += p.y * ${SHADER_CONFIG.isoXOffset.toFixed(1)};
        p *= ${SHADER_CONFIG.isoZoom.toFixed(1)};
        return p + 0.5;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;

        float center = abs(uv.x - 0.5);
        float falloff = pow(max(0.0, 1.0 - center * 2.0), ${SHADER_CONFIG.falloffPow.toFixed(1)});

        float n  = noise(uv.x * ${SHADER_CONFIG.noiseFreq1.toFixed(1)} + uv.y * 200.0);
        float n2 = noise(uv.x * ${SHADER_CONFIG.noiseFreq2.toFixed(1)} + uv.y * ${SHADER_CONFIG.noiseFreq3.toFixed(1)});
        float pulse = sin(u_time * ${SHADER_CONFIG.pulseSpeed.toFixed(1)}) * 0.5 + 0.5;
        float spike = pow(fract(sin(uv.x * ${SHADER_CONFIG.spikeFreq.toFixed(1)}) * 1000.0), ${SHADER_CONFIG.spikePow.toFixed(1)});

        float height  = (n * 0.4 + spike * (0.6 + pulse * 0.6)) * falloff;
        float height2 = height * ${SHADER_CONFIG.midHeightMult.toFixed(1)} + 0.05;
        float height3 = height * ${SHADER_CONFIG.backHeightMult.toFixed(1)} + 0.1;

        float size = ${SHADER_CONFIG.pointSize.toFixed(1)} / u_resolution.y;

        float intensity = 0.0;

        float densityMask = smoothstep(0.0, 1.2, falloff);

        for (int i = 0; i < ${SHADER_CONFIG.layerCount}; i++) {
          float fi = float(i);

          float offsetX = (sin(fi * 12.9898) * 0.5 + 0.5) * 0.02 - 0.01;
          float offsetY = (cos(fi * 48.233) * 0.5 + 0.5) * 0.02;

          vec2 p1 = vec2(uv.x + offsetX * 1.2, height  - offsetY);
          vec2 p2 = vec2(uv.x + offsetX * 0.5, height2 - offsetY);
          vec2 p3 = vec2(uv.x + offsetX * 0.1, height3 - offsetY);

          float d1 = distance(iso(uv), iso(p1));
          float d2 = distance(iso(uv), iso(p2));
          float d3 = distance(iso(uv), iso(p3));

          float point =
          step(d1, size) * ${SHADER_CONFIG.frontBrightness.toFixed(1)} +
          step(d2, size) * ${SHADER_CONFIG.midBrightness.toFixed(1)} +
          step(d3, size) * ${SHADER_CONFIG.backBrightness.toFixed(1)};

          point *= densityMask;

          intensity += point;
        }

        intensity *= ${SHADER_CONFIG.visibilityBoost.toFixed(1)};
        intensity = pow(intensity, ${SHADER_CONFIG.contrastPow.toFixed(1)});
        intensity = clamp(intensity, 0.0, 1.0);
        intensity *= (1.0 + 1.4 * falloff);
        float depthFade = smoothstep(0.0, ${SHADER_CONFIG.depthFadeY.toFixed(1)}, uv.y);
        intensity *= depthFade;
        gl_FragColor = vec4(vec3(intensity), intensity);
      }`
    );
    gl.compileShader(fragment);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      canvas.style.width = canvas.clientWidth + 'px';
      canvas.style.height = canvas.clientHeight + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', resize);
    resize();

    let time = 0;

    function render() {
      time += 0.016;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(render);
    }

    render();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
