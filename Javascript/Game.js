import { InputManager } from "./Input/InputManager.js";
import { SceneManager } from "./SceneManager.js";
import { WebGLRenderer, PerspectiveCamera, Vector3, MathUtils, DirectionalLight, MeshLambertMaterial, AmbientLight, Object3D, Vector2 } from "three";
import { PhysicsManager } from "./Physics/PhysicsManager.js";
import { Player } from "./Objects/Player.js";
import { Planet } from "./Objects/Planet.js";

const renderer = new WebGLRenderer(
    {
        canvas: document.querySelector('#bg'),
    }
);
const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);

const sceneManager = new SceneManager(renderer, camera, 0x2a2536);

const inputManager = new InputManager();

const planet = new Planet(new Vector3(0, 0, 10), 8, 0x04f030, 400, 30); 

const player = new Player(new Vector3(2, 9, 10));


let inputVec = new Vector2();

let lastFrameTime = 0;
let deltaTime = 0;

start();

/**
 * Initializer function, starts the game loop
 */
function start()
{
    lastFrameTime = Date.now();


    camera.position.setY(10);
    camera.position.setZ(30);
    camera.quaternion.setFromAxisAngle(new Vector3(1, 0, 0), MathUtils.DEG2RAD * -25);
    
    let light = new DirectionalLight();

    light.position.set(-0.5, 0, 0.25);

    SceneManager.scene.add(light);
    SceneManager.scene.add(new AmbientLight(0xffffff, 0.2));


    update();
}

function updateInputVector()
{
    inputVec.set
    (
        -inputManager.trackedkeys.a + inputManager.trackedkeys.d,
        -inputManager.trackedkeys.s + inputManager.trackedkeys.w
    ).normalize();
}

/**
 * Game loop, running every animation frame
 */
function update()
{
    requestAnimationFrame( update );

    updateInputVector();

    let currentTime = Date.now();

    deltaTime = currentTime - lastFrameTime;

    player.ManageMovement(inputVec, inputManager.trackedkeys.space);

    PhysicsManager.PhysicsUpdate(deltaTime/1000);

    sceneManager.render(camera);

    lastFrameTime = currentTime;    
}