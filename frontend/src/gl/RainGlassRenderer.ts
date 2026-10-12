import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders';

export interface RainGlassOptions {
  /** Fall-speed multiplier. 1 is the tuned default. */
  speed?: number;
  /** Master strength 0..1. 0 renders a flat pane with no water. */
  intensity?: number;
  /** Upper-left corner of the canvas in CSS pixels, for a light direction
   *  that stays fixed relative to the page rather than the canvas. */
  maxDpr?: number;
  /** Deep tone behind the glass. */
  deep?: [number, number, number];
  /** Mid tone. */
  mid?: [number, number, number];
  /** Lightest band of the interior view. */
  haze?: [number, number, number];
  /** Bead highlight colour. */
  specular?: [number, number, number];
}

const DEFAULT_OPTIONS: Required<RainGlassOptions> = {
  speed: 1,
  intensity: 1,
  maxDpr: 1.75,
  deep: [0.035, 0.086, 0.129],
  mid: [0.075, 0.203, 0.278],
  haze: [0.639, 0.741, 0.831],
  specular: [0.97, 0.99, 1.0],
};

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`RainGlass shader compile failed: ${log ?? 'unknown error'}`);
  }
  return shader;
}

/**
 * Owns the WebGL context, the animation loop and every GL resource.
 *
 * Lifecycle contract: `destroy()` is idempotent and must be called from the
 * React effect cleanup. It cancels the RAF, unhooks every listener, deletes
 * the program, buffers and shaders, and calls `loseContext()` so the driver
 * reclaims the GPU allocation immediately rather than waiting on GC.
 */
