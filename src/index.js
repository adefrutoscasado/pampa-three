import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { Suspense, lazy } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls } from 'drei'
import queryString from 'query-string'
import './styles.css'

const {query} = queryString.parseUrl(window.location.href)

const containsQueryString = (string) => {
  return Object.keys(query).findIndex(
    v => v.toUpperCase() === string.toUpperCase()
  ) > -1
}
const queryStringColor = function(){
  if (!query.color) return null
  return query.color.startsWith('#') ?
    query.color
    :
    '#' + query.color
}()

const CandleA = lazy(() => import('./models/candleA'))
const CandleB = lazy(() => import('./models/candleB'))
const CandleC = lazy(() => import('./models/candleC'))

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
      {containsQueryString('candleA') &&
        <Suspense fallback={null}>
            <CandleA
              material={new THREE.MeshPhongMaterial({ color: queryStringColor || '#E18C46', specular: '#F111111', shininess: 30, flatShading: true })}
            />
        </Suspense>
      }
      {containsQueryString('candleB') &&
        <Suspense fallback={null}>
            <CandleB
              material={new THREE.MeshPhongMaterial({ color: queryStringColor || '#E18C46', specular: '#F111111', shininess: 30, flatShading: true })}
            />
        </Suspense>
      }
      {containsQueryString('candleC') &&
        <Suspense fallback={null}>
            <CandleC
              material={new THREE.MeshPhongMaterial({ color: queryStringColor || '#E18C46', specular: '#F111111', shininess: 30, flatShading: true })}
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
    camera={{ position: [0, 2, 5], zoom: 250, fov: 50 }}
    pixelRatio={window.devicePixelRatio}
  >
    <Scene />
  </Canvas>,
  document.getElementById('root')
)
