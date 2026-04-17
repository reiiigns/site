'use client';

import { useEffect, useRef } from 'react';

export default function DataShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext('webgl');

    if (!gl) return;

    // resize
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;

    canvas.style.width = canvas.clientWidth + 'px';
    canvas.style.height = canvas.clientHeight + 'px';

    gl.viewport(0, 0, canvas.width, canvas.height);

    // vertex shader (fullscreen quad)
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

    // fragment shader (THE ENGINE)
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
        p.y *= 0.6;
        p.x += p.y * 0.8;
        p *= 1.9; // 👈 zoom control
        return p + 0.5;
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        // centered space
      
        float center = abs(uv.x - 0.5);
        float falloff = pow(max(0.0, 1.0 - center * 2.0), 1.5);
      
        float n = noise(a_uv.x * 300.0 + a_uv.y * 200.0);
        float n2 = noise(a_uv.x * 80.0 + a_uv.y * 60.0);
        float pulse = sin(u_time * 1.5) * 0.5 + 0.5;
        float spike = pow(fract(sin(uv.x * 500.0) * 1000.0), 3.0);
      
        float height = (n * 0.4 + spike * (0.6 + pulse * 0.6)) * falloff;
        float height2 = height * 0.8 + 0.05;
        float height3 = height * 0.4 + 0.1;
      
        float size = 1.5 / u_resolution.y;
      
        float intensity = 0.0;
      
        float densityMask = smoothstep(0.0, 1.2, falloff);
      
        for (int i = 0; i < 6; i++) {
          float fi = float(i);
      
          float offsetX = (sin(fi * 12.9898) * 0.5 + 0.5) * 0.02 - 0.01;
          float offsetY = (cos(fi * 48.233) * 0.5 + 0.5) * 0.02;
      
          vec2 p1 = vec2(uv.x + offsetX * 1.2, height - offsetY);   // front
          vec2 p2 = vec2(uv.x + offsetX * 0.5, height2 - offsetY);  // mid
          vec2 p3 = vec2(uv.x + offsetX * 0.1, height3 - offsetY);  // back
      
          float d1 = distance(iso(uv), iso(p1));
          float d2 = distance(iso(uv), iso(p2));
          float d3 = distance(iso(uv), iso(p3));
      
          float point =
          step(d1, size) * 1.2 +  // front brighter
          step(d2, size) * 0.7 +
          step(d3, size) * 0.3;
      
          point *= densityMask;
      
          intensity += point;
        }
      
        // boost visibility
        intensity *= 1.4;
      
        // contrast
        intensity = pow(intensity, 0.6);
      
        // clamp
        intensity = clamp(intensity, 0.0, 1.0);
      
        // final shaping
        intensity *= (1.0 + 1.4 * falloff);
        float depthFade = smoothstep(0.0, 0.4, uv.y);
        intensity *= depthFade;
        gl_FragColor = vec4(vec3(intensity), intensity);
      }`
    );
    gl.compileShader(fragment);

    // program
    const program = gl.createProgram()!;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.useProgram(program);

    // quad
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

    let time = 0;

    function render() {
      time += 0.016;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(render);
    }

    render();
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
