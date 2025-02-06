import { Quaternion, Vector3 } from "three"
import { SphereCollider } from "./SphereCollider";
import { PhysicsManager } from "./PhysicsManager";
import { CollisionManager } from "./CollisionManager";
export class PhysicsObject
{
    tag = "Default";
    dragRatio = 1; 
    /**
     * Initializes the physics object, should be called after constructor in extending class
     */
    InitPhysics(radius)
    {
        this.gravityDirection = new Vector3(0,-1,0);
    
        this.invMass = 1;
    
        this.acceleration = new Vector3(0, 0, 0);
        this.velocity = new Vector3(0, 0, 0);
    
        this.forceAccum = new Vector3(0, 0, 0);
    
        this.collider = new SphereCollider(radius, this.mesh, this);

        PhysicsManager.physicsObjects.push(this);
        CollisionManager.Insert(this);
    }

    /**
     * Runs the physics update on the body
     */
    PhysicsUpdate(timestep)
    {
        if(this.invMass === 0) return;

        this.Integrate(timestep);

    }

//#region Dynamics

    /**
     * Integrates the velocity and position of the object 
     * @param {number} step The timestep for the physics update 
     */
    Integrate(step)
    {
        this.acceleration.copy(this.forceAccum);

        this.velocity.addScaledVector(this.acceleration, step);

        this.velocity.addScaledVector(this.velocity, -this.dragRatio * step);

        this.mesh.position.addScaledVector(this.velocity, step);

        this.forceAccum.set(0, 0, 0);
    }

    /**
     * Applies the gravity force
     * @param {number} force 
     */
    ApplyGravity(force)
    {
        this.forceAccum.addScaledVector(this.gravityDirection, force);
    }

    /**
     * Adds a force to the object, affected by mass;
     * @param {Vector3} force 
     */
    AddForce(force)
    {
        this.forceAccum.addScaledVector(force, this.invMass);
    }


    /**
     * Calculates and updates the gravity direction
     * @param {Vector3} center The center of the body that's generating the gravity 
     */
    CalculateGravityDirection(center)
    {
        let direction =  center.clone().sub(this.mesh.position).normalize();

        this.SetGravityDirection(direction);
    }

    /**
     * Sets the direction of the gravity and rotates the body to match
     * @param {Vector3} direction 
     */
    SetGravityDirection(direction)
    {
        const rotationAxis = new Vector3().crossVectors(this.gravityDirection, direction);

        let dot = Math.max(-1, Math.min(1, this.gravityDirection.dot(direction)));
        let angle = Math.acos(dot);

        this.gravityDirection = direction;

        if (rotationAxis.lengthSq() === 0) return; 
        
        const newRot = new Quaternion().setFromAxisAngle(rotationAxis.normalize(), angle);

        this.mesh.quaternion.premultiply(newRot);
    }

//#endregion

//#region Utilities

    /**
     * Get the relative forward vector of the object.
     * @returns {Vector3}
     */
    GetForwardVector() 
    {
        let forward = new Vector3(0, 0, -1);

        return this.GetRelativeVector(forward);
    }

    /**
     * Gets the relative vector o
     * @param {Vector3} vector 
     */
    GetRelativeVector(vector)
    {
        return vector.clone().applyQuaternion(this.mesh.quaternion).normalize();
    }

//#endregion

}