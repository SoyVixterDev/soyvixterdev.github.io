import { CylinderGeometry, Mesh, MeshLambertMaterial, Vector3 } from "three";
import { PhysicsObject } from "../Physics/PhysicsObject";
import { SceneManager } from "../SceneManager";
import { PhysicsManager } from "../Physics/PhysicsManager";

export class Player extends PhysicsObject
{
    movementSpeed = 7;
    jumpStrength = 12;

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

    ManageMovement(inputVector, jump)
    {
        let downDir = this.gravityDirection.clone();

        let inputVel = inputVector.clone().multiplyScalar(this.movementSpeed);
        let localVel = this.velocity.clone().applyQuaternion(this.mesh.quaternion.clone().invert());
        let newVel = new Vector3(inputVel.x, localVel.y, inputVel.y);
        newVel.applyQuaternion(this.mesh.quaternion); 

        this.velocity.copy(newVel);

        if(jump && PhysicsManager.CheckSphere(this.mesh.position.clone().addScaledVector(downDir, 1), 0.01, ["Planet"]).length != 0)
        {
            console.log("Jump!");
            this.velocity = (downDir.multiplyScalar(-this.jumpStrength));
        }
    }
}