import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { useMemo, Suspense, lazy } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls } from 'drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import './styles.css'
import candleA from './candleA'
import candleB from './candleB'

function getCenterPoint(mesh) {
  const geometry = mesh.geometry
  geometry.computeBoundingBox()
  const center = new THREE.Vector3()
  geometry.boundingBox.getCenter(center)
  mesh.localToWorld(center)
  return center
}

// fire? https://codepen.io/prisoner849/pen/XPVGLp

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function Candle({stringifiedSrc, material, test, ...props}) {
  const { camera } = useThree()  

  const object = useMemo(() => {
    const loader = new OBJLoader()
    return loader.parse(stringifiedSrc)
  }, [])

  const candleMaterial = useMemo(() => {
    return material || new THREE.MeshNormalMaterial()
  }, [])

  const theta = useMemo(() => {
    const randomTheta = () => getRandomInt(3,7)
    return {
      x: randomTheta(),
      y: randomTheta(),
      z: randomTheta()
    }
  }, [])

  useMemo(() => {
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = candleMaterial
      }
    })
  }, [object])

  useFrame(() => {
    if (object && object.children && object.children[0]) {
      const center = getCenterPoint(object.children[0])
      camera.lookAt(center)
      camera.updateProjectionMatrix()
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
        object.rotateX( Math.sin(timer * theta.x) / 1000 )
        object.rotateY( Math.cos(timer * theta.y) / 1000 )
        object.rotateZ( Math.cos(timer * theta.z) / 1000 )
    }
  })

  return (
    <>
      {object &&
        <mesh
          scale={[0.01, 0.01, 0.01]}
          position={[0, -1.5, 0]}
          {...props}
        >
          <primitive attach="mesh" object={object} />
        </mesh>
      }
    </>
  )
}

const urlContains = (string) => {
  return window.location.href.toLowerCase().includes(string.toLowerCase())
}

const CandleA = lazy(() => import('./candleA').then(candleA => {
  return (
    // <Suspense fallback={null}>
      <Candle 
        stringifiedSrc={candleA.default}
        material={new THREE.MeshPhongMaterial({ color: '#F44336', specular: '#F111111', shininess: 30, flatShading: false })}
      />
    // </Suspense>
  )
}))

const Scene = () => {
  const {
    camera
  } = useThree()

  useFrame(() => {
    const MAX_ZOOM = 300
    if (camera.zoom > MAX_ZOOM) {
      camera.zoom = camera.zoom - (camera.zoom - MAX_ZOOM) * 0.075
    }
  })

  return (
    <>
      <ambientLight />
      <spotLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} color="orange" />
      {/* {urlContains('candleA') &&
        <Suspense fallback={null}>
          <Candle 
            stringifiedSrc={candleA}
            material={new THREE.MeshPhongMaterial({ color: '#F44336', specular: '#F111111', shininess: 30, flatShading: false })}
          />
        </Suspense>
      } */}
      {urlContains('candleA') &&
        <Suspense fallback={null}>
          <Candle 
            stringifiedSrc={candleA}
            material={new THREE.MeshPhongMaterial({ color: '#F44336', specular: '#F111111', shininess: 30, flatShading: false })}
          />
        </Suspense>
      }
      {urlContains('candleB') &&
        <Suspense fallback={null}>
          <Candle 
            stringifiedSrc={candleB}
            material={new THREE.MeshPhongMaterial({ color: '#E18C46', specular: '#F111111', shininess: 30, flatShading: false })}
          />
        </Suspense>
      }
      <OrbitControls />
    </>
  )
}

ReactDOM.render(
  <Canvas
    colorManagement
    orthographic
    camera={{ position: [0, 2, 5], zoom: 200, fov: 50 }}
  >
    <Scene />
  </Canvas>,
  document.getElementById('root')
)
