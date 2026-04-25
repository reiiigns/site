'use client';

import { useEffect, useRef } from 'react';

export default function DataShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // 1. GRID GENERATION (2D Plane of points)
    const segments = 250;
    const points = [];
    for (let y = 0; y < segments; y++) {
      for (let x = 0; x < segments; x++) {
        points.push(x / (segments - 1), y / (segments - 1));
      }
    }
    const pointData = new Float32Array(points);

    // 2. VERTEX SHADER: 3D Centralized Spiking
    const vertex = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(
      vertex,
      `
      attribute vec2 a_uv;
      uniform float u_time;
      varying float v_intensity;

      float noise(float x) { return sin(x * 0.1) * 0.5 + sin(x * 0.03) * 0.5; } 

      void main() {
        // --- 1. FALLOFF LOGIC (The "Mountain" shape) ---
        // Center-heavy falloff for both X and Y axes
        float distX = abs(a_uv.x - 0.5) * 2.0; 
        float distY = abs(a_uv.y - 0.5) * 2.0;
        // Combined falloff makes it a "peak" in the middle
        float falloff = pow(max(0.0, 1.0 - length(vec2(distX, distY))), 2.0);

        // --- 2. SPIKE LOGIC ---
        float n = noise(a_uv.x * 400.0 + u_time * 20.0);
        float spike = pow(fract(sin(a_uv.x * 500.0) * 1000.0), 3.0);
        
        // Height is only applied where falloff is strong (the center)
        float height = (n * 0.4 + spike * 0.8) * falloff;

        // --- 3. 3D PROJECTION ---
        // Map UVs to -1 to 1 range
        vec3 pos = vec3(a_uv.x * 2.0 - 1.0, a_uv.y * 2.0 - 1.0, 0.0);
        
        // Perspective tilt: squeeze the top and expand the bottom
        pos.y *= 0.6; // Flatten the plane's aspect
        pos.y += height * 1.5; // The "Spike"
        
        gl_Position = vec4(pos.x, pos.y, 0.0, 1.0);
        gl_PointSize = 1.5; // Smaller dots for high-res look
        
        v_intensity = height + (falloff * 0.2); // Brightest at peak
      }
    `
    );
    gl.compileShader(vertex);

    // 3. FRAGMENT SHADER: Tech Glow
    const fragment = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(
      fragment,
      `
      precision mediump float; 
      varying float v_intensity;
      void main() {
        // High contrast white for a technical FUI feel
        gl_FragColor = vec4(vec3(v_intensity * 1.5), v_intensity);
      }
    `
    );
    gl.compileShader(fragment);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointData, gl.STATIC_DRAW);

    const aUv = gl.getAttribLocation(program, 'a_uv');
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', resize);
    resize();

    function render() {
      time += 0.016;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.POINTS, 0, pointData.length / 2);
      requestAnimationFrame(render);
    }
    render();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full bg-black" />;
}
