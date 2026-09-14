'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RobotMood } from './RobotAvatar';

interface Robot3DCanvasProps {
  mood?: RobotMood;
  isSpeaking?: boolean;
  isPointing?: boolean;
  pointingDirection?: 'left' | 'right';
  isWaving?: boolean;
  size?: number;
  className?: string;
}

export function Robot3DCanvas({
  mood = 'idle',
  isSpeaking = false,
  isPointing = false,
  pointingDirection = 'left',
  isWaving = false,
  size = 160,
  className = '',
}: Robot3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ mood, isSpeaking, isPointing, pointingDirection, isWaving });

  // Keep state updated in ref for the animation loop
  useEffect(() => {
    stateRef.current = { mood, isSpeaking, isPointing, pointingDirection, isWaving };
  }, [mood, isSpeaking, isPointing, pointingDirection, isWaving]);

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
    faceTexture.colorSpace = THREE.SRGBColorSpace;
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

      // Sleek curved glass reflection sheen across top-left of visor
      const sheenGrad = ctx.createLinearGradient(60, 20, 260, 180);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
      sheenGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.05)');
      sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sheenGrad;
      ctx.beginPath();
      ctx.ellipse(180, 65, 150, 50, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

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

    // Initial face render to ensure visor texture is never blank
    drawFace('idle', false, 0, 'left', false);

    // --- 4. High-End 3D Materials ---
    // Pearlescent gloss white chassis
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.12,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    // Dark titanium joints & bezel frame
    const jointMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.35,
      metalness: 0.85,
    });

    // Visor material displaying dynamic texture (bright OLED screen)
    const visorMaterial = new THREE.MeshBasicMaterial({
      map: faceTexture,
      toneMapped: false,
      side: THREE.DoubleSide,
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
    const headGeo = new THREE.SphereGeometry(0.50, 36, 36);
    const headMesh = new THREE.Mesh(headGeo, bodyMaterial);
    headGroup.add(headMesh);

    // Visor Outer Bezel (Dark titanium frame)
    const visorBezelGeo = new THREE.SphereGeometry(0.518, 36, 24, Math.PI * 0.12, Math.PI * 0.76, Math.PI * 0.22, Math.PI * 0.56);
    const visorBezel = new THREE.Mesh(visorBezelGeo, jointMaterial);
    headGroup.add(visorBezel);

    // Visor Screen (Glowing OLED curved glass with dynamic face)
    const visorGeo = new THREE.SphereGeometry(0.524, 36, 24, Math.PI * 0.15, Math.PI * 0.70, Math.PI * 0.25, Math.PI * 0.50);
    const visorMesh = new THREE.Mesh(visorGeo, visorMaterial);
    headGroup.add(visorMesh);

    // Headphone / Ear pieces (Left and Right)
    const earGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.09, 24);
    earGeo.rotateZ(Math.PI / 2);

    const leftEar = new THREE.Mesh(earGeo, haloMaterial);
    leftEar.position.set(-0.50, 0.02, 0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, haloMaterial);
    rightEar.position.set(0.50, 0.02, 0);
    headGroup.add(rightEar);

    const earGlowGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.095, 24);
    earGlowGeo.rotateZ(Math.PI / 2);
    const leftEarGlow = new THREE.Mesh(earGlowGeo, glowMaterial);
    leftEarGlow.position.set(-0.50, 0.02, 0);
    headGroup.add(leftEarGlow);

    const rightEarGlow = new THREE.Mesh(earGlowGeo, glowMaterial);
    rightEarGlow.position.set(0.50, 0.02, 0);
    headGroup.add(rightEarGlow);

    // Antenna on top of head
    const antennaStemGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.28, 16);
    antennaStemGeo.translate(0, 0.14, 0);
    const antennaStem = new THREE.Mesh(antennaStemGeo, jointMaterial);
    antennaStem.position.set(0, 0.48, 0);
    headGroup.add(antennaStem);

    const antennaTipGeo = new THREE.SphereGeometry(0.08, 20, 20);
    const antennaTip = new THREE.Mesh(antennaTipGeo, glowMaterial);
    antennaTip.position.set(0, 0.76, 0);
    headGroup.add(antennaTip);

    // Glowing holographic data halo around head
    const haloRingGeo = new THREE.TorusGeometry(0.58, 0.016, 16, 48);
    haloRingGeo.rotateX(Math.PI / 2.3);
    const haloRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
    });
    const haloRing = new THREE.Mesh(haloRingGeo, haloRingMat);
    headGroup.add(haloRing);

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

    // C. Anti-gravity Hover Thruster Ring & Soft Light Cone
    const thrusterRingGeo = new THREE.TorusGeometry(0.3, 0.045, 20, 36);
    thrusterRingGeo.rotateX(Math.PI / 2);
    const thrusterRing = new THREE.Mesh(thrusterRingGeo, glowMaterial);
    thrusterRing.position.set(0, -0.88, 0);
    robotRoot.add(thrusterRing);

    // Pulsating anti-gravity energy beam
    const beamGeo = new THREE.ConeGeometry(0.24, 0.45, 24, 1, true);
    beamGeo.rotateX(Math.PI);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const thrusterBeam = new THREE.Mesh(beamGeo, beamMat);
    thrusterBeam.position.set(0, -1.05, 0);
    robotRoot.add(thrusterBeam);

    // Articulated Teacher Hand Creator (Natural palm, 4 fingers, laser index pointer, thumb)
    const createHand = (isLeft: boolean) => {
      const handGroup = new THREE.Group();

      // Wrist ball joint
      const wrist = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 16), jointMaterial);
      handGroup.add(wrist);

      // Sculpted palm body
      const palm = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.08, 0.038), jointMaterial);
      palm.position.set(0, -0.045, 0);
      handGroup.add(palm);

      // White outer chassis backplate
      const backplate = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.075, 0.012), bodyMaterial);
      backplate.position.set(0, -0.045, -0.016);
      handGroup.add(backplate);

      // Glowing palm repulsor/emitter
      const repulsor = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.006, 16), glowMaterial);
      repulsor.rotation.x = Math.PI / 2;
      repulsor.position.set(0, -0.045, 0.02);
      handGroup.add(repulsor);

      // Articulated Thumb
      const thumbGroup = new THREE.Group();
      const thumbX = isLeft ? 0.042 : -0.042;
      thumbGroup.position.set(thumbX, -0.03, 0.008);
      thumbGroup.rotation.z = isLeft ? -0.4 : 0.4;
      thumbGroup.rotation.x = 0.3;
      const thumbBase = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), jointMaterial);
      thumbGroup.add(thumbBase);
      const thumbPhalange = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.038, 12, 12), bodyMaterial);
      thumbPhalange.position.set(isLeft ? 0.012 : -0.012, -0.022, 0.008);
      thumbPhalange.rotation.z = isLeft ? -0.3 : 0.3;
      thumbGroup.add(thumbPhalange);
      handGroup.add(thumbGroup);

      // Articulated Fingers (Index with laser pointer, Middle, Ring, Pinky)
      const createFinger = (xOffset: number, length: number, radius: number, isIndex = false) => {
        const fingerGroup = new THREE.Group();
        fingerGroup.position.set(xOffset, -0.082, 0);
        const fingerJoint = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.05, 12, 12), jointMaterial);
        fingerGroup.add(fingerJoint);
        const fingerPhalange = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 12, 12), bodyMaterial);
        fingerPhalange.position.set(0, -length / 2, 0);
        fingerGroup.add(fingerPhalange);

        let laserTip: THREE.Mesh | null = null;
        if (isIndex) {
          laserTip = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.35, 16, 16), glowMaterial);
          laserTip.position.set(0, -length, 0);
          fingerGroup.add(laserTip);
        }
        return { group: fingerGroup, laserTip };
      };

      const idxX = isLeft ? 0.028 : -0.028;
      const midX = isLeft ? 0.009 : -0.009;
      const ringX = isLeft ? -0.010 : 0.010;
      const pinkyX = isLeft ? -0.028 : 0.028;

      const indexData = createFinger(idxX, 0.068, 0.013, true);
      const midData = createFinger(midX, 0.072, 0.0135, false);
      const ringData = createFinger(ringX, 0.062, 0.0125, false);
      const pinkyData = createFinger(pinkyX, 0.048, 0.011, false);

      handGroup.add(indexData.group);
      handGroup.add(midData.group);
      handGroup.add(ringData.group);
      handGroup.add(pinkyData.group);

      return {
        handGroup,
        thumbGroup,
        indexGroup: indexData.group,
        laserTip: indexData.laserTip!,
        midGroup: midData.group,
        ringGroup: ringData.group,
        pinkyGroup: pinkyData.group,
      };
    };

    // D. Articulated Left Arm (Shoulder -> Upper Arm -> Elbow -> Forearm -> Wrist -> Hand & Fingers)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.54, -0.16, 0);
    robotRoot.add(leftArmGroup);

    const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), jointMaterial);
    leftArmGroup.add(leftShoulder);

    const leftUpperArmGeo = new THREE.CapsuleGeometry(0.068, 0.20, 16, 16);
    const leftUpperArm = new THREE.Mesh(leftUpperArmGeo, bodyMaterial);
    leftUpperArm.position.set(0, -0.10, 0);
    leftArmGroup.add(leftUpperArm);

    const leftElbowGroup = new THREE.Group();
    leftElbowGroup.position.set(0, -0.21, 0);
    leftArmGroup.add(leftElbowGroup);

    const leftElbow = new THREE.Mesh(new THREE.SphereGeometry(0.068, 16, 16), jointMaterial);
    leftElbowGroup.add(leftElbow);

    const leftForearmGeo = new THREE.CapsuleGeometry(0.062, 0.18, 16, 16);
    const leftForearm = new THREE.Mesh(leftForearmGeo, bodyMaterial);
    leftForearm.position.set(0, -0.09, 0);
    leftElbowGroup.add(leftForearm);

    const leftHand = createHand(true);
    leftHand.handGroup.position.set(0, -0.19, 0);
    leftElbowGroup.add(leftHand.handGroup);

    // E. Articulated Right Arm (Shoulder -> Upper Arm -> Elbow -> Forearm -> Wrist -> Hand & Fingers)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.54, -0.16, 0);
    robotRoot.add(rightArmGroup);

    const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), jointMaterial);
    rightArmGroup.add(rightShoulder);

    const rightUpperArmGeo = new THREE.CapsuleGeometry(0.068, 0.20, 16, 16);
    const rightUpperArm = new THREE.Mesh(rightUpperArmGeo, bodyMaterial);
    rightUpperArm.position.set(0, -0.10, 0);
    rightArmGroup.add(rightUpperArm);

    const rightElbowGroup = new THREE.Group();
    rightElbowGroup.position.set(0, -0.21, 0);
    rightArmGroup.add(rightElbowGroup);

    const rightElbow = new THREE.Mesh(new THREE.SphereGeometry(0.068, 16, 16), jointMaterial);
    rightElbowGroup.add(rightElbow);

    const rightForearmGeo = new THREE.CapsuleGeometry(0.062, 0.18, 16, 16);
    const rightForearm = new THREE.Mesh(rightForearmGeo, bodyMaterial);
    rightForearm.position.set(0, -0.09, 0);
    rightElbowGroup.add(rightForearm);

    const rightHand = createHand(false);
    rightHand.handGroup.position.set(0, -0.19, 0);
    rightElbowGroup.add(rightHand.handGroup);

    // --- 6. Smooth Animation Loop ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      const t = clock.getElapsedTime();
      const { mood: curMood, isSpeaking: curSpeaking, isPointing: curPointing, pointingDirection: curDir, isWaving: curWaving } = stateRef.current;

      // Update face texture with pupil tracking & visemes
      drawFace(curMood, curSpeaking, t, curDir, curPointing);

      // Rotate glowing holographic teacher halo
      haloRing.rotation.z = t * 1.6;
      haloRing.rotation.y = Math.sin(t * 0.9) * 0.2;
      haloRingMat.opacity = 0.65 + Math.sin(t * 4) * 0.2;

      // Thruster anti-gravity light beam pulse
      const beamPulse = 1 + Math.sin(t * 12) * 0.15;
      thrusterBeam.scale.set(beamPulse, 1 + Math.cos(t * 10) * 0.1, beamPulse);
      beamMat.opacity = 0.22 + Math.sin(t * 14) * 0.12;

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

      // 5. Dynamic Articulated Teacher Gestures (Shoulders + Elbows + Wrists + Fingers)
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

          // Left Hand tilts forward to aim index finger straight at content
          leftHand.handGroup.rotation.x = THREE.MathUtils.lerp(leftHand.handGroup.rotation.x, -1.2, 0.18);
          leftHand.handGroup.rotation.z = THREE.MathUtils.lerp(leftHand.handGroup.rotation.z, wristPulse, 0.18);
          leftHand.handGroup.rotation.y = THREE.MathUtils.lerp(leftHand.handGroup.rotation.y, -0.2, 0.18);

          // Left Hand: Index extends straight with laser pointer, other fingers curl into fist
          leftHand.indexGroup.rotation.x = THREE.MathUtils.lerp(leftHand.indexGroup.rotation.x, 0, 0.2);
          leftHand.midGroup.rotation.x = THREE.MathUtils.lerp(leftHand.midGroup.rotation.x, 1.25, 0.2);
          leftHand.ringGroup.rotation.x = THREE.MathUtils.lerp(leftHand.ringGroup.rotation.x, 1.35, 0.2);
          leftHand.pinkyGroup.rotation.x = THREE.MathUtils.lerp(leftHand.pinkyGroup.rotation.x, 1.35, 0.2);
          leftHand.thumbGroup.rotation.x = THREE.MathUtils.lerp(leftHand.thumbGroup.rotation.x, 0.7, 0.2);

          const fingerGlow = 1 + (curSpeaking ? Math.sin(t * 14) * 0.4 : Math.sin(t * 8) * 0.15);
          leftHand.laserTip.scale.set(fingerGlow, fingerGlow, fingerGlow);

          // Right Arm (Free arm gestures like an active human teacher!)
          const rightSway = curSpeaking ? Math.sin(t * 4.0) * 0.22 : 0;
          const rightLift = curSpeaking ? -0.35 + Math.cos(t * 3.5) * 0.18 : 0;
          rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, rightLift, 0.12);
          rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.35 + rightSway, 0.12);
          rightArmGroup.rotation.y = THREE.MathUtils.lerp(rightArmGroup.rotation.y, curSpeaking ? 0.3 : 0, 0.12);

          // Right Elbow flexes naturally in teaching gesture
          rightElbowGroup.rotation.x = THREE.MathUtils.lerp(rightElbowGroup.rotation.x, curSpeaking ? -0.65 + Math.sin(t * 4.5) * 0.2 : -0.15, 0.14);
          rightHand.handGroup.rotation.x = THREE.MathUtils.lerp(rightHand.handGroup.rotation.x, curSpeaking ? Math.sin(t * 5.0) * 0.3 : 0, 0.16);
          rightHand.handGroup.rotation.y = THREE.MathUtils.lerp(rightHand.handGroup.rotation.y, 0, 0.16);
          rightHand.handGroup.rotation.z = THREE.MathUtils.lerp(rightHand.handGroup.rotation.z, 0, 0.16);

          // Free hand fingers flex gently
          const freeRightFlex = curSpeaking ? 0.28 + Math.sin(t * 4.5) * 0.2 : 0.18;
          rightHand.indexGroup.rotation.x = THREE.MathUtils.lerp(rightHand.indexGroup.rotation.x, freeRightFlex, 0.16);
          rightHand.midGroup.rotation.x = THREE.MathUtils.lerp(rightHand.midGroup.rotation.x, freeRightFlex + 0.05, 0.16);
          rightHand.ringGroup.rotation.x = THREE.MathUtils.lerp(rightHand.ringGroup.rotation.x, freeRightFlex + 0.1, 0.16);
          rightHand.pinkyGroup.rotation.x = THREE.MathUtils.lerp(rightHand.pinkyGroup.rotation.x, freeRightFlex + 0.15, 0.16);
          rightHand.thumbGroup.rotation.x = THREE.MathUtils.lerp(rightHand.thumbGroup.rotation.x, 0.3, 0.16);

          // Head turns and tilts towards left
          headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, -0.42 + (curSpeaking ? Math.sin(t * 2.5) * 0.08 : 0), 0.12);
          headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, curSpeaking ? Math.sin(t * 6.5) * 0.08 : 0, 0.15);
          robotRoot.rotation.y = THREE.MathUtils.lerp(robotRoot.rotation.y, -0.25, 0.12);
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

          // Right Hand tilts forward to aim index finger straight at editor line
          rightHand.handGroup.rotation.x = THREE.MathUtils.lerp(rightHand.handGroup.rotation.x, -1.2, 0.18);
          rightHand.handGroup.rotation.z = THREE.MathUtils.lerp(rightHand.handGroup.rotation.z, wristPulse, 0.18);
          rightHand.handGroup.rotation.y = THREE.MathUtils.lerp(rightHand.handGroup.rotation.y, 0.2, 0.18);

          // Right Hand: Index extends straight with laser pointer, other fingers curl into fist
          rightHand.indexGroup.rotation.x = THREE.MathUtils.lerp(rightHand.indexGroup.rotation.x, 0, 0.2);
          rightHand.midGroup.rotation.x = THREE.MathUtils.lerp(rightHand.midGroup.rotation.x, 1.25, 0.2);
          rightHand.ringGroup.rotation.x = THREE.MathUtils.lerp(rightHand.ringGroup.rotation.x, 1.35, 0.2);
          rightHand.pinkyGroup.rotation.x = THREE.MathUtils.lerp(rightHand.pinkyGroup.rotation.x, 1.35, 0.2);
          rightHand.thumbGroup.rotation.x = THREE.MathUtils.lerp(rightHand.thumbGroup.rotation.x, 0.7, 0.2);

          const fingerGlow = 1 + (curSpeaking ? Math.sin(t * 14) * 0.4 : Math.sin(t * 8) * 0.15);
          rightHand.laserTip.scale.set(fingerGlow, fingerGlow, fingerGlow);

          // Left Arm (Free arm gestures like an active human teacher!)
          const leftSway = curSpeaking ? Math.sin(t * 4.0) * 0.22 : 0;
          const leftLift = curSpeaking ? -0.35 + Math.cos(t * 3.5) * 0.18 : 0;
          leftArmGroup.rotation.x = THREE.MathUtils.lerp(leftArmGroup.rotation.x, leftLift, 0.12);
          leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.35 - leftSway, 0.12);
          leftArmGroup.rotation.y = THREE.MathUtils.lerp(leftArmGroup.rotation.y, curSpeaking ? -0.3 : 0, 0.12);

          // Left Elbow flexes naturally
          leftElbowGroup.rotation.x = THREE.MathUtils.lerp(leftElbowGroup.rotation.x, curSpeaking ? -0.65 + Math.sin(t * 4.5) * 0.2 : -0.15, 0.14);
          leftHand.handGroup.rotation.x = THREE.MathUtils.lerp(leftHand.handGroup.rotation.x, curSpeaking ? Math.sin(t * 5.0) * 0.3 : 0, 0.16);
          leftHand.handGroup.rotation.y = THREE.MathUtils.lerp(leftHand.handGroup.rotation.y, 0, 0.16);
          leftHand.handGroup.rotation.z = THREE.MathUtils.lerp(leftHand.handGroup.rotation.z, 0, 0.16);

          // Free hand fingers flex gently
          const freeLeftFlex = curSpeaking ? 0.28 + Math.sin(t * 4.5) * 0.2 : 0.18;
          leftHand.indexGroup.rotation.x = THREE.MathUtils.lerp(leftHand.indexGroup.rotation.x, freeLeftFlex, 0.16);
          leftHand.midGroup.rotation.x = THREE.MathUtils.lerp(leftHand.midGroup.rotation.x, freeLeftFlex + 0.05, 0.16);
          leftHand.ringGroup.rotation.x = THREE.MathUtils.lerp(leftHand.ringGroup.rotation.x, freeLeftFlex + 0.1, 0.16);
          leftHand.pinkyGroup.rotation.x = THREE.MathUtils.lerp(leftHand.pinkyGroup.rotation.x, freeLeftFlex + 0.15, 0.16);
          leftHand.thumbGroup.rotation.x = THREE.MathUtils.lerp(leftHand.thumbGroup.rotation.x, 0.3, 0.16);

          // Head turns and tilts towards right
          headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, 0.42 - (curSpeaking ? Math.sin(t * 2.5) * 0.08 : 0), 0.12);
          headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, curSpeaking ? Math.sin(t * 6.5) * 0.08 : 0, 0.15);
          robotRoot.rotation.y = THREE.MathUtils.lerp(robotRoot.rotation.y, 0.25, 0.12);
        }
      } else if (curWaving) {
        // --- FRIENDLY 3D HAND WAVE GESTURE ---
        // Right Shoulder raises high
        rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, -0.85, 0.15);
        rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.80, 0.15);
        rightArmGroup.rotation.y = THREE.MathUtils.lerp(rightArmGroup.rotation.y, 0.35, 0.15);

        // Right Elbow bends up at 90 degrees
        rightElbowGroup.rotation.x = THREE.MathUtils.lerp(rightElbowGroup.rotation.x, -1.25, 0.18);
        rightElbowGroup.rotation.z = THREE.MathUtils.lerp(rightElbowGroup.rotation.z, 0.25, 0.18);

        // Right Hand swings back and forth in friendly wave
        const waveSwing = Math.sin(t * 8.5) * 0.45;
        rightHand.handGroup.rotation.z = THREE.MathUtils.lerp(rightHand.handGroup.rotation.z, waveSwing, 0.25);
        rightHand.handGroup.rotation.x = THREE.MathUtils.lerp(rightHand.handGroup.rotation.x, 0.15, 0.18);

        // Relaxed open fingers for warm waving
        rightHand.indexGroup.rotation.x = THREE.MathUtils.lerp(rightHand.indexGroup.rotation.x, 0.05, 0.18);
        rightHand.midGroup.rotation.x = THREE.MathUtils.lerp(rightHand.midGroup.rotation.x, 0.08, 0.18);
        rightHand.ringGroup.rotation.x = THREE.MathUtils.lerp(rightHand.ringGroup.rotation.x, 0.12, 0.18);
        rightHand.pinkyGroup.rotation.x = THREE.MathUtils.lerp(rightHand.pinkyGroup.rotation.x, 0.16, 0.18);
        rightHand.thumbGroup.rotation.x = THREE.MathUtils.lerp(rightHand.thumbGroup.rotation.x, 0.25, 0.18);

        // Left Arm rests gently
        leftArmGroup.rotation.x = THREE.MathUtils.lerp(leftArmGroup.rotation.x, 0, 0.1);
        leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.22, 0.1);
        leftElbowGroup.rotation.set(0, 0, 0);

        // Head tilts charmingly with speech
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, -0.15, 0.12);
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, curSpeaking ? Math.sin(t * 3.5) * 0.15 : 0.08, 0.12);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, curSpeaking ? Math.sin(t * 6.0) * 0.08 : 0, 0.15);
        robotRoot.rotation.y = THREE.MathUtils.lerp(robotRoot.rotation.y, 0, 0.08);
      } else if (curSpeaking) {
        // --- TEACHER GESTICULATING WITH BOTH HANDS (Articulated Forearms & Palms) ---
        // Left arm and elbow
        leftArmGroup.rotation.x = THREE.MathUtils.lerp(leftArmGroup.rotation.x, -0.28 + Math.sin(t * 3.8) * 0.15, 0.12);
        leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.32 + Math.cos(t * 3.0) * 0.12, 0.12);
        leftArmGroup.rotation.y = THREE.MathUtils.lerp(leftArmGroup.rotation.y, -0.2, 0.12);
        leftElbowGroup.rotation.x = THREE.MathUtils.lerp(leftElbowGroup.rotation.x, -0.65 + Math.sin(t * 4.5) * 0.25, 0.14);
        leftHand.handGroup.rotation.x = THREE.MathUtils.lerp(leftHand.handGroup.rotation.x, Math.sin(t * 5.5) * 0.35, 0.16);
        leftHand.handGroup.rotation.y = THREE.MathUtils.lerp(leftHand.handGroup.rotation.y, 0, 0.16);
        leftHand.handGroup.rotation.z = THREE.MathUtils.lerp(leftHand.handGroup.rotation.z, 0, 0.16);

        const leftFlex = 0.22 + Math.sin(t * 4.5) * 0.18;
        leftHand.indexGroup.rotation.x = THREE.MathUtils.lerp(leftHand.indexGroup.rotation.x, leftFlex, 0.16);
        leftHand.midGroup.rotation.x = THREE.MathUtils.lerp(leftHand.midGroup.rotation.x, leftFlex + 0.05, 0.16);
        leftHand.ringGroup.rotation.x = THREE.MathUtils.lerp(leftHand.ringGroup.rotation.x, leftFlex + 0.1, 0.16);
        leftHand.pinkyGroup.rotation.x = THREE.MathUtils.lerp(leftHand.pinkyGroup.rotation.x, leftFlex + 0.15, 0.16);
        leftHand.thumbGroup.rotation.x = THREE.MathUtils.lerp(leftHand.thumbGroup.rotation.x, 0.3, 0.16);

        // Right arm and elbow
        rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, -0.28 + Math.cos(t * 3.8) * 0.15, 0.12);
        rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.32 - Math.sin(t * 3.0) * 0.12, 0.12);
        rightArmGroup.rotation.y = THREE.MathUtils.lerp(rightArmGroup.rotation.y, 0.2, 0.12);
        rightElbowGroup.rotation.x = THREE.MathUtils.lerp(rightElbowGroup.rotation.x, -0.65 + Math.cos(t * 4.5) * 0.25, 0.14);
        rightHand.handGroup.rotation.x = THREE.MathUtils.lerp(rightHand.handGroup.rotation.x, Math.cos(t * 5.5) * 0.35, 0.16);
        rightHand.handGroup.rotation.y = THREE.MathUtils.lerp(rightHand.handGroup.rotation.y, 0, 0.16);
        rightHand.handGroup.rotation.z = THREE.MathUtils.lerp(rightHand.handGroup.rotation.z, 0, 0.16);

        const rightFlex = 0.22 + Math.cos(t * 4.5) * 0.18;
        rightHand.indexGroup.rotation.x = THREE.MathUtils.lerp(rightHand.indexGroup.rotation.x, rightFlex, 0.16);
        rightHand.midGroup.rotation.x = THREE.MathUtils.lerp(rightHand.midGroup.rotation.x, rightFlex + 0.05, 0.16);
        rightHand.ringGroup.rotation.x = THREE.MathUtils.lerp(rightHand.ringGroup.rotation.x, rightFlex + 0.1, 0.16);
        rightHand.pinkyGroup.rotation.x = THREE.MathUtils.lerp(rightHand.pinkyGroup.rotation.x, rightFlex + 0.15, 0.16);
        rightHand.thumbGroup.rotation.x = THREE.MathUtils.lerp(rightHand.thumbGroup.rotation.x, 0.3, 0.16);

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
        leftHand.handGroup.rotation.set(0, 0, 0);

        rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, 0, 0.08);
        rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.15 - Math.sin(t * 2) * 0.03, 0.08);
        rightArmGroup.rotation.y = THREE.MathUtils.lerp(rightArmGroup.rotation.y, 0, 0.08);
        rightElbowGroup.rotation.set(0, 0, 0);
        rightHand.handGroup.rotation.set(0, 0, 0);

        // Relaxed natural finger curve
        const restCurve = 0.15 + Math.sin(t * 1.8) * 0.03;
        leftHand.indexGroup.rotation.x = THREE.MathUtils.lerp(leftHand.indexGroup.rotation.x, restCurve, 0.1);
        leftHand.midGroup.rotation.x = THREE.MathUtils.lerp(leftHand.midGroup.rotation.x, restCurve + 0.04, 0.1);
        leftHand.ringGroup.rotation.x = THREE.MathUtils.lerp(leftHand.ringGroup.rotation.x, restCurve + 0.08, 0.1);
        leftHand.pinkyGroup.rotation.x = THREE.MathUtils.lerp(leftHand.pinkyGroup.rotation.x, restCurve + 0.12, 0.1);
        leftHand.thumbGroup.rotation.x = THREE.MathUtils.lerp(leftHand.thumbGroup.rotation.x, 0.25, 0.1);

        rightHand.indexGroup.rotation.x = THREE.MathUtils.lerp(rightHand.indexGroup.rotation.x, restCurve, 0.1);
        rightHand.midGroup.rotation.x = THREE.MathUtils.lerp(rightHand.midGroup.rotation.x, restCurve + 0.04, 0.1);
        rightHand.ringGroup.rotation.x = THREE.MathUtils.lerp(rightHand.ringGroup.rotation.x, restCurve + 0.08, 0.1);
        rightHand.pinkyGroup.rotation.x = THREE.MathUtils.lerp(rightHand.pinkyGroup.rotation.x, restCurve + 0.12, 0.1);
        rightHand.thumbGroup.rotation.x = THREE.MathUtils.lerp(rightHand.thumbGroup.rotation.x, 0.25, 0.1);

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
