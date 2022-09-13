import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import portalVertexShader from '../static/shaders/portal/vertex.glsl'
import portalFragmentShader from '../static/shaders/portal/fragment.glsl'

import  MeshReflectorMaterial  from '../static/shaders/MeshReflectorMaterial';

//Texture load


/**
 * Base
 */
// Debug


// Debug
let debug = true
const debugObject = {}
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
    '/textures/enviromentMap/1/px.jpg',
    '/textures/enviromentMap/1/nx.jpg',
    '/textures/enviromentMap/1/py.jpg',
    '/textures/enviromentMap/1/ny.jpg',
    '/textures/enviromentMap/1/pz.jpg',
    '/textures/enviromentMap/1/nz.jpg'
])
scene.background = environmentMap
console.log(environmentMap)
/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()


const graniteDifuse = textureLoader.load('./textures/reflecting-material/Granite08large_MR_1K/Granite08large_1K_BaseColor.png')
const graniteRoughness = textureLoader.load('./textures/reflecting-material/Granite08large_MR_1K/Granite08large_1K_Roughness.png')
const graniteNormal = textureLoader.load('./textures/reflecting-material/Granite08large_MR_1K/Granite08large_1K_Normal.png')
const whiteTilesDifuse = textureLoader.load('./textures/reflecting-material/StoneTilesFloor03_MR_1K/StoneTilesFloor03_1K_BaseColor.png')
const whiteTilesRoughness = textureLoader.load('./textures/reflecting-material/StoneTilesFloor03_MR_1K/StoneTilesFloor03_1K_Roughness.png')
const whiteTilesNormal = textureLoader.load('./textures/reflecting-material/StoneTilesFloor03_MR_1K/StoneTilesFloor03_1K_Normal.png')


// // Draco loader
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('draco/')

// // GLTF loader
// const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)
/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      
       
    })
)
// floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)




// Portal light material
debugObject.portalColorStart = '#ffffff'
debugObject.portalColorEnd = '#09ec60'

gui
    .addColor(debugObject, 'portalColorStart')
    .onChange(() =>
    {
        portalLightMaterial.uniforms.uColorStart.value.set(debugObject.portalColorStart)
    })

gui
    .addColor(debugObject, 'portalColorEnd')
    .onChange(() =>
    {
        portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd)
    })

const portalLightMaterial = new THREE.ShaderMaterial({
    uniforms:
    {
        uTime: { value: 0 },
        uColorStart: { value: new THREE.Color(debugObject.portalColorStart) },
        uColorEnd: { value: new THREE.Color(debugObject.portalColorEnd) }
    },
    vertexShader: portalVertexShader,
    fragmentShader: portalFragmentShader
})

const portal = new THREE.Mesh(
    new THREE.PlaneGeometry(5,5),
    new THREE.MeshStandardMaterial({
        color: 'white',
        emissive: 'white',
        envMap: environmentMap

    })
)

portal.material = portalLightMaterial
portal.position.set(0,2,0)
scene.add(portal)


/**
 * Lights
 */



const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)



function lightsGUI() {
    if(debug) {
        const lightsFolder = gui.addFolder('Lights')
        lightsFolder.add(directionalLight, 'intensity').min(0).max(10).step(0.01).name('lightIntensity')
        lightsFolder.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightDirectionX')
        lightsFolder.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightDirectionY')
        lightsFolder.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightDirectionZ')
      

    }
}

function addReflectorGUI2(){
    if (debug){
        const reflectorFolder2 = gui.addFolder('Reflector2')
        reflectorFolder2.add(floor.material, 'roughness').min(0).max(2).step(0.001)
        reflectorFolder2.add(floor.material, 'envMapIntensity').min(0).max(2).step(0.001)
        reflectorFolder2.add(floor.material, 'emissiveIntensity').min(0).max(2).step(0.001)
        reflectorFolder2.add(floor.material, 'metalness').min(0).max(2).step(0.001)
        // reflectorFolder2.addColor(floor.material, 'color')
        reflectorFolder2.add(floor.material.reflectorProps, 'mixBlur').min(0).max(7).step(0.001)
        reflectorFolder2.add(floor.material.reflectorProps, 'mixStrength').min(0).max(200).step(0.001)
        reflectorFolder2.add(floor.material.reflectorProps, 'depthScale').min(0).max(20).step(0.1)
        reflectorFolder2.add(floor.material.reflectorProps, 'mixContrast').min(0).max(7).step(0.001)
        reflectorFolder2.add(floor.material.reflectorProps, 'minDepthThreshold').min(0).max(7).step(0.001)
        reflectorFolder2.add(floor.material.reflectorProps, 'depthToBlurRatioBias').min(0).max(7).step(0.001)
        reflectorFolder2.add(floor.material.reflectorProps, 'maxDepthThreshold').min(-5).max(7).step(0.001).onChange(function(){
            floor.material.needsUpdate = true;
        })
    }
}
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 2, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.physicallyCorrectLights = true
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

lightsGUI()

const floorOriginalMaterial = floor.material;

//   
    floor.material = new MeshReflectorMaterial(renderer, camera, scene, floor,
        {
            resolution: 512,
            blur: [1024,1024],
            mixStrength: 1,
            planeNormal: new THREE.Vector3(0, 0, 1),
            mixContrast: 1,
            bufferSamples: 16,
            depthToBlurRatioBias: 0.6,
            mixBlur: 5,
            mixContrast: 1,
            minDepthThreshold: 0.5,
            maxDepthThreshold: 2.9,
            depthScale: 1.7,
            // mirror: 1,
            // distortionMap: whiteTilesNormal
        });
        floor.material.setValues({
            // roughnessMap:whiteTilesRoughness,
            map: whiteTilesDifuse,
            normalScale: new THREE.Vector2(0.25, 0.25),
            normalMap: whiteTilesNormal,
            emissiveMap: whiteTilesDifuse,
            emissive: new THREE.Color(0xffffff),
            emissiveIntensity: 0.6,
            envMapIntensity: 0.2,
            roughness:0.2,
            color: 0xffffff,
            metalness: 0.1
        })
        floorOriginalMaterial.dispose();
        renderer.renderLists.dispose();
        floor.material.envMap = environmentMap

        addReflectorGUI2();



/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    portalLightMaterial.uniforms.uTime.value = elapsedTime
    floor.material.update();
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()