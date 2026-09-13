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

    function drawFace(currentMood: RobotMood, speaking: boolean, time: number, pointingDir: 'left' | 'right', pointing: boolean) {
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

      // Smooth Blinking Dynamics (Sine wave glide, 160ms blink duration)
      const blinkCycle = time % 3.6;
      let blinkAmount = 0; // 0 = fully open, 1 = fully closed
      if (blinkCycle < 0.16) {
        blinkAmount = Math.sin((blinkCycle / 0.16) * Math.PI);
      }

      // Pupil Saccade and Directional Tracking
      let pupilTargetX = 0;
      let pupilTargetY = 0;
      if (pointing) {
        pupilTargetX = pointingDir === 'left' ? -12 : 12;
        pupilTargetY = 4;
      } else {
        // Natural subtle gaze micro-movements
        pupilTargetX = Math.sin(time * 0.9) * 4;
        pupilTargetY = Math.cos(time * 1.3) * 2.5;
      }

      // Dynamic Animated Eyebrows (Above eyes)
      ctx.save();
      const browColor = currentMood === 'celebrate' ? '#fbbf24' : currentMood === 'alert' ? '#f87171' : '#38bdf8';
      ctx.strokeStyle = browColor;
      ctx.shadowColor = browColor;
      ctx.shadowBlur = 12;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';

      if (currentMood === 'celebrate') {
        // Cheerful arched eyebrows
        ctx.beginPath();
        ctx.arc(160, 68, 28, 1.1 * Math.PI, 1.9 * Math.PI);
        ctx.arc(352, 68, 28, 1.1 * Math.PI, 1.9 * Math.PI);
        ctx.stroke();
      } else if (currentMood === 'alert') {
        // Furrowed concerned eyebrows (slanted inward)
        ctx.beginPath();
        ctx.moveTo(125, 62);
        ctx.lineTo(195, 74);
        ctx.moveTo(387, 62);
        ctx.lineTo(317, 74);
        ctx.stroke();
      } else {
        // Expressive teacher eyebrows that raise with vocal inflection
        const browLift = speaking ? Math.sin(time * 3.8) * 5 : 0;
        const leftBrowY = 66 - browLift + (pointing && pointingDir === 'left' ? -4 : 0);
        const rightBrowY = 66 - browLift + (pointing && pointingDir === 'right' ? -4 : 0);

        ctx.beginPath();
        ctx.moveTo(125, leftBrowY + 4);
        ctx.quadraticCurveTo(160, leftBrowY - 6, 195, leftBrowY + 2);
        ctx.moveTo(317, rightBrowY + 2);
        ctx.quadraticCurveTo(352, rightBrowY - 6, 387, rightBrowY + 4);
        ctx.stroke();
      }
      ctx.restore();

      // Mood-based Eyes
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
      } else if (currentMood === 'alert') {
        // Alert / Error: Concerned wide glowing eyes
        ctx.fillStyle = '#f87171';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 25;

        const eyePulse = 36 + Math.sin(time * 10) * 4;
        ctx.beginPath();
        ctx.ellipse(160, 115, eyePulse, eyePulse * 1.15, 0, 0, Math.PI * 2);
        ctx.ellipse(352, 115, eyePulse, eyePulse * 1.15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pupils looking nervously
        ctx.fillStyle = '#080d1a';
        ctx.beginPath();
        ctx.arc(160 + pupilTargetX, 115 + pupilTargetY, 14, 0, Math.PI * 2);
        ctx.arc(352 + pupilTargetX, 115 + pupilTargetY, 14, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Friendly Teacher Eyes with Smooth Organic Blinking
        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 24;

        const baseH = 68;
        const curEyeH = Math.max(6, baseH * (1 - blinkAmount * 0.92));
        const curEyeY = 119 - curEyeH / 2;

        ctx.beginPath();
        ctx.roundRect(125, curEyeY, 75, curEyeH, Math.min(34, curEyeH / 2));
        ctx.roundRect(312, curEyeY, 75, curEyeH, Math.min(34, curEyeH / 2));
        ctx.fill();

        if (blinkAmount < 0.6) {
          // Specular highlights / gloss catchlights
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          // Primary catchlight
          ctx.arc(170 + pupilTargetX, 102 + pupilTargetY, 8.5, 0, Math.PI * 2);
          ctx.arc(357 + pupilTargetX, 102 + pupilTargetY, 8.5, 0, Math.PI * 2);
          // Secondary lower sparkle
          ctx.arc(148 + pupilTargetX * 0.6, 126 + pupilTargetY * 0.6, 4.5, 0, Math.PI * 2);
          ctx.arc(335 + pupilTargetX * 0.6, 126 + pupilTargetY * 0.6, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Mouth Dynamics (Visemes, Speech Cadence & Natural Pauses)
      const mouthAccent = currentMood === 'celebrate' ? '#fbbf24' : currentMood === 'alert' ? '#f87171' : '#38bdf8';
      const mouthGlow = currentMood === 'celebrate' ? '#f59e0b' : currentMood === 'alert' ? '#ef4444' : '#0284c7';

      if (speaking) {
        ctx.save();
        // Multi-frequency cadence with natural clause micro-pauses
        const isPause = Math.sin(time * 2.8) > 0.88;
        const speechSpeed = time * 15;
        const talkWave = Math.sin(speechSpeed) * 0.5 + Math.sin(speechSpeed * 0.6) * 0.35 + Math.cos(speechSpeed * 1.3) * 0.15;
        const rawH = isPause ? 4 : Math.max(5, Math.min(34, 11 + talkWave * 22));
        const mouthW = 46 + Math.sin(time * 6) * 8;
        const mouthY = 188;

        // 1. Dark inner oral cavity
        ctx.fillStyle = '#060d1f';
        ctx.beginPath();
        ctx.ellipse(256, mouthY, mouthW / 2, rawH / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Tongue movement
        if (rawH > 10) {
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.ellipse(256, mouthY + (rawH * 0.22), (mouthW / 2) * 0.52, (rawH / 2) * 0.42, 0, 0, Math.PI);
          ctx.fill();
        }

        // 3. Crisp white upper teeth line
        if (rawH > 12) {
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.roundRect(256 - (mouthW * 0.3), mouthY - (rawH / 2) + 1, mouthW * 0.6, 4, 2);
          ctx.fill();
        }

        // 4. Glowing animated lips with Cupid's bow dip
        ctx.strokeStyle = mouthAccent;
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = mouthGlow;
        ctx.shadowBlur = 14;

        ctx.beginPath();
        // Upper lip
        ctx.moveTo(256 - mouthW / 2, mouthY);
        ctx.quadraticCurveTo(256, mouthY - (rawH / 2) - 1, 256 + mouthW / 2, mouthY);
        // Lower lip
        ctx.quadraticCurveTo(256, mouthY + (rawH / 2) + 1, 256 - mouthW / 2, mouthY);
        ctx.stroke();

        // 5. Smiling mouth dimple corners
        ctx.fillStyle = mouthAccent;
        ctx.beginPath();
        ctx.arc(256 - mouthW / 2 - 2, mouthY - 1, 2.5, 0, Math.PI * 2);
        ctx.arc(256 + mouthW / 2 + 2, mouthY - 1, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else {
        // Warm smiling closed lips with dimples
        ctx.save();
        ctx.strokeStyle = mouthAccent;
        ctx.lineWidth = 5.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = mouthGlow;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(256, 178, 24, 0.18 * Math.PI, 0.82 * Math.PI);
        ctx.stroke();

        // Dimple corners
        ctx.fillStyle = mouthAccent;
        ctx.beginPath();
        ctx.arc(234, 191, 3, 0, Math.PI * 2);
        ctx.arc(278, 191, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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

    // D. Articulated Left Arm (Shoulder -> Upper Arm -> Elbow -> Forearm -> Wrist -> Hand & Fingers)
    const leftArmGroup = new THREE.Group(); // Shoulder Pivot
    leftArmGroup.position.set(-0.54, -0.16, 0);
    robotRoot.add(leftArmGroup);

    // Shoulder sphere socket
    const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), jointMaterial);
    leftArmGroup.add(leftShoulder);

    // Upper Arm Capsule
    const leftUpperArmGeo = new THREE.CapsuleGeometry(0.068, 0.20, 16, 16);
    const leftUpperArm = new THREE.Mesh(leftUpperArmGeo, bodyMaterial);
    leftUpperArm.position.set(0, -0.10, 0);
    leftArmGroup.add(leftUpperArm);

    // Elbow Group (Bending joint)
    const leftElbowGroup = new THREE.Group();
    leftElbowGroup.position.set(0, -0.21, 0);
    leftArmGroup.add(leftElbowGroup);

    // Elbow joint sphere
    const leftElbow = new THREE.Mesh(new THREE.SphereGeometry(0.068, 16, 16), jointMaterial);
    leftElbowGroup.add(leftElbow);

    // Forearm Capsule
    const leftForearmGeo = new THREE.CapsuleGeometry(0.062, 0.18, 16, 16);
    const leftForearm = new THREE.Mesh(leftForearmGeo, bodyMaterial);
    leftForearm.position.set(0, -0.09, 0);
    leftElbowGroup.add(leftForearm);

    // Wrist / Hand Group
    const leftHandGroup = new THREE.Group();
    leftHandGroup.position.set(0, -0.19, 0);
    leftElbowGroup.add(leftHandGroup);

    // Palm & Joint
    const leftPalm = new THREE.Mesh(new THREE.SphereGeometry(0.072, 16, 16), jointMaterial);
    leftHandGroup.add(leftPalm);

    // Extended Pointing Finger on Left Hand 👈
    const leftFingerGeo = new THREE.CylinderGeometry(0.026, 0.018, 0.24, 16);
    leftFingerGeo.rotateZ(Math.PI / 2);
    leftFingerGeo.translate(-0.12, 0, 0);
    const leftFinger = new THREE.Mesh(leftFingerGeo, bodyMaterial);
    leftHandGroup.add(leftFinger);

    const leftFingerTip = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 16), glowMaterial);
    leftFingerTip.position.set(-0.24, 0, 0);
    leftHandGroup.add(leftFingerTip);

    // Natural Thumb
    const thumbGeo = new THREE.CylinderGeometry(0.018, 0.014, 0.09, 12);
    thumbGeo.rotateX(-Math.PI / 4);
    const leftThumb = new THREE.Mesh(thumbGeo, jointMaterial);
    leftThumb.position.set(-0.02, 0.03, 0.03);
    leftHandGroup.add(leftThumb);

    // E. Articulated Right Arm (Shoulder -> Upper Arm -> Elbow -> Forearm -> Wrist -> Hand & Fingers)
    const rightArmGroup = new THREE.Group(); // Shoulder Pivot
    rightArmGroup.position.set(0.54, -0.16, 0);
    robotRoot.add(rightArmGroup);

    // Shoulder sphere socket
    const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), jointMaterial);
    rightArmGroup.add(rightShoulder);

    // Upper Arm Capsule
    const rightUpperArmGeo = new THREE.CapsuleGeometry(0.068, 0.20, 16, 16);
    const rightUpperArm = new THREE.Mesh(rightUpperArmGeo, bodyMaterial);
    rightUpperArm.position.set(0, -0.10, 0);
    rightArmGroup.add(rightUpperArm);

    // Elbow Group (Bending joint)
    const rightElbowGroup = new THREE.Group();
    rightElbowGroup.position.set(0, -0.21, 0);
    rightArmGroup.add(rightElbowGroup);

    // Elbow joint sphere
    const rightElbow = new THREE.Mesh(new THREE.SphereGeometry(0.068, 16, 16), jointMaterial);
    rightElbowGroup.add(rightElbow);

    // Forearm Capsule
    const rightForearmGeo = new THREE.CapsuleGeometry(0.062, 0.18, 16, 16);
    const rightForearm = new THREE.Mesh(rightForearmGeo, bodyMaterial);
    rightForearm.position.set(0, -0.09, 0);
    rightElbowGroup.add(rightForearm);

    // Wrist / Hand Group
    const rightHandGroup = new THREE.Group();
    rightHandGroup.position.set(0, -0.19, 0);
    rightElbowGroup.add(rightHandGroup);

    // Palm & Joint
    const rightPalm = new THREE.Mesh(new THREE.SphereGeometry(0.072, 16, 16), jointMaterial);
    rightHandGroup.add(rightPalm);

    // Extended Pointing Finger on Right Hand 👉
    const rightFingerGeo = new THREE.CylinderGeometry(0.026, 0.018, 0.24, 16);
    rightFingerGeo.rotateZ(-Math.PI / 2);
    rightFingerGeo.translate(0.12, 0, 0);
    const rightFinger = new THREE.Mesh(rightFingerGeo, bodyMaterial);
    rightHandGroup.add(rightFinger);

    const rightFingerTip = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 16), glowMaterial);
    rightFingerTip.position.set(0.24, 0, 0);
    rightHandGroup.add(rightFingerTip);

    // Natural Thumb
    const rightThumb = new THREE.Mesh(thumbGeo, jointMaterial);
    rightThumb.position.set(0.02, 0.03, 0.03);
    rightHandGroup.add(rightThumb);

    // --- 6. Smooth Animation Loop ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      const t = clock.getElapsedTime();
      const { mood: curMood, isSpeaking: curSpeaking, isPointing: curPointing, pointingDirection: curDir } = stateRef.current;

      // Update face texture with pupil tracking & visemes
      drawFace(curMood, curSpeaking, t, curDir, curPointing);

      // 1. Organic Floating & Hover Physics (Harmonic waves)
      const hoverY = Math.sin(t * 1.9) * 0.07 + Math.sin(t * 3.7) * 0.025 + (curSpeaking ? Math.sin(t * 5.5) * 0.02 : 0);
      robotRoot.position.y = hoverY;
      const hoverRoll = Math.sin(t * 1.4) * 0.03 + (curSpeaking ? Math.sin(t * 3.2) * 0.025 : 0);
      robotRoot.rotation.z = hoverRoll;

      // 2. Torso subtle breathing expansion
      const breathe = 1 + Math.sin(t * 2.2) * 0.018;
      torsoMesh.scale.set(0.85 * breathe, 1.1 * breathe, 0.85 * breathe);

      // 3. Hover Thruster Flare & Ambient Luminescence
      const thrusterPulse = 1 + Math.sin(t * 10) * 0.12 + Math.cos(t * 16) * 0.05;
      thrusterRing.scale.set(thrusterPulse, thrusterPulse, thrusterPulse);
      thrusterLight.intensity = 2.2 + Math.sin(t * 12) * 0.9;

      // 4. Antenna Spring Dynamics (Responds to head motion and speech energy)
      const antennaWobbleZ = Math.sin(t * 7.5) * (curSpeaking ? 0.12 : 0.035);
      const antennaWobbleX = Math.cos(t * 6.5) * (curSpeaking ? 0.09 : 0.025);
      antennaStem.rotation.z = THREE.MathUtils.lerp(antennaStem.rotation.z, antennaWobbleZ, 0.15);
      antennaStem.rotation.x = THREE.MathUtils.lerp(antennaStem.rotation.x, antennaWobbleX, 0.15);

      if (curMood === 'alert') {
        antennaTip.material = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      } else if (curMood === 'celebrate') {
        antennaTip.material = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      } else {
        antennaTip.material = glowMaterial;
      }

      // 5. Dynamic Articulated Teacher Gestures (Shoulders + Elbows + Wrists)
      if (curPointing) {
        if (curDir === 'left') {
          // --- POINTING LEFT (towards lesson content) ---
          const speechPulse = curSpeaking ? Math.sin(t * 5.2) * 0.14 : 0;
          const wristPulse = curSpeaking ? Math.sin(t * 7.0) * 0.22 : 0;

          // Left Shoulder raises and extends forward
          leftArmGroup.rotation.x = THREE.MathUtils.lerp(leftArmGroup.rotation.x, -0.45 + speechPulse * 0.5, 0.14);
          leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.65 + speechPulse * 0.3, 0.14);
          leftArmGroup.rotation.y = THREE.MathUtils.lerp(leftArmGroup.rotation.y, -0.25, 0.14);

          // Left Elbow bends forward to guide index finger at content
          leftElbowGroup.rotation.x = THREE.MathUtils.lerp(leftElbowGroup.rotation.x, -0.45 + speechPulse * 0.8, 0.16);
          leftElbowGroup.rotation.z = THREE.MathUtils.lerp(leftElbowGroup.rotation.z, -0.25, 0.16);

          // Left Hand & Wrist keeps pointing finger laser-focused
          leftHandGroup.rotation.z = THREE.MathUtils.lerp(leftHandGroup.rotation.z, wristPulse, 0.18);
          leftHandGroup.rotation.x = THREE.MathUtils.lerp(leftHandGroup.rotation.x, speechPulse * 0.6, 0.18);

          // Right Arm (Free arm gestures like an active human teacher!)
          const rightSway = curSpeaking ? Math.sin(t * 4.0) * 0.22 : 0;
          const rightLift = curSpeaking ? -0.35 + Math.cos(t * 3.5) * 0.18 : 0;
          rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, rightLift, 0.12);
          rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.35 + rightSway, 0.12);
          rightArmGroup.rotation.y = THREE.MathUtils.lerp(rightArmGroup.rotation.y, curSpeaking ? 0.3 : 0, 0.12);

          // Right Elbow flexes naturally in teaching gesture
          rightElbowGroup.rotation.x = THREE.MathUtils.lerp(rightElbowGroup.rotation.x, curSpeaking ? -0.65 + Math.sin(t * 4.5) * 0.2 : -0.15, 0.14);
          rightHandGroup.rotation.y = THREE.MathUtils.lerp(rightHandGroup.rotation.y, curSpeaking ? Math.sin(t * 5.0) * 0.4 : 0, 0.16);

          // Head turns and tilts towards left
          headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, -0.42 + (curSpeaking ? Math.sin(t * 2.5) * 0.08 : 0), 0.12);
          headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, curSpeaking ? Math.sin(t * 6.5) * 0.08 : 0, 0.15);
          robotRoot.rotation.y = THREE.MathUtils.lerp(robotRoot.rotation.y, -0.25, 0.12);

          const fingerGlow = 1 + (curSpeaking ? Math.sin(t * 14) * 0.4 : Math.sin(t * 8) * 0.15);
          leftFingerTip.scale.set(fingerGlow, fingerGlow, fingerGlow);
        } else {
          // --- POINTING RIGHT (towards code editor / error line) ---
          const speechPulse = curSpeaking ? Math.sin(t * 5.2) * 0.14 : 0;
          const wristPulse = curSpeaking ? -Math.sin(t * 7.0) * 0.22 : 0;

          // Right Shoulder raises and extends forward
          rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, -0.45 + speechPulse * 0.5, 0.14);
          rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.65 - speechPulse * 0.3, 0.14);
          rightArmGroup.rotation.y = THREE.MathUtils.lerp(rightArmGroup.rotation.y, 0.25, 0.14);

          // Right Elbow bends forward to guide index finger at editor
          rightElbowGroup.rotation.x = THREE.MathUtils.lerp(rightElbowGroup.rotation.x, -0.45 + speechPulse * 0.8, 0.16);
          rightElbowGroup.rotation.z = THREE.MathUtils.lerp(rightElbowGroup.rotation.z, 0.25, 0.16);

          // Right Hand & Wrist
          rightHandGroup.rotation.z = THREE.MathUtils.lerp(rightHandGroup.rotation.z, wristPulse, 0.18);
          rightHandGroup.rotation.x = THREE.MathUtils.lerp(rightHandGroup.rotation.x, speechPulse * 0.6, 0.18);

          // Left Arm (Free arm gestures like an active human teacher!)
          const leftSway = curSpeaking ? Math.sin(t * 4.0) * 0.22 : 0;
          const leftLift = curSpeaking ? -0.35 + Math.cos(t * 3.5) * 0.18 : 0;
          leftArmGroup.rotation.x = THREE.MathUtils.lerp(leftArmGroup.rotation.x, leftLift, 0.12);
          leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.35 - leftSway, 0.12);
          leftArmGroup.rotation.y = THREE.MathUtils.lerp(leftArmGroup.rotation.y, curSpeaking ? -0.3 : 0, 0.12);

          // Left Elbow flexes naturally
          leftElbowGroup.rotation.x = THREE.MathUtils.lerp(leftElbowGroup.rotation.x, curSpeaking ? -0.65 + Math.sin(t * 4.5) * 0.2 : -0.15, 0.14);
          leftHandGroup.rotation.y = THREE.MathUtils.lerp(leftHandGroup.rotation.y, curSpeaking ? -Math.sin(t * 5.0) * 0.4 : 0, 0.16);

          // Head turns and tilts towards right
          headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, 0.42 - (curSpeaking ? Math.sin(t * 2.5) * 0.08 : 0), 0.12);
          headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, curSpeaking ? Math.sin(t * 6.5) * 0.08 : 0, 0.15);
          robotRoot.rotation.y = THREE.MathUtils.lerp(robotRoot.rotation.y, 0.25, 0.12);

          const fingerGlow = 1 + (curSpeaking ? Math.sin(t * 14) * 0.4 : Math.sin(t * 8) * 0.15);
          rightFingerTip.scale.set(fingerGlow, fingerGlow, fingerGlow);
        }
      } else if (curSpeaking) {
        // --- TEACHER GESTICULATING WITH BOTH HANDS (Articulated Forearms & Palms) ---
        // Left arm and elbow
        leftArmGroup.rotation.x = THREE.MathUtils.lerp(leftArmGroup.rotation.x, -0.28 + Math.sin(t * 3.8) * 0.15, 0.12);
        leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.32 + Math.cos(t * 3.0) * 0.12, 0.12);
        leftArmGroup.rotation.y = THREE.MathUtils.lerp(leftArmGroup.rotation.y, -0.2, 0.12);
        leftElbowGroup.rotation.x = THREE.MathUtils.lerp(leftElbowGroup.rotation.x, -0.65 + Math.sin(t * 4.5) * 0.25, 0.14);
        leftHandGroup.rotation.x = THREE.MathUtils.lerp(leftHandGroup.rotation.x, Math.sin(t * 5.5) * 0.3, 0.16);

        // Right arm and elbow
        rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, -0.28 + Math.cos(t * 3.8) * 0.15, 0.12);
        rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.32 - Math.sin(t * 3.0) * 0.12, 0.12);
        rightArmGroup.rotation.y = THREE.MathUtils.lerp(rightArmGroup.rotation.y, 0.2, 0.12);
        rightElbowGroup.rotation.x = THREE.MathUtils.lerp(rightElbowGroup.rotation.x, -0.65 + Math.cos(t * 4.5) * 0.25, 0.14);
        rightHandGroup.rotation.x = THREE.MathUtils.lerp(rightHandGroup.rotation.x, Math.cos(t * 5.5) * 0.3, 0.16);

        // Head nods and moves in conversation
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, Math.sin(t * 6.5) * 0.09, 0.14);
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, Math.sin(t * 2.0) * 0.16, 0.1);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, Math.sin(t * 2.8) * 0.05, 0.1);
        robotRoot.rotation.y = THREE.MathUtils.lerp(robotRoot.rotation.y, 0, 0.08);
      } else {
        // --- NATURAL RESTING POSTURE (Gentle Breathing & Hovering) ---
        leftArmGroup.rotation.x = THREE.MathUtils.lerp(leftArmGroup.rotation.x, 0, 0.08);
        leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.15 + Math.sin(t * 2) * 0.03, 0.08);
        leftArmGroup.rotation.y = THREE.MathUtils.lerp(leftArmGroup.rotation.y, 0, 0.08);
        leftElbowGroup.rotation.set(0, 0, 0);
        leftHandGroup.rotation.set(0, 0, 0);

        rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, 0, 0.08);
        rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.15 - Math.sin(t * 2) * 0.03, 0.08);
        rightArmGroup.rotation.y = THREE.MathUtils.lerp(rightArmGroup.rotation.y, 0, 0.08);
        rightElbowGroup.rotation.set(0, 0, 0);
        rightHandGroup.rotation.set(0, 0, 0);

        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, 0, 0.08);
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, Math.sin(t * 1.2) * 0.10, 0.08);
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
