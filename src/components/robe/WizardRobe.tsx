"use client";

import React, { Suspense, useEffect, useLayoutEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

const FUR_LINES_COUNT = 500000;
const FUR_MIN_LENGTH = 0.004;
const FUR_MAX_LENGTH = 0.01;

interface FurLinesModelProps {
  onReady?: () => void;
}

function FurLinesModel({ onReady }: FurLinesModelProps) {
  const { scene } = useGLTF("/untitled.glb");

  const targetMesh = useMemo<THREE.Mesh | null>(() => {
    let found: THREE.Mesh | null = null;
    scene.traverse((obj) => {
      if (!found && (obj as THREE.Mesh).isMesh) {
        found = obj as THREE.Mesh;
      }
    });
    return found;
  }, [scene]);

  const baseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#151515"),
        roughness: 1,
        metalness: 0,
      }),
    [],
  );

  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0.75,
        vertexColors: true,
      }),
    [],
  );

  const lineGeometry = useMemo(() => {
    if (!targetMesh) return null;
    const geometry = targetMesh.geometry.clone();
    geometry.computeVertexNormals();

    targetMesh.updateWorldMatrix(true, true);
    const inverseWorld = targetMesh.matrixWorld.clone().invert();
    const gravityLocal = new THREE.Vector3(0, -1, 0).transformDirection(
      inverseWorld,
    );

    const sampler = new MeshSurfaceSampler(new THREE.Mesh(geometry)).build();
    const positions = new Float32Array(FUR_LINES_COUNT * 2 * 3);
    const colors = new Float32Array(FUR_LINES_COUNT * 2 * 3);
    const point = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const tip = new THREE.Vector3();
    const randomVec = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const baseColor = new THREE.Color("#1a1a1a");
    const tipColor = new THREE.Color("#6a6a6a");
    const strandColor = new THREE.Color();

    for (let i = 0; i < FUR_LINES_COUNT; i += 1) {
      sampler.sample(point, normal);
      const length = THREE.MathUtils.lerp(
        FUR_MIN_LENGTH,
        FUR_MAX_LENGTH,
        Math.random(),
      );
      randomVec.set(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      );
      tangent.copy(normal).cross(randomVec).normalize();
      direction
        .copy(normal)
        .multiplyScalar(0.7)
        .addScaledVector(gravityLocal, 0.25)
        .addScaledVector(tangent, 0.2)
        .normalize();
      tip.copy(point).addScaledVector(direction, length);
      const offset = i * 6;
      positions[offset] = point.x;
      positions[offset + 1] = point.y;
      positions[offset + 2] = point.z;
      positions[offset + 3] = tip.x;
      positions[offset + 4] = tip.y;
      positions[offset + 5] = tip.z;

      const shade = THREE.MathUtils.lerp(0.75, 1.25, Math.random());
      strandColor.copy(baseColor).multiplyScalar(shade);
      colors[offset] = strandColor.r;
      colors[offset + 1] = strandColor.g;
      colors[offset + 2] = strandColor.b;

      strandColor.copy(tipColor).multiplyScalar(shade + 0.1);
      colors[offset + 3] = strandColor.r;
      colors[offset + 4] = strandColor.g;
      colors[offset + 5] = strandColor.b;
    }

    const lines = new THREE.BufferGeometry();
    lines.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    lines.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    lines.computeBoundingSphere();
    return lines;
  }, [targetMesh]);

  const lineMatrix = useMemo(() => {
    if (!targetMesh) return null;
    targetMesh.updateWorldMatrix(true, true);
    return targetMesh.matrixWorld.clone();
  }, [targetMesh]);

  useEffect(() => {
    if (lineGeometry && lineMatrix) {
      onReady?.();
    }
  }, [lineGeometry, lineMatrix, onReady]);

  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        mesh.material = baseMaterial;
        mesh.material.needsUpdate = true;
      }
    });
  }, [scene, baseMaterial]);

  if (!lineGeometry || !lineMatrix) return null;

  return (
    <group>
      <primitive object={scene} />
      <lineSegments
        geometry={lineGeometry}
        material={lineMaterial}
        matrixAutoUpdate={false}
        matrix={lineMatrix}
      />
    </group>
  );
}

interface WizardRobeViewerProps {
  className?: string;
  onReady?: () => void;
}

export default function WizardRobeViewer({
  className,
  onReady,
}: WizardRobeViewerProps) {
  const lighting = { ambient: 0.16, key: 0.52, fill: 0.13, stage: 0.46 };
  const containerClassName = className
    ? `w-full relative ${className}`
    : "w-full h-[600px] bg-neutral-100 relative";

  return (
    <div className={containerClassName}>
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={lighting.ambient} />
          <directionalLight intensity={lighting.key} position={[5, 6, 3]} />
          <directionalLight intensity={lighting.fill} position={[-4, 2, -3]} />
          <Stage
            environment="city"
            intensity={lighting.stage}
            adjustCamera={1.2}
            preset="rembrandt"
          >
            <FurLinesModel onReady={onReady} />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault autoRotate enableZoom={false} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/untitled.glb");
