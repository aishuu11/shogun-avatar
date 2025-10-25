"use client";

import { useEffect, useRef } from "react";
import { Group, Box3, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
// ✅ use the official examples loader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  VRM,
  VRMLoaderPlugin,
  VRMHumanBoneName,
  VRMUtils,
} from "@pixiv/three-vrm";

export default function Avatar() {
  const root = useRef<Group>(null!);
  const vrmRef = useRef<VRM | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();

    // ✅ register the VRM plugin (cast makes TS chill)
    (loader as any).register((parser: any) => new VRMLoaderPlugin(parser));

    // ✅ simple + robust: let the loader fetch and decode
    loader.load(
      "/avatar.vrm",
      (gltf) => {
        const vrm = gltf.userData.vrm as VRM | undefined;
        if (!vrm) {
          console.error("[VRM] userData.vrm is missing");
          return;
        }
        vrmRef.current = vrm;

        // tidy + visibility
        VRMUtils.removeUnnecessaryJoints(vrm.scene);
        VRMUtils.removeUnnecessaryVertices(vrm.scene);
        vrm.scene.traverse((o: any) => (o.frustumCulled = false));

        // face camera
        vrm.scene.rotation.y = Math.PI;

        // autosize to ~1.6m and rest on ground
        const box = new Box3().setFromObject(vrm.scene);
        const size = new Vector3();
        box.getSize(size);
        const height = Math.max(0.001, size.y);
        const scale = 1.6 / height;
        vrm.scene.scale.setScalar(scale);

        const box2 = new Box3().setFromObject(vrm.scene);
        const center = new Vector3();
        box2.getCenter(center);
        vrm.scene.position.sub(center).setY(-box2.min.y * scale);

        root.current.add(vrm.scene);
        console.log("[VRM] loaded ✅");
      },
      undefined,
      (err) => console.error("[VRM] load error:", err)
    );

    // cleanup
    return () => {
      const vrm = vrmRef.current;
      if (!vrm) return;
      root.current.remove(vrm.scene);
      vrm.scene.traverse((obj: any) => {
        obj.geometry?.dispose?.();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.filter(Boolean).forEach((m: any) => m.dispose?.());
      });
      vrmRef.current = null;
    };
  }, []);

  useFrame((state, delta) => {
    const vrm = vrmRef.current;
    if (!vrm) return;

    vrm.update(delta);

    // idle bob
    root.current.position.y = Math.sin(state.clock.elapsedTime) * 0.02;

    // head follow
    const head = vrm.humanoid?.getBoneNode(VRMHumanBoneName.Head);
    if (head) {
      head.rotation.y = state.pointer.x * 0.3;
      head.rotation.x = state.pointer.y * -0.2;
    }
  });

  return <group ref={root} />;
}
