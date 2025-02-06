import { Sphere, Vector3 } from "./node_modules/three/build/three.module.js";
import { PotentialContact } from "./Contact";
import { PhysicsObject } from "./PhysicsObject";

export class BVHNode
{
    children = [null, null]

    constructor(parent, body, volume)
    {
        this.parent = parent;
        this.body = body;
        this.volume = volume;
    }

    /**
     * Checks if the node is a leaf node
     * @returns True if the node is a leaf node
     */
    IsLeaf()
    {
        return this.children[0] == null;
    }



    /**
     * Inserts a body into the hierarchy
     * @param {PhysicsObject} newBody 
     * @param {SphereVolume} newVolume
     */
    Insert(newBody, newVolume)
    {
        if(this.IsLeaf())
        {
            this.children[0] = new BVHNode(this, this.body, this.volume);
            this.children[1] = new BVHNode(this, newBody, newVolume);

            this.body = null;
            
            this.RecalculateBoundingVolume();
        }
        else
        {
            if (!this.children[1] || this.children[0].volume.GetGrowth(newVolume) < this.children[1].volume.GetGrowth(newVolume))
            {
                this.children[0]?.Insert(newBody, newVolume);
            }
            else 
            {
                this.children[1]?.Insert(newBody, newVolume);
            }
        }
    }

    /**
     * Recalculates this node's bounding volume
     */
    RecalculateBoundingVolume()
    {
        if(this.IsLeaf())
            return;

        this.volume = SphereVolume.GenerateBoundingVolume([this.children[0].volume, this.children[1].volume]);

        if(this.parent != null && this.volume != null) this.parent.RecalculateBoundingVolume();
    }

    /**
     * Removes this node from the hierarchy
     * @param {PhysicsObject} body 
     */
    Remove()
    {
        if(this.parent != null)
        {
            let sibling = this.parent.children[0] == this ? this.parent.children[1] : this.parent.children[0];

            if(sibling != null)
            {
                this.parent.volume = sibling.volume;
                this.parent.body = sibling.body;
                this.parent.children[0] = sibling.children[0];
                this.parent.children[1] = sibling.children[1];

                if(sibling.children[0] != null)
                    sibling.children[0].parent = this.parent;
                
                if(sibling.children[1] != null)
                    sibling.children[1].parent = this.parent;
            }
            else
            {
                this.parent.Remove()
            }
        }

        if(this.children[0] != null)
        {
            this.children[0].parent = null;
            this.children[0].Remove();
        }

        if(this.children[1] != null)
        {
            this.children[1].parent = null;
            this.children[1].Remove();
        }

        this.body = null;
        this.children[0] = null;
        this.children[1] = null;
        this.volume = null;
        this.parent = null;
    }


    /**
     * Gets all potential contacts down this node
     */
    GetPotentialContacts()
    {
        let potentialContacts = []

        if(this.IsLeaf())
            return potentialContacts;

        this.children[0]?.GetPotentialContactsWith(this.children[1], potentialContacts);

        this.children[0]?.GetPotentialContacts(potentialContacts);
        this.children[1]?.GetPotentialContacts(potentialContacts);


        return potentialContacts;
    }

    /**
     * Gets the potential contacts between this node and another
     * @param {BVHNode} other 
     * @param {PotentialContact[]} potentialContacts The current list of potential contacts, empty by default for the first call
     * @returns The potential contacts list
     */
    GetPotentialContactsWith(other, potentialContacts = [])
    {
        if(other == null || !this.volume.Overlaps(other.volume))
            return potentialContacts;


        if(this.IsLeaf() && other.IsLeaf())
        {
            potentialContacts.push(new PotentialContact(this.body, other.body));
            return potentialContacts;
        }

        if(other.IsLeaf() || !this.IsLeaf() && this.volume.GetVolume() >= other.volume.GetVolume())
        {
            this.children[0]?.GetPotentialContactsWith(other, potentialContacts);
            this.children[1]?.GetPotentialContactsWith(other, potentialContacts);
        }
        else
        {
            this.GetPotentialContactsWith(other.children[0], potentialContacts);
            this.GetPotentialContactsWith(other.children[1], potentialContacts);
        }
        return potentialContacts;
    }
}

/**
 * 3D Sphere Volume 
 */
export class SphereVolume
{
    constructor(center = null, radius = null, sphereCollider = null)
    {
        this._center = center;
        this._radius = radius;
        this.collider = sphereCollider;
    }

    get center()
    {
        if(this._center != null)
            return this._center;

        return this.collider.mesh.position;
    }

    get radius()
    {
        if(this._radius != null)
            return this._radius;

        return this.collider.radius;
    }

    /**
     * Gets the volume of the sphere volume
     * @returns The volume of the sphere volume
     */
    GetVolume()
    {
        return (4 * Math.PI / 3) * this.radius * this.radius * this.radius;
    }

    /**
     * Checks if two volumes are overlapping
     * @param {SphereVolume} other 
     * @returns True if the volumes are overlapping
     */
    Overlaps(other)
    {
        return other.center.distanceTo(this.center) <= this.radius + other.radius;
    }

    /**
     * Generates a bounding volume that encapsulates all volumes
     */
    static GenerateBoundingVolume(volumes)
    {
        if (!volumes || volumes.length === 0) 
            return null;

        if (volumes.length === 1) 
            return volumes[0];

        let center = new Vector3();
        let count = 0;

        // Calculate the average center of all volumes
        volumes.forEach(volume => 
        {
            center.add(volume.center);
            count++;
        });

        center.multiplyScalar(1.0 / count);

        // Calculate the radius to encompass all volumes
        let radius = 0;
        volumes.forEach(volume => 
        {
            let sphereDistance = volume.center.distanceTo(center) + volume.radius;
            radius = Math.max(radius, sphereDistance);
        });

        return new SphereVolume(center, radius);
    }

    /**
     * Calculates and returns the growth the volume would need to go through to accomodate for the new volume
     * @param {SphereVolume} volume 
     */
    GetGrowth(volume)
    {
        let distanceBetweenCenters = this.center.distanceTo(volume.center);
        let expandedRadius = Math.max(this.radius, (distanceBetweenCenters + volume.radius) / 2);

        let originalSize = (4.0 / 3.0 * Math.PI * Math.pow(this.radius, 3));
        let expandedSize = (4.0 / 3.0 * Math.PI * Math.pow(expandedRadius, 3));

        return expandedSize - originalSize;
    }
}