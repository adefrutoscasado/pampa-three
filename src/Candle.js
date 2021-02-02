import * as THREE from 'three'
import React, { useMemo, useState } from 'react'
import { useFrame, useThree, useRender } from 'react-three-fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { SubdivisionModifier } from 'three/examples/jsm/modifiers/SubdivisionModifier'

function getCenterPoint(mesh) {
  const geometry = mesh.geometry
  geometry.computeBoundingBox()
  const center = new THREE.Vector3()
  geometry.boundingBox.getCenter(center)
  mesh.localToWorld(center)
  return center
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export default function Candle({ stringifiedSrc, material, ...props }) {
  const [ ready, setReady ] = useState(false)
  const { 
    camera
  } = useThree()

  const object = useMemo(() => {
    const loader = new OBJLoader()
    return loader.parse(stringifiedSrc)
  }, [])

  const candleMaterial = useMemo(() => {
    return material || new THREE.MeshNormalMaterial()
  }, [])

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
        child.material = candleMaterial
        const MODIFIER_SUBDIVISIONS = 2
        child.geometry = subdivide(child.geometry, MODIFIER_SUBDIVISIONS)
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
        <mesh scale={[0.01, 0.01, 0.01]} position={[0, -1.5, 0]} {...props}>
          <primitive attach="mesh" object={object} />
        </mesh>
      )}
    </>
  )
}
