import vertexShader from '../shaders/vertex.js';
import fragmentShader from '../shaders/fragment.js';

class ScrollStage {
  constructor() {
    this.element = document.querySelector('.content');

    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.mouse = {
      x: 0,
      y: 0
    };

    this.scroll = {
      height: 0,
      limit: 0,
      hard: 0,
      soft: 0,
      ease: 0.05,
      normalized: 0,
      running: false
    };

    this.settings = {
      // vertex
      uFrequency: {
        start: 0,
        end: 4,
      },
      uAmplitude: {
        start: 4,
        end: 4,
      },
      uDensity: {
        start: 1,
        end: 1,
      },
      uStrength: {
        start: 0,
        end: 1.1,
      },
      // fragment
      uDeepPurple: {
        start: 1,
        end: 0,
      },
      uOpacity: {
        start: .33,
        end: .66,
      },
    }

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    this.canvas = this.renderer.domElement;

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.viewport.width / this.viewport.height,
      0.1,
      10
    );

    this.clock = new THREE.Clock();

    this.smoothScroll = new SmoothScroll({
      element: this.element,
      viewport: this.viewport,
      scroll: this.scroll
    });

    gsap.defaults({
      ease: 'power2',
      duration: 6.6,
      overwrite: true
    });

    this.updateScrollAnimations = this.updateScrollAnimations.bind(this);
    this.update = this.update.bind(this);

    this.init();
  }

  init() {
    this.addCanvas();
    this.addCamera();
    this.addMesh();
    this.addEventListeners();
    this.onResize();
    this.update();
  }

  addCanvas() {
    this.canvas.classList.add('webgl');
    document.body.appendChild(this.canvas);
  }

  addCamera() {
    this.camera.position.set(0, 0, 2.5);
    this.scene.add(this.camera);
  }

  addMesh() {
    this.geometry = new THREE.IcosahedronGeometry(1, 64);

    this.material = new THREE.ShaderMaterial({
      wireframe: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      vertexShader,
      fragmentShader,
      uniforms: {
        uFrequency: { value: this.settings.uFrequency.start },
        uAmplitude: { value: this.settings.uAmplitude.start },
        uDensity: { value: this.settings.uDensity.start },
        uStrength: { value: this.settings.uStrength.start },
        uDeepPurple: { value: this.settings.uDeepPurple.start },
        uOpacity: { value: this.settings.uOpacity.start },
      }
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  addEventListeners() {
    // window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('scroll', this.onScroll.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / this.viewport.width).toFixed(2) * 4;
    this.mouse.y = (event.clientY / this.viewport.height).toFixed(2) * 2;

    gsap.to(this.mesh.material.uniforms.uFrequency, { value: this.mouse.x });
    gsap.to(this.mesh.material.uniforms.uAmplitude, { value: this.mouse.x });
    gsap.to(this.mesh.material.uniforms.uDensity, { value: this.mouse.y });
    gsap.to(this.mesh.material.uniforms.uStrength, { value: this.mouse.y });

    // gsap.to(this.mesh.material.uniforms.uDeepPurple, { value: this.mouse.x });
    // gsap.to(this.mesh.material.uniforms.uOpacity, { value: this.mouse.y });
  }

  onScroll() {
    if (!this.scroll.running) {
      window.requestAnimationFrame(this.updateScrollAnimations);
      this.scroll.running = true;
    }
  }

  onResize() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    if (this.viewport.width < this.viewport.height) {
      this.mesh.scale.set(.75, .75, .75);
    } else {
      this.mesh.scale.set(1, 1, 1);
    }

    this.smoothScroll.onResize();

    this.camera.aspect = this.viewport.width / this.viewport.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }

  updateScrollAnimations() {
    this.scroll.running = false;
    this.scroll.normalized = (this.scroll.hard / this.scroll.limit).toFixed(1);

    gsap.to(this.mesh.rotation, {
      x: this.scroll.normalized * Math.PI
    });

    for (const key in this.settings) {
      if (this.settings[key].start !== this.settings[key].end) {
        gsap.to(this.mesh.material.uniforms[key], {
          value: this.settings[key].start + this.scroll.normalized * (this.settings[key].end - this.settings[key].start)
        })
      }
    }
  }

  update() {
    const elapsedTime = this.clock.getElapsedTime();
    this.mesh.rotation.y = elapsedTime * 0.05;

    this.render();
    this.smoothScroll.update();

    window.requestAnimationFrame(this.update);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}