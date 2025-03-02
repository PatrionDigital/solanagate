// src/components/BackgroundEffect.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";

const BackgroundEffect = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const cloudParticlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Initialize scene
    const init = async () => {
      // Create scene
      sceneRef.current = new THREE.Scene();

      // Create camera
      cameraRef.current = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      cameraRef.current.position.z = 1;
      cameraRef.current.rotation.x = 1.16;
      cameraRef.current.rotation.y = -0.12;
      cameraRef.current.rotation.z = 0.27;

      // Add ambient light
      const ambient = new THREE.AmbientLight(0x555555);
      sceneRef.current.add(ambient);

      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xff8c19);
      directionalLight.position.set(0, 0, 1);
      sceneRef.current.add(directionalLight);

      // Add point lights
      const orangeLight = new THREE.PointLight(0xcc6600, 50, 450, 1.7);
      orangeLight.position.set(200, 300, 100);
      sceneRef.current.add(orangeLight);

      const redLight = new THREE.PointLight(0xd8547e, 50, 450, 1.7);
      redLight.position.set(100, 300, 100);
      sceneRef.current.add(redLight);

      const blueLight = new THREE.PointLight(0x3677ac, 50, 450, 1.7);
      blueLight.position.set(300, 300, 200);
      sceneRef.current.add(blueLight);

      // Create renderer
      rendererRef.current = new THREE.WebGLRenderer();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);

      // Add fog to scene
      sceneRef.current.fog = new THREE.FogExp2(0x03544e, 0.001);
      rendererRef.current.setClearColor(sceneRef.current.fog.color);

      // Append renderer to container
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(rendererRef.current.domElement);
      }

      // Load texture and create particles
      try {
        // In React, we need to import or require the image
        // For now, we'll use a placeholder URL and you'll need to add the actual image to your assets
        const textureUrl = "/src/assets/smoke-texture.png"; // Update this path to your actual smoke texture
        const texture = await new Promise((resolve) => {
          new THREE.TextureLoader().load(textureUrl, resolve);
        });

        const cloudGeo = new THREE.PlaneGeometry(500, 500);
        const cloudMaterial = new THREE.MeshLambertMaterial({
          map: texture,
          transparent: true,
        });

        cloudParticlesRef.current = [];

        for (let p = 0; p < 50; p++) {
          const cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
          cloud.position.set(
            Math.random() * 800 - 400,
            500,
            Math.random() * 500 - 500
          );
          cloud.rotation.x = 1.16;
          cloud.rotation.y = -0.12;
          cloud.rotation.z = Math.random() * 2 * Math.PI;
          cloud.material.opacity = 0.55;

          cloudParticlesRef.current.push(cloud);
          sceneRef.current.add(cloud);
        }

        // Start animation
        animate();
      } catch (error) {
        console.error("Error loading texture:", error);
      }
    };

    // Animation function
    const animate = () => {
      cloudParticlesRef.current.forEach((p) => {
        p.rotation.z -= 0.001;
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Initialize the scene
    init();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (
        rendererRef.current &&
        rendererRef.current.domElement &&
        containerRef.current
      ) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      // Dispose of resources
      if (cloudParticlesRef.current.length) {
        cloudParticlesRef.current.forEach((cloud) => {
          if (cloud.geometry) cloud.geometry.dispose();
          if (cloud.material) cloud.material.dispose();
        });
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1, // Place it behind other content
      }}
    />
  );
};

export default BackgroundEffect;
