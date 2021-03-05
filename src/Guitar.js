import React, { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "react-three-fiber"
import { ContactShadows, Environment, useGLTF, OrbitControls, Effects } from "drei"
import { HexColorPicker } from "react-colorful"
import { proxy, useProxy } from "valtio"

// Using a Valtio state model to bridge reactivity between
// the canvas and the dom, both can write to it and/or react to it.
const state = proxy({
  current: null,
  items: {
    Body: "black",
    Madera: "#ffffff",
    plastico_blanco: "#ffffff",
    Metal: "#ffffff"
  },
})

export const Guitar = (props) => {
  const ref = useRef()
  const snap = useProxy(state)
  // Drei's useGLTF hook sets up draco automatically, that's how it differs from useLoader(GLTFLoader, url)
  // { nodes, materials } are extras that come from useLoader, these do not exist in threejs/GLTFLoader
  // nodes is a named collection of meshes, materials a named collection of materials
  const { nodes, materials } = useGLTF("fender_min.glb")

  // Animate model
  useFrame((state) => {
    const t = state.clock.getElapsedTime() / 4
    // ref.current.rotation.z = 0 - (1 + Math.sin(t)) / 2
    ref.current.rotation.z += 0.004
  })

  // Cursor showing current color
  const [hovered, set] = useState(null)
  useEffect(() => {
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`
    document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(hovered ? cursor : auto)}'), auto`;
  }, [hovered])

  // Using the GLTFJSX output here to wire in app-state and hook up events
  return (
    <group
      rotation={[1.57, 0, 0]}
      scale={[1, 1, 1]}
      position={[0, -2, 0]}
      ref={ref}
      dispose={null}
      onPointerOver={(e) => (e.stopPropagation(), set(e.object.material.name))}
      onPointerOut={(e) => e.intersections.length === 0 && set(null)}
      onPointerMissed={() => (state.current = null)}
      onPointerDown={
        (e) => {
          e.stopPropagation();
          state.current = e.object.material.name;
          props.setColors({ ...state })
        }
      }>
      <mesh geometry={nodes.Guitarra.children[0].geometry} material={materials.Body} material-color={snap.items.Body} colorWrite={true} />
      <mesh geometry={nodes.Guitarra.children[1].geometry} material={materials.plastico_blanco} material-color={snap.items.plastico_blanco} />
      <mesh geometry={nodes.Guitarra.children[2].geometry} material={materials.Metal} material-color={snap.items.Metal} />
      <mesh geometry={nodes.Guitarra.children[3].geometry} material={materials.Madera} material-color={snap.items.Madera} />
    </group>
  )
}

function tag(tag) {

  switch (tag) {
    case 'Body':
      return 'Guitar Body';
    case 'plastico_blanco':
      return 'Cap';
    case 'Madera':
      return 'Guitar Neck';
    default:
      return tag;
  }
}

function Picker(props) {
  const snap = useProxy(state)
  return (
    <div style={{ display: snap.current ? "block" : "none" }}>
      <HexColorPicker className="picker" color={snap.items[snap.current]} onChange={(color) => {
        console.log('Color chnage')
        state.items[snap.current] = color;
        props.setColors({ ...snap })
      }} />
      <span className='material_tag'>
        <h1>{tag(snap.current)}</h1>
      </span>
    </div>
  )
}

export const GuitarMesh = (props) => {
  return (
    <>
      <Canvas concurrent pixelRatio={[1, 1.5]} camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.4} />
        <spotLight intensity={0.2} angle={0.1} penumbra={1} position={[5, 25, 20]} />
        {/* <Effects multisamping={.2} renderIndex={2}/> */}
        <Suspense fallback={null}>
          <Guitar setColors={props.setColors} />
          <Environment files="royal_esplanade_1k.hdr" />
          <ContactShadows rotation-x={Math.PI / 2} position={[0, -4, 0]} opacity={0.25} width={30} height={30} blur={2} far={2} />
        </Suspense>
        <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>
      <Picker setColors={props.setColors}/>
    </>
  )
}
