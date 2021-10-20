import * as THREE from 'three'
import React, { useMemo, useState } from 'react'
import { useFrame, useThree } from 'react-three-fiber'

function getCenterPoint(mesh) {
  const geometry = mesh.geometry
  geometry.computeBoundingBox()
  const center = new THREE.Vector3()
  geometry.boundingBox.getCenter(center)
  mesh.localToWorld(center)
  return center
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export default function Candle({ 
  stringifiedSrc, 
  material,// = new THREE.MeshNormalMaterial(), 
  materialOnOver,// = new THREE.MeshNormalMaterial(), 
  object,
  scale = 1,
  ...props 
}) {
  const [ ready, setReady ] = useState(false)
  const { 
    camera
  } = useThree()

  const onPointerMove = () => {
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = materialOnOver
      }
    })
  }
  const onPointerOut = () => {
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = material
      }
    })
  }

  const theta = useMemo(() => {
    const randomTheta = () => getRandomInt(3, 7)
    return {
      x: randomTheta(),
      y: randomTheta(),
      z: randomTheta()
    }
  }, [])

  useMemo(() => {
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = material
      }
    })
  }, [object])

  useFrame(() => {
    if (object && object.children && object.children[0]) {
      const center = getCenterPoint(object.children[0])
      camera.lookAt(center)
      camera.updateProjectionMatrix()
      setReady(true)
    }
  })

  useFrame(() => {
    if (object) {
      const timer = Date.now() * 0.00025
      object.position.x = Math.sin(timer * theta.x) * 10
      object.position.y = Math.cos(timer * theta.y) * 10
      object.position.z = Math.cos(timer * theta.z) * 10
    }
  })

  useFrame(() => {
    if (object) {
      const timer = Date.now() * 0.00025
      object.rotateX(Math.sin(timer * theta.x) / 1000)
      object.rotateY(Math.cos(timer * theta.y) / 1000)
      object.rotateZ(Math.cos(timer * theta.z) / 1000)
    }
  })

  return (
    <>
      {ready && (
        <mesh scale={[0.01 * scale, 0.01 * scale, 0.01 * scale]} position={[0, -1.5, 0]} {...props}>
          <primitive
            attach="mesh"
            object={object}
            onPointerMove={onPointerMove}
            onPointerOut={onPointerOut}
          />
        </mesh>
      )}
    </>
  )
}
