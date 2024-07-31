import * as three from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const webgl = document.querySelector(".webgl")
const canvas = document.getElementById("canvas")

console.log(canvas.clientHeight);

const scene = new three.Scene()
const sizes = {
    width: window.innerWidth,
    heigth: window.innerHeight
}

const camera = new three.PerspectiveCamera(75, sizes.width / sizes.heigth)
scene.add(camera)
camera.position.z = 3
camera.position.y = 5
camera.position.x = 2


window.addEventListener("resize", () => {
    sizes.width = window.innerWidth
    sizes.heigth = window.innerHeight

    camera.aspect = sizes.width / sizes.heigth
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
})

const orbitcontrol = new OrbitControls(camera, canvas)
// scene.add(orbitcontrol)


// scene.add(box)

// const logocolor = document.getElementById("logocolor")
// const backcolor = document.getElementById("backcolor")

// console.log(logocolor.value);
let logocolor = new three.Color(`${document.getElementById("backcolor").value}`)

document.getElementById("logocolor").addEventListener("input", (e) => {
    logocolor = new three.Color(`${e.target.value}`)
    // console.log(toptapecolor);
    modelgenrate()
    // console.log(`${e.target.value}`);
})

let backcolor
document.getElementById("backcolor").addEventListener("input", (e) => {
    backcolor = new three.Color(`${e.target.value}`)
    modelgenrate()
})



let textureloader = new three.TextureLoader()
let tapetexture = textureloader.load("p.png")
tapetexture.flipY = false
console.log(tapetexture);
tapetexture.wrapS = three.RepeatWrapping
tapetexture.wrapT = three.RepeatWrapping
tapetexture.repeat.set(1, 1)


// let tapecolor = new three.Color(`"${color}"`)
// console.log(tapecolor);
const image = document.getElementById("image")
image.addEventListener("change", (el) => {

    const file = el.target.files[0]
    // console.log(file);
    if (file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = (e) => {
            tapetexture = textureloader.load(e.target.result)
            tapetexture.flipY = false

            tapetexture.wrapS = three.RepeatWrapping
            tapetexture.wrapT = three.RepeatWrapping
            // tapetexture.repeat.set(1, 9)
            modelgenrate()

        }
    }

})


const modeloader = new GLTFLoader()
let model = null
let model1 = null
function modelgenrate() {

    modeloader.load("./tape.glb", (gltf) => {
        // console.log(gltf);
        scene.add(gltf.scene)

        if (model1) {
            scene.remove(model1)
            // console.log(gltf.scene);
        }
        model1 = gltf.scene
        // model1.position.set(0, 0, 0)

        // console.log(model1);

        gltf.scene.children.map((mesh) => {
            // console.log(mesh);
            if (mesh.name === "tape_logo") {
                mesh.material.emissive = logocolor
                mesh.material.map = tapetexture

            }

            if (mesh.name === "tape_color") {
                mesh.material.color = backcolor
            }

            if (mesh.name === "tape_core") {
            }
        })
        // scene.add(model1)

    })


}

modelgenrate()

const light = new three.DirectionalLight("white", 1)
const light1 = new three.AmbientLight("white", 1)
scene.add(light, light1)


const renderer = new three.WebGLRenderer({
    canvas: webgl,
    antialias: true,
    alpha: true

})

renderer.setSize(sizes.width, sizes.heigth)

function tick() {

    renderer.render(scene, camera)

    // box.rotation.y += .1
    window.requestAnimationFrame(tick)
}

tick()
