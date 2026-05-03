/* 
   MUSIC EQUALIZER TERRAIN
   A 3D floor made of pulsing bars that react like a music visualizer.
*/

const canvasContainer = document.getElementById("particle-canvas");

if (canvasContainer) {
  // 1. SCENE SETUP
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.003); // Deep fog

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  // Position higher to see the "floor" of bars
  camera.position.set(0, 60, 120);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  canvasContainer.appendChild(renderer.domElement);

  // 2. EQUALIZER BARS (InstancedMesh for performance)
  const rows = 30;
  const cols = 50;
  const count = rows * cols;

  const barGeometry = new THREE.BoxGeometry(1, 1, 1);
  // Shift pivot to bottom so they scale up from floor, not center
  barGeometry.translate(0, 0.5, 0); 
  
  const barMaterial = new THREE.MeshBasicMaterial({
    color: 0xbc13fe,
    transparent: true,
    opacity: 0.8,
  });

  const mesh = new THREE.InstancedMesh(barGeometry, barMaterial, count);
  scene.add(mesh);

  const dummy = new THREE.Object3D();
  const positionOffset = 4; // Space between bars

  // Initialize Matrix
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const index = i * cols + j;
      dummy.position.set(
        (j - cols / 2) * positionOffset,
        -30, // Floor level
        (i - rows / 2) * positionOffset
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    }
  }

  // 3. MOUSE INTERACTION
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 30); // Plane at y=-30
  let targetPoint = new THREE.Vector3();

  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // 4. ANIMATION LOOP
  let time = 0;
  const color = new THREE.Color();

  function animate() {
    requestAnimationFrame(animate);
    time += 0.1;

    // Raycast to find mouse on floor
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, targetPoint);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const index = i * cols + j;
            
            // Calculate base position
            const x = (j - cols / 2) * positionOffset;
            const z = (i - rows / 2) * positionOffset;
            
            // SIMULATE MUSIC WAVE (Perlin-ish pseudo noise)
            // Distorted sine waves to look like audio spectrum
            let height = Math.abs(Math.sin(x * 0.05 + time) * Math.cos(z * 0.05 + time * 0.5)) * 20;
            // Add a "beat" pulse
            height += Math.sin(time * 2) * 2;
            
            // MOUSE REACTION (Strumming)
            if (targetPoint) {
                const dx = x - targetPoint.x;
                const dz = z - targetPoint.z;
                const dist = Math.sqrt(dx * dx + dz * dz);
                if (dist < 30) {
                    const force = (30 - dist) / 30;
                    height += force * 40; // Spike up near mouse
                }
            }
            
            // Ensure min height
            height = Math.max(1, height);

            // Update Scale
            dummy.position.set(x, -30, z);
            dummy.scale.set(1.5, height, 1.5); // Thicker bars
            dummy.updateMatrix();
            mesh.setMatrixAt(index, dummy.matrix);

            // Dynamic Color (Purple to Blue based on height)
            color.setHSL(0.8 + height * 0.01, 1, 0.5);
            mesh.setColorAt(index, color);
        }
    }
    
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;

    // Orbit Camera slightly
    // camera.position.x = Math.sin(time * 0.01) * 20;
    
    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
