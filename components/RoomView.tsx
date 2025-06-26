import React, { useEffect, useRef, useState } from "react";

const RoomViewer = () => {
  const mountRef = useRef(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Ensure component is mounted first
    if (!mountRef.current) {
      setError("Mount point not available");
      setLoading(false);
      return;
    }

    // Check if Three.js is already loaded
    if (window.THREE) {
      initThreeJS();
      return;
    }

    // Load Three.js
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

    script.onload = () => {
      initThreeJS();
    };

    script.onerror = () => {
      setError("Failed to load Three.js library");
      setLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initThreeJS = () => {
    try {
      const THREE = window.THREE;

      if (!THREE) {
        setError("Three.js not available");
        setLoading(false);
        return;
      }

      if (!mountRef.current) {
        setError("Mount point not ready");
        setLoading(false);
        return;
      }

      // Clear any existing content
      mountRef.current.innerHTML = "";

      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x222222);

      // Get container dimensions
      const width = mountRef.current.clientWidth || window.innerWidth;
      const height = mountRef.current.clientHeight || window.innerHeight;

      // Camera
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 0, -3);

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.domElement.style.display = "block";

      // Append to mount point
      mountRef.current.appendChild(renderer.domElement);

      // Room geometry - create interior walls
      const roomSize = 5;
      const wallHeight = 4;

      // Materials with different colors to distinguish walls
      const materials = [
        new THREE.MeshBasicMaterial({ color: 0xf5f5dc, side: THREE.BackSide }), // right wall - beige
        new THREE.MeshBasicMaterial({ color: 0xf5f5dc, side: THREE.BackSide }), // left wall - beige
        new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide }), // ceiling - white
        new THREE.MeshBasicMaterial({ color: 0x8b4513, side: THREE.BackSide }), // floor - brown
        new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide }), // front - black (door opening)
        new THREE.MeshBasicMaterial({ color: 0xf5f5dc, side: THREE.BackSide }), // back wall - beige
      ];

      // Create room as interior cube
      const roomGeometry = new THREE.BoxGeometry(
        roomSize,
        wallHeight,
        roomSize,
      );
      const room = new THREE.Mesh(roomGeometry, materials);
      scene.add(room);

      // Add some simple furniture for reference
      // Table
      const tableGeometry = new THREE.BoxGeometry(1, 0.1, 0.6);
      const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x654321 });
      const table = new THREE.Mesh(tableGeometry, tableMaterial);
      table.position.set(0.5, -1.5, 1);
      scene.add(table);

      // Chair
      const chairGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.4);
      const chairMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
      const chair = new THREE.Mesh(chairGeometry, chairMaterial);
      chair.position.set(-0.8, -1.2, 0.5);
      scene.add(chair);

      // Add a simple light source visualization
      const lightGeometry = new THREE.SphereGeometry(0.1, 8, 6);
      const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const lightBulb = new THREE.Mesh(lightGeometry, lightMaterial);
      lightBulb.position.set(0, 1.8, 0);
      scene.add(lightBulb);

      // Mouse controls
      let mouseX = 0;
      let mouseY = 0;
      let isMouseDown = false;

      const onMouseMove = (event) => {
        if (isMouseDown) return; // Skip if dragging

        const rect = mountRef.current.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      };

      const onMouseDown = () => {
        isMouseDown = true;
      };
      const onMouseUp = () => {
        isMouseDown = false;
      };

      mountRef.current.addEventListener("mousemove", onMouseMove);
      mountRef.current.addEventListener("mousedown", onMouseDown);
      mountRef.current.addEventListener("mouseup", onMouseUp);

      // Animation loop
      let animationId;
      const animate = () => {
        animationId = requestAnimationFrame(animate);

        // Camera rotation based on mouse
        camera.rotation.y = mouseX * 0.5;
        camera.rotation.x = mouseY * 0.3;

        renderer.render(scene, camera);
      };

      // Handle resize
      const onWindowResize = () => {
        if (!mountRef.current) return;

        const newWidth = mountRef.current.clientWidth;
        const newHeight = mountRef.current.clientHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener("resize", onWindowResize);

      // Start animation
      animate();
      setLoading(false);
      setError(null);

      // Return cleanup function
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        window.removeEventListener("resize", onWindowResize);
        if (mountRef.current) {
          mountRef.current.removeEventListener("mousemove", onMouseMove);
          mountRef.current.removeEventListener("mousedown", onMouseDown);
          mountRef.current.removeEventListener("mouseup", onMouseUp);
          if (
            renderer.domElement &&
            mountRef.current.contains(renderer.domElement)
          ) {
            mountRef.current.removeChild(renderer.domElement);
          }
        }
        renderer.dispose();
      };
    } catch (err) {
      setError(`Three.js initialization failed: ${err.message}`);
      setLoading(false);
      console.error("Three.js error:", err);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Three.js Room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-red-900 text-white">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold mb-4">Failed to Load Room</h2>
          <p className="text-red-200 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      <div ref={mountRef} className="w-full h-full" />

      <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white p-3 rounded max-w-sm">
        <h3 className="font-bold mb-1">Room Interior View</h3>
        <p className="text-sm mb-1">Move mouse to look around the room</p>
        <div className="text-xs opacity-75">
          <div>• Brown floor</div>
          <div>• Beige walls</div>
          <div>• White ceiling</div>
          <div>• Yellow light bulb</div>
        </div>
      </div>
    </div>
  );
};

export default RoomViewer;
