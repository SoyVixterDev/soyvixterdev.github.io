import { PhysicsObject } from "./PhysicsObject";

export class Contact
{
    constructor(normal, point, penetration, bodyA, bodyB)
    {
        this.penetration = penetration;
        this.point = point;
        this.normal = normal;

        this.bodyA = bodyA;
        this.bodyB = bodyB;
    }

    /**
     * Resolves this contact
     */
    Resolve()
    {
        this.ResolveInterpenetration();
    }

    /**
     * Resolves interpenetration in the contact
     */
    ResolveInterpenetration()
    {
        let totalMass = this.bodyA.invMass + this.bodyB.invMass;

        let displacementA = (totalMass - this.bodyB.invMass) * this.penetration / totalMass;
        let displacementB = (totalMass - this.bodyA.invMass) * this.penetration / totalMass;
        
        this.bodyA.mesh.position.add(this.normal.clone().multiplyScalar(-displacementA));
        this.bodyB.mesh.position.add(this.normal.clone().multiplyScalar(displacementB));
    }
}

export class PotentialContact
{
    /**
     * 
     * @param {PhysicsObject} bodyA 
     * @param {PhysicsObject} bodyB 
     */
    constructor(bodyA, bodyB)
    {
        this.bodyA = bodyA;
        this.bodyB = bodyB;
    }

    /**
     * Gets the contact data
     * @returns 
     */
    GetContact()
    {
        return this.bodyA.collider.GetContact(this.bodyB.collider);
    }
}