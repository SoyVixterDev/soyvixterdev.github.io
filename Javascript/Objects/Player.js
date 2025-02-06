import { CylinderGeometry, Mesh, MeshLambertMaterial, Vector3 } from "three";
import { PhysicsObject } from "../Physics/PhysicsObject";
import { SceneManager } from "../SceneManager";

export class Player extends PhysicsObject
{
    movementSpeed = 2;
    jumpStrength = 5;

    constructor(position)
    {
        super();
        this.geometry = new CylinderGeometry(1, 1, 2);
        this.material = new MeshLambertMaterial({ color: 0x770077});

        this.mesh = new Mesh(this.geometry, this.material);

        this.mesh.position.copy(position);

        SceneManager.scene.add(this.mesh);

        this.InitPhysics();
    }    
}