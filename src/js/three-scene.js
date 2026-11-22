import * as THREE from 'three';

/**
 * Ambient 3D Cyber-Laboratory Scene (Three.js)
 * - Detects GPU/WebGL capability & reduced-motion preference
 * - Adapts particle density for lower-power/mobile devices
 * - Subtle mouse parallax & scroll depth response
 * - Clean GPU resource disposal on page unload
 */
export function initThreeScene() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmallScreen = window.innerWidth < 768;
  const lowCoreCount = (navigator.hardwareConcurrency || 4) <= 4;

  // Test WebGL support gracefully
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isSmallScreen,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch {
    canvas.style.display = 'none';
    return null;
  }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.25 : 1.75);
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    120
  );
  camera.position.z = 26;

  // Adaptive particle count based on device capabilities
  const particleCount = isSmallScreen || lowCoreCount ? 180 : 420;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorCyan = new THREE.Color('#00D9FF');
  const colorBlue = new THREE.Color('#287BFF');
  const colorViolet = new THREE.Color('#8055FF');

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 60;
    positions[i3 + 1] = (Math.random() - 0.5) * 44;
    positions[i3 + 2] = (Math.random() - 0.5) * 32;

    const pick = Math.random();
    const c = pick < 0.55 ? colorCyan : pick < 0.8 ? colorBlue : colorViolet;
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: isSmallScreen ? 0.18 : 0.22,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Subtle holographic wireframe rings in deep space
  const ringGroup = new THREE.Group();
  const outerRingGeo = new THREE.TorusGeometry(9.5, 0.032, 12, 96);
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: 0x00d9ff,
    transparent: true,
    opacity: 0.24,
  });
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRing.rotation.x = Math.PI * 0.36;
  outerRing.rotation.y = Math.PI * 0.14;
  ringGroup.add(outerRing);

  const innerRingGeo = new THREE.TorusGeometry(6.4, 0.026, 12, 72);
  const innerRingMat = new THREE.MeshBasicMaterial({
    color: 0x8055ff,
    transparent: true,
    opacity: 0.22,
  });
  const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerRing.rotation.x = -Math.PI * 0.28;
  innerRing.rotation.y = Math.PI * 0.32;
  ringGroup.add(innerRing);

  ringGroup.position.set(8, 0, -8);
  scene.add(ringGroup);

  // Subtle mouse & scroll tracking
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollProgress = 0;

  const onMouseMove = (event) => {
    mouse.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
  };

  const onScroll = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollProgress = window.scrollY / maxScroll;
  };

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  let rafId = null;
  const clock = new THREE.Clock();

  const renderFrame = () => {
    const elapsed = clock.getElapsedTime();

    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    if (!prefersReducedMotion) {
      particles.rotation.y = elapsed * 0.024 + mouse.x * 0.12;
      particles.rotation.x = Math.sin(elapsed * 0.08) * 0.06 - mouse.y * 0.08;

      ringGroup.rotation.z = elapsed * 0.045;
      ringGroup.rotation.y = mouse.x * 0.18 + scrollProgress * 1.4;
      ringGroup.position.y = -scrollProgress * 6 + Math.sin(elapsed * 0.4) * 0.4;
    }

    camera.position.x = mouse.x * 0.9;
    camera.position.y = -mouse.y * 0.6;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    if (!prefersReducedMotion) {
      rafId = window.requestAnimationFrame(renderFrame);
    }
  };

  renderFrame();

  const dispose = () => {
    if (rafId) window.cancelAnimationFrame(rafId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    particleGeometry.dispose();
    particleMaterial.dispose();
    outerRingGeo.dispose();
    outerRingMat.dispose();
    innerRingGeo.dispose();
    innerRingMat.dispose();
    renderer.dispose();
  };

  window.addEventListener('beforeunload', dispose);
  return { dispose };
}
