'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RobotMood } from './RobotAvatar';

interface Robot3DCanvasProps {
  mood?: RobotMood;
  isSpeaking?: boolean;
  isPointing?: boolean;
  pointingDirection?: 'left' | 'right';
  size?: number;
  className?: string;
}

export function Robot3DCanvas({
  mood = 'idle',
  isSpeaking = false,
  isPointing = false,
  pointingDirection = 'left',
  size = 160,
  className = '',
}: Robot3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ mood, isSpeaking, isPointing, pointingDirection });

  // Keep state updated in ref for the animation loop
  useEffect(() => {
    stateRef.current = { mood, isSpeaking, isPointing, pointingDirection };
  }, [mood, isSpeaking, isPointing, pointingDirection]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.15, 3.7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- 2. Studio Lighting for High 3D Fidelity ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Main key light (cool white/cyan)
    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 3.0);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    // Fill light (subtle violet/blue)
    const fillLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    fillLight.position.set(-3, -1, 3);
    scene.add(fillLight);

    // Rim backlight for edge separation
    const rimLight = new THREE.PointLight(0x38bdf8, 3.5, 10);
    rimLight.position.set(0, 1.5, -2);
    scene.add(rimLight);

    // Bottom thruster light
    const thrusterLight = new THREE.PointLight(0x06b6d4, 2.5, 5);
    thrusterLight.position.set(0, -1.2, 0);
    scene.add(thrusterLight);

    // --- 3. High-Resolution Dynamic Visor Face Texture ---
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 512;
    faceCanvas.height = 256;
    const ctx = faceCanvas.getContext('2d')!;
    const faceTexture = new THREE.CanvasTexture(faceCanvas);
    faceTexture.minFilter = THREE.LinearFilter;
    faceTexture.magFilter = THREE.LinearFilter;

    function drawFace(currentMood: RobotMood, speaking: boolean, time: number) {
      ctx.clearRect(0, 0, 512, 256);

      // Deep obsidian curved screen background
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, 512, 256);

      // Subtle cybernetic grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 2;
      for (let y = 30; y < 256; y += 35) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }

      // Mood-based expressions
      if (currentMood === 'celebrate') {
        // Golden Star Eyes
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 20;

        const drawStar = (cx: number, cy: number, r: number) => {
          ctx.save();
          ctx.beginPath();
          ctx.translate(cx, cy);
          ctx.rotate(time * 2.5);
          for (let i = 0; i < 5; i++) {
            ctx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * r, -Math.sin(((18 + i * 72) * Math.PI) / 180) * r);
            ctx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (r / 2), -Math.sin(((54 + i * 72) * Math.PI) / 180) * (r / 2));
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        };

        drawStar(160, 115, 38);
        drawStar(352, 115, 38);

        // Cheerful smiling arc
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(256, 170, 35, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
      } else if (currentMood === 'alert') {
        // Alert / Error: Concerned wide eyes with pulsing red/amber glow
        ctx.fillStyle = '#f87171';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 25;

        const eyePulse = 36 + Math.sin(time * 10) * 5;
        ctx.beginPath();
        ctx.ellipse(160, 115, eyePulse, eyePulse * 1.15, 0, 0, Math.PI * 2);
        ctx.ellipse(352, 115, eyePulse, eyePulse * 1.15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dark dilated pupils
        ctx.fillStyle = '#080d1a';
        ctx.beginPath();
        ctx.arc(160, 115, 14, 0, Math.PI * 2);
        ctx.arc(352, 115, 14, 0, Math.PI * 2);
        ctx.fill();

        // Flat concerned mouth
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(215, 190);
        ctx.lineTo(297, 190);
        ctx.stroke();
      } else {
        // Friendly Teacher Mode: Expressive glowing cyan rounded eyes
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 24;

        const blinkCycle = time % 3.8;
        const isBlinking = blinkCycle > 3.65;

        if (isBlinking) {
          // Sleek horizontal blink slit
          ctx.fillRect(120, 120, 80, 8);
          ctx.fillRect(312, 120, 80, 8);
        } else {
          // Warm smiling friendly eyes (pill shape with slight upward arch)
          ctx.beginPath();
          ctx.roundRect(125, 85, 75, 68, 34);
          ctx.roundRect(312, 85, 75, 68, 34);
          ctx.fill();

          // Cute glossy pupil reflections
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(175, 102, 9, 0, Math.PI * 2);
          ctx.arc(362, 102, 9, 0, Math.PI * 2);
          ctx.arc(150, 125, 5, 0, Math.PI * 2);
          ctx.arc(337, 125, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Real Animated Teacher Mouth (Mouth and lips open/close dynamically to speech)
        if (speaking) {
          ctx.save();
          const speechSpeed = time * 15;
          // Natural speech cadence & syllables (alternating open, round, wide visemes)
          const syllableFactor = Math.abs(Math.sin(speechSpeed) * Math.cos(speechSpeed * 0.65));
          const mouthH = Math.max(5, Math.min(32, 8 + syllableFactor * 26));
          const mouthW = 46 + Math.sin(speechSpeed * 0.4) * 8;
          const mouthY = 188;

          // 1. Dark inner mouth cavity
          ctx.fillStyle = '#060d1f';
          ctx.beginPath();
          ctx.ellipse(256, mouthY, mouthW / 2, mouthH / 2, 0, 0, Math.PI * 2);
          ctx.fill();

          // 2. Tongue movement when mouth is open
          if (mouthH > 10) {
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.ellipse(256, mouthY + (mouthH * 0.22), (mouthW / 2) * 0.5, (mouthH / 2) * 0.4, 0, 0, Math.PI);
            ctx.fill();
          }

          // 3. Crisp white upper teeth line
          if (mouthH > 12) {
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.roundRect(256 - (mouthW * 0.3), mouthY - (mouthH / 2) + 1, mouthW * 0.6, 4, 2);
            ctx.fill();
          }

          // 4. Glowing animated lips
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 4.5;
          ctx.lineCap = 'round';
          ctx.shadowColor = '#0284c7';
          ctx.shadowBlur = 14;

          ctx.beginPath();
          // Upper lip
          ctx.moveTo(256 - mouthW / 2, mouthY);
          ctx.quadraticCurveTo(256, mouthY - (mouthH / 2) - 1, 256 + mouthW / 2, mouthY);
          // Lower lip
          ctx.quadraticCurveTo(256, mouthY + (mouthH / 2) + 1, 256 - mouthW / 2, mouthY);
          ctx.stroke();

          // 5. Smiling mouth dimple corners
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(256 - mouthW / 2 - 2, mouthY - 1, 2.5, 0, Math.PI * 2);
          ctx.arc(256 + mouthW / 2 + 2, mouthY - 1, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        } else {
          // Warm smiling friendly mouth
          ctx.save();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 5.5;
          ctx.lineCap = 'round';
          ctx.shadowColor = '#0284c7';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(256, 178, 24, 0.18 * Math.PI, 0.82 * Math.PI);
          ctx.stroke();

          // Dimple corners
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(234, 191, 3, 0, Math.PI * 2);
          ctx.arc(278, 191, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      faceTexture.needsUpdate = true;
    }

    // --- 4. High-End 3D Materials ---
    // Pearlescent gloss white chassis
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.12,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    // Dark titanium joints
    const jointMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.85,
    });

    // Visor material displaying dynamic texture
    const visorMaterial = new THREE.MeshBasicMaterial({
      map: faceTexture,
    });

    // Glowing cyan neon
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    // Floating Halo / Headphone gear
    const haloMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.7,
      roughness: 0.2,
    });

    // --- 5. Build Procedural 3D Robot Hierarchy ---
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);

    // A. Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.48, 0);
    robotRoot.add(headGroup);

    // Head Shell (Sleek aerodynamic sphere)
    const headGeo = new THREE.SphereGeometry(0.56, 36, 36);
    const headMesh = new THREE.Mesh(headGeo, bodyMaterial);
    headGroup.add(headMesh);

    // Visor Screen (Front curved glass)
    const visorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.34, 36, 1, false, 0, Math.PI);
    visorGeo.rotateY(Math.PI / 2);
    visorGeo.scale(1, 1, 0.86);
    const visorMesh = new THREE.Mesh(visorGeo, visorMaterial);
    visorMesh.position.set(0, 0.02, 0.11);
    headGroup.add(visorMesh);

    // Headphone / Ear pieces (Left and Right)
    const earGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 24);
    earGeo.rotateZ(Math.PI / 2);

    const leftEar = new THREE.Mesh(earGeo, haloMaterial);
    leftEar.position.set(-0.56, 0.02, 0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, haloMaterial);
    rightEar.position.set(0.56, 0.02, 0);
    headGroup.add(rightEar);

    // Antenna on top of head
    const antennaStemGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.32, 16);
    antennaStemGeo.translate(0, 0.16, 0);
    const antennaStem = new THREE.Mesh(antennaStemGeo, jointMaterial);
    antennaStem.position.set(0, 0.52, 0);
    headGroup.add(antennaStem);

    const antennaTipGeo = new THREE.SphereGeometry(0.09, 20, 20);
    const antennaTip = new THREE.Mesh(antennaTipGeo, glowMaterial);
    antennaTip.position.set(0, 0.84, 0);
    headGroup.add(antennaTip);

    // B. Torso (Aerodynamic Pod Body)
    const torsoGeo = new THREE.SphereGeometry(0.52, 36, 36);
    torsoGeo.scale(0.85, 1.1, 0.85);
    const torsoMesh = new THREE.Mesh(torsoGeo, bodyMaterial);
    torsoMesh.position.set(0, -0.32, 0);
    robotRoot.add(torsoMesh);

    // Chest Glowing Arc Core
    const coreGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.04, 32);
    coreGeo.rotateX(Math.PI / 2);
    const coreMesh = new THREE.Mesh(coreGeo, glowMaterial);
    coreMesh.position.set(0, -0.22, 0.44);
    robotRoot.add(coreMesh);

    // C. Anti-gravity Hover Thruster Ring
    const thrusterRingGeo = new THREE.TorusGeometry(0.3, 0.045, 20, 36);
    thrusterRingGeo.rotateX(Math.PI / 2);
    const thrusterRing = new THREE.Mesh(thrusterRingGeo, glowMaterial);
    thrusterRing.position.set(0, -0.88, 0);
    robotRoot.add(thrusterRing);

    // D. Articulated Left Arm (Can point left 👈)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.56, -0.2, 0);
    robotRoot.add(leftArmGroup);

    const leftUpperArmGeo = new THREE.CapsuleGeometry(0.08, 0.28, 16, 16);
    const leftUpperArm = new THREE.Mesh(leftUpperArmGeo, bodyMaterial);
    leftUpperArm.position.set(0, -0.14, 0);
    leftArmGroup.add(leftUpperArm);

    const leftHandGroup = new THREE.Group();
    leftHandGroup.position.set(0, -0.3, 0);
    leftArmGroup.add(leftHandGroup);

    const leftPalm = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), jointMaterial);
    leftHandGroup.add(leftPalm);

    // Extended Pointing Finger on Left Hand 👈
    const leftFingerGeo = new THREE.CylinderGeometry(0.03, 0.02, 0.26, 16);
    leftFingerGeo.rotateZ(Math.PI / 2); // Points outward-left
    leftFingerGeo.translate(-0.13, 0, 0);
    const leftFinger = new THREE.Mesh(leftFingerGeo, bodyMaterial);
    leftHandGroup.add(leftFinger);

    const leftFingerTip = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), glowMaterial);
    leftFingerTip.position.set(-0.26, 0, 0);
    leftHandGroup.add(leftFingerTip);

    // E. Articulated Right Arm (Can point right 👉)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.56, -0.2, 0);
    robotRoot.add(rightArmGroup);

    const rightUpperArmGeo = new THREE.CapsuleGeometry(0.08, 0.28, 16, 16);
    const rightUpperArm = new THREE.Mesh(rightUpperArmGeo, bodyMaterial);
    rightUpperArm.position.set(0, -0.14, 0);
    rightArmGroup.add(rightUpperArm);

    const rightHandGroup = new THREE.Group();
    rightHandGroup.position.set(0, -0.3, 0);
    rightArmGroup.add(rightHandGroup);

    const rightPalm = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), jointMaterial);
    rightHandGroup.add(rightPalm);

    // Extended Pointing Finger on Right Hand 👉
    const rightFingerGeo = new THREE.CylinderGeometry(0.03, 0.02, 0.26, 16);
    rightFingerGeo.rotateZ(-Math.PI / 2); // Points outward-right
    rightFingerGeo.translate(0.13, 0, 0);
    const rightFinger = new THREE.Mesh(rightFingerGeo, bodyMaterial);
    rightHandGroup.add(rightFinger);

    const rightFingerTip = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), glowMaterial);
    rightFingerTip.position.set(0.26, 0, 0);
    rightHandGroup.add(rightFingerTip);

    // --- 6. Smooth Animation Loop ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      const t = clock.getElapsedTime();
      const { mood: curMood, isSpeaking: curSpeaking, isPointing: curPointing, pointingDirection: curDir } = stateRef.current;

      // Update face texture
      drawFace(curMood, curSpeaking, t);

      // 1. Idle Floating & Hover Physics
      robotRoot.position.y = Math.sin(t * 2.6) * 0.1;
      robotRoot.rotation.z = Math.sin(t * 1.5) * 0.04;

      // 2. Hover thruster pulse & light
      const pulseScale = 1 + Math.sin(t * 8) * 0.1;
      thrusterRing.scale.set(pulseScale, pulseScale, pulseScale);
      thrusterLight.intensity = 2.0 + Math.sin(t * 8) * 0.8;

      // 3. Antenna tip color
      if (curMood === 'alert') {
        antennaTip.material = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      } else if (curMood === 'celebrate') {
        antennaTip.material = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      } else {
        antennaTip.material = glowMaterial;
      }

      // 4. Dynamic Teacher Arm & Hand Gestures 👉 👈
      if (curPointing) {
        if (curDir === 'left') {
          // Point LEFT towards the content on the left side
          const pointGesture = curSpeaking ? Math.sin(t * 5.0) * 0.12 : 0;
          const wristPulse = curSpeaking ? Math.sin(t * 6.5) * 0.2 : 0;

          // Left pointing arm articulates and pulses towards the target
          leftArmGroup.rotation.x = THREE.MathUtils.lerp(leftArmGroup.rotation.x, -0.65 + pointGesture, 0.14);
          leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.85 + pointGesture * 0.35, 0.14);
          leftArmGroup.rotation.y = THREE.MathUtils.lerp(leftArmGroup.rotation.y, -0.4, 0.14);
          leftHandGroup.rotation.z = THREE.MathUtils.lerp(leftHandGroup.rotation.z, wristPulse, 0.15);
          leftHandGroup.rotation.x = THREE.MathUtils.lerp(leftHandGroup.rotation.x, pointGesture * 0.8, 0.15);

          // Right arm: gestures expressively like a human teacher explaining
          const freeLift = curSpeaking ? -0.42 + Math.sin(t * 4.2) * 0.2 : 0;
          const freeSway = curSpeaking ? 0.35 + Math.cos(t * 3.6) * 0.18 : 0.15;
          rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, freeLift, 0.12);
          rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, freeSway, 0.12);
          rightArmGroup.rotation.y = THREE.MathUtils.lerp(rightArmGroup.rotation.y, curSpeaking ? 0.35 : 0, 0.12);
          rightHandGroup.rotation.y = THREE.MathUtils.lerp(rightHandGroup.rotation.y, curSpeaking ? Math.sin(t * 5.0) * 0.35 : 0, 0.15);

          // Head tilts and turns towards left
          headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, -0.42 + (curSpeaking ? Math.sin(t * 2.5) * 0.08 : 0), 0.12);
          headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, curSpeaking ? Math.sin(t * 6.5) * 0.08 : 0, 0.15);
          robotRoot.rotation.y = THREE.MathUtils.lerp(robotRoot.rotation.y, -0.25, 0.12);

          const fingerGlow = 1 + (curSpeaking ? Math.sin(t * 14) * 0.35 : Math.sin(t * 8) * 0.15);
          leftFingerTip.scale.set(fingerGlow, fingerGlow, fingerGlow);
        } else {
          // Point RIGHT towards the editor on the right side
          const pointGesture = curSpeaking ? Math.sin(t * 5.0) * 0.12 : 0;
          const wristPulse = curSpeaking ? -Math.sin(t * 6.5) * 0.2 : 0;

          // Right pointing arm articulates and pulses towards the editor
          rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, -0.65 + pointGesture, 0.14);
          rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.85 - pointGesture * 0.35, 0.14);
          rightArmGroup.rotation.y = THREE.MathUtils.lerp(rightArmGroup.rotation.y, 0.4, 0.14);
          rightHandGroup.rotation.z = THREE.MathUtils.lerp(rightHandGroup.rotation.z, wristPulse, 0.15);
          rightHandGroup.rotation.x = THREE.MathUtils.lerp(rightHandGroup.rotation.x, pointGesture * 0.8, 0.15);

          // Left arm: gestures expressively like a human teacher explaining
          const freeLift = curSpeaking ? -0.42 + Math.sin(t * 4.2) * 0.2 : 0;
          const freeSway = curSpeaking ? -0.35 - Math.cos(t * 3.6) * 0.18 : -0.15;
          leftArmGroup.rotation.x = THREE.MathUtils.lerp(leftArmGroup.rotation.x, freeLift, 0.12);
          leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, freeSway, 0.12);
          leftArmGroup.rotation.y = THREE.MathUtils.lerp(leftArmGroup.rotation.y, curSpeaking ? -0.35 : 0, 0.12);
          leftHandGroup.rotation.y = THREE.MathUtils.lerp(leftHandGroup.rotation.y, curSpeaking ? -Math.sin(t * 5.0) * 0.35 : 0, 0.15);

          // Head tilts and turns towards right
          headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, 0.42 - (curSpeaking ? Math.sin(t * 2.5) * 0.08 : 0), 0.12);
          headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, curSpeaking ? Math.sin(t * 6.5) * 0.08 : 0, 0.15);
          robotRoot.rotation.y = THREE.MathUtils.lerp(robotRoot.rotation.y, 0.25, 0.12);

          const fingerGlow = 1 + (curSpeaking ? Math.sin(t * 14) * 0.35 : Math.sin(t * 8) * 0.15);
          rightFingerTip.scale.set(fingerGlow, fingerGlow, fingerGlow);
        }
      } else if (curSpeaking) {
        // Teacher Explaining with Both Hands (Natural lecturer gesticulation)
        const leftLift = -0.42 + Math.sin(t * 4.5) * 0.2;
        const leftSpread = -0.32 + Math.cos(t * 3.2) * 0.15;
        leftArmGroup.rotation.x = THREE.MathUtils.lerp(leftArmGroup.rotation.x, leftLift, 0.12);
        leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, leftSpread, 0.12);
        leftArmGroup.rotation.y = THREE.MathUtils.lerp(leftArmGroup.rotation.y, -0.25, 0.12);
        leftHandGroup.rotation.x = THREE.MathUtils.lerp(leftHandGroup.rotation.x, Math.sin(t * 5.5) * 0.25, 0.14);

        const rightLift = -0.42 + Math.cos(t * 4.2) * 0.2;
        const rightSpread = 0.32 - Math.sin(t * 3.2) * 0.15;
        rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, rightLift, 0.12);
        rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, rightSpread, 0.12);
        rightArmGroup.rotation.y = THREE.MathUtils.lerp(rightArmGroup.rotation.y, 0.25, 0.12);
        rightHandGroup.rotation.x = THREE.MathUtils.lerp(rightHandGroup.rotation.x, Math.cos(t * 5.5) * 0.25, 0.14);

        // Head nods and moves in conversation
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, Math.sin(t * 6.5) * 0.08, 0.14);
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, Math.sin(t * 2.0) * 0.15, 0.1);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, Math.sin(t * 2.8) * 0.05, 0.1);
        robotRoot.rotation.y = THREE.MathUtils.lerp(robotRoot.rotation.y, 0, 0.08);
      } else {
        // Natural resting posture
        leftArmGroup.rotation.x = THREE.MathUtils.lerp(leftArmGroup.rotation.x, 0, 0.08);
        leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.15 + Math.sin(t * 2) * 0.04, 0.08);
        leftArmGroup.rotation.y = THREE.MathUtils.lerp(leftArmGroup.rotation.y, 0, 0.08);
        leftHandGroup.rotation.set(0, 0, 0);

        rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, 0, 0.08);
        rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.15 - Math.sin(t * 2) * 0.04, 0.08);
        rightArmGroup.rotation.y = THREE.MathUtils.lerp(rightArmGroup.rotation.y, 0, 0.08);
        rightHandGroup.rotation.set(0, 0, 0);

        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, 0, 0.08);
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, Math.sin(t * 1.2) * 0.12, 0.08);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0, 0.08);
        robotRoot.rotation.y = THREE.MathUtils.lerp(robotRoot.rotation.y, 0, 0.08);
      }

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
      haloMaterial.dispose();
      container.innerHTML = '';
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size }}
      className={`relative select-none pointer-events-none drop-shadow-[0_15px_25px_rgba(0,0,0,0.35)] ${className}`}
    />
  );
}
