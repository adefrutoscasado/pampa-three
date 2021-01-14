import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree, useLoader, extend } from 'react-three-fiber'
import { OrbitControls } from 'drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import './styles.css'

function getCenterPoint(mesh) {
  const geometry = mesh.geometry
  geometry.computeBoundingBox()
  const center = new THREE.Vector3()
  geometry.boundingBox.getCenter(center)
  mesh.localToWorld(center)
  return center
}

// fire? https://codepen.io/prisoner849/pen/XPVGLp

function Candle(props) {
  const { camera } = useThree()
  const object = useLoader(OBJLoader, 'https://github.com/adefrutoscasado/pampa-three/raw/main/public/candle_single.obj')

  const candleMaterial = useMemo(() => {
    return new THREE.MeshNormalMaterial()
    // return new THREE.MeshPhongMaterial()
  }, [])

  useMemo(() => {
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = candleMaterial
      }
    })
  }, [object])

  useFrame(() => {
    if (object) {
      const center = getCenterPoint(object.children[0])
      camera.lookAt(center)
      camera.updateProjectionMatrix()
    }
  })

  useFrame(() => {
    if (object) {
        const timer = Date.now() * 0.00025
        object.position.x = Math.sin(timer * 7) * 100
        object.position.y = Math.cos(timer * 5) * 100
        object.position.z = Math.cos(timer * 3) * 100
    }
  })

  useFrame(() => {
    if (object) {
        const timer = Date.now() * 0.00025
        object.rotateX( Math.sin(timer * 7) / 1000 )
        object.rotateY( Math.cos(timer * 5) / 1000 )
        object.rotateZ( Math.cos(timer * 3) / 1000 )
    }
  })

  return (
    <>
      {object &&
        <mesh
          {...props}
          scale={[0.01, 0.01, 0.01]}
          position={[0, 0, 0]}
          rotateOnAxis={90}
        >
          <primitive attach="mesh" object={object} />
        </mesh>
      }
    </>
  )
}

const Scene = () => {
  const {
    camera
  } = useThree()

  useFrame(() => {
    const MAX_ZOOM = 200
    if (camera.zoom > MAX_ZOOM) {
      camera.zoom = camera.zoom - (camera.zoom - MAX_ZOOM) * 0.075
    }
  })

  return (
    <>
      <ambientLight />
      <spotLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} color="red" />
      <Suspense fallback={null}>
        <Candle />
      </Suspense>
      <OrbitControls />
    </>
  )
}

ReactDOM.render(
  <Canvas
    colorManagement
    orthographic
    camera={{ position: [0, 5, 5], zoom: 150, fov: 50 }}
  >
    <Scene />
  </Canvas>,
  document.getElementById('root')
)