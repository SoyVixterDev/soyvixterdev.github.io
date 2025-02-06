export class Random
{
    /**
     * Generates a random integer between min and max, inclusive
     * @param {number} min 
     * @param {number} max 
     * @returns The random integer
     */
    static RandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * Generates a ranomd float between min and max, exclusive
     * @param {number} min 
     * @param {number} max 
     * @returns 
     */
    static RandomFloat(min, max)
    {
        return Math.random() * (max - min) + min;
    }
}