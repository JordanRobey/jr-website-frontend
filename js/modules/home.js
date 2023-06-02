export function initializeHomePage() {

    // Initialize the scene
    var camera, scene, mesh, renderer;
  
    function init() {
      camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.01,
        10
      );
      camera.position.z = 0.5;
  
      scene = new THREE.Scene();
  
      var geometry = new THREE.BoxGeometry(0.13, 0.13, 0.13);
      var material = new THREE.MeshNormalMaterial();
  
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
  
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      renderer.setSize(window.innerWidth / 5, window.innerHeight / 5);
      document.getElementById("canvas").appendChild(renderer.domElement);
  
      animate();
    }
  
    function animate() {
      requestAnimationFrame(animate);
      var time = Date.now();
      mesh.rotation.x = time / 2000;
      mesh.rotation.y = time / 1000;
      renderer.render(scene, camera);
    }
  
    init();
  
  }