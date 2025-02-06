import { Vector3 } from "three";
import { CollisionManager } from "./CollisionManager";

export class PhysicsManager
{
    static physicsObjects = [];

    static PhysicsUpdate(timestep)
    {
        PhysicsManager.physicsObjects.forEach(object => 
        {
            object.PhysicsUpdate(timestep);
        });

        CollisionManager.CollisionPipeline();
    }


    //Should be changed to use the BVH instead
    /**
     * Returns all the physics objects found within the check sphere
     * @param {Vector3} center 
     * @param {number} radius 
     * @param {String[]} filters 
     */
    static CheckSphere(center, radius, filters)
    {
        let overlappingObjects = [];

        PhysicsManager.physicsObjects.forEach(object =>
        {
            if(!filters || filters.includes(object.tag))
            {
                if(object.collider.CheckOverlap(center, radius))
                    overlappingObjects.push(object);
            }
        });

        return overlappingObjects;
    }
}