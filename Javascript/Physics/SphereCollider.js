import { Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from "three";
import { Contact } from "./Contact";
import { PhysicsManager } from "./PhysicsManager";
import { SceneManager } from "../SceneManager";

export class SphereCollider
{
    radius = 1;

    constructor(radius = 1, mesh, body, debugView = false)
    {
        this.body = body;
        this.mesh = mesh;
        this.radius = radius;

        if(debugView)
        {
            this.geometry = new SphereGeometry(this.radius);
            this.material = new MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.75, wireframe: true});
            
            this.debugMesh = new Mesh(this.geometry, this.material);
            this.mesh.add(this.debugMesh);
        }
    }

    /**
     * Checks for overlap between this collider and another
     * @param {SphereCollider} other 
     */
    CheckOverlap(other)
    {
        return other.mesh.position.distanceTo(this.mesh.position) <= this.radius + other.radius;
    }

    /**
     * Checks if the specified sphere is overlapping with this collider
     * @param {Vector3} center 
     * @param {number} radius 
     */
    CheckOverlap(center, radius)
    {
        return center.distanceTo(this.mesh.position) <= this.radius + radius;
    }


    /**
     * Generates a contact point if the colliders are currently in contact
     * @param {SphereCollider} other
     * @returns Returns the penetration, contact point and normal between the colliders 
     */
    GetContact(other)
    {
        let distance = other.mesh.position.distanceTo(this.body.mesh.position);
        let penetration =  (this.radius + other.radius) - distance;

        if(penetration < 0)
            return null;

        let contactNormal = other.mesh.position.clone().sub(this.mesh.position).normalize();
        let contactPoint = this.mesh.position.clone().add(contactNormal.clone().multiplyScalar(distance / 2));

        return new Contact(contactNormal, contactPoint, penetration, this.body, other.body);
    }
}
