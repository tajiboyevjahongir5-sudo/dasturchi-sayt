'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RobotMood } from './RobotAvatar';

interface Robot3DCanvasProps {
  mood?: RobotMood;
  isSpeaking?: boolean;
  isPointing?: boolean;
  size?: number;
  className?: string;
}

export function Robot3DCanvas({
  mood = 'idle',
  isSpeaking = false,
  isPointing = false,
  size = 120,
  className = '',
}: Robot3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ mood, isSpeaking, isPointing });

  // Keep state updated in ref for the animation loop
  useEffect(() => {
    stateRef.current = { mood, isSpeaking, isPointing };
  }, [mood, isSpeaking, isPointing]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.2, 3.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- 2. Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x60a5fa, 2.5); // Futuristic blue tint
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa855f7, 1.8); // Purple neon fill
    fillLight.position.set(-3, -1, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2, 10);
    rimLight.position.set(0, -2, -1);
    scene.add(rimLight);

    // --- 3. Dynamic Texture for Visor Eyes / Face ---
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 256;
    faceCanvas.height = 128;
    const ctx = faceCanvas.getContext('2d')!;
    const faceTexture = new THREE.CanvasTexture(faceCanvas);
    faceTexture.minFilter = THREE.LinearFilter;
    faceTexture.magFilter = THREE.LinearFilter;

    function drawFace(currentMood: RobotMood, speaking: boolean, time: number) {
      ctx.clearRect(0, 0, 256, 128);

      // Dark futuristic visor background
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, 256, 128);

      // Subtle cyan scanning line
      const scanY = (time * 60) % 128;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fillRect(0, scanY, 256, 2);

      // Mood-based facial features
      if (currentMood === 'celebrate') {
        // Golden Star Eyes
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;

        const drawStar = (cx: number, cy: number, r: number) => {
          ctx.save();
          ctx.beginPath();
          ctx.translate(cx, cy);
          ctx.rotate(time * 2);
          for (let i = 0; i < 5; i++) {
            ctx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * r, -Math.sin(((18 + i * 72) * Math.PI) / 180) * r);
            ctx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (r / 2), -Math.sin(((54 + i * 72) * Math.PI) / 180) * (r / 2));
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        };

        drawStar(80, 60, 22);
        drawStar(176, 60, 22);

        // Cheerful smiling arc
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(128, 85, 16, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
      } else if (currentMood === 'alert') {
        // Alert / Error: Concerned wide eyes with warning glow
        ctx.fillStyle = '#f87171';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 16;

        // Pulsing round eyes
        const pulse = 20 + Math.sin(time * 8) * 3;
        ctx.beginPath();
        ctx.ellipse(80, 60, pulse, pulse * 1.2, 0, 0, Math.PI * 2);
        ctx.ellipse(176, 60, pulse, pulse * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Inner pupils
        ctx.fillStyle = '#060913';
        ctx.beginPath();
        ctx.arc(80, 60, 8, 0, Math.PI * 2);
        ctx.arc(176, 60, 8, 0, Math.PI * 2);
        ctx.fill();

        // Warning flat mouth
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(110, 95);
        ctx.lineTo(146, 95);
        ctx.stroke();
      } else if (currentMood === 'thinking') {
        // Thinking: Rotating tech visor rings
        ctx.strokeStyle = '#818cf8';
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 4;

        ctx.save();
        ctx.translate(80, 60);
        ctx.rotate(time * 4);
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, 1.5 * Math.PI);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(176, 60);
        ctx.rotate(-time * 4);
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, 1.5 * Math.PI);
        ctx.stroke();
        ctx.restore();
      } else {
        // Idle or Talking: Friendly glowing cyan eyes
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 14;

        const blinkCycle = time % 4;
        const isBlinking = blinkCycle > 3.8 && blinkCycle < 3.95;

        if (isBlinking) {
          // Closed eye slit
          ctx.fillRect(60, 60, 40, 5);
          ctx.fillRect(156, 60, 40, 5);
        } else {
          // Curved friendly rounded eye pills
          ctx.beginPath();
          ctx.roundRect(62, 45, 36, 32, 16);
          ctx.roundRect(158, 45, 36, 32, 16);
          ctx.fill();

          // Cute sparkle dots
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(85, 52, 4, 0, Math.PI * 2);
          ctx.arc(181, 52, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Animated soundwave mouth if speaking
        if (speaking) {
          ctx.fillStyle = '#38bdf8';
          const bars = 5;
          const barW = 4;
          const gap = 4;
          const startX = 128 - ((bars * (barW + gap)) / 2);
          for (let i = 0; i < bars; i++) {
            const h = 4 + Math.abs(Math.sin(time * 12 + i)) * 14;
            ctx.fillRect(startX + i * (barW + gap), 98 - h / 2, barW, h);
          }
        }
      }

      faceTexture.needsUpdate = true;
    }

    // --- 4. 3D Model Materials ---
    // Premium glossy pearl white chassis
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.18,
      metalness: 0.15,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    });

    // Dark sleek titanium joints
    const jointMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.8,
    });

    // Visor material displaying our dynamic texture
    const visorMaterial = new THREE.MeshBasicMaterial({
      map: faceTexture,
    });

    // Glowing cyan neon material for thrusters and rings
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    // --- 5. Build Procedural 3D Robot Hierarchy ---
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // A. Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.45, 0);
    robotGroup.add(headGroup);

    // Head Shell (Rounded Sphere)
    const headGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, bodyMaterial);
    headGroup.add(headMesh);

    // Visor Screen (Slightly flattened cylinder on front of head)
    const visorGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.32, 32, 1, false, 0, Math.PI);
    visorGeo.rotateY(Math.PI / 2);
    visorGeo.scale(1, 1, 0.85);
    const visorMesh = new THREE.Mesh(visorGeo, visorMaterial);
    visorMesh.position.set(0, 0.02, 0.12);
    headGroup.add(visorMesh);

    // Cute Antenna on top of head
    const antennaStemGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.3, 16);
    antennaStemGeo.translate(0, 0.15, 0);
    const antennaStem = new THREE.Mesh(antennaStemGeo, jointMaterial);
    antennaStem.position.set(0, 0.5, 0);
    headGroup.add(antennaStem);

    const antennaTipGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const antennaTip = new THREE.Mesh(antennaTipGeo, glowMaterial);
    antennaTip.position.set(0, 0.8, 0);
    headGroup.add(antennaTip);

    // B. Torso (Aerodynamic Pod Body)
    const torsoGeo = new THREE.SphereGeometry(0.5, 32, 32);
    torsoGeo.scale(0.85, 1.1, 0.85);
    const torsoMesh = new THREE.Mesh(torsoGeo, bodyMaterial);
    torsoMesh.position.set(0, -0.3, 0);
    robotGroup.add(torsoMesh);

    // Chest Glowing Arc Core
    const coreGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 24);
    coreGeo.rotateX(Math.PI / 2);
    const coreMesh = new THREE.Mesh(coreGeo, glowMaterial);
    coreMesh.position.set(0, -0.22, 0.42);
    robotGroup.add(coreMesh);

    // C. Anti-gravity Hover Thruster Ring
    const thrusterRingGeo = new THREE.TorusGeometry(0.28, 0.04, 16, 32);
    thrusterRingGeo.rotateX(Math.PI / 2);
    const thrusterRing = new THREE.Mesh(thrusterRingGeo, glowMaterial);
    thrusterRing.position.set(0, -0.85, 0);
    robotGroup.add(thrusterRing);

    // D. Left Arm (Gently floating at side)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.55, -0.2, 0);
    robotGroup.add(leftArmGroup);

    const leftUpperArmGeo = new THREE.CapsuleGeometry(0.08, 0.3, 12, 16);
    const leftArmMesh = new THREE.Mesh(leftUpperArmGeo, bodyMaterial);
    leftArmMesh.position.set(0, -0.15, 0);
    leftArmMesh.rotation.z = -0.2;
    leftArmGroup.add(leftArmMesh);

    // E. Right Arm: Articulated Pointing Arm & Finger 👉
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.55, -0.2, 0);
    robotGroup.add(rightArmGroup);

    // Right Shoulder / Upper Arm
    const rightUpperArmGeo = new THREE.CapsuleGeometry(0.08, 0.28, 12, 16);
    const rightUpperArm = new THREE.Mesh(rightUpperArmGeo, bodyMaterial);
    rightUpperArm.position.set(0, -0.14, 0);
    rightArmGroup.add(rightUpperArm);

    // Right Forearm & Hand Group (Pivots towards target)
    const rightHandGroup = new THREE.Group();
    rightHandGroup.position.set(0, -0.3, 0);
    rightArmGroup.add(rightHandGroup);

    // Hand Palm
    const palmGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const palm = new THREE.Mesh(palmGeo, jointMaterial);
    rightHandGroup.add(palm);

    // Extended Pointing Index Finger 👉
    const fingerGeo = new THREE.CylinderGeometry(0.03, 0.02, 0.25, 12);
    fingerGeo.rotateZ(-Math.PI / 2); // Points forward-right
    fingerGeo.translate(0.12, 0, 0);
    const finger = new THREE.Mesh(fingerGeo, bodyMaterial);
    rightHandGroup.add(finger);

    // Fingertip Glowing Pointer Light
    const fingerTipGeo = new THREE.SphereGeometry(0.035, 12, 12);
    const fingerTipMesh = new THREE.Mesh(fingerTipGeo, glowMaterial);
    fingerTipMesh.position.set(0.24, 0, 0);
    rightHandGroup.add(fingerTipMesh);

    // --- 6. Animation Loop ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      const t = clock.getElapsedTime();
      const { mood: curMood, isSpeaking: curSpeaking, isPointing: curPointing } = stateRef.current;

      // Update face texture
      drawFace(curMood, curSpeaking, t);

      // 1. Idle Floating / Bobbing
      robotGroup.position.y = Math.sin(t * 2.5) * 0.08;
      robotGroup.rotation.y = Math.sin(t * 1.2) * 0.12;

      // 2. Thruster pulse
      const pulseScale = 1 + Math.sin(t * 8) * 0.08;
      thrusterRing.scale.set(pulseScale, pulseScale, pulseScale);

      // 3. Antenna tip color change on alert
      if (curMood === 'alert') {
        antennaTip.material = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      } else if (curMood === 'celebrate') {
        antennaTip.material = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      } else {
        antennaTip.material = glowMaterial;
      }

      // 4. Pointing Hand Dynamics 👉
      if (curPointing) {
        // Raise arm up and forward to point directly at target!
        rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, -0.6, 0.1);
        rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.8, 0.1);
        rightArmGroup.rotation.y = THREE.MathUtils.lerp(rightArmGroup.rotation.y, 0.4, 0.1);

        // Pointing pulse
        const fingerPulse = 1 + Math.sin(t * 10) * 0.15;
        fingerTipMesh.scale.set(fingerPulse, fingerPulse, fingerPulse);
        
        // Head tilts towards pointing direction
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, 0.25, 0.1);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0.1, 0.1);
      } else {
        // Rest arm naturally at the side
        rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, 0, 0.08);
        rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.15, 0.08);
        rightArmGroup.rotation.y = THREE.MathUtils.lerp(rightArmGroup.rotation.y, 0, 0.08);

        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, 0, 0.08);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0, 0.08);
      }

      // 5. Left Arm gentle bobbing
      leftArmGroup.rotation.z = -0.15 + Math.sin(t * 2) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      renderer.dispose();
      faceTexture.dispose();
      bodyMaterial.dispose();
      jointMaterial.dispose();
      visorMaterial.dispose();
      glowMaterial.dispose();
      container.innerHTML = '';
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size }}
      className={`relative select-none pointer-events-none ${className}`}
    />
  );
}