export class RainGlassRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly gl: WebGLRenderingContext;
  private readonly program: WebGLProgram;
  private readonly buffer: WebGLBuffer;
  private readonly loc: Record<string, WebGLUniformLocation | null>;
  private readonly opts: Required<RainGlassOptions>;

  private rafId = 0;
  private running = false;
  private destroyed = false;
  private startTime = 0;
  private lastFrame = 0;
  private cssWidth = 0;
  private cssHeight = 0;
  private cellPx = 130;

  /** Rolling average frame time in ms, for the perf readout. */
  frameMs = 0;
  onFrame?: (frameMs: number, fps: number) => void;

  private readonly resizeObserver: ResizeObserver | null;
  private readonly intersectionObserver: IntersectionObserver | null = null;
  private readonly onVisibilityChange = () => this.handleVisibility();
  private readonly onMotionChange = (e: Event) => {
    const mq = e as MediaQueryListEvent;
    this.applyMotion(mq.matches);
  };
  private motionQuery: MediaQueryList | null = null;

  constructor(canvas: HTMLCanvasElement, options: RainGlassOptions = {}) {
    this.canvas = canvas;
    this.opts = { ...DEFAULT_OPTIONS, ...options };

    const gl = (canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    }) ?? canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

    if (!gl) throw new Error('WebGL is unavailable');
    this.gl = gl;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) throw new Error('Shader allocation failed');

    const program = gl.createProgram();
    if (!program) throw new Error('Program allocation failed');
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`RainGlass program link failed: ${log ?? 'unknown error'}`);
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    this.program = program;

    const buffer = gl.createBuffer();
    if (!buffer) throw new Error('Buffer allocation failed');
    this.buffer = buffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    gl.useProgram(program);
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    this.loc = {
      resolution: gl.getUniformLocation(program, 'uResolution'),
      time: gl.getUniformLocation(program, 'uTime'),
      aspect: gl.getUniformLocation(program, 'uAspect'),
      cellPx: gl.getUniformLocation(program, 'uCellPx'),
      intensity: gl.getUniformLocation(program, 'uIntensity'),
      speed: gl.getUniformLocation(program, 'uSpeed'),
      deep: gl.getUniformLocation(program, 'uDeep'),
      mid: gl.getUniformLocation(program, 'uMid'),
      haze: gl.getUniformLocation(program, 'uHaze'),
      specular: gl.getUniformLocation(program, 'uSpecular'),
    };

    this.resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => this.resize())
      : null;
    this.resizeObserver?.observe(canvas);

    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries.some((e) => e.isIntersecting);
          if (visible) this.start();
          else this.stop();
        },
        { threshold: 0 },
      );
      this.intersectionObserver.observe(canvas);
    }

    this.motionQuery = typeof matchMedia !== 'undefined'
      ? matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    this.motionQuery?.addEventListener('change', this.onMotionChange);

    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.resize();
  }

  private applyMotion(reduced: boolean): void {
    if (reduced) {
      // Draw a single settled frame rather than animating. The pane still shows
      // water, it simply no longer moves.
      this.stop();
      this.renderFrame(performance.now(), true);
    } else {
      this.start();
    }
  }

  private handleVisibility(): void {
    if (document.hidden) this.stop();
    else this.start();
  }

  private resize(): void {
    if (this.destroyed) return;
    const dpr = Math.min(window.devicePixelRatio || 1, this.opts.maxDpr);
    const w = this.canvas.clientWidth || this.canvas.width || 1;
    const h = this.canvas.clientHeight || this.canvas.height || 1;
    const pw = Math.max(1, Math.round(w * dpr));
    const ph = Math.max(1, Math.round(h * dpr));
    if (pw === this.canvas.width && ph === this.canvas.height) return;
    this.canvas.width = pw;
    this.canvas.height = ph;
    this.cssWidth = w;
    this.cssHeight = h;
    this.gl.viewport(0, 0, pw, ph);

    /* Lattice cell size, in CSS pixels.
     *
     * Derived from the viewport width so a droplet occupies a constant visual
     * size everywhere. The clamps matter: without the upper bound a 1440px
     * pane gets cells four times the reference and the water reads as a
     * handful of giant bubbles; without the lower bound a 320px phone turns
     * into visual noise.
     *
     * The scale is applied in device pixels, not CSS pixels, so a high-DPR
     * screen renders the same physical drop with more detail rather than more
     * drops. */
    const widthPx = Math.max(w, 1);
    this.cellPx = Math.min(Math.max(widthPx * 0.16, 68), 148) * dpr;
  }

  private renderFrame(now: number, single = false): void {
    if (this.destroyed) return;
    const gl = this.gl;

    if (this.startTime === 0) this.startTime = now;
    const elapsed = (now - this.startTime) / 1000;

    gl.uniform2f(this.loc.resolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.loc.time, elapsed);
    gl.uniform1f(this.loc.aspect, this.cssWidth / Math.max(this.cssHeight, 1));
    gl.uniform1f(this.loc.cellPx, this.cellPx);
    gl.uniform1f(this.loc.intensity, this.opts.intensity);
    gl.uniform1f(this.loc.speed, this.opts.speed);
    gl.uniform3fv(this.loc.deep, this.opts.deep);
    gl.uniform3fv(this.loc.mid, this.opts.mid);
    gl.uniform3fv(this.loc.haze, this.opts.haze);
    gl.uniform3fv(this.loc.specular, this.opts.specular);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (single) return;

    if (this.lastFrame > 0) {
      const dt = now - this.lastFrame;
      this.frameMs = this.frameMs === 0 ? dt : this.frameMs * 0.9 + dt * 0.1;
      this.onFrame?.(this.frameMs, 1000 / Math.max(this.frameMs, 0.001));
    }
    this.lastFrame = now;
  }

  private loop = (now: number): void => {
    if (!this.running || this.destroyed) return;
    this.renderFrame(now);
    this.rafId = requestAnimationFrame(this.loop);
  };

  start(): void {
    if (this.destroyed || this.running) return;
    if (this.motionQuery?.matches) {
      this.renderFrame(performance.now(), true);
      return;
    }
    this.running = true;
    this.lastFrame = 0;
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop(): void {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  /** Resolves after `ms` of animation, so tests can await a real frame. */
  frame(ms = 16): Promise<void> {
    return new Promise((resolve) => {
      this.rafId = requestAnimationFrame(() => {
        this.renderFrame(performance.now());
        window.setTimeout(resolve, ms);
      });
    });
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.stop();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.motionQuery?.removeEventListener('change', this.onMotionChange);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    const gl = this.gl;
    gl.deleteBuffer(this.buffer);
    gl.deleteProgram(this.program);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}