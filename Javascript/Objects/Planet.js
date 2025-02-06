import { Mesh, MeshLambertMaterial, SphereGeometry } from "./node_modules/three/build/three.module.js";
import { SphereCollider } from "../Physics/SphereCollider";
import { PhysicsObject } from "../Physics/PhysicsObject";
import { PhysicsManager } from "../Physics/PhysicsManager";
import { SceneManager } from "../SceneManager";

export class Planet extends PhysicsObject
{
    objectsInPull = [];

    constructor(position, radius, color, gravityStrength, gravitationalPullRadius)
    {
        super();
        this.geometry =  new SphereGeometry(radius);
        this.material = new MeshLambertMaterial({color: color, opacity: 0.7, transparent: true});

        this.mesh = new Mesh(this.geometry, this.material);

        this.mesh.position.copy(position);

        SceneManager.scene.add(this.mesh);

        this.gravityStrength = gravityStrength;
        this.gravitationalPullRadius = gravitationalPullRadius;

        this.InitPhysics(radius);

        this.invMass = 0;
    }

    PhysicsUpdate(step)
    {
        super.PhysicsUpdate(step);

        let objectsCurrentlyInPull = PhysicsManager.CheckSphere(this.mesh.position, this.gravitationalPullRadius);

        objectsCurrentlyInPull.forEach(object =>
        {
            if(object != this)
            {
                let distance = this.mesh.position.distanceTo(object.mesh.position);
                let epsilon = 0.5;
                distance = Math.max(distance, epsilon);


                object.CalculateGravityDirection(this.mesh.position);
                object.ApplyGravity((this.gravityStrength * 100 * step) / (distance * distance));
            }
        });

    }
}