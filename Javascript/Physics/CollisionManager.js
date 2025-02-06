import { BVHNode, SphereVolume } from "./BHV";
import { PhysicsObject } from "./PhysicsObject";

export class CollisionManager
{
    static BVHRoot = null;
    
    /**
     * Runs the collision pipeline from broad collision check to contact resolution
     * @returns 
     */
    static CollisionPipeline()
    {
        if(CollisionManager.BVHRoot == null)
            return;

        //Broad collision check
        let potentialContacts = CollisionManager.BVHRoot.GetPotentialContacts();
        
        //Fine collision check & Contact Generation
        let contacts = [];
        potentialContacts.forEach(potentialContact => 
        {
            let contact = potentialContact.GetContact();
            if(contact != null)
                contacts.push(contact);
        });

        //Contact Resolution
        contacts.forEach(contact => contact.Resolve())
    }

    /**
     * Updates a body in the hierarchy
     * @param {PhysicsObject} body 
     */
    static UpdateNode(body)
    {
        CollisionManager.Remove(body);
        CollisionManager.Insert(body);
    }


    /**
     * Inserts a body into the hierarchy
     * @param {PhysicsObject} body 
     */
    static Insert(body)
    {
        let volume = new SphereVolume(null, null, body.collider);
        
        if(CollisionManager.BVHRoot == null)
        {
            CollisionManager.BVHRoot = new BVHNode(null, body, volume);
        }
        else
        {
            CollisionManager.BVHRoot.Insert(body, volume);
        }
    }

    /**
     * Removes a body from the hierarchy
     * @param {PhysicsObject} body 
     */
    static Remove(body)
    {
        if(CollisionManager.BVHRoot == null) return;

        let node = CollisionManager.FindNode(body, CollisionManager.BVHRoot);
        
        if(node != null)
            node.Remove();

        if(node == root)
            CollisionManager.BVHRoot = null;
    }


    /**
     * Finds a node which body matches the input
     * @param {PhysicsObject} body The body to find
     * @param {BVHNode} node Current root node 
     * @returns 
     */
    static FindNode(body, node)
    {
        if(node == null) return null;
        if(node.body == body) return node;
        if(node.IsLeaf()) return null;

        let c1 = CollisionManager.FindNode(body, node.children[0]);
        if(c1 != null)
            return c1;

        return CollisionManager.FindNode(body, node.children[1]);
    }
}