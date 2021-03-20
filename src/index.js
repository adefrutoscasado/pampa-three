import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { useMemo, useRef, useEffect, useState } from 'react'
import { Canvas, useThree, extend } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import queryString from 'query-string'
import './styles.css'
import { SubdivisionModifier } from 'three/examples/jsm/modifiers/SubdivisionModifier'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Candle from './Candle'
const loader = new GLTFLoader();

extend({ OrbitControls })

const { query } = queryString.parseUrl(window.location.href)

const containsQueryString = (string) => {
  return Object.keys(query).findIndex((v) => v.toUpperCase() === string.toUpperCase()) > -1
}
const queryStringColor = (function () {
  if (!query.color) return null
  return query.color.startsWith('#') ? query.color : '#' + query.color
})()

const queryStringColorOnOver = (function () {
  if (!query.colorOnOver) return null
  return query.colorOnOver.startsWith('#') ? query.colorOnOver : '#' + query.colorOnOver
})()

const Scene = ({object}) => {
  const {
    camera,
    size,
    gl: { domElement },
    invalidate,
  } = useThree()
  const controls = useRef()

  useMemo(() => {
    camera.zoom = size.height / 4
  }, [size])

  const materials = useMemo(() => ({
    material: new THREE.MeshPhongMaterial({ color: queryStringColor || '#E18C46', specular: '#F111111', shininess: 30, flatShading: true }),
    materialOnOver: new THREE.MeshPhongMaterial({ color: queryStringColorOnOver || '#E8A772', specular: '#F111111', shininess: 30, flatShading: true })
  }), [])

  useEffect(() => {
    controls.current.addEventListener('change', invalidate)
    return () => controls.current.removeEventListener('change', invalidate)
  }, [controls.current])

  // useFrame(() => {
  //   const MAX_ZOOM = 300
  //   if (camera.zoom > MAX_ZOOM) {
  //     camera.zoom = camera.zoom - (camera.zoom - MAX_ZOOM) * 0.075
  //   }
  // })

  return (
    <>
      <ambientLight />
      <spotLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} color="orange" />
      {object && <Candle {...materials} object={object} />}
      <orbitControls ref={controls} args={[camera, domElement]} enableDamping/>
    </>
  )
}

/**
 * Generates a smooth geometry from a shaded one
 * https://threejs.org/examples/?q=subd#webgl_modifier_subdivision
 */
function subdivide(geometry, subdivisions) {
  const faceIndices = ['a', 'b', 'c']
  const modifier = new SubdivisionModifier(subdivisions)
  const smoothGeometry = modifier.modify(geometry)
  // colorify faces
  for (let i = 0; i < smoothGeometry.faces.length; i++) {
    const face = smoothGeometry.faces[i]
    for (let j = 0; j < 3; j++) {
      const vertexIndex = face[faceIndices[j]]
      const vertex = smoothGeometry.vertices[vertexIndex]
      const hue = vertex.y / 200 + 0.5
      const color = new THREE.Color().setHSL(hue, 1, 0.5)
      face.vertexColors[j] = color
    }
  }
  // convert to THREE.BufferGeometry
  return new THREE.BufferGeometry().fromGeometry(smoothGeometry)
}

const App = () => {
  const [object, setObject] = useState()

  useEffect(() => {
    if (containsQueryString('candleA'))
      loader.load('./candleA.gltf', ({scene}) => {
        setObject(scene)
      })
    if (containsQueryString('candleB'))
      loader.load('./candleB.gltf', ({scene}) => {
        setObject(scene)
      })
    if (containsQueryString('candleC'))
      loader.load('./candleC.gltf', ({scene}) => {
        setObject(scene)
      })
    if (containsQueryString('candleD'))
      loader.load('./candleD.gltf', ({scene}) => {
        setObject(scene)
      })
    if (containsQueryString('candleE'))
      loader.load('./candleE.gltf', ({scene}) => {
        setObject(scene)
      })
    if (containsQueryString('candleF'))
      loader.load('./candleF.gltf', ({scene}) => {
        setObject(scene)
      })
  }, [])

  // useMemo(() => {
  //   if (object && (
  //     containsQueryString('candleA') ||
  //     containsQueryString('candleB') ||
  //     containsQueryString('candleC')
  //   ))
  //     object.traverse(function (child) {
  //       if (child instanceof THREE.Mesh) {
  //         const MODIFIER_SUBDIVISIONS = 2
  //         child.geometry = subdivide(child.geometry, MODIFIER_SUBDIVISIONS)
  //       }
  //     })
  // }, [object])

  return (
    <Canvas
      colorManagement
      orthographic
      camera={{ position: [0, 2, 5],zoom: 200, fov: 50 }}
      pixelRatio={window.devicePixelRatio || 1}
      >
      <Scene object={object}/>
    </Canvas>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
