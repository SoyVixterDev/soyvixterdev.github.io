export class InputManager
{
    /**
     * Dictionary tracking the state of keys
     */
    trackedkeys = 
    {
        w: false,
        a: false,
        s: false,
        d: false
    }

    constructor()
    {
        //Updates the tracked keys to true when pressed
        document.addEventListener("keydown", (event) => 
        {
            const key = event.key.toLowerCase();
    
            if (key in this.trackedkeys) 
            {
                this.trackedkeys[key] = true;
            }
        });
    
        //Updates the tracked keys to false when released
        document.addEventListener("keyup", (event) => 
        {
            const key = event.key.toLowerCase();
            
            if (key in this.trackedkeys)
            {
                this.trackedkeys[key] = false;
            }
        });
    
        //Resets keys when the window loses focus
        window.addEventListener("blur", () =>
        {
            for (const key in this.trackedkeys) 
            {
                if (this.trackedkeys.hasOwnProperty(key)) 
                {
                    this.trackedkeys[key] = false;
                }
            }
        });
    }
}